package org.bibeault.aip.search;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.bibeault.aip.search.google.WebSearchByGoogle;
import org.bibeault.aip.search.yahoo.WebSearchByYahoo;

public class SearchServlet extends HttpServlet {

    public static final String KEY_SEARCH_TERM = "term";
    public static final String KEY_ENGINE = "engine";

    public static final String ENGINE_GOOGLE = "google";
    public static final String ENGINE_YAHOO = "yahoo";

    public void doGet( HttpServletRequest request, HttpServletResponse response ) throws ServletException {
        String searchTerm = request.getParameter( KEY_SEARCH_TERM );
        String engineName = request.getParameter( KEY_ENGINE );
        if ((searchTerm == null) || (engineName == null)) throw new ServletException( "a search term and engineName must be provided" );
        WebSearch searchEngine;
        if (engineName.equals( ENGINE_GOOGLE )) {
            searchEngine = new WebSearchByGoogle( "aApewexQFHItVSrlTMDk2iglRbhB+6AR" );
        }
        else if (engineName.equals( ENGINE_YAHOO )) {
            searchEngine = new WebSearchByYahoo( "org.bibeault.aip" );
        }
        else {
            throw new ServletException( "engine with name of " + engineName + " not found" );
        }
        try {
            WebSearchResult[] results = searchEngine.search( searchTerm );
            StringBuilder responseBody = new StringBuilder();
            responseBody.append( '[' );
            for (WebSearchResult result : results ) appendResultAsJSON( responseBody, result );
            responseBody.append( ']' );
            response.setContentType( "text/plain" );
            response.setContentLength( responseBody.length() );
            response.getOutputStream().print( responseBody.toString() );
        }
        catch (Exception e) {
            throw new ServletException( "error searching for " + searchTerm + " using " + searchEngine, e );
        }
    }

    private void appendResultAsJSON( StringBuilder responseBody, WebSearchResult result ) {
        responseBody.append( '{' )
                .append( "title:'" ).append( escapeQuotes( result.getTitle() ) ).append( "'," )
                .append( "summary:'" ).append( escapeQuotes( result.getSummary() ) ).append( "'," )
                .append( "url:'" ).append( escapeQuotes( result.getUrl() ) ).append( "'" )
                .append( "}," );
    }

    private String escapeQuotes( String text ) {
        return text.replaceAll( "'", "\'" );
    }

}
