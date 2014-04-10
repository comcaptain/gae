<%@ page language="java" contentType="text/html; charset=utf-8"
   pageEncoding="utf-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">

<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<title>Hello App Engine</title>
		<link href="css/cmd.css" media="all" rel="stylesheet">
		<link href="css/jpLearner.css" media="all" rel="stylesheet">
		<style type="text/css">
		</style>
		<script src="js/jquery.min.js" ></script>
		<script src="js/cmd.js" ></script>
		<script src="js/jpLearner.js" ></script>
		<script type="text/javascript">
			var cmdObj;
			$(document).ready(function() {
				cmdObj = $("body").cmdConsole({rightPaste: false});
				var cmd = new Command("cal", "cal [expression], calculate, use javascript grammar");
				cmd.valueRequired = true;
				cmd.executeImpl = function(data) {
					this.end(new CmdMessage(eval(data[0]["value"][0]), "green"));
				};
				cmdObj.registerCommand(cmd);
				cmdObj.registerApplication(new JPLearner());
			});
		</script>
	</head>

	<body>
	</body>
</html>
