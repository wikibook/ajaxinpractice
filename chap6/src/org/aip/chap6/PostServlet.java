package org.aip.chap6;

import java.io.IOException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;

public class PostServlet extends HttpServlet {

  protected void doPost(HttpServletRequest request,
                        HttpServletResponse response)
      throws ServletException, IOException {
    System.out.println("Content type: " +
                       request.getContentType());
    ServletInputStream is = request.getInputStream();
    int data = is.read();
    int bytes = 0;
    while (data >= 0) {
      bytes++;
      data = is.read();
    }
    response.getWriter().write("Received " + bytes + " bytes.");
  }

}
