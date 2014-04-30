function ItemListManager( selectElement ) {
  this.selectElement = selectElement;
}

ItemListManager.prototype.ajaxUpdate = function( response ) {
  for (var n = 0; n < response.childNodes.length; n++) {
    var child = response.childNodes[n];
    if (child.nodeName == 'item') {
      var itemKey = child.getAttribute('key');
      var itemName = child.getAttribute('name');
      this.selectElement.add( new Option(itemName,itemKey), document.all ? 0 : null );
    }
  }
}
