HelpConveyer = Class.create();

HelpConveyer.prototype = {

  initialize: function(targetElement,form,url,paramName) {
    this.target = targetElement;
    this.form = form;
    this.url = url;
    this.paramName = paramName;
    var conveyer = this;
    $A(this.form.elements).each(
      function(control) {
        if (control.name != undefined && control.name != '') {
          control.onfocus = function() {
            var paramHash = {};
            paramHash[conveyer.paramName] = control.name;
            new Ajax.Updater(
              conveyer.target,
              conveyer.url,
              {
                method: 'get',
                parameters: $H(paramHash).toQueryString()
              }
            );
          };
        }
      }
    );
  }

}
