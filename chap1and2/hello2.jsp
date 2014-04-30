<%--
simple JSP to generate some questions - and answers--%>
<jsp:directive.page contentType="text/html"/>
<%
String name=request.getParameter("name");
%>
<h1>Hello <%=name%></h1>
<p>I used to know someone called <b><i><%=name%></i></b>. Are you related?</p>