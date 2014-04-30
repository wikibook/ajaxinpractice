if (!Prototype) {
  throw new Error( "prototype.js must be in scope to use Trip-O-Matic" );
}

TripomaticDigester = Class.create();

TripomaticDigester.prototype = {

  initialize: function(dataUrl,onLoadHandler) {
    this.dataUrl = dataUrl;
    this.onLoadHandler = onLoadHandler;
    new Ajax.Request(
      this.dataUrl,
      {
        onSuccess: this.onDigest.bind(this),
        onFailure: function() {
          throw new Error('failed to load ' + dataUrl);
        }
      }
    );
  },

  onDigest: function(request) {
    var xmlDoc = request.responseXML;
    var tripElement = xmlDoc.childNodes.item(0);
    if (tripElement.nodeName != 'trip')
      throw new Error( 'root element must be <trip>' );
    this.title = tripElement.getAttribute('title');
    this.flickrNSID = tripElement.getAttribute('flickrNSID');
    this.flickrKey = tripElement.getAttribute('flickrKey');
    this.description = this.collectText(tripElement);
    this.points = new Array();
    var poiElements = tripElement.getElementsByTagName('poi');
    $A(poiElements).each(this.loadPoint.bind(this));
    this.onLoadHandler.call(this);
  },

  loadPoint: function(poiElement,index) {
    this.points.push ({
      name: poiElement.getAttribute('name'),
      latitude: poiElement.getAttribute('latitude'),
      longitude: poiElement.getAttribute('longitude'),
      photoSetId: poiElement.getAttribute('photoSetId'),
      description: this.collectText(poiElement)
    });
  },

  collectText: function(element) {
    var text = '';
    $A(element.childNodes).each(
      function(child) {
        if ((child.nodeName == '#text') ||
            (child.nodeName == '#cdata-section')) {
          text += child.data;
        }
      }
    );
    return text.trim();
  }

}
