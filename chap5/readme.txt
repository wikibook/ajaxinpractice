This folder contains the example code for Chapter 5.

The files and sub-folders within this folder consist of:

  src/               Source code for the server-side resources
  WEB-INF/           Deployment folder allowing this folder to serve as a Java web application
  image.jpg          An image file referenced from the sample pages
  introduction.html  The HTML page referenced in the chapter introduction
  listing-5.1.html   The HTML file for listing 5.1
  listing-5.2.html   The HTML file for listing 5.2
  listing-5.3.html   The HTML file for listing 5.3
  listing-5.4.html   The HTML file for listing 5.4
  listing-5.5.html   The HTML file for listing 5.5
  listing-5.6.html   The HTML file for listing 5.6
  listing-5.7.html   The HTML file for listing 5.7
  listing-5.8.html   The HTML file for listing 5.8
  listing-5.9.html   The HTML file for listing 5.9
  listing-5.10.html  The HTML file for listing 5.10
  listing-5.11.html  The HTML file for listing 5.11
  listing-5.12.html  The HTML file for listing 5.12
  listing-5.13.html  The HTML file for listing 5.13
  listing-5.14.html  The HTML file for listing 5.14
  listing-5.15.html  The HTML file for listing 5.15
  prelude.jspf       Common file prepended to all JSP pages
  prototype-1.5.1.js Prototype library

In order to execute, some solutions in this chapter require the services of
server-side resources. For your convenience, this folder has been configured
to be used directly as a Java web application without the need for building
or compiling the source code.

The server-side code requires the following:

  - a Java Web Server that is Servlets 2.4 and JSP 2.0 compliant
  - Java JDK 1.5

If you already have a suitable Servlet-enabled web server running, simply
set up an application context named /aip.chap5 whose docbase is this folder.
If you need to set up a free instance of Tomcat, please see the tomcat.pdf
document in the folder for the Chapter 4 example code.

These pages and classes have been tested in Safari 2.0, Firefox 1.5 and
Internet Explorer 6 and 7.
