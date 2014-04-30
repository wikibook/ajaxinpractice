package aip;

import java.io.Serializable;

public class ShoppingItem implements Serializable  {
    
    String hoverMessage = "";

    public void setHoverMessage(String message){
        this.hoverMessage = message;
    }        
    
    public String getHoverMessage(){
        return hoverMessage;
    }

    String dropMessage = "";

    public void setDropMessage(String message){
        this.dropMessage = message;
    }        
    
    public String getDropMessage(){
        return dropMessage;
    }

    String dragOptions = "";

    public void setDragOptions(String options){
        this.dragOptions = options;
    }        
    
    public String getDragOptions(){
        return dragOptions;
    }
    
}