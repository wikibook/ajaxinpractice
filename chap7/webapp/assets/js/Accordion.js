var DefaultAccordionOptions={
	showOnlyOne: true,
	expandAll  : false,
	panelHeight: 300,
	panelWidth : 300,
	speed      : 0.2
};

function Accordion(container, theOptions)
{
    var options =theOptions
    var elements=new Array();

    if(!options)
    {
    	options=DefaultAccordionOptions;
    }
    else
    {
    	if(options.showOnlyOne == null)
    	{
    		options.showOnlyOne=DefaultAccordionOptions.showOnlyOne;
    	}
    	
    	if(options.expandAll == null)
    	{
    		options.expandAll=DefaultAccordionOptions.expandAll;
    	}
    	
    	if(options.panelHeight == null)
    	{
    		options.panelHeight=DefaultAccordionOptions.panelHeight;
    	}
    	
    	if(options.panelWidth == null)
    	{
    		options.panelWidth=DefaultAccordionOptions.panelWidth;
    	}
    	
    	if(options.speed == null)
    	{
    		options.speed=DefaultAccordionOptions.speed;
    	}
    }
    
    for(var i=0;i<container.childNodes.length;i+=2)
    {
		Effect.DefaultOptions.duration=0.0;
	
    	elements[elements.length]={
    		headerId:           container.childNodes[i].id,
    		headerContainerId:  container.childNodes[i][0].id,
    		contentId:          container.childNodes[i+1].id,
    		contentContainerId: container.childNodes[i+1][0].id
    	};
    	
    	Effect.DefaultOptions.duration=options.speed;
    	
    	if(i == 0 && options.showOnlyOne)
    	{
    		document.getElementById(elements[elements.length-1].headerId);
    	}
    }
}

function DefaultAccordionHandler()
{
	this.addEventListeners=_addEventListeners;
	
	function _addEventListeners(container, theContent, handler)
	{
		var element=document.getElementById(container.id+'_h_'+theContent.getId());
	
		eventHelper.addEventListener(element,'mouseover',handler.mouseOver);
		eventHelper.addEventListener(element,'mouseout', handler.mouseOut);
		eventHelper.addEventListener(element,'mousedown',handler.mouseDown);
		eventHelper.addEventListener(element,'click',    handler.click);
	}
	
	////
	
	function _mouseOver(event)
	{
		findTarget(event).className='accordionHeaderHighlight';
	}
	
	function _mouseOut(event)
	{
		var element=findTarget(event);
		
		if(element.selected && showOneOnly)
		{
			element.className='accordionHeaderSelected';
		}
		else
		{
			element.className='accordionHeader';
		}
	}
	
	function _mouseDown(event)
	{
		findTarget(event).className='accordionHeaderSelected';
	}
	
	function _click(event)
	{
		var element=findTarget(event);
		
		if(!element.selected || !showOneOnly)
		{
			var curSelected=document.getElementById(selectedId);
			curSelected.selected=false;
			curSelected.className='accordionHeader';
			
			selectedId=element.id;
			element.selected=true;
			element.className='accordionHeaderSelected';
			
			if(showOneOnly)
			{
				hide(curSelected);
				show(element);
			}
			else if(element.expanded)
			{
				hide(element);
			}
			else
			{
				show(element);
			}
		}
	}
}




function hideAccordionContent(element)
{
	Effect.BlindUp(element.content);
	element.expanded=false;
}

function showAccordionContent(element)
{
	Effect.BlindDown(element.content);
	element.expanded=true;
}

function findAccordionHeaderTarget(event)
{
	var element=eventHelper.getEventTarget(event);
    var parent=null;
    
    while(parent == null)
    {
        if(element.tagName == 'DIV' && element.content)
        {
            parent=element;
        }
        else
        {
            element=element.parentNode;
        }
    }
    
    return(parent);
}