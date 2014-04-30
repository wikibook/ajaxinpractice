package org.bibeault.aip.dwr;

public class CustomerFactory {

    public Customer findByName( String firstName, String lastName ) {
        if (firstName.equalsIgnoreCase("Bill") &&
            lastName.equalsIgnoreCase("Moody")) {
            return new Customer( "Bill", "Moody", "123 Nowhere Lane",
                                 "Austin", "TX", "USA", "78701" );
        }
        else {
            return null;
        }
    }

}
