package org.bibeault.aip.usability;

import java.io.IOException;
import javax.servlet.http.*;
import javax.servlet.ServletException;

public interface Command {

  void execute( HttpServletRequest request, HttpServletResponse rsponse ) throws ServletException, IOException;

}
