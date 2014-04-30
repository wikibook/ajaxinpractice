

// the tree view repository
// should not be accessed directly
var treeViews=new Array();

// the default node status icons
var collapsedIcon='./assets/images/tree/plus.gif';
var expandedIcon ='./assets/images/tree/minus.gif';
var leafIcon     ='./assets/images/tree/leaf.gif';

// registers a tree view
// automatically called when instantiating a TreeView object
// can later be retrieved by calling getTreeView(name)
function addTreeView(name,object)
{
    treeViews[name]=object;
}

// gets a tree view
// name is the container id specified when
// instantiating a TreeView object
function getTreeView(name)
{
    return(treeViews[name]);
}

// sets the location of the collapsed node icon
function setCollapsedIcon(iconHref)
{
    collapsedIcon=iconHref;
}

// sets the location of the expanded node icon
function setExpandedIcon(iconHref)
{
    expandedIcon =iconHref;
}

// sets the location of the leaf node icon
function setLeafIcon(iconHref)
{
    leafIcon     =iconHref;
}

// returns the location of the collapsed node icon
function getCollapsedIcon()
{
    return(collapsedIcon);
}

// returns the location of the expanded node icon
function getExpandedIcon()
{
    return(expandedIcon);
}

// returns the location of the leaf node icon
function getLeafIcon()
{
    return(leafIcon);
}

// this object holds the data for a node in a tree view
//
// theId       : the unique (to the tree view) id for the node
// theText     : the descriptive text that is displayed when rendered
// theIcon     : the nodes icon (image) that is displayed when rendered
// theAction   : the action object. this needs to take the form required
//               by the action handler registered with the tree view
// theExpanded : boolean value that determines if the node is to initally
//               be rendered in an expanded state
// theParentId : the parent node of this node. should be null if this node
//               is at the root level
function TreeViewNode(theId,theText,theIcon,theAction,theExpanded,theParentId)
{
    var id      =theId;
    var text    =theText;
    var icon    =theIcon;
    var action  =theAction;
    var expanded=theExpanded;
    var parentId=theParentId;
    
    // getter methods for the member variables
    this.getId      =_getId;
    this.getText    =_getText;
    this.getIcon    =_getIcon;
    this.getAction  =_getAction;
    this.isExpanded =_isExpanded;
    this.getParentId=_getParentId;
    
    // setter methods for the member variables
    this.setId      =_setId;
    this.setText    =_setText;
    this.setIcon    =_setIcon;
    this.setAction  =_setAction;
    this.setExpanded=_setExpanded;
    
    function _getId()
    {
        return(id);
    }
    
    function _setId(theId)
    {
        id=theId;
    }
    
    function _getText()
    {
        return(text);
    }
    
    function _setText(theText)
    {
        text=theText;
    }
    
    function _getIcon()
    {
        return(icon);
    }
    
    function _setIcon(theIcon)
    {
        icon=theIcon;
    }
    
    function _getAction()
    {
        return(action);
    }
    
    function _setAction(theAction)
    {
        action=theAction;
    }
    
    function _isExpanded()
    {
        return(expanded);
    }
    
    function _setExpanded(theExpanded)
    {
        expanded=theExpanded;
    }
    
    function _getParentId()
    {
        return(parentId);
    }
}

// this object maintains the state and handlers for a tree view
//
// theContainer : the id of the html element that will hold the
//                rendered tree view
function TreeView(theContainer)
{
    var container            =theContainer;
    var nodes                =new Array();
    var expandContractHandler=DefaultExpandContractHandler;
    var nodeRenderer         =new DefaultTreeViewNodeRenderer();
    var actionHandler        =DefaultActionHandler;
    
    // add this tree view to the repository for easy access
    addTreeView(container,this);
    
    this.render                       =_render;
    
    this.addNode                      =_addNode;
    this.removeNode                   =_removeNode;
    
    this.getNode                      =_getNode;
    this.getParentNode                =_getParentNode;
    this.getChildNodes                =_getChildNodes;
    this.listAncestors                =_listAncestors;
    this.isAncestorOf                 =_isAncestorOf;
    
    this.getLevel                     =_getLevel;
    
    this.registerExpandContractHandler=_registerExpandContractHandler;
    this.registerNodeRenderer         =_registerNodeRenderer;
    this.registerActionHandler        =_registerActionHandler;
    
    this.getCurrentState              =_getCurrentState;
    
    function _render(fromNode)
    {
        nodeRenderer.clearNode(
                container,
                fromNode,
                _listAncestors(fromNode),
                (_getChildNodes(fromNode).length > 0),
                expandContractHandler,
                actionHandler
        );

        _doRender(fromNode);
    }
    
    function _doRender(fromNode)
    {
        var nodesAtLevel=_getChildNodes(fromNode);
        
        for(var i=0;i<nodesAtLevel.length;i++)
        {
            var hasChildren=(_getChildNodes(nodesAtLevel[i]).length > 0);

            nodeRenderer.renderNode(
                container,
                nodesAtLevel[i],
                _listAncestors(nodesAtLevel[i]),
                hasChildren,
                expandContractHandler,
                actionHandler
            );

            if(hasChildren)
            {
                _render(nodesAtLevel[i]);
            }
        }
    }
    
    function _addNode(node)
    {
        nodes[nodes.length]=node;
    }
    
    function _removeNode(node)
    {
        var indicesToRemove=new Array();
    
        for(var i=0;i<nodes.length;i++)
        {
            if(nodes[i].getId() == node.getId() || _isAncestorOf(nodes[i],node))
            {
                indicesToRemove[indicesToRemove.length]=i;
            }
        }
        
        for(var i=0;i<indicesToRemove.length;i++)
        {
            nodes[indicesToRemove[i]]=null;
        }
        
        _compactNodes();
    }
    
    function _getNode(id)
    {
        for(var i=0;i<nodes.length;i++)
        {
            if((nodes[i] != null) && nodes[i].getId && (nodes[i].getId() == id))
            {
                return(nodes[i]);
            }
        }
            
        return(null);
    }
    
    function _getParentNode(node)
    {
        if(node.getParentId() != null)
        {
            for(var i=0;i<nodes.length;i++)
            {
                if(nodes[i].getId() == node.getParentId())
                {
                    return(nodes[i]);
                }
            }
        }
            
        return(null);
    }
    
    function _getChildNodes(node)
    {
        var children=new Array();
    
        for(var i=0;i<nodes.length;i++)
        {
            if(node == null)
            {
                if(nodes[i].getParentId() == null)
                {
                    children[children.length]=nodes[i];
                }
            }
            else if(nodes[i].getParentId() == node.getId())
            {
                children[children.length]=nodes[i];
            }
        }
            
        return(children);
    }
    
    function _listAncestors(node)
    {
        var ancestors=new Array();
        
        if(node != null)
        {
            var parentId=node.getParentId();
            
            while(parentId != null)
            {
                var parentNode=_getNode(parentId);
                
                ancestors[ancestors.length]=parentNode;
                parentId=parentNode.getParentId();
            }
        }
    
        return(ancestors);
    }
    
    function _isAncestorOf(child,node)
    {
        var parentId=child.getParentId();
    
        while(parentId != null)
        {
            if(parentId == node.getId())
            {
                return(true);
            }

            child=_getNode(parentId);
            parentId=child.getParentId();
        }
    
        return(false);
    }
    
    function _getLevel(node,prevLevel)
    {
        var level=0;
        
        if(prevLevel != null)
        {
            level=prevLevel;
        }

        if(node.getParentId() != null)
        {
            for(var i=0;i<nodes.length;i++)
            {
                if(nodes[i].getId() == node.getParentId())
                {
                    level=_getLevel(nodes[i],level+1);
                    break;
                }
            }
        }
        
        return(level);
    }
    
    function _registerExpandContractHandler(theHandler)
    {
        expandContractHandler=theHandler;
    }
    
    function _registerNodeRenderer(theRenderer)
    {
        nodeRenderer=theRenderer;
    }
    
    function _registerActionHandler(theHandler)
    {
        actionHandler=theHandler;
    }
    
    function _getCurrentState()
    {
        var state=new Array();
        
        for(var i=0;i<nodes.length;i++)
        {
            state[i]={id:nodes[i].getId(),isExpanded:nodes[i].isExpanded()};
        }
        
        return(state);
    }
    
    //
    
    function _compactNodes()
    {
        nodes=nodes.sort();
        
        for(var i=0;i<nodes.length;i++)
        {
            if(nodes[i] == null)
            {
                nodes.length=i;
                break;
            }
        }
    }
}

function DefaultExpandContractHandler(event)
{
    var expandContractImage=eventHelper.getEventTarget(event);
    var childrenDiv        =document.getElementById(expandContractImage.getAttribute('childrenContainer'));
    var treeViewRef        =expandContractImage.getAttribute('container');
    var nodeId             =expandContractImage.getAttribute('nodeId');

    var treeView=getTreeView(treeViewRef);

    if(childrenDiv.style.display == 'block')
    {
        expandContractImage.src=getCollapsedIcon();
        childrenDiv.style.display='none';
        
        treeView.getNode(nodeId).setExpanded(false);
    }
    else
    {
        expandContractImage.src=getExpandedIcon();
        childrenDiv.style.display='block';
        
        treeView.getNode(nodeId).setExpanded(true);
    }
}

function DefaultTreeViewNodeRenderer()
{
    this.renderNode=_renderNode;
    this.clearNode =_clearNode;

    function _renderNode(container,node,ancestors,hasChildren,expandContractHandler,actionHandler)
    {
        var directAncestor=_findDirectAncestor(container,ancestors);
        var renderedNode  =_getRenderedNode(container,node,directAncestor,ancestors,hasChildren,expandContractHandler,actionHandler);

        document.getElementById(directAncestor).appendChild(renderedNode);
    }

    function _clearNode(container,node,ancestors,hasChildren,expandContractHandler,actionHandler)
    {
        if(node == null)
        {
            document.getElementById(container).innerHTML='';
        }
        else
        {
            var directAncestor=_findDirectAncestor(container,ancestors);
            var currentNode   =document.getElementById(container+'_'+node.getId());
            var newNode       =_getRenderedNode(container,node,directAncestor,ancestors,hasChildren,expandContractHandler,actionHandler);
            
            if(currentNode != null)
            {
                document.getElementById(directAncestor).replaceChild(newNode,currentNode);
            }
            else
            {
                document.getElementById(directAncestor).appendChild(newNode);
            }
        }
    }
    
    function _findDirectAncestor(container,ancestors)
    {
        var directAncestor=container;
        
        if(ancestors.length > 0)
        {
            directAncestor=container+'_'+ancestors[0].getId()+'_children';
        }
        
        return(directAncestor);
    }
    
    function _getRenderedNode(container,node,directAncestor,ancestors,hasChildren,expandContractHandler,actionHandler)
    {
        // Create Elements
        var theDiv              =document.createElement('DIV');
        var theTable            =document.createElement('TABLE');
        var theRow              =document.createElement('TR');
        var childrenDiv         =document.createElement('DIV');
        
        var spacerColumn        =document.createElement('TD');
        var expandContractColumn=document.createElement('TD');
        var iconColumn          =document.createElement('TD');
        var textColumn          =document.createElement('TD');
        
        var expandContractImage =document.createElement('IMG');
        var iconImage           =document.createElement('IMG');
        
        // Set up styles / attributes
        
        theDiv.id             =container+'_'+node.getId();
        childrenDiv.id        =container+'_'+node.getId()+'_children';
        expandContractImage.id=container+'_'+node.getId()+'_ecImage';
        textColumn.id         =container+'_'+node.getId()+'_action';
        
        expandContractImage.setAttribute('childrenContainer',childrenDiv.id);
        expandContractImage.setAttribute('container',        container);
        expandContractImage.setAttribute('nodeId',           node.getId());
        
        textColumn.setAttribute('childrenContainer',childrenDiv.id);
        textColumn.setAttribute('container',        container);
        textColumn.setAttribute('nodeId',           node.getId());
        
        if(node.getAction())
        {
            textColumn.style.color ='#0000FF';
            textColumn.style.cursor='hand';
        }
        else
        {
            textColumn.style.cursor='default';
        }
        
        if(hasChildren)
        {
            if(node.isExpanded())
            {
                expandContractImage.src=getExpandedIcon();
                childrenDiv.style.display='block';
            }
            else
            {
                expandContractImage.src=getCollapsedIcon();
                childrenDiv.style.display='none';
            }
        }
        else
        {
            expandContractImage.src=getLeafIcon();
            childrenDiv.style.display='none';
        }

        expandContractImage.style.width ='9px';
        expandContractImage.style.height='9px';
        
        iconImage.src=node.getIcon();
        iconImage.style.width ='16px';
        iconImage.style.height='16px';
        
        textColumn.innerHTML=node.getText();
        spacerColumn.style.width=ancestors.length*16;
        
        // Build the DOM
        expandContractColumn.appendChild(expandContractImage);
        iconColumn.appendChild(iconImage);
        
        theRow.appendChild(spacerColumn);
        theRow.appendChild(expandContractColumn);
        theRow.appendChild(iconColumn);
        theRow.appendChild(textColumn);
        
        theTable.appendChild(theRow);
        theDiv.appendChild(theTable);
        theDiv.appendChild(childrenDiv);

        if(!eventHelper.DOM)
        {
            theDiv.innerHTML=theDiv.innerHTML;
            
            var images =theDiv.getElementsByTagName('IMG');
            var columns=theDiv.getElementsByTagName('TD');
            
            for(var i=0;i<images.length;i++)
            {
                if(images[i].id == container+'_'+node.getId()+'_ecImage')
                {
                    expandContractImage=images[i];
                    break;
                }
            }
            
            for(var i=0;i<columns.length;i++)
            {
                if(columns[i].id == container+'_'+node.getId()+'_action')
                {
                    textColumn=columns[i];
                    break;
                }
            }
        }

        if(hasChildren)
        {
            eventHelper.addEventListener(expandContractImage,'click',expandContractHandler,true);
        }

        eventHelper.addEventListener(textColumn,'click',    actionHandler.onClick,    true);
        eventHelper.addEventListener(textColumn,'mouseover',actionHandler.onMouseOver,true);
        eventHelper.addEventListener(textColumn,'mouseout', actionHandler.onMouseOut, true);
        eventHelper.addEventListener(textColumn,'mousedown',actionHandler.onMouseDown,true);
        eventHelper.addEventListener(textColumn,'mouseup',  actionHandler.onMouseUp , true);

        return(theDiv);
    }
}

function DefaultActionHandler()
{
    var textColumn;
    var childrenDiv;
    var treeViewRef;
    var nodeId;

    this.onClick    =_onClick;
    this.onMouseOver=_onMouseOver;
    this.onMouseOut =_onMouseOut;
    this.onMouseDown=_onMouseDown;
    this.onMouseUp  =_onMouseUp;
    
    function _setProperties(event)
    {
        textColumn =eventHelper.getEventTarget(event);
        childrenDiv=document.getElementById(textColumn.getAttribute('childrenContainer'));
        treeViewRef=textColumn.getAttribute('container');
        nodeId     =textColumn.getAttribute('nodeId');
        
        treeView=getTreeView(treeViewRef);
    }
    
    function _onClick(event)
    {
        _setProperties(event);
    
        if(treeView.getNode(nodeId).getAction() != null)
        {
            var target=treeView.getNode(nodeId).getAction()[0];
            var link  =treeView.getNode(nodeId).getAction()[1];
            
            if(target == null)
            {
                window.location.href=link;
            }
            else
            {
                window.open(link,target);
            }
        }
    }
    
    function _setColor(event,color)
    {
        _setProperties(event);
        
        if(treeView.getNode(nodeId).getAction())
        {
            textColumn.style.color=color;
        }
    }
    
    function _onMouseOver(event)
    {
        _setColor(event,'#00FF00');
    }
    
    function _onMouseOut(event)
    {
        _setColor(event,'#0000FF');
    }
    
    function _onMouseDown(event)
    {
        _setColor(event,'#FF0000');
    }
    
    function _onMouseUp(event)
    {
        _setColor(event,'#00FF00');
    }
}