function getXHR()
{
	var retval = false;
	if(window.ActiveXObject) 
	{
		//Internet Explorer supports the object through ActiveX
		try 
		{
			retval = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch(exception) 
		{
			retval = new ActiveXObject("Microsoft.XMLHTTP"); 
		}
	}
	else if(window.XMLHttpRequest) 
	{
		//Mozilla / Safari supports the object natively
		retval = new XMLHttpRequest();
	}
	return retval;
}

function $(elementid)
{
	return document.getElementById(elementid);
}

function processXML(url, callback)
{
	//Obtain an XMLHttpRequest object
	var xhr = getXHR();
	xhr.open('GET', url, true);
			
	//Assign an event handling function which will
	//notify our 'callback' function when loading is complete
	xhr.onreadystatechange = function () 
		{
			//We are only interested in state 4, meaning that the
			//data has been loaded.
			if (xhr.readyState == 4 && xhr.status == 200) 
			{
				//Invoke our callback, passing the XML DOM
				callback(xhr.responseXML);
			}
			else if(xhr.readyState == 4)
			{
				//response code is not 200! A server error occured.
				alert('Error loading data from ' + url + '. Server status: ' + xhr.status);
			}
			else
			{
				//We are not done loading yet, because readyState is not 4. 
				//You could use this part to update the UI and show that
				//data is being loaded.
			}
		}; // End of the onreadystatechange event handling function


	//Here we activate the XHR object to retrieve the data.
	xhr.send(null);
}

function xslTransform(xmlDom, xslDom, span)
{
	if(window.ActiveXObject) 
	{
		//Internet Explorer supports the object through ActiveX
		var text = xmlDom.transformNode(xslDom);
		span.innerHTML = text;
	}
	else if(window.XMLHttpRequest) 
	{
		var xsltProcessor = new XSLTProcessor();
		xsltProcessor.importStylesheet(xslDom);
		var processed =  xsltProcessor.transformToFragment(xmlDom, document);
		span.appendChild(processed);
	}	
}

function rssToHTMLXSL(xmlUrl, xslUrl, span)
{
	var xmlCallBack = function(xmlDom)
	{
		var xslCallBack = function(xslDom)
		{
			var processed = xsltProcess(xmlDom, xslDom);
			span.innerHTML = processed;
		};
		
		processXML(xslUrl, xslCallBack);
		
	};
	
	processXML(xmlUrl, xmlCallBack);
}


function rssToHTML(url, span)
{
	var rssToHtmlTransformerCallback = function (dom) 
		{
			var channelNodeList = dom.getElementsByTagName('channel');
			var channelNode = channelNodeList.item(0);

			var titleNode = getNode('title', channelNode);
			var titleString = getNodeText(titleNode);
			
			var linkNode = getNode('link', channelNode);
			var linkString = getNodeText(linkNode);
			
			var descNode = getNode('description', channelNode);
			var descString = getNodeText(descNode);
			
			//create the list
			var listNode = createList(span, titleString, linkString, descString);
			
			//process the items
			var channelChildNodes = channelNode.childNodes;
			for(j = 0; j < channelChildNodes.length; j++)
			{
				var currentNode = channelChildNodes.item(j);
				//nodeType == 1 is for element nodes
				if(currentNode.nodeType == 1 && currentNode.nodeName == 'item')
				{
					titleNode = getNode('title', currentNode);
					titleString = getNodeText(titleNode);

					linkNode = getNode('link', currentNode);
					linkString = getNodeText(linkNode);
			
					descNode = getNode('description', currentNode);
					descString = getNodeText(descNode);
					
					dtNode = listNode.ownerDocument.createElement('dt');
					listNode.appendChild(dtNode);
	
					ddNode = listNode.ownerDocument.createElement('dd');
					listNode.appendChild(ddNode);
	
					appendText(dtNode, 'item');
					createList(ddNode, titleString, linkString, descString);
					
				}
			}
			
		};
		
	processXML(url, rssToHtmlTransformerCallback);
}



function createList(parentNode, titleString, linkString, descString)
{
	var listNode = parentNode.ownerDocument.createElement('dl');
	parentNode.appendChild(listNode);
	
	createListEntry(listNode, 'title', titleString);
	createListEntryLink(listNode, 'link', linkString);
	createListEntry(listNode, 'description', descString);
	
	return listNode;
}

function createListEntry(list, name, value)
{
	var dtNode = list.ownerDocument.createElement('dt');
	list.appendChild(dtNode);

	var ddNode = list.ownerDocument.createElement('dd');
	list.appendChild(ddNode);
	
	appendText(dtNode, name);
	appendText(ddNode, value);
}

function createListEntryLink(list, name, value)
{
	var dtNode = list.ownerDocument.createElement('dt');
	list.appendChild(dtNode);

	var ddNode = list.ownerDocument.createElement('dd');
	list.appendChild(ddNode);
	
	appendText(dtNode, name);
		
	var aNode = document.createElement('a');
	var attrNode = document.createAttribute('href');
	attrNode.value = value;
	var attributes = aNode.attributes;
	attributes.setNamedItem(attrNode);
	var textNode = document.createTextNode(value);
	aNode.appendChild(textNode);
	ddNode.appendChild(aNode);
}

function getNodeText(node)
{
	var childNodes = node.childNodes;
	for(var i = 0; i < childNodes.length; i++)
	{
		var currentNode = childNodes.item(i);
		//nodeType == 3 is for text nodes
		if(currentNode.nodeType == 3)
		{
			return currentNode.data;
		}
	}
}

function getNode(nodeName, parentNode)
{
	var childNodes = parentNode.childNodes;
	for(var i = 0; i < childNodes.length; i++)
	{
		var currentNode = childNodes.item(i);
		//nodeType == 1 is for element nodes
		if(currentNode.nodeType == 1 && currentNode.nodeName == nodeName)
		{
			return currentNode;
		}
	}
}

function appendText(node, value)
{
	var textNode = node.ownerDocument.createTextNode(value);
	node.appendChild(textNode);
}

//aNode = document.createElement('a');
//attrNode = document.createAttribute('href');
//attrNode.value = 'http://www.google.com';
//attributes = aNode.attributes;
//attributes.setNamedItem(attrNode);
//textNode = document.createTextNode('foo');
//aNode.appendChild(textNode);
//node.appendChild(aNode);
