<%--
simple JSP to generate some questions - and answers--%>
<jsp:directive.page contentType="text/plain"/>
<%
String name=request.getParameter("name");
%>
Hello, <%=name%>