package org.bibeault.rest;

import java.util.*;
import org.apache.commons.httpclient.*;
import org.apache.commons.httpclient.methods.*;

public class ContentGrabber {

  private String url;
  private String content;
  private String contentType;
  private Integer contentLength;

  public ContentGrabber(String url,
                        Map<String, String[]> parameters) {
    this.url = url;
    try {
      HttpMethod method = new GetMethod( url );
      List<NameValuePair> params = new ArrayList<NameValuePair>();
      for (Map.Entry<String,String[]> entry : parameters.entrySet()) {
        for (String value : entry.getValue()) {
          params.add( new NameValuePair( entry.getKey(), value ) );
        }
      }
      method.setQueryString(
        params.toArray( new NameValuePair[params.size()] ) );
      new HttpClient().executeMethod( method );
      this.content = method.getResponseBodyAsString();
      Header contentTypeHeader =
        method.getResponseHeader( "content-type" );
      Header contentLengthHeader =
        method.getResponseHeader( "content-length" );
      if (contentTypeHeader != null)
        this.contentType = contentTypeHeader.getValue();
      if (contentLengthHeader != null)
        this.contentLength =
          Integer.parseInt( contentLengthHeader.getValue() );
      method.releaseConnection();
    }
    catch (Exception e) {
      e.printStackTrace();
      throw new RuntimeException( "Error obtaining content from " +
          this.url + ": " + e, e );
    }
  }

  public String getUrl() { return this.url; }
  public String getContent() { return this.content; }
  public String getContentType() { return this.contentType; }
  public Integer getContentLength() {  return this.contentLength; }

  public static void main(String[] args) {
    Map<String, String[]> params = new HashMap<String, String[]>();
    params.put("appid", new String[] {"org.bibeault.aip"});
    params.put("location", new String[] {"78701"});
    System.out.println(
      new ContentGrabber("http://api.local.yahoo.com/MapsService/V1/geocode",
                         params)
        .getContent());
  }

}
