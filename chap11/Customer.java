package chapter11;

import java.util.Date;
import java.util.UUID;

import org.json.JSONException;
import org.json.JSONObject;

public class Customer
{

    public String firstName;
    public String lastName;
    public int customerID;
    public long lastModified;

    public Customer(String firstName, String lastName, int customerID)
    {
        this.firstName = firstName;
        this.lastName = lastName;
        this.customerID = customerID;
        this.lastModified = System.currentTimeMillis();
    }
    
    public JSONObject toJSON() throws JSONException
    {
        JSONObject obj = new JSONObject();
        obj.put("firstName", firstName);
        obj.put("lastName", lastName);
        obj.put("customerID", customerID);
        
        return obj;
    }
    
}
