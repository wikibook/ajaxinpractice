package chapter11;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class CustomerServlet extends HttpServlet
{

  CustomerManager cm = CustomerManager.getInstance();

  @Override
  protected void doGet(HttpServletRequest req,
      HttpServletResponse res) throws ServletException,
      IOException
  {
    int start = Integer.parseInt(req.getParameter("start"));
    int pagesize = Integer.parseInt(req
        .getParameter("pageSize"));

    List<Customer> customers = cm.getCustomers();

    JSONArray ja = new JSONArray();
    for (int current = start; current < start + pagesize
        && !(current >= customers.size()); current++)
    {
      try
      {
        ja.put(customers.get(current).toJSON());
      }
      catch (JSONException e)
      {
        e.printStackTrace();
        throw new ServletException(e);
      }
    }

    res.getOutputStream().write(ja.toString().getBytes());
  }
}
