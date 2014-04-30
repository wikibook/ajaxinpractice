package org.bibeault.aip.usability;

import java.io.IOException;
import javax.servlet.http.*;
import javax.servlet.ServletException;
import javax.servlet.RequestDispatcher;

public class CommandSearchForRecipes implements Command {

  public void execute( HttpServletRequest request, HttpServletResponse response ) throws ServletException, IOException {
    request.getSession().setAttribute( CommandGetProgress.VAR_PROGRESS, 0 );
    new SlowProcess().execute( 5000 );
    RequestDispatcher dispatcher = request.getRequestDispatcher( "/WEB-INF/pages/search-results.jsp" );
    dispatcher.forward( request, response );
  }

}
