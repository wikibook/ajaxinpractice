This folder contains the example code for Chapter 10.

The files and sub-folders within this folder consist of:

  WEB-INF/        Deployment folder allowing this folder to serve as a Java web application
  helpfiles/      Folder to hold help text for Solutions 10.3 and 10.4
  prelude.jspf    Common file prepended to all JSP pages
  prototype.js    Prototype library
  solution-10.1/  Files for Solution 10.1
  solution-10.2/  Files for Solution 10.2
  solution-10.3/  Files for Solution 10.3
  solution-10.4/  Files for Solution 10.4
  solution-10.5/  Files for Solution 10.5
  solution-10.6/  Files for Solution 10.6
  solution-10.7/  Files for Solution 10.7
  solution-10.8/  Files for Solution 10.8
  src/            Source code for the server-side resources
  styles.css      Style sheet common to all solutions

In order to execute, the solutions in this chapter require the services of
server-side resources. For your convenience, this folder has been configured
to be used directly as a Java web application without the need for building
or compiling the source code.

The server-side code requires the following:

  - a Java Web Server that is Servlets 2.4 and JSP 2.0 compliant
  - Java JDK 1.5

If you already have a suitable Servlet-enabled web server running, simply
set up an application context named /aip.chap10 whose docbase is this folder.
If you need to set up a free instance of Tomcat, please see the tomcat.pdf
document in the folder for the Chapter 4 example code.

These pages and classes have been tested in Safari 2.0, Firefox 1.5 and
Internet Explorer 6.
