<% response.setContentType("text/xml"); %>
<jsp:useBean id="eFridge" class="org.bibeault.aip.rico.EFridge"/>
<ajax-response>
  <response type="object" id="itemListManager">
    <c:forEach items="${eFridge.items}" var="entry">
      <item key="${entry.key}" name="${entry.value.name}"/>
    </c:forEach>
  </response>
</ajax-response>
