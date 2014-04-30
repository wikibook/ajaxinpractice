package aip;

import java.util.HashMap;
import java.util.ArrayList;
import java.util.Map;

public class Demo  {

    public Demo()  {
        initPlantData();
    }

    Map plants;
    private void initPlantData()  {
        plants = new HashMap();
        ArrayList fruits = new ArrayList();
        ArrayList vegetables = new ArrayList();
        fruits.add("Apple");
        fruits.add("Pumpkin");
        fruits.add("Orange");
        fruits.add("Tomato");

        vegetables.add("Carrot");
        vegetables.add("Turnip");
        
        plants.put("vegetables", vegetables);
        plants.put("fruits", fruits);
    }

    public String checkPlant(String listUpdate)  {
        String[] items = listUpdate.split("&");
        for (int i=0; i < items.length; i++)  {
            if ("".equals(items[i]))  {
                continue;
            }
            String[] pair = items[i].split("\\[\\]=");
            ArrayList plant = (ArrayList) plants.get(pair[0]);
            if (!plant.contains(pair[1]))  {
                return pair[1] + " isn't a " +
                pair[0].substring(0, pair[0].length() - 1) +
                ".";
            }
        }
        return "";
    }

}

