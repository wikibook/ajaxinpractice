////////////////////////////////////
// Simple Undo Stack Class
////////////////////////////////////

var undoStack={
    // index of current item in the undo stack
    curIdx: 0,
    
    // the undo stack
    stack: [],
    
    // the undo handler
    undoHandler: null,
    
    // for toggling the comparison
    // between action to be added and
    // action located at curIdx
    doDiffCheck: true,
    
    // used in postCheckUndo to ensure that
    // event propagation is stopped in the
    // event of ctl+z or ctl+y is pressed
    // inside an input or textarea element
    actionPerformed:false,
    
    // initializes the undo stack, setting
    // the undo handler and registering
    // event to intercept ctl+z and ctl+y
    init: function(theUndoHandler){
        Event.observe(document, 'keydown', this.checkUndo);
        Event.observe(document, 'keypress',this.postCheckUndo);
        this.undoHandler=theUndoHandler;
    },
    
    // handler for the document's onKeyDown event.
    // checks if ctl+z or ctl+y has been pressed,
    // and if so, calls undo or redo respectively.
    checkUndo: function(event){
        var keyCode = event.which || event.keyCode;
        if((keyCode ==  90) && event.ctrlKey){
            // z + control
            undoStack.undo();
            undoStack.actionPerformed=true;
            Event.stop(event);
            return false;
        }else if((keyCode ==  89) && event.ctrlKey){
            // y + control
            undoStack.redo();
            undoStack.actionPerformed=true;
            Event.stop(event);
            return false;
        }
    },
    
    // handler for the document's onKeyDown event.
    // ensures that event propagation is stopped in
    // the event of an undo or redo.
    // this effectively disables the browser's undo
    // and redo functionality, replacing it with our
    // own.
    postCheckUndo: function(event){
        if(undoStack.actionPerformed){
            undoStack.actionPerformed=false;
            Event.stop(event);
            return false;
        }
    },
    
    // sets the current stack index to the
    // specified value
    seek: function(index){
        if(index >= 0 && index < this.stack.length){
            this.curIdx=index;
        }
    },
    
    // adds an action to the undo stack
    // if this.doDiffCheck is equal to
    // true and ignoreDiffCheck is
    // equal to false, the action can be
    // added if the action at curIdx are
    // equal to each other. Otherwise this
    // behavior is not allowed
    add: function(theType,theValue,ignoreDiffCheck){
        var action =this.getNewUndoAction(theType,theValue);
        var success=false;
        var differs=(
          // if previous action != new action
          this.doDiffCheck && !ignoreDiffCheck)?
            (this.checkAction(action)):
            true;
    
        if(differs){
            this.stack[this.curIdx++]=action;
            this.stack.length=this.curIdx;
            success=true;
        }
        
        // create a state action to set the
        // disabled property of the undo and
        // redo buttons.
        var stateAction=this.getNewUndoAction();
        stateAction.canUndo=true;
        stateAction.canRedo=false;
        this.undoHandler(stateAction);
        
        this.dump();

        return success;
    },
    
    // checks to see if the previous action
    // is different from the current one.
    // returns true if they differ, false if
    // they are the same.
    checkAction: function(action){
        var latest = this.stack[this.stack.length-1];
        return (latest) ?
            (!action.equals(latest)) :
            true;
    },
    
    // gets the action and calls the handler
    // to undo.
    undo: function(){
        var action=null;

        // we have an action to undo
        if(this.curIdx > 0){
            action=this.stack[--this.curIdx];
        }else{
            // no action to undo, set up new action
            // in order to set the state of the undo
            // and redo buttons.
            action=this.getNewUndoAction();
        }
        
        // set up for the state of the undo and redo buttons
        action.canUndo=this.curIdx > 0;
        action.canRedo=this.curIdx < this.stack.length;

        this.undoHandler(action,true);
        
        this.dump();
    },
    
    // gets the action and calls the handler
    // to redo.
    redo: function(){
        var action=null;

        // we have an action to redo
        if(this.curIdx < this.stack.length){
            action=this.stack[this.curIdx++];
        }else{
            // no action to redo, set up new action
            // in order to set the state of the undo
            // and redo buttons.
            action=this.getNewUndoAction();
        }
        
        // set up for the state of the undo and redo buttons
        action.canUndo=this.curIdx > 0;
        action.canRedo=this.curIdx < this.stack.length;
        this.undoHandler(action,false);
        
        this.dump();
    },
    
    // returns a new undo action of type 'theType'
    // and with a value of 'theValue'
    getNewUndoAction: function(theType,theValue){
        return {
            type:   theType,
            value:  theValue,
            canUndo:false,
            canRedo:false,
            equals: function(action){
              return (JSON.stringify(this.type)  == JSON.stringify(action.type) && 
                JSON.stringify(this.value) == JSON.stringify(action.value));
            }
        };

    },
    
    //print message to debug panel
    dump:function(){
      if (!$('debug')){ return; }
      $('debug').innerHTML=
        'curIdx = '+this.curIdx+'<br/>'
        +this.stack.collect(
          function(item,index){
            var valStr="";
            for (i in item.value){
              valStr+=i+" -> "+item.value[i]+"<br/>";
            }
            return "["+index+"] type: "+item.type+"<br/>"
              +valStr
              +"  can undo?: "+item.canUndo+"<br/>"
              +"  can redo?: "+item.canRedo+"<br/>"
          }
        ).join('');
    }
};