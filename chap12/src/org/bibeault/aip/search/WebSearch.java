package org.bibeault.aip.search;

public interface WebSearch {
    public WebSearchResult[] search( String searchTerm ) throws Exception;
}
