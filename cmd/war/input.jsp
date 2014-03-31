<%@ page language="java" contentType="text/html; charset=utf-8"
   pageEncoding="utf-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" 
"http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>Employee Form</title>
</head>

<body>
   <form action="empinfo" method="post">
      <s:textfield name="name" label="Name" size="20" />
      <s:textfield name="age" label="Age" size="20" />
      <input type="submit" />
   </form>
</body>
</html>