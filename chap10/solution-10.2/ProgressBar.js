ProgressBar = Class.create();

ProgressBar.prototype = {

  initialize: function(parent,options) {
    this.parentElement = $(parent);
    this.options = Object.extend(
      {
        className: 'progressBar',
        color: 'red',
        interval: 2500
      },
      options
    );
    this.parentElement.innerHTML = '';
    this.parentElement.style.display = 'none';
    this.barContainer = document.createElement( 'div' );
    this.barContainer.className = this.options.className;
    this.barContainer.style.position = 'relative';
    this.bar = document.createElement( 'div' );
    this.bar.style.position = 'absolute';
    this.bar.style.height = '16px';
    this.bar.style.width = '0%';
    this.bar.style.backgroundColor = this.options.color;
    this.barContainer.appendChild( this.bar );
    this.parentElement.appendChild( this.barContainer );
  },

  start: function() {
    this.bar.style.width = '0%';
    Element.show(this.parentElement);
    this.timer =
      setInterval(this._tick.bind(this),this.options.interval);
  },

  stop: function() {
    clearInterval(this.timer);
    Element.hide(this.parentElement);
  },

  _tick: function() {
    var self = this;
    new Ajax.Request(
      '/aip.chap10/command/GetProgress',
      {
        onSuccess: function(request) {
          self.bar.style.width = request.responseText + '%';
        }
      }
    );
  }

}
