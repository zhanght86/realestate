<%@ page language="java" import="java.util.*" pageEncoding="GBK"
	contentType="text/html;charset=GBK"
	import="com.szhome.security.ext.UserInfo"%>
<%
	UserInfo userInfo = (UserInfo) session.getAttribute("userInfo");
	String userName = userInfo.getUserName();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
		"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>�Ǽ���Ϣ</title>
<meta http-equiv="content-type" content="text/html;charset=GBK">
	<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
			<meta http-equiv="expires" content="0">
				<meta http-equiv="keywords" content="">

					<%@ include file="/base/taglibs.jsp"%>
					<%@ include file="/base/prefix.jsp"%>
					<style type="text/css">
body,html {
	margin: 0px;
	font-family: Arial;
	font-size: 12px;
	color: #333333;
}

.tip {
	color: #3CF;
}

.title {
	text-align: right;
}

.bg1 {
	background: none repeat scroll 0 0 #E0ECFF;
}

.bg2 {
	background: none repeat scroll 0 0 #F4F4F4;
}

.panel-body {
	background: none repeat scroll 0 0 #F8FAFF;
}
</style>
							<script type="text/javascript">
								var user = '<%=userName%>';
								var ctx = '${ctx}';
							</script>
							<script type="text/javascript"
								src="${ctx}/js/common/correction/correction-material.js"></script>
</head>
<body class="body_set">
	<div class="plui-layout" style="width: 100%; height: 100%;">
		<div data-options="region:'center',border:true">
			<div class="page_con">
				<div id="div_iframe" style="800px;height:500px">
					
				</div>



			</div>
		</div>
	</div>
</body>
</html>
