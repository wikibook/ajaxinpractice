SearchInstrumenter = Class.create();

SearchInstrumenter.prototype = {

  DEFAULT_ELEMENT_TYPE: 'abbr',
  DEFAULT_RESULTS_CONTAINER: 'resultsContainer',
  SEARCH_URL: '/aip.chap12/search',

  initialize: function(options) {
    this.options = Object.extend(
      {
        elementType: this.DEFAULT_ELEMENT_TYPE,
        resultsContainer: this.DEFAULT_RESULTS_CONTAINER
      },
      options
    );
    var self = this;
    $A(document.getElementsByTagName(this.options.elementType))
      .each(
        function(element) {
          element.onclick = function() {
            self.doSearch(element.innerHTML);
          }
        }
      );
  },

  doSearch: function(term) {
    new Ajax.Request(
      this.SEARCH_URL,
      {
        method: 'get',
        parameters: $H({term: term}).toQueryString(),
        onSuccess: this.showResults.bind(this),
        onFailure: this.showError.bind(this)
      }
    );
    $(this.options.resultsContainer).innerHTML =
      'Searching for ' + term + '...';
  },

  showResults: function(request) {
    var jsonResponse = request.responseText;
    eval('results='+jsonResponse);
    $('resultsContainer').innerHTML = '';
    results.each(
      function(result) {
        $('resultsContainer').innerHTML +=
          '<p>Title: <b>' + result.title + '</b><br/>' +
          'Summary: ' + result.summary + '<br/>' +
          'URL: ' + result.url +'</p>';
      }
    );
  },

  showError: function(request) {
    $(this.options.resultsContainer).innerHTML =
      request.responseText;
  }

}
