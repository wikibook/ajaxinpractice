<jsp:directive.page 
  contentType="text/json"
  import="java.util.*"
/>
<%
String key=request.getParameter("key");
String data=request.getParameter("data");
if (data==null){
  %><%=session.getAttribute(key)%><%
}else{
  session.setAttribute(key,data);
  %>{ "status" : "ok" }<%
}
%>
