package org.bibeault.aip.rico;

import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;

public class EFridge {

    private static Map<String,Item> FAUX_DATABASE = new HashMap<String,Item>();
    static {
        FAUX_DATABASE.put( "1", new Item( "Milk", "HCF Milk, gallon", "dairy", "4/23/2006" ) );
        FAUX_DATABASE.put( "2", new Item( "Cole Slaw", "Hill Country Cole Slaw", "prepared", "4/29/2006" ) );
        FAUX_DATABASE.put( "3", new Item( "BBQ Sauce", "Stubb's BBQ Sauce, Spicy", "condiments", "4/23/2006" ) );
        FAUX_DATABASE.put( "4", new Item( "Lunch Meat", "Boar's Head Maple-glazed Turkey", "deli", "4/25/2006" ) );
        FAUX_DATABASE.put( "5", new Item( "Mustard", "Gulden's Spicy Brown Mustard", "condiments", "4/23/2006" ) );
        FAUX_DATABASE.put( "6", new Item( "Hot Sauce", "Sriracha Chile Sauce", "condiments", "12/5/2009" ) );
        FAUX_DATABASE.put( "7", new Item( "Cheese", "Tillamook Sharp Cheddar, 1 lb.", "dairy", "5/12/2006" ) );
        FAUX_DATABASE.put( "8", new Item( "Iced Tea", "Arizona Green tea, 1/2 gallon", "beverages", "4/23/2006" ) );
    }

    public List<String> getItemNames() {
        List<String> names = new ArrayList<String>();
        for (Item item : FAUX_DATABASE.values()) {
            names.add( item.getName() );
        }
        return names;
    }

    public Map<String,Item> getItems() {
        return FAUX_DATABASE;
    }

    public Item getItem( String key ) {
        return FAUX_DATABASE.get( key );
    }
    
}
