/**
 * combotree - plui
 * 使用授权及技术支持请联系: server@netgis.cn
 * 
 * Dependencies:
 *   combo
 * 	 tree
 * 
 */
(function($){
	/**
	 * create the combotree component.
	 */
	function create(target){
		var opts = $.data(target, 'combotree').options;
		var tree = $.data(target, 'combotree').tree;
		
		$(target).addClass('combotree-f');
		$(target).combo(opts);
		var panel = $(target).combo('panel');
		if (!tree){
			tree = $('<ul></ul>').appendTo(panel);
			$.data(target, 'combotree').tree = tree;
		}
		
		tree.tree($.extend({}, opts, {
			checkbox: opts.multiple,
			onLoadSuccess: function(node, data){
				var values = $(target).combotree('getValues');
				if (opts.multiple){
					var nodes = tree.tree('getChecked');
					for(var i=0; i<nodes.length; i++){
						var id = nodes[i].id;
						(function(){
							for(var i=0; i<values.length; i++){
								if (id == values[i]) return;
							}
							values.push(id);
						})();
					}
				}
				$(target).combotree('setValues', values);
				opts.onLoadSuccess.call(this, node, data);
			},
			onClick: function(node){
				retrieveValues(target);
				$(target).combo('hidePanel');
				opts.onClick.call(this, node);
			},
			onCheck: function(node, checked){
				retrieveValues(target);
				opts.onCheck.call(this, node, checked);
			}
		}));
	}
	
	/**
	 * retrieve values from tree panel.
	 */
	function retrieveValues(target){
		var opts = $.data(target, 'combotree').options;
		var tree = $.data(target, 'combotree').tree;
		var vv = [], ss = [];
		if (opts.multiple){
			var nodes = tree.tree('getChecked');
			for(var i=0; i<nodes.length; i++){
				vv.push(nodes[i].id);
				ss.push(nodes[i].text);
			}
		} else {
			var node = tree.tree('getSelected');
			if (node){
				vv.push(node.id);
				ss.push(node.text);
			}
		}
		//多选时调用combo的setTexts方法	chenlia-2013/09/09
		//$(target).combo('setValues', vv).combo('setText', ss.join(opts.separator));
		$(target).combo('setValues', vv).combo('setTexts', ss);
	}
	
	function setValues(target, values){
		var opts = $.data(target, 'combotree').options;
		var tree = $.data(target, 'combotree').tree;
		tree.find('span.tree-checkbox').addClass('tree-checkbox0').removeClass('tree-checkbox1 tree-checkbox2');
		var vv = [], ss = [];
		for(var i=0; i<values.length; i++){
			var v = values[i];
			var s = v;
			var node = tree.tree('find', v);
			if (node){
				s = node.text;
				tree.tree('check', node.target);
				tree.tree('select', node.target);
			}
			vv.push(v);
			ss.push(s);
		}
		//多选时调用combo的setTexts方法	chenlia-2013/09/09
		//$(target).combo('setValues', vv).combo('setText', ss.join(opts.separator));
		$(target).combo('setValues', vv).combo('setTexts', ss);
	}
	
	$.fn.combotree = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.combotree.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.combo(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'combotree');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'combotree', {
					options: $.extend({}, $.fn.combotree.defaults, $.fn.combotree.parseOptions(this), options)
				});
			}
			create(this);
		});
	};
	
	
	$.fn.combotree.methods = {
		options: function(jq){
			var opts = $.data(jq[0], 'combotree').options;
			opts.originalValue = jq.combo('options').originalValue;
			return opts;
		},
		tree: function(jq){
			return $.data(jq[0], 'combotree').tree;
		},
		loadData: function(jq, data){
			return jq.each(function(){
				var opts = $.data(this, 'combotree').options;
				opts.data = data;
				var tree = $.data(this, 'combotree').tree;
				tree.tree('loadData', data);
			});
		},
		reload: function(jq, url){
			return jq.each(function(){
				var opts = $.data(this, 'combotree').options;
				var tree = $.data(this, 'combotree').tree;
				if (url) opts.url = url;
				tree.tree({url:opts.url});
			});
		},
		setValues: function(jq, values){
			return jq.each(function(){
				setValues(this, values);
			});
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValues(this, [value]);
			});
		},
		clear: function(jq){
			return jq.each(function(){
				var tree = $.data(this, 'combotree').tree;
				tree.find('div.tree-node-selected').removeClass('tree-node-selected');
				var cc = tree.tree('getChecked');
				for(var i=0; i<cc.length; i++){
					tree.tree('uncheck', cc[i].target);
				}
				$(this).combo('clear');
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).combotree('options');
				if (opts.multiple){
					$(this).combotree('setValues', opts.originalValue);
				} else {
					$(this).combotree('setValue', opts.originalValue);
				}
			});
		}
	};
	
	$.fn.combotree.parseOptions = function(target){
		return $.extend({}, $.fn.combo.parseOptions(target), $.fn.tree.parseOptions(target));
	};
	
	$.fn.combotree.defaults = $.extend({}, $.fn.combo.defaults, $.fn.tree.defaults, {
		editable: false
	});
})(jQuery);
