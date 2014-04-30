<% response.setContentType("text/xml"); %>
<jsp:useBean id="eFridge" class="org.bibeault.aip.rico.EFridge"/>
<ajax-response>
  <response type="element" id="itemData">
    <div>
      <div><label>Item:</label>${eFridge.items[param.id].name}</div>
      <div><label>Description:</label>${eFridge.items[param.id].description}</div>
      <div><label>Category:</label>${eFridge.items[param.id].category}</div>
      <div><label>Expires:</label>${eFridge.items[param.id].expires}</div>
    </div>
  </response>
</ajax-response>
