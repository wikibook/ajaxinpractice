package aip;

import com.icesoft.faces.component.dragdrop.DragEvent;
import com.icesoft.faces.component.ext.HtmlPanelGroup;

public class DragDropBean  {
    
    private String dragMessage = "";

    public void setDragMessage(String message)  {
        dragMessage = message;
    }        
    
    public String getDragMessage()  {
        return dragMessage;
    }
    
    public void dragListener(DragEvent dragEvent)  {
        ShoppingItem item = (ShoppingItem)
                ((HtmlPanelGroup) dragEvent.getComponent()).getDragValue();
      
        if (null != item) {
            if (dragEvent.getEventType() == dragEvent.HOVER_START)  {
                dragMessage = item.getHoverMessage();
            } else if (dragEvent.getEventType() == dragEvent.DROPPED)  {
                dragMessage = item.getDropMessage();
            }
        }

    }
}