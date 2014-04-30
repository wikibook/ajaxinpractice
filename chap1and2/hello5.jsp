<%--
simple JSP to generate some questions - and answers--%>
<jsp:directive.page contentType="application/javascript"/>
<%
String name=request.getParameter("name");
%>
{
  name: "<%=name%>",
  initial: "<%=name.substring(0,1).toUpperCase()%>",
  likes: [ "JavaScript", "Skiing", "Apple Pie" ],
  ingredients: {
    apples: "3kg",
    sugar: "1kg",
    pastry: "2.4kg",
    bestEaten: "outdoors"
  }
}
