<%--
simple JSP to generate some questions - and answers--%>
<%--
generally, it is good manners to set the mime type, but we've switched it off here because Prototype is clever
enough to recognise the text/javascript mime type and eval() it, and here we want to demonstrate
some general principles, not show off prototype's power-user features!
<jsp:directive.page contentType="text/javascript"/>
--%>
<jsp:directive.page contentType="text/plain"/>
<%
String name=request.getParameter("name");
%>
document.getElementById('helloTitle').innerHTML="<h1>Hello, <b><i>"+name+"</i></b></h1>";
