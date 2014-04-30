var Validator = Class.create();

Validator.prototype = {
  type: "all",

  initialize: function(validators) {                          //#1
    validators[this.type] = this;
  },

  doValidate: function(input) {                               //#2
    return "";
  },

  validate: function(input, errordiv) {                       //#3
    errorMsg = this.doValidate(input);
    errordiv.innerHTML = errorMsg;
    return (errorMsg.length == 0);
  }
}

var NumberValidator = Class.create();

Object.extend(NumberValidator.prototype,
              Validator.prototype);

Object.extend(NumberValidator.prototype, {
    type: "number",                                           //#4

     doValidate: function(input) {                            //#5
      var numberpattern=/(^\d+$)|(^\d+\.\d+$)/;
      if (numberpattern.test(input)) {
        return "";
      } else {
        return "'" + input + "' is not a number." ;
      }
    }
});

var ValidatorFramework = Class.create();

ValidatorFramework.prototype =
{
  validators: 0,                                             //#6

  validateForm: function(form) {
    var retval = true;
    for(i = 0; i < form.length; i++) {
      currentInput = form[i];
      type = currentInput.getAttribute("valid");
      errorDivName = currentInput.getAttribute("error");
      if(type == null || errorDivName == null) {
        continue;
      } else {
        valid = this.validate(                                //#7
          type, currentInput.value, $(errorDivName));
        if(!valid) {
          retval = false;
        }
      }
    }
    return retval;
  },

  validate: function(type, input, errordiv) {
    return this.validators[type].                             //#8
      validate(input, errordiv);                              //#8
  },

  initialize: function() {                                    //#9
    this.validators = new Object();
    new Validator(this.validators);
    new NumberValidator(this.validators);
  }

}
