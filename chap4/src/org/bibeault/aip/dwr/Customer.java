package org.bibeault.aip.dwr;

public class Customer {

    private String firstName;
    private String lastName;
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;

    public Customer( String firstName, String lastName, String address, String city, String state, String country, String postalCode ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.city = city;
        this.state = state;
        this.country = country;
        this.postalCode = postalCode;
    }

    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getAddress() { return address; }
    public String getCity() { return city; }
    public String getState() { return state; }
    public String getCountry() { return country; }
    public String getPostalCode() { return postalCode; }

}
