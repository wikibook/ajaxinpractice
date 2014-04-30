package org.bibeault.aip.usability;

public class SlowProcess {

  public String execute( long duration )  {
    try {
      System.out.println( "Sleeping " + duration + " milliseconds" );
      Thread.sleep( duration );
      System.out.println( "Done sleeping" );
    }
    catch (InterruptedException e)  {
      //No need to worry
    }
    return (new java.util.Date().toString());
  }

}
