DVD = Class.create();

DVD.prototype = Object.extend(
  new Disc(),
  {
    initialize: function(title,director,location) {
      this._initializeDisc(title,location,'DVD');
      this.director = director;
    }
  }
);
