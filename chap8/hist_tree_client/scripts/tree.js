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
    function(location,data){
      if (data){
        setTreeState(data);
      }
    }
  );
  if (!dhtmlHistory.getCurrentLocation()){
    addHistory();
  }
}

function addHistory(){
  dhtmlHistory.add(
    'history'+historyCount,
    getTreeState()
  );
  historyCount++;
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

function setTreeState(state){
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
