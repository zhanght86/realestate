/**
 * combo - plui
 * 使用授权及技术支持请联系: server@netgis.cn
 * 
 * Dependencies:
 *   panel
 *   validatebox
 * 
 */
(function($){
	function setSize(target, width){
		var opts = $.data(target, 'combo').options;
		var combo = $.data(target, 'combo').combo;
		var panel = $.data(target, 'combo').panel;
		
		if (width) opts.width = width;
		if (isNaN(opts.width)){
			var c = $(target).clone();
			c.css('visibility','hidden');
			c.appendTo('body');
			opts.width = c.outerWidth();
			c.remove();
		}
		
		combo.appendTo('body');
		
		var input = combo.find('input.combo-text');
		var arrow = combo.find('.combo-arrow');
		var arrowWidth = opts.hasDownArrow ? arrow._outerWidth() : 0;
		
		combo._outerWidth(opts.width)._outerHeight(opts.height);
		input._outerWidth(combo.width() - arrowWidth);
		input.css({
			height: combo.height()+'px',
			lineHeight: combo.height()+'px'
		});
		arrow._outerHeight(combo.height());
		
		panel.panel('resize', {
			width: (opts.panelWidth ? opts.panelWidth : combo.outerWidth()),
			height: opts.panelHeight
		});
		
		combo.insertAfter(target);
	}
	
	function setDownArrow(target){
		var opts = $.data(target, 'combo').options;
		var combo = $.data(target, 'combo').combo;
		if (opts.hasDownArrow){
			combo.find('.combo-arrow').show();
		} else {
			combo.find('.combo-arrow').hide();
		}
	}
	
	/**
	 * create the combo component.
	 */
	function init(target){
		$(target).addClass('combo-f').hide();
		
		var span = $('<span class="combo"></span>').insertAfter(target);
		var input = $('<input type="text" class="combo-text">').appendTo(span);
		$('<span><span class="combo-arrow"></span></span>').appendTo(span);
		$('<input type="hidden" class="combo-value">').appendTo(span);
		var panel = $('<div class="combo-panel"></div>').appendTo('body');
		panel.panel({
			doSize:false,
			closed:true,
			cls:'combo-p',
			style:{
				position:'absolute',
				zIndex:10
			},
			onOpen:function(){
				$(this).panel('resize');
			}
		});
		
		var name = $(target).attr('name');
		if (name){
			span.find('input.combo-value').attr('name', name);
			$(target).removeAttr('name').attr('comboName', name);
		}
		input.attr('autocomplete', 'off');
		
		return {
			combo: span,
			panel: panel
		};
	}
	
	function destroy(target){
		var input = $.data(target, 'combo').combo.find('input.combo-text');
		input.validatebox('destroy');
		$.data(target, 'combo').panel.panel('destroy');
		$.data(target, 'combo').combo.remove();
		$(target).remove();
	}
	
	function bindEvents(target){
		var state = $.data(target, 'combo');
		var opts = state.options;
		var combo = $.data(target, 'combo').combo;
		var panel = $.data(target, 'combo').panel;
		var input = combo.find('.combo-text');
		var arrow = combo.find('.combo-arrow');
		
		$(document).unbind('.combo').bind('mousedown.combo', function(e){
			var p = $(e.target).closest('span.combo,div.combo-panel');
			if (p.length){return;}
			var allPanel = $('body>div.combo-p>div.combo-panel');
			allPanel.panel('close');
		});
		
		combo.unbind('.combo');
		panel.unbind('.combo');
		input.unbind('.combo');
		arrow.unbind('.combo');
		
		if (!opts.disabled){
			input.bind('mousedown.combo', function(e){
				$('div.combo-panel').not(panel).panel('close');
				e.stopPropagation();
			}).bind('keydown.combo', function(e){
				switch(e.keyCode){
					case 38:	// up
						opts.keyHandler.up.call(target);
						break;
					case 40:	// down
						opts.keyHandler.down.call(target);
						break;
					case 13:	// enter
						e.preventDefault();
						opts.keyHandler.enter.call(target);
						return false;
					case 9:		// tab
					case 27:	// esc
						hidePanel(target);
						break;
					default:
						if (opts.editable){

							if (state.timer){
								clearTimeout(state.timer);
							}
							state.timer = setTimeout(function(){
								var q = input.val();
								if (state.previousValue != q){
									state.previousValue = q;
//									showPanel(target);
									$(target).combo('showPanel');
									opts.keyHandler.query.call(target, input.val());
									validate(target, true);
								}
							}, opts.delay);
						}
				}
			}).bind('keyup.combo', function(e){
				//支持手动输入数据 chenlia-2014/3/20
				if (opts.customInput && (opts.textName || valueMergeField)) {
					
					var inv = input.val();
					var changeFlag = false;
					
					if (opts.multiple) {
						//多选
					} else {
						//单选
						if (opts.textName) {
							var tnv = combo.find('.combo-txt').val();
							changeFlag = inv != tnv;
						} else if (opts.valueMergeField){
							var mtnv = combo.find('.combo-jointxt').val();
							changeFlag = inv != mtnv;
						}
						if (changeFlag) {
							$(target).combo('setText', inv);
							$(target).combo('setValue', '');
						}
					}
				}
			});
			
			arrow.bind('click.combo', function(){
				if (panel.is(':visible')){
					hidePanel(target);
				} else {
					$('div.combo-panel').panel('close');
//					showPanel(target);
					$(target).combo('showPanel');
				}
				input.focus();
			}).bind('mouseenter.combo', function(){
				$(this).addClass('combo-arrow-hover');
			}).bind('mouseleave.combo', function(){
				$(this).removeClass('combo-arrow-hover');
			}).bind('mousedown.combo', function(){
//				return false;
			});
		}
	}
	
	/**
	 * show the drop down panel.
	 */
	function showPanel(target){
		var opts = $.data(target, 'combo').options;
		var combo = $.data(target, 'combo').combo;
		var panel = $.data(target, 'combo').panel;
		
		if ($.fn.window){
			panel.panel('panel').css('z-index', $.fn.window.defaults.zIndex++);
		}
		
		panel.panel('move', {
			left:combo.offset().left,
			top:getTop()
		});
		if (panel.panel('options').closed){
			panel.panel('open');
			opts.onShowPanel.call(target);
		}
		
		(function(){
			if (panel.is(':visible')){
				panel.panel('move', {
					left:getLeft(),
					top:getTop()
				});
				setTimeout(arguments.callee, 200);
			}
		})();
		
		function getLeft(){
			var left = combo.offset().left;
			if (left + panel._outerWidth() > $(window)._outerWidth() + $(document).scrollLeft()){
				left = $(window)._outerWidth() + $(document).scrollLeft() - panel._outerWidth();
			}
			if (left < 0){
				left = 0;
			}
			return left;
		}
		function getTop(){
			var top = combo.offset().top + combo._outerHeight();
			if (top + panel._outerHeight() > $(window)._outerHeight() + $(document).scrollTop()){
				top = combo.offset().top - panel._outerHeight();
			}
			if (top < $(document).scrollTop()){
				top = combo.offset().top + combo._outerHeight();
			}
			return top;
		}
	}
	
	/**
	 * hide the drop down panel.
	 */
	function hidePanel(target){
		var opts = $.data(target, 'combo').options;
		var panel = $.data(target, 'combo').panel;
		panel.panel('close');
		opts.onHidePanel.call(target);
	}
	
	function validate(target, doit){
		var opts = $.data(target, 'combo').options;
		var input = $.data(target, 'combo').combo.find('input.combo-text');
		input.validatebox(opts);
		if (doit){
			input.validatebox('validate');
//			input.trigger('mouseleave');
		}
	}
	
	function setDisabled(target, disabled){
		var opts = $.data(target, 'combo').options;
		var combo = $.data(target, 'combo').combo;
		if (disabled){
			opts.disabled = true;
			$(target).attr('disabled', true);
			combo.find('.combo-value').attr('disabled', true);
			combo.find('.combo-text').attr('disabled', true);
			combo.find('.combo-txt').attr('disabled', true);
			combo.find('.combo-jointxt').attr('disabled', true);
			combo.find('.combo-joinvalue').attr('disabled', true);
		} else {
			opts.disabled = false;
			$(target).removeAttr('disabled');
			combo.find('.combo-value').removeAttr('disabled');
			combo.find('.combo-text').removeAttr('disabled');
			combo.find('.combo-txt').removeAttr('disabled');
			combo.find('.combo-jointxt').removeAttr('disabled');
			combo.find('.combo-joinvalue').removeAttr('disabled');
		}
	}
	
	/**
	 * 使combo组件获取焦点
	 * chenlia-2013/09/12
	 */
	function focus(target){
		var combo = $.data(target, 'combo').combo;
		var input = combo.find('input.combo-text');
		$(input).focus();
	};
	
	function clear(target){
		var opts = $.data(target, 'combo').options;
		var combo = $.data(target, 'combo').combo;
		if (opts.multiple){
			combo.find('input.combo-value').remove();
			combo.find('input.combo-txt').remove();
		} else {
			combo.find('input.combo-value').val('');
			combo.find('input.combo-txt').val('');
		}
		combo.find('input.combo-text').val('');
		combo.find('input.combo-jointxt').val('');
		combo.find('input.combo-joinvalue').val('');
		
	}
	
	function getText(target){
		var combo = $.data(target, 'combo').combo;
		return combo.find('input.combo-text').val();
	}
	
	function getTexts(target){
		var opts = $.data(target, 'combo').options;
		var combo = $.data(target, 'combo').combo;
		return combo.find('input.combo-text').val().split(opts.separator);
	}
	
	function setText(target, text){
//		var combo = $.data(target, 'combo').combo;
//		combo.find('input.combo-text').val(text);
//		validate(target, true);
//		$.data(target, 'combo').previousValue = text;
		setTexts(target, [text]);
	}
	
	/**
	 * 设置多选时的显示文字
	 * 增加显示文字自动生成对应的input元素
	 * chenlia-2013/09/09
	 */
	function setTexts(target, texts){
		var opts = $.data(target, 'combo').options;
		var combo = $.data(target, 'combo').combo;
		combo.find('input.combo-text').val(texts.join(opts.separator));
		validate(target, true);
		$.data(target, 'combo').previousValue = texts.join(opts.separator);
		//remove old text input
		combo.find('input.combo-txt').remove();
		if (opts.textName/* || opts.textField*/) {
			opts.textName = opts.textName/* || opts.textField*/;
			$(texts).each(function() {
				var input = $('<input type="hidden" class="combo-txt" />').appendTo(combo);
				input.attr('name', opts.textName);
				input.val(this);
			});
		}
		
		//增加连接字符串input元素
		combo.find('input.combo-jointxt').remove();
		if (opts.textMergeField) {
			var input = $('<input type="hidden" class="combo-jointxt" />').appendTo(combo);
			input.attr('name', opts.textMergeField);
			input.val(texts.join(opts.separator));
		}
	}
	
	function getValues(target){
		var values = [];
		var combo = $.data(target, 'combo').combo;
		combo.find('input.combo-value').each(function(){
			values.push($(this).val());
		});
		return values;
	}
	
	function setValues(target, values){
		var opts = $.data(target, 'combo').options;
		var oldValues = getValues(target);
		
		var combo = $.data(target, 'combo').combo;
		combo.find('input.combo-value').remove();
		var name = $(target).attr('comboName');
		//没设置组件name时取消动态产生input控件	chenlia-2013/09/09
		//不能取消	getValues方法有用到该控件 	chenlia-2013/09/17
//		if (name){
			for(var i=0; i<values.length; i++){
				var input = $('<input type="hidden" class="combo-value">').appendTo(combo);
				if (name) input.attr('name', name);
				input.val(values[i]);
			}
//		}
		
		//增加连接字符串input元素	chenlia-2013/09/09
		combo.find('input.combo-joinvalue').remove();
		if (opts.valueMergeField) {
			var input = $('<input type="hidden" class="combo-joinvalue" />').appendTo(combo);
			input.attr('name', opts.valueMergeField);
			input.val(values.join(opts.separator));
		}
		
		var tmp = [];
		for(var i=0; i<oldValues.length; i++){
			tmp[i] = oldValues[i];
		}
		var aa = [];
		for(var i=0; i<values.length; i++){
			for(var j=0; j<tmp.length; j++){
				if (values[i] == tmp[j]){
					aa.push(values[i]);
					tmp.splice(j, 1);
					break;
				}
			}
		}
		
		if (aa.length != values.length || values.length != oldValues.length){
			if (opts.multiple){
				opts.onChange.call(target, values, oldValues);
			} else {
				opts.onChange.call(target, values[0], oldValues[0]);
			}
		}
	}
	
	function getValue(target){
		var values = getValues(target);
		return values[0];
	}
	
	function setValue(target, value){
		setValues(target, [value]);
	}
	
	/**
	 * 初始化value值
	 */
	function initValue(target){
		var opts = $.data(target, 'combo').options;
		var fn = opts.onChange;
		opts.onChange = function(){};
		if (opts.multiple){
			if (opts.value){
				if (typeof opts.value == 'object'){
					setValues(target, opts.value);
				} else {
					setValues(target, opts.value.split(opts.separator));
				}
			} else {
				setValues(target, []);
			}
			opts.originalValue = getValues(target);
		} else {
			setValue(target, opts.value);	// set initialize value
			opts.originalValue = opts.value;
		}
		opts.onChange = fn;
	};
	
	/**
	 * 初始化Text值
	 */
	function initText(target) {
		var opts = $.data(target, 'combo').options;
		if (opts.text) {
			if (opts.multiple){
				setTexts(target, opts.text.split(opts.separator));
			} else {
				setText(target, opts.text);
			}
		}
	};
	
	$.fn.combo = function(options, param){
		if (typeof options == 'string'){
			return $.fn.combo.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'combo');
			if (state){
				$.extend(state.options, options);
			} else {
				var r = init(this);
				state = $.data(this, 'combo', {
					options: $.extend({}, $.fn.combo.defaults, $.fn.combo.parseOptions(this), options),
					combo: r.combo,
					panel: r.panel,
					previousValue: null
				});
				$(this).removeAttr('disabled');
			}
			$('input.combo-text', state.combo).attr('readonly', !state.options.editable);
			setDownArrow(this);
			setDisabled(this, state.options.disabled);
			setSize(this);
			bindEvents(this);
			validate(this);
			initValue(this);
			initText(this);
		});
	};
	
	$.fn.combo.methods = {
		options: function(jq){
			return $.data(jq[0], 'combo').options;
		},
		panel: function(jq){
			return $.data(jq[0], 'combo').panel;
		},
		textbox: function(jq){
			return $.data(jq[0], 'combo').combo.find('input.combo-text');
		},
		destroy: function(jq){
			return jq.each(function(){
				destroy(this);
			});
		},
		resize: function(jq, width){
			return jq.each(function(){
				setSize(this, width);
			});
		},
		showPanel: function(jq){
			return jq.each(function(){
				showPanel(this);
			});
		},
		hidePanel: function(jq){
			return jq.each(function(){
				hidePanel(this);
			});
		},
		disable: function(jq){
			return jq.each(function(){
				setDisabled(this, true);
				bindEvents(this);
			});
		},
		enable: function(jq){
			return jq.each(function(){
				setDisabled(this, false);
				bindEvents(this);
			});
		},
		validate: function(jq){
			return jq.each(function(){
				validate(this, true);
			});
		},
		isValid: function(jq){
			var input = $.data(jq[0], 'combo').combo.find('input.combo-text');
			return input.validatebox('isValid');
		},
		clear: function(jq){
			return jq.each(function(){
				clear(this);
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $.data(this, 'combo').options;
				if (opts.multiple){
					$(this).combo('setValues', opts.originalValue);
				} else {
					$(this).combo('setValue', opts.originalValue);
				}
			});
		},
		getText: function(jq){
			return getText(jq[0]);
		},
		getTexts: function(jq){
			return getTexts(jq[0]);
		},
		setText: function(jq, text){
			return jq.each(function(){
				setText(this, text);
			});
		},
		setTexts: function(jq, texts){
			return jq.each(function(){
				setTexts(this, texts);
			});
		},
		getValues: function(jq){
			return getValues(jq[0]);
		},
		setValues: function(jq, values){
			return jq.each(function(){
				setValues(this, values);
			});
		},
		getValue: function(jq){
			return getValue(jq[0]);
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValue(this, value);
			});
		},
		//使combo获取焦点
		focus: function(jq){
			focus(jq[0]);
		}
	};
	
	$.fn.combo.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.validatebox.parseOptions(target), $.parser.parseOptions(target, [
			'width','height','separator','textName','textField','valueMergeField','textMergeField','text',{panelWidth:'number',editable:'boolean',hasDownArrow:'boolean',delay:'number'}
		]), {
			panelHeight: (t.attr('panelHeight')=='auto' ? 'auto' : parseInt(t.attr('panelHeight')) || undefined),
			multiple: (t.attr('multiple') ? true : undefined),
			disabled: (t.attr('disabled') ? true : undefined),
			customInput : (t.attr('customInput') ? true : undefined),
			value: (t.val() || undefined)
		});
	};
	
	// Inherited from $.fn.validatebox.defaults
	$.fn.combo.defaults = $.extend({}, $.fn.validatebox.defaults, {
		width: 'auto',
		height: 22,
		panelWidth: null,
		panelHeight: 200,
		multiple: false,
		separator: ',',
		editable: true,
		disabled: false,
		customInput : false,
		hasDownArrow: true,
		value: '',
		delay: 200,	// delay to do searching from the last key input event.
		textName : null,
		textField : null,
		valueMergeField : null,
		textMergeField : null,
		keyHandler: {
			up: function(){},
			down: function(){},
			enter: function(){},
			query: function(q){}
		},
		
		onShowPanel: function(){},
		onHidePanel: function(){},
		onChange: function(newValue, oldValue){}
	});
})(jQuery);
