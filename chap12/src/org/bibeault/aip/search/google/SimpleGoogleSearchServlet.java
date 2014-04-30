package org.bibeault.aip.search.google;

import java.io.IOException;
import javax.servlet.*;
import javax.servlet.http.*;
import com.google.soap.search.*;

public class SimpleGoogleSearchServlet extends HttpServlet {

  public static final String KEY_SEARCH_TERM = "term";

  public void doGet( HttpServletRequest request,
                     HttpServletResponse response )
        throws ServletException, IOException {
    String searchTerm = request.getParameter( KEY_SEARCH_TERM );
    SimpleGoogleSearch searcher =
      new SimpleGoogleSearch( "aApewexQFHItVSrlTMDk2iglRbhB+6AR" );
    try {
      GoogleSearchResultElement[] results =
        searcher.search( searchTerm );
      StringBuilder responseBody = new StringBuilder();
      responseBody.append( '[' );
      for (GoogleSearchResultElement result : results )
        appendResultAsJSON( responseBody, result );
      responseBody.append( ']' );
      response.setContentType( "text/plain" );
      response.setContentLength( responseBody.length() );
      response.getOutputStream().print( responseBody.toString() );
    }
    catch (GoogleSearchFault e) {
      e.printStackTrace();
      throw new ServletException( "Search error: " + e, e );
    }
  }

  private void appendResultAsJSON( StringBuilder responseBody,
                                   GoogleSearchResultElement result ) {
    responseBody
      .append( '{' )
      .append( "title:'" )
      .append( escapeQuotes( result.getTitle() ) ).append( "'," )
      .append( "snippet:'" )
      .append( escapeQuotes( result.getSnippet() ) ).append( "'," )
      .append( "url:'" ).append( escapeQuotes( result.getURL() ) )
      .append( "'" )
      .append( "}," );
  }

  private String escapeQuotes( String text ) {
    return text.replaceAll( "'", "\'" );
  }

}
