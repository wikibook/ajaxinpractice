package org.bibeault.aip.search.yahoo;

import org.bibeault.aip.search.WebSearch;
import org.bibeault.aip.search.WebSearchResult;
import com.yahoo.search.SearchClient;
import com.yahoo.search.WebSearchRequest;
import com.yahoo.search.WebSearchResults;

public class WebSearchByYahoo implements WebSearch {

    private SearchClient yahooSearch;

    public WebSearchByYahoo( String clientKey ) {
        this.yahooSearch = new SearchClient( clientKey );
    }

    public WebSearchResult[] search( String searchTerm ) throws Exception {
        WebSearchRequest request = new WebSearchRequest( searchTerm );
        try {
            WebSearchResults yahooResult = this.yahooSearch.webSearch( request );
            com.yahoo.search.WebSearchResult[] yahooResults = yahooResult.listResults();
            WebSearchResult[] results = new Result[ yahooResults.length ];
            for (int n = 0; n < yahooResults.length; n++) {
                results[n] = new Result( yahooResults[n] );
            }
            return results;
        }
        catch (Exception e) {
            throw new Exception( "Web search by Yahoo! failed: " + e );
        }
    }

    class Result implements WebSearchResult {

        private com.yahoo.search.WebSearchResult yahooResult;

        private Result( com.yahoo.search.WebSearchResult result ) {
            this.yahooResult = result;
        }

        public String getTitle() { return this.yahooResult.getTitle(); }
        public String getSummary() { return this.yahooResult.getSummary(); }
        public String getUrl() { return this.yahooResult.getUrl(); }

    }

}
