Button = Class.create();

Button.prototype = {

  initialize: function(element, options) {
    this.element = $(element);
    if (!this.element) throw new Error(element + ' not found');
    this.options = Object.extend(
      {
        enabled: true,
        onClick: function() {},
        enabledClassName: this.CLASS_DEFAULT_CLASS_ENABLED,
        disabledClassName: this.CLASS_DEFAULT_CLASS_DISABLED,
        armedClassName: this.CLASS_DEFAULT_CLASS_ARMED,
        pressedClassName: this.CLASS_DEFAULT_CLASS_PRESSED
      },
      options
    );
    this.element.onclick = this.onclick.bind(this);
    this.element.onmouseover = this.onArm.bind(this);
    this.element.onmouseout = this.onDisarm.bind(this);
    this.element.onmousedown = this.onPress.bind(this);
    this.element.onmouseup = this.onRelease.bind(this);
    if (this.options.enabled) {
      this.enable();
    }
    else {
      this.disable();
    }
  },

  CLASS_DEFAULT_CLASS_ENABLED: 'buttonEnabled',
  CLASS_DEFAULT_CLASS_ARMED: 'buttonArmed',
  CLASS_DEFAULT_CLASS_DISABLED: 'buttonDisabled',
  CLASS_DEFAULT_CLASS_PRESSED: 'buttonPressed',

  onclick: function() {
    if (this.options.enabled) {
      this.options.onClick.call(this);
    }
  },

  onArm: function() {
    if (this.options.enabled) {
      this.element.className = this.options.armedClassName;
    }
  },

  onDisarm: function() {
    if (this.options.enabled) {
      this.element.className = this.options.enabledClassName;
    }
  },

  onPress: function() {
    if (this.options.enabled) {
      this.element.className = this.options.pressedClassName;
    }
  },

  onRelease: function() {
    if (this.options.enabled) {
      this.element.className = this.options.enabledClassName;
    }
  },

  isEnabled: function() {
    return this.options.enabled;
  },

  enable: function() {
    this.options.enabled = true;
    this.element.disabled = false;
    this.element.className = this.options.enabledClassName;
  },

  disable: function() {
    this.options.enabled = false;
    this.element.disabled = true;
    this.element.className = this.options.disabledClassName;
  }

}
