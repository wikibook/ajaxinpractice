package org.bibeault.aip.search.google;

import com.google.soap.search.GoogleSearch;
import com.google.soap.search.GoogleSearchFault;
import com.google.soap.search.GoogleSearchResult;
import com.google.soap.search.GoogleSearchResultElement;
import org.bibeault.aip.search.WebSearch;
import org.bibeault.aip.search.WebSearchResult;

public class WebSearchByGoogle implements WebSearch {

    private GoogleSearch googleSearch;

    public WebSearchByGoogle( String clientKey ) {
        this.googleSearch = new GoogleSearch();
        this.googleSearch.setKey( clientKey );
    }

    public WebSearchResult[] search( String searchTerm ) throws Exception {
        this.googleSearch.setQueryString( searchTerm );
        try {
            GoogleSearchResult googleSearchResult = this.googleSearch.doSearch();
            GoogleSearchResultElement[] googleResults = googleSearchResult.getResultElements();
            WebSearchResult[] results = new Result[ googleResults.length ];
            for (int n = 0; n < googleResults.length; n++) {
                results[n] = new Result( googleResults[n] );
            }
            return results;
        }
        catch (GoogleSearchFault e) {
            throw new Exception( "Web serach by Google failed: " + e );
        }
    }

    public static void main( String[] args ) throws Exception {
        WebSearchByGoogle searcher = new WebSearchByGoogle( "aApewexQFHItVSrlTMDk2iglRbhB+6AR" );
        WebSearchResult[] results = searcher.search( "dragon tattoo" );
        for (WebSearchResult result : results ) {
            System.out.println( "title: " + result.getTitle() );
            System.out.println( "url: " + result.getUrl() );
            System.out.println( "summary: " + result.getSummary() );
            System.out.println( "<<<<>>>>" );
        }
        System.out.println( "##################################################################################" );
        results = searcher.search( "orange juice" );
        for (WebSearchResult result : results ) {
            System.out.println( "title: " + result.getTitle() );
            System.out.println( "url: " + result.getUrl() );
            System.out.println( "summary: " + result.getSummary() );
            System.out.println( "<<<<>>>>" );
        }
    }

    class Result implements WebSearchResult {

        private GoogleSearchResultElement googleElement;

        private Result( GoogleSearchResultElement element ) {
            this.googleElement = element;
        }

        public String getTitle() { return this.googleElement.getTitle(); }
        public String getSummary() { return this.googleElement.getSnippet(); }
        public String getUrl() { return this.googleElement.getURL(); }

    }

}
