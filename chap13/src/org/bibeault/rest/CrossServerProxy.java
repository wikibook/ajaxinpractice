package org.bibeault.rest;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CrossServerProxy extends HttpServlet {

  public static final String KEY_SERVICE_URL = ".serviceUrl.";

  public void doGet( HttpServletRequest request,
                     HttpServletResponse response)
        throws ServletException, IOException {
    String serviceUrl = request.getParameter( KEY_SERVICE_URL );
    if (serviceUrl == null)
      throw new ServletException( "the " + KEY_SERVICE_URL +
        " parameter must be provided" );
    Map<String,String[]> parameters = new HashMap<String,String[]>();
    parameters.putAll( request.getParameterMap() );
    parameters.remove( KEY_SERVICE_URL );
    ContentGrabber grabber =
      new ContentGrabber( serviceUrl, parameters );
    if (grabber.getContentType() != null)
      response.setContentType( grabber.getContentType() );
    if (grabber.getContentLength() != null)
      response.setContentLength( grabber.getContentLength() );
    response.getOutputStream().print( grabber.getContent() );
  }

}
