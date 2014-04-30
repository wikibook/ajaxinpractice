package org.bibeault.aip.rico;

public class Item {

    private String name;
    private String description;
    private String category;
    private String expires;

    public Item( String name, String description, String category, String expires) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.expires = expires;
    }

    public String getName() { return this.name; }
    public String getDescription() { return this.description; }
    public String getCategory() { return this.category; }
    public String getExpires() { return this.expires; }
}
