import java.io.BufferedInputStream;
import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Bookmarks extends HttpServlet
{
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException
    {
        String bookmarkId = req.getParameter("bookmarkId");

        res.setContentType("text/html");

        boolean isError = false;

        String qu = req.getParameter("bookmarkId");
        
        if (qu.length() > 5)
        {
            System.out.println("SUGGEST - bookmarkId: " + qu);
        }

        URL u;
        InputStream is = null;
        DataInputStream dis;
        String s;
        String returnString = "";
        
        try
        {
            qu = URLEncoder.encode(qu, "UTF-8");
            u = new URL("http://www.google.com/complete/search?hl=en&js=true&qu="+qu);
            is = u.openStream(); // throws an IOException
            dis = new DataInputStream(new BufferedInputStream(is));
            
            while ((s = dis.readLine()) != null)
            {
                System.out.println(s);
                returnString += s;
            }

        }
        catch (MalformedURLException mue)
        {

            System.out.println("--------------MalformedURLException happened.");
            mue.printStackTrace();
            isError = true;
        }
        catch (IOException ioe)
        {

            System.out.println("--------------IOException happened.");
            ioe.printStackTrace();
            isError = true;
        }
        finally
        {
            try
            {
                is.close();
            }
            catch (IOException ioe)
            {
                // just going to ignore this one
            }

        } // end of 'finally' clause

        PrintWriter out = res.getWriter();
        
        if (isError)
        {
            out.println("alert(\"Server Error - Please Try Again Later\");");
        }
        else
        {
            out.println(returnString);
            out.println("setTitle('Your bookmark is: "+bookmarkId+"');");
        }
        
        out.close();
    }
}