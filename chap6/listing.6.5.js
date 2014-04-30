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

var DateValidator = Class.create();                           //#1
Object.extend(DateValidator.prototype, Validator.prototype);
Object.extend(DateValidator.prototype, {
  type: "date",

   doValidate: function(input) {
    var value = Date.parse(input);                            //#2
    if(value <= 0) {
      return "'" + input + "' is not a date.";
    } else {
      return "";
    }
  }
});

var ValidatorFramework = Class.create();
ValidatorFramework.prototype =
{
  validators: 0,
  crossValidators: 0,                                         //#A

  validateForm: function(form) {
    var retval = true;
    for(i = 0; i < form.length; i++) {
      currentInput = form[i];
      type = currentInput.getAttribute("valid");
      errorDivName = currentInput.getAttribute("error");
      if(type == null || errorDivName == null) {
        continue;
      } else {
        valid = this.validate(type, currentInput.value,
          $(errorDivName));
        if(!valid) {
          retval = false;
        }
      }
    }
    for(i = 0;                                                //#3
        i < this.crossValidators.length; i++) {
      this.crossValidators[i].clearErrors();
    }
    if (retval) {                                             //#4
      for(i = 0; i < this.crossValidators.length; i++)  {
        valid = this.crossValidators[i].validate();
        if(!valid) {
          retval = false;
        }
      }
    }
    return retval;
  },

  validate: function(type, input, errordiv) {
    var validator = this.validators[type];
    if(!validator) {
      alert("No validator for type '" + type + "'.");
      return "";
    }
    return validator.validate(input, errordiv);
  },

  initialize: function() {
    this.validators = new Array();
    this.crossValidators = new Array();

    new Validator(this.validators);
    new NumberValidator(this.validators);
    new DateValidator(this.validators);
  }

}

var CrossValidator = Class.create();                          //#5
Object.extend(CrossValidator.prototype, {
    type: "none",
    crossError: 0,
    crossInputs: 0,

    initialize: function(framework,                           //#B
                         p_crossInputs,                       //#B
                         p_crossError) {                      //#B
      framework.crossValidators.push(this);                   //#C
      this.crossError = p_crossError;
      this.crossInputs = p_crossInputs;
    },

    validate: function() {
      errorMsg = this.doValidate(
        this.crossInputs);                                    //#D
      this.crossError.innerHTML = errorMsg;
      return (errorMsg.length == 0);
    },

    clearErrors: function() {                                 //#E
      this.crossError.innerHTML = "";
    }
});

var DateRangeCrossValidator =                                 //#6
  Class.create();                                             //#6
Object.extend(DateRangeCrossValidator.prototype,
              CrossValidator.prototype);
Object.extend(DateRangeCrossValidator.prototype, {

  doValidate: function(inputs) {
    var startDate = Date.parse(inputs[0].value);
    var endDate = Date.parse(inputs[1].value);
    if (startDate > endDate) {
      return "The start date cannot be after the end date.";
    } else {
      return "";
    }
  }

});
