<%@ page language="java" import="java.util.*" pageEncoding="GBK" contentType="text/html;charset=GBK"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
		"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>建筑关联角色</title>
        <meta http-equiv="content-type" content="text/html;charset=GBK">
        <meta http-equiv="pragma" content="no-cache">
        <meta http-equiv="cache-control" content="no-cache">
        <meta http-equiv="expires" content="0">
        <meta http-equiv="keywords" content="">
        
        <jsp:include page="/plui2/head.jsp" />
        
<script type="text/javascript">
		
	//var row;
	//初始化加载.		
	function __init(){
		
		$('#table_rel_role').datagrid({
			fit:true,
			border:false,
			//表格数据来源
			url:'../userRoleRelDelegate/getRoleListByUserID.run?user_id='+args.user.user_id,
			//表格每列宽度自动适应表格总宽度
			fitColumns: true,
			//是否有翻页栏
			pagination:false,
			//每页行数
			pageSize:20,
			//是否在最左增加一列显示行号的列
			rownumbers:true,
			//主键值所在行。在使用复选框时必须设置此项。
			idField: 'user_id',
			//表格的行是否交替显示不同背景色					
			striped:true,
			//只允许单选一行
			singleSelect:true,
			//列属性设置
			columns:[[
				//每列的属性，field：行对象的列属性名；title：列标题；width：列宽；sortable：是否可排序。
				
				{field:'uur_id', title:'关联ID', hidden:true},
				{field:'role_id', title:'角色ID', width:100},
				{field:'role_name', title:'角色名称', width:200},	
				{field:'role_code', title:'角色代码', width:200},
				{field:'product_name', title:'所属产品', width:200},
				{field:'remark', title:'关联备注', width:200},
				{field:'creator', title:'关联人', width:80},
				{field:'create_date', title:'关联时间', width:100}						
				
			]],
			//表头，添加工具栏。
			toolbar:[{
				text:'新增角色关联',
				iconCls:'icon-add',
				handler:doAdd
			},'-',{
				text:'删除角色关联',
				iconCls:'icon-remove',
				handler:function(){
					
					getSelected(doDelete);
				}
			}]
		});
		
	};

	
	//选择表格中某一行的数据。
	function getSelected(func){
		var selectedrow = $('#table_rel_role').datagrid('getSelected');
		
		if (selectedrow){
			row = selectedrow;
			//调用相关函数
			func.call(this,selectedrow);
		}
		else{
			
			$.messager.alert('提示：','请点击选中表格中的某一行.');
		}
	}
	
	//新增
	function doAdd(row){
		var options={
				id:'plat_addRelRole', //id一定要是唯一
				src:'../user/relRoleAdd.jsp',
				destroy:true,//点关闭时是否注销该窗口释放内容
				title:'新增建筑角色关联：',
				width:800,   
				height:600, 
				modal:true,
				onBeforeClose:function(){
					//刷新
					$('#table_rel_role').datagrid("reload");
				},
				onLoad:function(){
					
					//这里的this已经指向到了对应IFRAME的window
					
					//传递参数给弹出窗口
					this.user_id =args.user.user_id;
				}
			};
			openInTopWindow(options);
	}

	//删除
	function doDelete(row){
		top.$.messager.confirm('确认', '确定要删除关联角色[' + row.role_name + ']？', function(result){
			if (result) {
				$.ajax({
				   type: "POST",
				   url:  '../userRoleRelDelegate/deleteUserRoleRelFromUser.run?urr_ids='+row.urr_id,
				   dataType:"json",
				   success: function(data){
				    	//载入表单
				    	$('#table_rel_role').datagrid("reload");
				   }
				});
			}
		});
	}
	
	

</script>
</head>
<body>

<table id="table_rel_role"  />

</body>
