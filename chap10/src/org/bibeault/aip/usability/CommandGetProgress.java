package org.bibeault.aip.usability;

import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;

public class CommandGetProgress implements Command {

  public static final String VAR_PROGRESS = "progress";

  public void execute (HttpServletRequest request, HttpServletResponse response ) throws ServletException, IOException {
    Integer progress = (Integer)request.getSession().getAttribute( VAR_PROGRESS );
    if (progress == null) progress = 0;
    progress += 20;
    if (progress > 100) progress = 0;
    request.getSession().setAttribute( VAR_PROGRESS, progress );
    response.getOutputStream().print( progress );
  }

}
