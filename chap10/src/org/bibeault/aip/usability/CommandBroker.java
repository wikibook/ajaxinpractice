package org.bibeault.aip.usability;

import java.io.IOException;
import javax.servlet.http.*;
import javax.servlet.ServletException;

public class CommandBroker extends HttpServlet {

  public void doGet( HttpServletRequest request,
                     HttpServletResponse response)
    throws IOException, ServletException {
    Command command;
    String commandName = request.getPathInfo().substring( 1 );
    System.out.println( "COMMAND: " + commandName );
    if (commandName == null) {
      response.sendError(
        HttpServletResponse.SC_BAD_REQUEST,
        "An commandName must be provided."
      );
      return;
    }
    try {
      command = (Command)Class.forName( "org.bibeault.aip.usability.Command" + commandName ).newInstance();
    }
    catch (ClassNotFoundException e) {
      response.sendError(
        HttpServletResponse.SC_BAD_REQUEST,
        "Command with name " + commandName + " not supported"
      );
      return;
    }
    catch (Exception e) {
      throw new ServletException( "Error creating an command instance for " + commandName, e );
    }
    command.execute( request, response );
  }

  public void doPost( HttpServletRequest request,
                      HttpServletResponse response)
      throws ServletException, IOException {
    doGet( request, response );
  }

}
