package org.bibeault.aip.usability;

import java.io.IOException;
import javax.servlet.http.*;

public class SlowServlet extends HttpServlet {

  public static final String KEY_DURATION = "duration";
  public static final long DEFAULT_DURATION = 10000;

  public void doGet( HttpServletRequest request,
                     HttpServletResponse response)
      throws IOException {
    Long duration = null;
    String text = request.getParameter( KEY_DURATION );
    if (text != null) {
      try {
        duration = Long.parseLong( text );
      }
      catch (NumberFormatException nfe) {
        //eat exception and use default
      }
    }
    if (duration == null) duration = DEFAULT_DURATION;
    String time = new SlowProcess().execute( duration );
    response.getOutputStream().print( time );
  }

  public void doPost( HttpServletRequest request,
                      HttpServletResponse response)
      throws IOException {
    doGet( request, response );
  }
  
}
