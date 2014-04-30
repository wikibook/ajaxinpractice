<jsp:directive.page 
  contentType="application/javascript"
  import="java.util.*,net.sf.json.*"
/>
<%
//read the request body
String json=request.getReader().readLine();
JSONObject jsonObj=new JSONObject(json);
String name=(String)(jsonObj.get("name"));

jsonObj.put("initial",name.substring(0,1).toUpperCase());

String[] likes=new String[]{ "JavaScript", "Skiing", "Apple Pie" };
jsonObj.put("likes",likes);

Map ingredients=new HashMap();
ingredients.put("apples","3kg");
ingredients.put("sugar","1kg");
ingredients.put("pastry","2.4kg");
ingredients.put("bestEaten","outdoors");
jsonObj.put("ingredients",ingredients);
%><%=jsonObj%>
