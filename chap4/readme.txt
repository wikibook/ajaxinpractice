This folder contains the example code for Chapter 4.

The files and sub-folders within this folder consist of:

  WEB-INF/      Deployment folder allowing this folder to serve as a Java web application
  dojo/         Solutions for the Dojo section
  dwr/          Solutions for the DWR section
  prelude.jspf  Common file prepended to all JSP pages
  prototype/    Solutions for the Prototype section
  tomcat.pdf    Instructions for setting up Tomcat
  rico/         Solutions for the Rico section
  src/          Source code for the server-side resources

In order to execute, the solutions in this chapter require the services of
server-side resources. For your convenience, this folder has been configured
to be used directly as a Java web application without the need for building
or compiling the source code.

The server-side code requires the following:

  - a Java Web Server that is Servlets 2.4 and JSP 2.0 compliant
  - Java JDK 1.5

If you already have a suitable Servlet-enabled web server running, simply
set up an application context named /aip.chap4 whose docbase is this folder.
If you need to set up a free instance of Tomcat, please see the included
tomcat.pdf document.

These pages and classes have been tested in Safari 2.0, Firefox 1.5 and
Internet Explorer 6.
