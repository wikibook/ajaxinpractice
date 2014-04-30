function Button(elementName, options) {
  this.element = document.getElementById(elementName);             //|#1
  if (!this.element) throw new Error(elementName + ' not found');
  this.element.button = this;
  this.options = options || {};
  if (options) {                                                   //|#2
    this.options.enabled = options.enabled || true;
    this.options.onClick = options.onClick || function() {};
    this.options.enabledClassName =
      options.enabledClassName || this.CLASS_DEFAULT_CLASS_ENABLED;
    this.options.disabledClassName =
      options.disabledClassName || this.CLASS_DEFAULT_CLASS_DISABLED;
    this.options.armedClassName =
      options.armedClassName || this.CLASS_DEFAULT_CLASS_ARMED;
    this.options.pressedClassName =
      options.pressedClassName || this.CLASS_DEFAULT_CLASS_PRESSED;
  }
  var instance = this;                                             //|#3
  this.element.onclick = function() {
    if (instance.options.enabled) {
      instance.options.onClick.call(instance);
    }
  }
  this.element.onmouseover = this.onArm;                           //|#4
  this.element.onmouseout = this.onDisarm;
  this.element.onmousedown = this.onPress;
  this.element.onmouseup = this.onRelease;
  if (this.options.enabled) {                                     //|#5
    this.enable();
  }
  else {
    this.disable();
  }
}

Button.prototype.CLASS_DEFAULT_CLASS_ENABLED = 'buttonEnabled';
Button.prototype.CLASS_DEFAULT_CLASS_ARMED = 'buttonArmed';
Button.prototype.CLASS_DEFAULT_CLASS_DISABLED = 'buttonDisabled';
Button.prototype.CLASS_DEFAULT_CLASS_PRESSED = 'buttonPressed';

Button.prototype.onArm = function() {
  if (this.button.options.enabled) {
    this.className = this.button.options.armedClassName;
  }
}

Button.prototype.onDisarm = function() {
  if (this.button.options.enabled) {
    this.className = this.button.options.enabledClassName;
  }
}

Button.prototype.onPress = function() {
  if (this.button.options.enabled) {
    this.className = this.button.options.pressedClassName;
  }
}

Button.prototype.onRelease = function() {
  if (this.button.options.enabled) {
    this.className = this.button.options.enabledClassName;
  }
}

Button.prototype.isEnabled = function() {                        //|#1
  return this.options.enabled;
}

Button.prototype.enable = function() {                           //|#2
  this.options.enabled = true;
  this.element.disabled = false;
  this.element.className = this.options.enabledClassName;
}

Button.prototype.disable = function() {                          //|#3
  this.options.enabled = false;
  this.element.disabled = true;
  this.element.className = this.options.disabledClassName;
}
