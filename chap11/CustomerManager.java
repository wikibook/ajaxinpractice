package chapter11;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

import org.json.JSONArray;

public class CustomerManager
{

  private static CustomerManager instance = new CustomerManager();

  public static CustomerManager getInstance()
  {
    return instance;
  }

  private CustomerManager()
  {
    customers = new ArrayList<Customer>();
    createCustomers(100);
    Thread updater = new Thread(new UpdaterThread());
    updater.start();
  }

  private List<Customer> customers;

  private void createCustomers(int createCustomers)
  {
    Random random = new Random();

    String[] firstNames = { "Andrew", "Benjamin", "Chris",
        "Diana", "Elaine", "Fred", "Grizelda", "Helga",
        "Ishmael", "Julia", "Kevin", "Larry", "Mallory" };
    String[] lastNames = { "Andersen", "Benamos", "Costa",
        "Demumbrum", "Evans", "Fitzgerald", "Glen",
        "Harrison", "Ibrahim", "Johnson", "Klerk",
        "Lieberman", "Murakami" };

    for (int customersCreated = 0; customersCreated < createCustomers; customersCreated++)
    {
      String firstName = firstNames[random
          .nextInt(firstNames.length)];
      String lastName = lastNames[random
          .nextInt(lastNames.length)];
      Customer customer = new Customer(firstName, lastName,
          customersCreated);
      customers.add(customer.customerID, customer);
    }
  }

  public List<Customer> getCustomers()
  {
    return customers;
  }
  
  class UpdaterThread implements Runnable
  {
    private Random random = new Random();
    
    public void run()
    {
      while(true) 
      {
        try
        {
          Thread.sleep(1000);
        }
        catch (InterruptedException e)
        {
          // TODO Auto-generated catch block
          e.printStackTrace();
        }
        int customerID = random.nextInt(customers.size());
        Customer customer = customers.get(customerID);
        customer.firstName += "1";
        customer.lastModified = System.currentTimeMillis();
      }
      
    }
    
  }

}
