/* ************************************************************************

   qooxdoo - the new era of web interface development

   Copyright:
     (C) 2004-2006 by Schlund + Partner AG, Germany
         All rights reserved

   License:
     LGPL 2.1: http://creativecommons.org/licenses/LGPL/2.1/

   Internet:
     * http://qooxdoo.oss.schlund.de

   Authors:
     * Sebastian Werner (wpbasti)
       <sebastian dot werner at 1und1 dot de>
     * Andreas Ecker (aecker)
       <andreas dot ecker at 1und1 dot de>

************************************************************************ */

/* ************************************************************************

#package(menu)

************************************************************************ */

function QxMenuButtonLayoutImpl(vWidget)
{
  QxHorizontalBoxLayoutImpl.call(this, vWidget);
  
  // We don't need flex support, should make things a bit faster, 
  // as this omits some additional loops in QxHorizontalBoxLayoutImpl.
  this.setEnableFlexSupport(false);  
};

QxMenuButtonLayoutImpl.extend(QxHorizontalBoxLayoutImpl, "QxMenuButtonLayoutImpl");


/*!
  Global Structure:
  [01] COMPUTE BOX DIMENSIONS FOR AN INDIVIDUAL CHILD
  [02] COMPUTE NEEDED DIMENSIONS FOR AN INDIVIDUAL CHILD
  [03] COMPUTE NEEDED DIMENSIONS FOR ALL CHILDREN
  [04] UPDATE LAYOUT WHEN A CHILD CHANGES ITS OUTER DIMENSIONS
  [05] UPDATE CHILD ON INNER DIMENSION CHANGES OF LAYOUT
  [06] UPDATE LAYOUT ON JOB QUEUE FLUSH
  [07] UPDATE CHILDREN ON JOB QUEUE FLUSH
  [08] CHILDREN ADD/REMOVE/MOVE HANDLING
  [09] FLUSH LAYOUT QUEUES OF CHILDREN
  [10] LAYOUT CHILD
  [11] DISPOSER
  

  Inherits from QxHorizontalBoxLayoutImpl:
  [01] COMPUTE BOX DIMENSIONS FOR AN INDIVIDUAL CHILD
  [02] COMPUTE NEEDED DIMENSIONS FOR AN INDIVIDUAL CHILD
  [05] UPDATE CHILD ON INNER DIMENSION CHANGES OF LAYOUT
  [06] UPDATE LAYOUT ON JOB QUEUE FLUSH
  [07] UPDATE CHILDREN ON JOB QUEUE FLUSH
  [08] CHILDREN ADD/REMOVE/MOVE HANDLING
  [09] FLUSH LAYOUT QUEUES OF CHILDREN
  [11] DISPOSER
*/





/*
---------------------------------------------------------------------------
  [03] COMPUTE NEEDED DIMENSIONS FOR ALL CHILDREN
---------------------------------------------------------------------------
*/

/*!
  Compute and return the width needed by all children of this widget
*/
proto.computeChildrenNeededWidth = function()
{
  // Caching the widget reference
  var vWidget = this.getWidget();
  
  // Ignore the verticalBoxLayout inside QxMenu
  var vMenu = vWidget.getParent().getParent();  
  
  // Let the menu do the real hard things
  return vMenu.getMenuButtonNeededWidth();
};







/*
---------------------------------------------------------------------------
  [04] UPDATE LAYOUT WHEN A CHILD CHANGES ITS OUTER DIMENSIONS
---------------------------------------------------------------------------
*/

/*!
  Things to do and layout when any of the childs changes its outer width.
  Needed by layouts where the children depends on each-other, like flow- or box-layouts.
*/
proto.updateSelfOnChildOuterWidthChange = function(vChild)
{
  // Caching the widget reference
  var vWidget = this.getWidget();
  
  // Ignore the verticalBoxLayout inside QxMenu
  var vMenu = vWidget.getParent().getParent();
  
  // Send out invalidate signals
  switch(vChild)
  {
    case vWidget._iconObject:
      vMenu._invalidateMaxIconWidth(); 
      break;
    
    case vWidget._labelObject:
      vMenu._invalidateMaxLabelWidth();  
      break;

    case vWidget._shortcutObject:
      vMenu._invalidateMaxShortcutWidth();  
      break;

    case vWidget._arrowObject:
      vMenu._invalidateMaxArrowWidth();  
      break;
  };
  
  // Call superclass implementation
  return QxHorizontalBoxLayoutImpl.prototype.updateSelfOnChildOuterWidthChange.call(this, vChild);
};



  
  


/*
---------------------------------------------------------------------------
  [10] LAYOUT CHILD
---------------------------------------------------------------------------
*/

proto.layoutChild_locationX = function(vChild, vJobs)
{
  // Caching the widget reference
  var vWidget = this.getWidget();
  
  // Ignore the verticalBoxLayout inside QxMenu
  var vMenu = vWidget.getParent().getParent();
  
  // Left position of the child
  var vPos = null;

  // Ask the menu instance for the correct location
  switch(vChild)
  {
    case vWidget._iconObject:
      vPos = vMenu.getIconPosition();
      break;
    
    case vWidget._labelObject:
      vPos = vMenu.getLabelPosition();
      break;

    case vWidget._shortcutObject:
      vPos = vMenu.getShortcutPosition();
      break;

    case vWidget._arrowObject:
      vPos = vMenu.getArrowPosition();
      break;
  };
  
  if (vPos != null)
  {
    vPos += vWidget.getPaddingLeft();
    vChild._applyRuntimeLeft(vPos);
  }; 
};
