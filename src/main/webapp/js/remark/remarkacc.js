//初始化加载.	
var proc=this.parent.proc;
//var serialNumber ={num1:"登记编号",num2:"归档号",num3:"房地产证号"};
//
var proc_node = proc.activName;
var proc_id = proc.procId;
//var  = 4;//1000016366;
//var proc_node = "初审";
var state1 = {
		string0: "受理",
		string1 : "初审",
		string2 : "复审",
		string3 : "审核",
		string4 : "核准",
		string5 : "初步审定",
		string6 : "公告审定",
		string7: "公告结果初审",
		string8 : "公告结果复审",		
		string9 : "缮证",
		string10 : "发证",
		string11: "归档",
		string12: "公告",
		string13:"拟定公告"
	};
var userDataGrid;
var transferorDataGrid;
var houseDataGrid;
var _init_form_data;							//初始化时数据   用于判断当前页面数据是否己修改
var _cur_form_data;								//验证时数据   用于判断当前页面数据是否己修改
/**********************************************************************************
*函数名称: 
*功能说明: 页面初始化
*函数作者: xuzz
*创建日期: 2014-02-28
*修改历史: 
***********************************************************************************/
$(function() {
	houseDataGrid = $('#table_house').datagrid({
		title:'房地产信息',
		height:240,
		url:ctx+"/mortgage/morsetup!getRegunitMess.action?time="+new Date()+"&proc_id="+proc_id,
		// 表格每列宽度自动适应表格总宽度
		autoRowHeight : true,
		fitColumns : true,
		// 去掉边框
		border : true,
		striped : true,
		// 是否有翻页栏
		pagination : true,
		// pagePosition:'top',
		// 每页行数
		pageSize : 10,
		// 是否在最左增加一列显示行号的列
		rownumbers : true,
		// 主键值所在行。在使用复选框时必须设置此项。
		//idField : 'jjclmc',
		// 表格的行是否交替显示不同背景色
		striped : true,
		// 只允许单选一行
		singleSelect : true,
		
		columns : [ [
		     		// 每列的属性，field：行对象的列属性名；title：列标题；width：列宽；sortable：是否可排序。

		     		// {field:'ck',checkbox:true},
		     		
		     		{
		     			title : '宗地号',
		     			field : 'PARCEL_CODE',
		     			width:80
		     			
		     		}, {
		     			title : '登记单元类型',
		     			field : 'TYPE',formatter : dicts.format.reg_unit_type_format,
		     			width:100
		     		}, {
		     			title : '宗地坐落',
		     			field : 'LAND_ADDRESS',
		     			width:100
		     			
		     		},
		     		{
		     			title : '建筑物名称',
		     			field : 'BUILDING_NAME',
		     				width:100
		     		}, 
		     		{
		     			title : '栋号',
		     			field : 'BUILD_NO',
		     			width:50
		     			
		     		}, 
		     		{
		     			title : '房号',
		     			field : 'ROOMNAME',
		     			width:50
		     			
		     		},  {
		     			title : '项目名称',
		     			field : 'PRO_NAME',
		     			width:100
		     			
		     		}, {
		     			hidden: true,
		     			field : 'CODE',
		     			
		     		},
		     		{
		     			title : '操作',		     		
		     			field:'button',
		     			formatter:function(value,rec){
		     				 var btn = '<a class="editcls" onclick="" href="javascript:void(0)">查看</a>';  
		                     return btn;
		     			
		     			}
		     		}
		     		] ],
		     		// 表头，添加工具栏。
		     		onClickCell:function(rowIndex, field, value){
		     			if(field=="button"){
		    				$('#table_house').datagrid('selectRow',rowIndex);
		    				dowatch(this);
		    			}
		    		},
		     		onLoadSuccess : function() {
		     			$('.editcls').linkbutton({text:'查看'});
		     			_init_form_data = $("#add_app_form").serializeJson(); 
		     		}
	});
	
	//创建申请人信息表
	 userDataGrid = $('#table_user').datagrid({
		fit : true,
		title:'申请人',
		height:200,
		// 表格数据来源
		url :ctx+"/houseownership/initialreg!getAppMessage.action?time="+new Date()+"&proc_id="+proc_id,
		// 表格每列宽度自动适应表格总宽度
		autoRowHeight : true,
		fitColumns : false,
		// 去掉边框
		border : true,
		striped : true,
		// 是否有翻页栏
		pagination : true,
		// pagePosition:'top',
		// 每页行数
		pageSize : 10,
		// 是否在最左增加一列显示行号的列
		rownumbers : true,
		// 主键值所在行。在使用复选框时必须设置此项。
		//idField : 'jjclmc',
		// 表格的行是否交替显示不同背景色
		striped : true,
		// 只允许单选一行
		singleSelect : true,
		// 是否在点选表中一行时同时选中复选框
		// checkOnSelect:true,
		// 是否在选中复选框时同时点选表中一行
		// selectOnCheck:true,
		// 列属性设置
		columns : [ [
		// 每列的属性，field：行对象的列属性名；title：列标题；width：列宽；sortable：是否可排序。

		// {field:'ck',checkbox:true},
		{
			title : '申请人',
			field : 'app_name'
			
		}, {
			title : '申请人类型',
			field : 'app_type',formatter : dicts.format.app_type_format
			
		}, {
			title : '证件类型',
			field : 'app_cer_type',formatter : dicts.format.app_cer_type_format
			
		}, {
			title : '证件编号',
			field : 'app_cer_no'
			
		}, {
			title : '份额',
			field : 'app_port'
			
		}, {
			title : '地址',
			field : 'app_address'
			
		}, {
			title : '联系电话',
			field : 'app_tel'
			
		}, {
			title : '法定代表人',
			field : 'legal_name'
		
		},  {
			title : '代理人',
			field : 'agent_name'
			
		}, 
		{
			title : '代理人证件类型',
			field : 'agent_cer_type'
			
		},
		
		
		{
			title : '代理人身份证号',
			field : 'agent_cer'
			
		}, {
			title : '代理人联系电话',
			field : 'agent_tel'
			
		}

		] ],
		// 表头，添加工具栏。
		// 表头，添加工具栏。
		toolbar : [ {
			id : 'user_add',
			text : '新增',
			iconCls : 'icon-add',
			handler : doAdd
		}, '-', {
			id : 'user_edit',
			text : '编辑',
			iconCls : 'icon-pencil',
			disabled : true,
			handler : doEdit
		}, '-', {
			id : 'user_delete',
			text : '删除',
			iconCls : 'icon-remove',
			disabled : true,
			handler : doDelete
		}],
		onClickRow : function() {
			//点击列时激活“编辑”、“删除”按钮 只在受理和初审环节激活
			if(proc_node==state1.string0){
				$('#user_edit').linkbutton('enable');
				$('#user_delete').linkbutton('enable');
			}
		},
		onLoadSuccess : function(data) {
			//加载完毕禁用“编辑”、“删除”按钮
			$('#user_edit').linkbutton('disable');
			$('#user_delete').linkbutton('disable');
			
			//只有在受理环节中才对权利人变更进行记录  其它环节不允许权利人变更
		}

	});
	 //alert(JSON.stringify(proc));
	 getPreRegMess();
	 //getMortMess();
	 getRemark(false);
	 //设置权限状态
	 setState(proc_node);
	 //alert(JSON.stringify(proc));
	 document.getElementById("submit").onclick = function() {
	 	submit();
	 };
	_init_form_data = $("#add_app_form").serializeJson(); 
});

// 新增
function doAdd() {
	openInTopWindow({
		// 窗口元素的id
		id : 'add_user_win',
		// 窗口iframe的src
		src : ctx+'/jsp/common/applicant/addapplicant.jsp?time='+new Date(),
		// 关闭时是否销毁窗口。不销毁的话，每次打开窗口都会添加一个新窗口元素。
		destroy : true,
		// 窗口标题
		title : '新增申请人',
		// 窗口宽
		width : 700,
		// 窗口高
		height : 400,
		modal : true,
		// 窗口中iframe的window对象的onLoad回调函数设置
		onLoad : function() {
			// 此处将本窗口window对象赋值为打开的新窗口window对象的openerWindow属性。
			// 因此，在新窗口中，可通过openerWindow属性调用本窗口，从而实现多窗口间的交互、传值。
			this.openerWindow = window;
			// 将参数传入打开窗口对象的parenter属性中，从而实现窗口间传递参数调用
			this.args = {
				userDataGrid : userDataGrid
			};
			this.init(proc_id);
		}
	});
};

// 编辑
function doEdit() {
	var row = userDataGrid.datagrid('getSelected');

	openInTopWindow({
		// 窗口元素的id
		id : 'edit_user_win',
		// 窗口iframe的src
		src : ctx+'/jsp/common/applicant/editapplicant.jsp',
		// 关闭时是否销毁窗口。不销毁的话，每次打开窗口都会添加一个新窗口元素。
		destroy : true,
		// 窗口标题
		title : '编辑申请人',
		// 窗口宽
		width : 700,
		// 窗口高
		height : 400,
		modal : true,
		// 窗口中iframe的window对象的onLoad回调函数设置
		onLoad : function() {
			// 此处将本窗口window对象赋值为打开的新窗口window对象的openerWindow属性。
			// 因此，在新窗口中，可通过openerWindow属性调用本窗口，从而实现多窗口间的交互、传值。
			this.openerWindow = window;
			// 将参数传入打开窗口对象的parenter属性中，从而实现窗口间传递参数调用
			this.args = {
				user : row,
				userDataGrid : userDataGrid
			};
			this.init(row);
		}
	});
	_init_form_data = $("#add_app_form").serializeJson(); 
};


// 删除
function doDelete() {
	var row = userDataGrid.datagrid('getSelected');
	top.$.messager.confirm('确认', '确定要删除申请人名称为[' + row.app_name + ']？', function(
			result) {
		if (result) {
			$.ajax({
				url : ctx+"/houseownership/initialreg!deleteApplicant.action?time="+new Date(),
				type : 'post',
				data : {
					applicant_id : row.applicant_id
				},
				dataType : 'json',
				success : function(data) {
					if (data.success) {
						top.$.messager.alert('提示', data.tipMessage, 'info',
								function() {
							        //alert("删除之后刷新");
									userDataGrid.datagrid('reload');
								});
					} else {
						top.$.messager.alert('提示', data.errorMessage, 'error');
					}
				}
			});
		}
	});

};
	

	// 新增
	function doAdd() {
		openInTopWindow({
			// 窗口元素的id
			id : 'add_user_win',
			// 窗口iframe的src
			src : ctx+'/jsp/common/applicant/addapplicant.jsp?time='+new Date(),
			// 关闭时是否销毁窗口。不销毁的话，每次打开窗口都会添加一个新窗口元素。
			destroy : true,
			// 窗口标题
			title : '新增申请人',
			// 窗口宽
			width : 700,
			// 窗口高
			height : 400,
			modal : true,
			// 窗口中iframe的window对象的onLoad回调函数设置
			onLoad : function() {
				// 此处将本窗口window对象赋值为打开的新窗口window对象的openerWindow属性。
				// 因此，在新窗口中，可通过openerWindow属性调用本窗口，从而实现多窗口间的交互、传值。
				this.openerWindow = window;
				// 将参数传入打开窗口对象的parenter属性中，从而实现窗口间传递参数调用
				this.args = {
					userDataGrid : userDataGrid
				};
				this.init(proc_id);
			}
		});
	}

	// 编辑
	function doEdit() {
		var row = userDataGrid.datagrid('getSelected');

		openInTopWindow({
			// 窗口元素的id
			id : 'edit_user_win',
			// 窗口iframe的src
			src : ctx+'/jsp/common/applicant/editapplicant.jsp',
			// 关闭时是否销毁窗口。不销毁的话，每次打开窗口都会添加一个新窗口元素。
			destroy : true,
			// 窗口标题
			title : '编辑申请人',
			// 窗口宽
			width : 700,
			// 窗口高
			height : 400,
			modal : true,
			// 窗口中iframe的window对象的onLoad回调函数设置
			onLoad : function() {
				// 此处将本窗口window对象赋值为打开的新窗口window对象的openerWindow属性。
				// 因此，在新窗口中，可通过openerWindow属性调用本窗口，从而实现多窗口间的交互、传值。
				this.openerWindow = window;
				// 将参数传入打开窗口对象的parenter属性中，从而实现窗口间传递参数调用
				this.args = {
					user : row,
					userDataGrid : userDataGrid
				};
				this.init(row);
			}
		});
	};

	// 删除
	function doDelete() {
		var row = userDataGrid.datagrid('getSelected');
		top.$.messager.confirm('确认', '确定要删除申请人名称为[' + row.app_name + ']？', function(
				result) {
			if (result) {
				$.ajax({
					url : ctx+"/houseownership/initialreg!deleteApplicant.action?time="+new Date(),
					type : 'post',
					data : {
						applicant_id : row.applicant_id
					},
					dataType : 'json',
					success : function(data) {
						if (data.success) {
							top.$.messager.alert('提示', data.tipMessage, 'info',
									function() {
								        //alert("删除之后刷新");
										userDataGrid.datagrid('reload');
									});
						} else {
							top.$.messager.alert('提示', data.errorMessage, 'error');
						}
					}
				});
			}
		});
	}
	/**********************************************************************************
	*函数名称: getRemark
	*功能说明: 获取备注信息
	*参数说明: 
	*返 回 值: 无
	*函数作者: xuzz
	*创建日期: 2014-04-11
	*修改历史: 
	***********************************************************************************/
	function getRemark(result){
		var url;
		if(result==false)
		{
			url= ctx+"/houseownership/initialreg!getRemark.action?time="+new Date()+"&proc_id="+proc_id;
		}
		else
		{
			url= ctx+"/houseownership/initialreg!getUnRemark.action?time="+new Date()+"&reg_code="+result;
		}	
		$.ajax({
			    dataType: 'json',
				url:url,
				success:function(data)
				{
				 	if(data)
				 	{
				 		//$("#add_app_form").form('load',data);
				 		$("#RECORDER").val(data.recorder);
				 		$("#REMARK_PERSON").val(data.remark_person);
				 		$("#REMARK_TYPE").combodict('setValue',data.remark_type);
				 		if(data.recorder)
				 		{
				 			$("#REG_DATE").datebox('setValue',data.reg_date.substr(0,data.reg_date.length-2));
				 		}
				 		$("#REMARK_NO").val(data.remark_no);
				 		$("#REMARK_OFFICE").val(data.remark_office);
				 		if(data.remark_content)
				 		{
				 			$("#REMARK_CONTENT").text(data.remark_content);
				 		}
				 		
				 	}
				 	_init_form_data = $("#add_app_form").serializeJson(); 
				}
			});
	}
	/**********************************************************************************
	*函数名称: saveRemark
	*功能说明: 在受理环节保存备注信息
	*参数说明: 
	*返 回 值: 
	*函数作者: xuzz
	*创建日期: 2014-04-11
	*修改历史: 
	***********************************************************************************/
	function  saveRemark(){
		var remarktype=$("#add_app_form").serialize()+"&remarkInfo.remark_type="+$("#REMARK_TYPE").combodict('getValue');
		//alert(remarktype);
		//return;
		var url;
		url= ctx+"/houseownership/initialreg!saveRemark.action?time="+new Date()+"&proc_id="+proc_id;
		var result = true; 
			 $.ajax({
			   		dataType:'json',
			   		url:url,
			   		contentType:"application/x-www-form-urlencoded; charset=GBK",
			   		//表单的序列化操作
			   		data:remarktype,
			   		success:function(data){
					 	if(data){
					 		top.$.messager.alert('保存成功提示',"保存成功",'info',function(){
							});	
					 	}else {
							top.$.messager.alert('保存失败提示',"保存失败",'error');
						}
			   		},error:function(data){
			   			result = false;
			   			top.$.messager.alert('保存失败提示',"保存失败",'error');
			   		}
			   	});  
		return result;
	};
	
	/**********************************************************************************
	*函数名称: dowatch
	*功能说明: 查看登记单元详细信息
	*参数说明: 无
	*返 回 值: 无
	*函数作者: xuzz
	*创建日期: 2014-03-27
	*修改历史: 
	***********************************************************************************/
		function dowatch(button){
			var row = $('#table_house').datagrid('getSelected');
			var obj={};
			 	obj.WHERE_CODE=row.CODE;
				obj.REG_UNIT_TYPE=row.TYPE;
			//alert(JSON.stringify(row));
			openInTopWindow({
				// 窗口元素的id
				id : 'add_user_win',
				// 窗口iframe的src
				src : ctx+'/bookmanage/book-manage!home.action?reg_unit_type='+row.TYPE+'&time='+new Date(),
				// 关闭时是否销毁窗口。不销毁的话，每次打开窗口都会添加一个新窗口元素。
				destroy : true,
				// 窗口标题
				title : '房地产信息',
				// 窗口宽
				width : 950,
				// 窗口高
				height : 700,
				modal : true,
				// 窗口中iframe的window对象的onLoad回调函数设置
				onLoad : function() {
					// 此处将本窗口window对象赋值为打开的新窗口window对象的openerWindow属性。
					// 因此，在新窗口中，可通过openerWindow属性调用本窗口，从而实现多窗口间的交互、传值。
					this.openerWindow = window;
					// 将参数传入打开窗口对象的parenter属性中，从而实现窗口间传递参数调用
					this.args = {
						userDataGrid : userDataGrid,
						regunit:row
					};
					this.init(obj);
				}
			});
		}


		/**********************************************************************************
		*函数名称: setState
		*功能说明: 根据流程节点，设置页面控件的权限
		*参数说明: proc_node：流程节点名称
		*返 回 值: 无
		*函数作者: xuzz
		*创建日期: 2014-03-27
		*修改历史: 
		***********************************************************************************/		
function setState(proc_node) {
	
	
	if(proc_node == state1.string1){
		//$("#REG_STATION").combo('disable');
		//$(":input").attr("disabled", "disabled");
		$(".edit_table").attr("disabled", "disabled");	
		$('#user_edit').linkbutton('disable');
		$('#user_delete').linkbutton('disable');

		$('#user_add').linkbutton('disable');
		
	}
	if (!(proc_node == state1.string0)&&!(proc_node == state1.string1)) {
		$("#REG_STATION").combo('disable');
		$(":input").attr("disabled", "disabled");
		$('#user_edit').linkbutton('disable');
		$('#user_delete').linkbutton('disable');

		$('#user_add').linkbutton('disable');
		$(".com").combo('disable');
		
		

	}
	
	if (proc_node == state1.string4) {
		$('#user_edit').linkbutton('enable');
		$('#user_delete').linkbutton('enable');

		$('#user_add').linkbutton('enable');

	}
    //if(proc_node != state1.string0){
		
		//$(".mortreg").css({display:"block"});
		//$(".remark").css({display:"block"});
	//}

}
//判断执行的是saveDjxx()还是saveFdccfj(proc_node)
function submit(){
		//saveRegInfo();		
		saveRemark();
}

// 登记信息保存更新操作
function saveRegInfo() {
	var reg_station = $("#REG_STATION").combo('getValue');
	var reg_code = $("#REG_CODE").val();
	var reg_type = $("#REG_TYPE").combo('getValue');
	var proc_name = $("#BUS_DETAIL").val();
	if($.trim(reg_station).length==0){
		top.$.messager.alert('提示', '请选择登记点！', 'info',
				function() {
					
				});	
		return;

	}
	  $.ajax({
	   		dataType:'json',
	   		url:ctx+"/sealup/sealup!saveRegInfo.action?time="+new Date()+"&proc_id="+proc_id,
	   		contentType:"application/x-www-form-urlencoded; charset=GBK",
	   		//表单的序列化操作
	   		data:{"oivo.reg_station":reg_station,"oivo.reg_code":reg_code,"oivo.reg_type":reg_type,"oivo.proc_name":proc_name},
	   		success:function(data){
			 	if(data){
			 		//alert(data);
			 		top.$.messager.alert('保存成功提示',"保存成功",'info',function(){
					});	
			 		
			 	}else {
					top.$.messager.alert('保存失败提示',"保存失败",'error');
				}
	   		}
	   	});  
	

}
//获取从受理前置窗口传递的登记信息
function getPreRegMess(){
	$.ajax({
		    dataType: 'json',
		    url:ctx+"/mortgage/morsetup!getRegInfo.action?time="+new Date()+"&proc_id="+proc_id,
			success:function(data){
			 	if(data){
			 		//alert(JSON.stringify(data));
			 		$("#REG_CODE").val(data.REG_CODE);
			 		$("#REG_STATION").combodict("setValue",data.REG_STATION);
			 		$("#BUS_DETAIL").val(data.PROC_NAME);
			 		$("#REG_TYPE").combodict("setValue",data.REG_TYPE);
			 		if(data.REG_TYPE==enumdata.JUDREMARK||data.REG_TYPE==enumdata.UNREMARK)
			 		{
			 			$(".remark_tab").attr("disabled", "disabled");
			 			getRemark($("#REG_CODE").val());
			 		}
			 	}
				}
		});
	
}
/**********************************************************************************
*函数名称: validate
*功能说明: 登记信息格式校验
*参数说明: 
*返 回 值: 无
*函数作者: xuzz
*创建日期: 2014-03-27
*修改历史: 
***********************************************************************************/
function validate(v_flag){
	//返回结果对象
	var result ={
			result:false,
			message:'',
			page_name:'申请表'
	}
	//提示消息 
	var message;
	if(proc_node==state1.string0){
		message = "注销原因！";
		var Disitem = new tt.Field(message,"DISS_ITEM");  
	    //非空检验
	    tt.vf.req.add(Disitem);
		
	    var valResult = tt.validate();
		if(!valResult.result){
			 result.message=valResult.message;
			 result.result=false;
			 return result;
		} 
	}
     //点保存按扭  初始化变量
     if(v_flag){
			_init_form_data = $("#add_app_form").serializeJson(); 
		}
	//序列化当前表单的值
	_cur_form_data = $("#add_app_form").serializeJson();
	//alert(JSON.stringify(_init_form_data)+" "+JSON.stringify(_cur_form_data));
	var r = equal(_init_form_data,_cur_form_data);
	if(!r){
		message ="表单元素已修改，请保存后提交！";
     	result.message = message;
 		return result;
	}	
	
	result.result=true;
	return result;
}
/**********************************************************************************
*函数名称: getTime
*功能说明: 获取当前系统时间
*参数说明: 无
*返 回 值: 无
*函数作者: xuzz
*创建日期: 2014-03-27
*修改历史: 
***********************************************************************************/
function getTime(){
	  var myDate = new Date();
	  var year = myDate.getFullYear();
	  var month = myDate.getMonth()+1;
	  var date = myDate.getDate(); 
     var mytime=myDate.toLocaleTimeString();     //获取当前时间	  
	var time = year+"-"+month+"-"+date;
	return time;
	
}
/**********************************************************************************
*函数名称: pageDataIsChange
*功能说明: 判断当前页面数据是否已经修改
*参数说明: 
*返 回 值: 修改返回true   未修改返回false
*函数作者: xuzz
*创建日期: 2014-03-01
*修改历史: 
***********************************************************************************/
function pageDataIsChange(){
	_cur_form_data = $("#add_app_form").serializeJson(); 
	
	var r = equal(_init_form_data,_cur_form_data);
	//如果相等返回  页面数据未修改  返回false
	if(r){
	  return false;
	}
	return true;
}












