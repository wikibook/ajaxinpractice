package org.aip.chap5;

import java.io.IOException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Smoke-and-mirrors validator servlet for listing 5.12. The
 * zip code must be non-blank and equal to "01826" to be
 * considered valid.
 */
public class ZipCodeValidatorServlet extends HttpServlet {

  protected void doGet( HttpServletRequest request,
                        HttpServletResponse response )
        throws IOException {
    StringBuilder result = new StringBuilder();
    String zipCodeValue = request.getParameter("zipCode");
    if (zipCodeValue.length() == 0) {
      result.append("The zip code field cannot be blank");
    }
    else if (!zipCodeValue.equals("01826")) {
      result
        .append("The zip code value of ")
        .append(zipCodeValue)
        .append(" does not match the specified street address");
    }
    response.getWriter().write(result.toString());
  }

}
