////////////////////////////////////
// Event Helper Class
////////////////////////////////////

window.eventHelper=
{
    DOM: document.all?false:true,
    
    addEventListener: function(element, event, listener, cancelBubble)
    {
        if(element.addEventListener)
        {
            element.addEventListener(event,listener,cancelBubble);
        }
        else
        {
            element.attachEvent('on'+event,listener);
        }
    },
    
    removeEventListener: function(element, event, listener, cancelBubble)
    {
        if(element.removeEventListener)
        {
            element.removeEventListener(event,listener,cancelBubble);
        }
        else
        {
            element.detachEvent('on'+event,listener);
        }
    },

    getEventTarget: function(event)
    {
        if(event.target)
        {
            return(event.target);
        }
        else
        {
            return(window.event.srcElement);
        }
    },

    getRelatedTarget: function(event)
    {
        if(event.relatedTarget)
        {
            return(event.relatedTarget);
        }
        else
        {
            return(window.event.fromElement);
        }
    },

    getAbsoluteMouse: function(event)
    {
        if(event.pageX)
        {
            return({x:event.pageX, y:event.pageY});
        }
        else
        {
            return({x:window.event.clientX + document.body.scrollLeft, y:window.event.clientY + document.body.scrollTop});
        }
    },
    
    getRelativeMouse: function(event)
    {
        if(event.layerX)
        {
            return({x:event.layerX, y:event.layerY});
        }
        else
        {
            return({x:window.event.offsetX, y:window.event.offsetY});
        }
    },

    getMouseButton: function(event)
    {
        if(event.which)
        {
            return(event.which);
        }
        else
        {
            return(window.event.button);
        }
    },
    
    getKeyCode: function(event)
    {
        if(event.which)
        {
            return(event.which);
        }
        else
        {
            return(window.event.keyCode);
        }
    },
    
    getModifiers: function(event)
    {
        var modifiers=null;
    
        if(event.altKey != null)
        {
            modifiers=
                {
                    alt  : event.altKey,
                    ctl  : event.ctrlKey,
                    shift: event.shiftKey
                };
        }
        else
        {
            modifiers=
                {
                    alt  : window.event.altKey,
                    ctl  : window.event.ctrlKey,
                    shift: window.event.shiftKey
                };
        }
        
        return(modifiers);
    },
    
    stopEventPropagation: function(event)
    {
        if(event.stopPropagation)
        {
            event.stopPropagation();
            event.preventDefault();
        }
        else
        {
            window.event.keyCode     =0;
            window.event.cancelBubble=true;
            window.event.returnValue =false;
        }
        
        return(false);
    }
}