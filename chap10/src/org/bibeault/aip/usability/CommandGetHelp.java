package org.bibeault.aip.usability;

import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;
import javax.servlet.RequestDispatcher;

public class CommandGetHelp implements Command {

  public static final String KEY_TOPIC = "topic";

  public void execute (HttpServletRequest request, HttpServletResponse response ) throws ServletException, IOException {
    String topic = request.getParameter(KEY_TOPIC);
    RequestDispatcher dispatcher = request.getRequestDispatcher( "/helpfiles/help-" + topic + ".html" );
    dispatcher.forward( request, response );
  }

}
