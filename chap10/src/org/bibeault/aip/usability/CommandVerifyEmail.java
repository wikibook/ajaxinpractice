/*
 * $Id$
 * Copyright 2006 by 3 Chiles Designs
 * The contents of this file is protected under the copyright laws of the United
 * States of America with all rights reserved. This document is confidential and
 * contains proprietary information. Any unauthorized use or disclosure is
 * expressly prohibited.
 */
package org.bibeault.aip.usability;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CommandVerifyEmail implements Command {

  public static final String KEY_VALUE = "value";

  private static final String REGEX_EMAIL = "([0-9a-zA-Z]([-.\\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\\w]*[0-9a-zA-Z]\\.)+[a-zA-Z]{2,9})";

  public void execute (HttpServletRequest request, HttpServletResponse response ) throws ServletException, IOException {
    String address = request.getParameter( KEY_VALUE );
    boolean matches = address.matches( REGEX_EMAIL );
    response.getOutputStream().print( matches ? "" : "The email field must contain a valid email address" );
  }

}
