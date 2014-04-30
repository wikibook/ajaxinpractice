var leafNodes=null;
var nonLeafNodes=null;
var historyCount=0;

function initTree(){

  $('preview').show();
  var allNodes=$$('.nodeHeader');
  var partitioned=allNodes.partition(
    function(node){
      return node.hasClassName('leaf');
    }
  );
  leafNodes=partitioned[0];
  leafNodes.each(
    function(node){
      var anchor=node.parentNode;
      var anchorParent=anchor.parentNode;
      var imgsrc=anchor.href;
      anchor.removeChild(node);
      anchorParent.replaceChild(node,anchor);
      node.onclick=function(){
        $('preview_img').src=imgsrc;
        addHistory();
      }
    }
  );
  nonLeafNodes=partitioned[1];
  nonLeafNodes.each(
    function(node){
      var childDivId=node.id.replace(/head/,"child");
      var childDiv=$(childDivId);
      node.onclick=function(){
        childDiv.toggle();
        addHistory();
      }
      childDiv.hide();
    }
  );

  dhtmlHistory.initialize();
  dhtmlHistory.addListener(
    function(location,key){
      if (key){
        fetchTreeState(key);
      }
    }
  );
  if (!dhtmlHistory.getCurrentLocation()){
    addHistory();
  }
}

function addHistory(){
  var data=getTreeState();
  var key='history'+historyCount;
  historyCount++;
  new Ajax.Request(
    "jsp/treeState.jsp",
    {
      method: "post",
      parameters: $H({ key:key, data:JSON.stringify(data) }).toQueryString(),
      onComplete:function(response){
        var responseObj=JSON.parse(response.responseText);
        if (responseObj && responseObj.status=="ok"){
          dhtmlHistory.add(key,key);
        }
      }
    }
  );
}

function getTreeState(){
  var treeState={ 
    nodes:{},
    image:$('preview_img').src
  };
  nonLeafNodes.each(
    function(node){
      var childDivId=node.id.replace(/head/,"child");
      var childDiv=$(childDivId);
      var isOpen=childDiv.visible();
      treeState.nodes[childDivId]=isOpen;
    }
  );
  return treeState;
}

function fetchTreeState(key){
  new Ajax.Request(
    "jsp/treeState.jsp",
    {
      method:"get",
      parameters: $H({ key:key }).toQueryString(),
      onComplete:function(response){
        var responseObj=JSON.parse(response.responseText);
        if (responseObj){
          updateTreeState(responseObj);
        }
      }
    }
  );
}

function updateTreeState(state){
  for (node in state.nodes){
    var nodeDiv=$(node);
    if (nodeDiv){
      if (state.nodes[node]){
        nodeDiv.show();
      }else{
        nodeDiv.hide();
      }
    }
  }
  $('preview_img').src=state.image;
}
