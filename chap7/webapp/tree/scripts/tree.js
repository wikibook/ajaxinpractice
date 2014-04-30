function initTree(){
  $('preview').show();
  var allNodes=$$('.nodeHeader');
  var partitioned=allNodes.partition(
    function(node){
      return node.hasClassName('leaf');
    }
  );
  var leafNodes=partitioned[0];
  leafNodes.each(
    function(node){
      var anchor=node.parentNode;
      var imgsrc=anchor.href;
      anchor.href='#';
      node.onclick=function(){
        $('preview_img').src=imgsrc;
      }
    }
  );
  var nonLeafNodes=partitioned[1];
  nonLeafNodes.each(
    function(node){
      var childDivId=node.id.replace(/head/,"child");
      var childDiv=$(childDivId);
      node.onclick=function(){
        childDiv.toggle();
      }
      childDiv.hide();
    }
  );
}