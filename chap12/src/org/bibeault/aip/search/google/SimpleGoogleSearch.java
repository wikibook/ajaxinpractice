package org.bibeault.aip.search.google;

import com.google.soap.search.*;

public class SimpleGoogleSearch {

  private GoogleSearch googleSearch;

  public SimpleGoogleSearch( String clientKey ) {
    this.googleSearch = new GoogleSearch();
    this.googleSearch.setKey( clientKey );
  }

  public GoogleSearchResultElement[] search( String searchTerm )
         throws GoogleSearchFault {
    this.googleSearch.setQueryString( searchTerm );
    GoogleSearchResult googleSearchResult =
      this.googleSearch.doSearch();
    return googleSearchResult.getResultElements();
  }

  public static void main( String[] args ) throws Exception {
    if (args.length == 0) throw new Exception( "A search term must be provided" );
    SimpleGoogleSearch searcher = new SimpleGoogleSearch( "aApewexQFHItVSrlTMDk2iglRbhB+6AR" );
    GoogleSearchResultElement[] results = searcher.search( args[0] );
    for (GoogleSearchResultElement result : results) {
      System.out.println( "title: " + result.getTitle() );
      System.out.println( "url: " + result.getURL() );
      System.out.println( "snippet: " + result.getSnippet() + '\n');
    }
  }

}
