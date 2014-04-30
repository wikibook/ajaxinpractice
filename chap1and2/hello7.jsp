<%--
simple JSP to generate some questions - and answers--%>
<jsp:directive.page contentType="text/xml"/>
<%
String name=request.getParameter("name");
%>
<person initial="<%=name.substring(0,1).toUpperCase()%>">
 <name><![CDATA[<%=name%>]]></name>
 <likes>
  <item>JavaScript</item>
  <item>Skiing</item>
  <item>Apple Pie</item>
 </likes>  
 <recipe>
  <name>apple pie</name>
  <ingredient qty="3kg">apples</ingredient>
  <ingredient qty="1kg">sugar</ingredient>
  <ingredient qty="2.4kg">pastry</ingredient>
  <serving-suggestion><![CDATA[Best Eaten Outdoors! Mmm!]]></serving-suggestion>
 </recipe>
</person>