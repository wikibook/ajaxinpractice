String.prototype.trim = function() {
  var matches = this.match(/^\s+/);
  var prefixLength = (matches == null) ? 0 : matches[0].length;
  matches = this.match(/\s+$/);
  var suffixLength = (matches == null) ? 0 : matches[0].length;
  return this.slice( prefixLength, this.length - suffixLength );
}

Object.prototype.formatURL = function(base) {
  return base + '?' + $H(this).toQueryString();
}

String.prototype.getQueryParameters = function() {
  var position = this.indexOf('?');
  var queryString = (position == -1) ?
    this : this.slice(position + 1);
  return $H(queryString.toQueryParams());
}
