FieldValidator = Class.create();

FieldValidator.prototype = {

  initialize: function(field,verifier,options) {
    this.field = $(field);
    this.verifier = verifier;
    this.options = Object.extend(
      {
        errorContainer: 'errorContainer',
        errorClassName: 'fieldInError',
        paramName: 'value'
      },
      options
    );
    this.errorContainer = $(this.options.errorContainer);
    this.field.validator = this;
    this.field.onblur = function() {
      this.validator.validate();
    }
  },

  validate: function() {
    this.clearError();
    if (this.verifier instanceof Function) {
      var message = this.verifier(this.field);
      if (message != null) this.markInError(message);
    }
    else {
      var validator = this;
      var paramHash = {};
      paramHash[this.options.paramName] = $F(this.field);
      new Ajax.Request(
        this.verifier,
        {
          parameters: $H(paramHash).toQueryString(),
          method: 'get',
          onSuccess: function(transport) {
            if (transport.responseText != '') {
              validator.markInError(transport.responseText);
            }
          }
        }
      );
    }
  },

  markInError: function(message) {
    Element.addClassName(this.field,
                         this.options.errorClassName);
    this.errorMessageElement = document.createElement('div');
    this.errorMessageElement.appendChild(
      document.createTextNode(message) );
    this.errorContainer.appendChild(
      this.errorMessageElement);
    Element.show(this.errorContainer);
  },

  clearError: function() {
    Element.removeClassName(this.field,
                            this.options.errorClassName);
    if (this.errorMessageElement)
      this.errorMessageElement.parentNode
        .removeChild(this.errorMessageElement);
  }

}

FieldValidator.verifier = {};

FieldValidator.verifier.NotBlank = function(field) {
  if ($F(field) == '') {
    return 'The ' + field.name + ' field cannot be blank';
  }
  else {
    return null;
  }
}

FieldValidator.verifier.IsNumeric = function(field) {
  if ($F(field) == '' || isNaN(new Number($F(field)))) {
    return 'The ' + field.name + ' field must be numeric';
  }
  else {
    return null;
  }
}

