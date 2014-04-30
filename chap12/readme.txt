This folder contains the example code for Chapter 12.

The files and sub-folders within this folder consist of:

  WEB-INF/      Deployment folder allowing this folder to serve as a Java web application
  flickr/       Files for the Flickr solutions
  prelude.jspf  Common file prepended to all JSP pages
  search/       Files for the search solutions
  src/          Source code for the server-side resources
  yahoo/        Files for the Yahoo! solutions

In order to execute, the solutions in this chapter require the services of
server-side resources. For your convenience, this folder has been configured
to be used directly as a Java web application without the need for building
or compiling the source code.

The server-side code requires the following:

  - a Java Web Server that is Servlets 2.4 and JSP 2.0 compliant
  - Java JDK 1.5

If you already have a suitable Servlet-enabled web server running, simply
set up an application context named /aip.chap12 whose docbase is this folder.
If you need to set up a free instance of Tomcat, please see the tomcat.pdf
document in the folder for the Chapter 4 example code.

These pages and classes have been tested in Safari 2.0, Firefox 1.5 and
Internet Explorer 6.
