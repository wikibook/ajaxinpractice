package org.bibeault.aip.search;

import org.bibeault.aip.search.google.WebSearchByGoogle;
import org.bibeault.aip.search.yahoo.WebSearchByYahoo;

public class SearchTest {

    public static void main( String[] args ) throws Exception {
        if (args.length < 1) throw new Exception( "Please provide a search term" );
        System.out.println( "Google results for search term: " + args[0] );
        showResults( doSearch( new WebSearchByGoogle( "aApewexQFHItVSrlTMDk2iglRbhB+6AR" ), args[0] ) );
        System.out.println( "\nYahoo! results for search term: " + args[0] );
        showResults( doSearch( new WebSearchByYahoo( "org.bibeault.aip" ), args[0] ) );
    }

    private static WebSearchResult[] doSearch( WebSearch searchEngine, String searchTerm ) throws Exception {
        return searchEngine.search( searchTerm );
    }

    private static void showResults( WebSearchResult[] results ) {
        for (WebSearchResult result : results ) {
            System.out.println( "Title: " + result.getTitle() );
            System.out.println( "Summary: " + result.getSummary() );
            System.out.println( "URL: " + result.getUrl() + '\n' );
        }
    }

}
