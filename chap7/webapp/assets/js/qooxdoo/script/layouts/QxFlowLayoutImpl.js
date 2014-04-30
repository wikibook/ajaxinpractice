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

#package(layout)

************************************************************************ */

function QxFlowLayoutImpl(vWidget) {
  QxLayoutImpl.call(this, vWidget);
};

QxFlowLayoutImpl.extend(QxLayoutImpl, "QxFlowLayoutImpl");

QxFlowLayoutImpl.STR_FIRST = "getFirstVisibleChild";
QxFlowLayoutImpl.STR_LAST = "getLastVisibleChild";
QxFlowLayoutImpl.STR_NEXT = "getNextSibling";
QxFlowLayoutImpl.STR_PREVIOUS = "getPreviousSibling";


/*!
  Global Structure:

  [01] COMPUTE BOX DIMENSIONS FOR AN INDIVIDUAL CHILD
  [03] COMPUTE NEEDED DIMENSIONS FOR ALL CHILDREN
  [04] UPDATE LAYOUT WHEN A CHILD CHANGES ITS OUTER DIMENSIONS
  [05] UPDATE CHILD ON INNER DIMENSION CHANGES OF LAYOUT
  [06] UPDATE LAYOUT ON JOB QUEUE FLUSH
  [07] UPDATE CHILDREN ON JOB QUEUE FLUSH
  [08] CHILDREN ADD/REMOVE/MOVE HANDLING
  [09] FLUSH LAYOUT QUEUES OF CHILDREN
  [10] LAYOUT CHILD
  [11] DISPOSER

  Inherits from QxLayoutImpl:

  [01] COMPUTE BOX DIMENSIONS FOR AN INDIVIDUAL CHILD
  [02] COMPUTE NEEDED DIMENSIONS FOR AN INDIVIDUAL CHILD
  [06] UPDATE LAYOUT ON JOB QUEUE FLUSH
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
  var w = this.getWidget();
  return QxLayoutImpl.prototype.computeChildrenNeededWidth_sum.call(this) + ((w.getVisibleChildrenLength()-1) * w.getHorizontalSpacing());
};

/*!
  Calculate the layout to get the needed height of the children
*/
proto.computeChildrenNeededHeight = function()
{
  var vWidget = this.getWidget();

  var vInnerWidth = vWidget.getInnerWidth();

  var vHorizontalSpacing = vWidget.getHorizontalSpacing();
  var vVerticalSpacing = vWidget.getVerticalSpacing();
  var vReversed = vWidget.getReverseChildrenOrder();

  var vRowWidth = 0;
  var vRowHeight = 0;

  var vRowHeightSum = 0;

  for (var i=0, ch=vWidget.getVisibleChildren(), chl=ch.length, chc; i<chl; i++)
  {
    chc = vReversed ? ch[chl-1-i] : ch[i];

    vRowWidth += chc.getNeededWidth();

    if (vRowWidth > vInnerWidth)
    {
      vRowHeightSum += vRowHeight + vVerticalSpacing;
      vRowWidth = chc.getNeededWidth();
      vRowHeight = chc.getNeededHeight();
    }
    else
    {
      vRowHeight = Math.max(vRowHeight, chc.getNeededHeight());
    };

    vRowWidth += vHorizontalSpacing;
  };

  return vRowHeightSum + vRowHeight;
};







/*
---------------------------------------------------------------------------
  [04] UPDATE LAYOUT WHEN A CHILD CHANGES ITS OUTER DIMENSIONS
---------------------------------------------------------------------------
*/

/*!
  Things to do and layout when any of the childs changes it's outer width.
  Needed by layouts where the children depends on each-other, like flow- or box-layouts.
*/
proto.updateSelfOnChildOuterWidthChange = function(vChild)
{
  // If a child only change it's width also recompute the height
  // as the layout flows around here
  //this.getWidget()._recomputeNeededHeightHelper();
  this.getWidget()._invalidatePreferredInnerHeight();
};






/*
---------------------------------------------------------------------------
  [05] UPDATE CHILD ON INNER DIMENSION CHANGES OF LAYOUT
---------------------------------------------------------------------------
*/

/*!
  Actions that should be done if the inner width of the widget was changed.
  Normally this includes update to percent values and ranges.
*/
proto.updateChildOnInnerWidthChange = function(vChild)
{
  vChild._recomputePercentX();
  vChild.addToLayoutChanges(QxConst.JOB_LOCATION);

  return true;
};

/*!
  Actions that should be done if the inner height of the widget was changed.
  Normally this includes update to percent values and ranges.
*/
proto.updateChildOnInnerHeightChange = function(vChild)
{
  vChild._recomputePercentY();
  vChild.addToLayoutChanges(QxConst.JOB_LOCATION);

  return true;
};







/*
---------------------------------------------------------------------------
  [07] UPDATE CHILDREN ON JOB QUEUE FLUSH
---------------------------------------------------------------------------
*/

/*!
  Updates children on special jobs
*/
proto.updateChildrenOnJobQueueFlush = function(vQueue)
{
  if (vQueue.horizontalSpacing || vQueue.verticalSpacing || vQueue.reverseChildrenOrder || vQueue.horizontalChildrenAlign || vQueue.verticalChildrenAlign) {
    this.getWidget()._addChildrenToLayoutQueue(QxConst.JOB_LOCATION);
  };
};






/*
---------------------------------------------------------------------------
  [08] CHILDREN ADD/REMOVE/MOVE HANDLING
---------------------------------------------------------------------------
*/

/*!
  This method combines calls of methods which should be done if a widget should be removed from the current layout.
  Needed by layouts where the children depends on each-other, like flow- or box-layouts.
*/
proto.updateChildrenOnRemoveChild = function(vChild, vIndex)
{
  var w=this.getWidget(), ch=w.getVisibleChildren(), chl=ch.length, chc, i=-1;

  if (w.getReverseChildrenOrder())
  {
    while((chc=ch[++i]) && i<vIndex) {
      chc.addToLayoutChanges(QxConst.JOB_LOCATION);
    };
  }
  else
  {
    i+=vIndex;
    while(chc=ch[++i]) {
      chc.addToLayoutChanges(QxConst.JOB_LOCATION);
    };
  };
};

/*!
  This method combines calls of methods which should be done if a child should be moved
  inside the same parent to a new positions.
  Needed by layouts where the children depends on each-other, like flow- or box-layouts.
*/
proto.updateChildrenOnMoveChild = function(vChild, vIndex, vOldIndex)
{
  for (var i=Math.min(vIndex, vOldIndex), ch=this.getWidget().getVisibleChildren(), l=ch.length; i<l; i++) {
    ch[i].addToLayoutChanges(QxConst.JOB_LOCATION);
  };
};






/*
---------------------------------------------------------------------------
  [09] FLUSH LAYOUT QUEUES OF CHILDREN
---------------------------------------------------------------------------
*/

/*!
  This method have full control of the order in which the
  registered (or also non-registered) children should be
  layouted on the horizontal axis.
*/

proto.flushChildrenQueue = function(vChildrenQueue)
{
  var w=this.getWidget(), ch=w.getVisibleChildren(), chl=ch.length, chc, chh;

  if (w.getReverseChildrenOrder())
  {
    // layout all childs from the first child
    // with an own layout request to the end
    var i=chl, changed=false;
    while(chc=ch[--i])
    {
      chh = chc.toHashCode();

      if (changed || vChildrenQueue[chh])
      {
        w._layoutChild(chc);
        changed = true;
      };
    };
  }
  else
  {
    // layout all childs from the first child
    // with an own layout request to the end
    var i=-1, changed=false;
    while(chc=ch[++i])
    {
      chh = chc.toHashCode();

      if (changed || vChildrenQueue[chh])
      {
        w._layoutChild(chc);
        changed = true;
      };
    };
  };
};






/*
---------------------------------------------------------------------------
  [10] LAYOUT CHILD
---------------------------------------------------------------------------
*/

proto.layoutChild = function(vChild, vJobs)
{
  this.layoutChild_sizeX_essentialWrapper(vChild, vJobs);
  this.layoutChild_sizeY_essentialWrapper(vChild, vJobs);

  this.layoutChild_sizeLimitX(vChild, vJobs);
  this.layoutChild_sizeLimitY(vChild, vJobs);

  this.layoutChild_marginX(vChild, vJobs);
  this.layoutChild_marginY(vChild, vJobs);

  this.layoutChild_location(vChild, vJobs);
};

if (QxClient.isMshtml() || QxClient.isOpera())
{
  /*!
    We need to respect all dimension properties on the horizontal axis in
    internet explorer to set the 'width' style
  */
  proto.layoutChild_sizeX = function(vChild, vJobs)
  {
    if (vJobs.initial || vJobs.width || vJobs.minWidth || vJobs.maxWidth) {
      vChild._computedWidthTypeNull && vChild._computedMinWidthTypeNull && vChild._computedMaxWidthTypeNull ? vChild._resetRuntimeWidth() : vChild._applyRuntimeWidth(vChild.getBoxWidth());
    };
  };

  /*!
    We need to respect all dimension properties on the vertical axis in
    internet explorer to set the 'height' style
  */
  proto.layoutChild_sizeY = function(vChild, vJobs)
  {
    if (vJobs.initial || vJobs.height || vJobs.minHeight || vJobs.maxHeight) {
      vChild._computedHeightTypeNull && vChild._computedMinHeightTypeNull && vChild._computedMaxHeightTypeNull ? vChild._resetRuntimeHeight() : vChild._applyRuntimeHeight(vChild.getBoxHeight());
    };
  };
}
else
{
  proto.layoutChild_sizeX = function(vChild, vJobs)
  {
    if (vJobs.initial || vJobs.width) {
      vChild._computedWidthTypeNull ? vChild._resetRuntimeWidth() : vChild._applyRuntimeWidth(vChild.getWidthValue());
    };
  };

  proto.layoutChild_sizeY = function(vChild, vJobs)
  {
    if (vJobs.initial || vJobs.height) {
      vChild._computedHeightTypeNull ? vChild._resetRuntimeHeight() : vChild._applyRuntimeHeight(vChild.getHeightValue());
    };
  };
};

proto.layoutChild_location = function(vChild, vJobs)
{
  var vWidget = this.getWidget();
  var vReverse = vWidget.getReverseChildrenOrder();

  var vMethodBegin = vReverse ? QxFlowLayoutImpl.STR_LAST : QxFlowLayoutImpl.STR_FIRST;
  var vMethodContinue = vReverse ? QxFlowLayoutImpl.STR_NEXT : QxFlowLayoutImpl.STR_PREVIOUS;

  if (vChild == vWidget[vMethodBegin]())
  {
    vChild._cachedLocationHorizontal = vChild._cachedLocationVertical = vChild._cachedRow = 0;
  }
  else
  {
    var vTempChild = vChild[vMethodContinue]();

    // stupidly update cache value (check them later)
    vChild._cachedLocationHorizontal = vTempChild._cachedLocationHorizontal + vTempChild.getOuterWidth() + vWidget.getHorizontalSpacing();
    vChild._cachedLocationVertical = vTempChild._cachedLocationVertical;
    vChild._cachedRow = vTempChild._cachedRow;

    // check now
    if ((vChild._cachedLocationHorizontal + vChild.getOuterWidth()) > vWidget.getInnerWidth())
    {
      // evaluate width of previous row
      vRowMax = vTempChild.getOuterHeight();
      while((vTempChild = vTempChild[vMethodContinue]()) && vTempChild._cachedRow == vChild._cachedRow) {
        vRowMax = Math.max(vRowMax, vTempChild.getOuterHeight());
      };

      // switch to new row
      vChild._cachedLocationHorizontal = 0;
      vChild._cachedLocationVertical += vWidget.getVerticalSpacing() + vRowMax;
      vChild._cachedRow++;
    };
  };

  // add margins and parent padding
  if (vWidget.getHorizontalChildrenAlign() == QxConst.ALIGN_RIGHT)
  {
    vChild._resetRuntimeLeft();
    vChild._applyRuntimeRight(vWidget.getPaddingRight() + vChild._cachedLocationHorizontal);
  }
  else
  {
    vChild._resetRuntimeRight();
    vChild._applyRuntimeLeft(vWidget.getPaddingLeft() + vChild._cachedLocationHorizontal);
  };

  if (vWidget.getVerticalChildrenAlign() == QxConst.ALIGN_BOTTOM)
  {
    vChild._resetRuntimeTop();
    vChild._applyRuntimeBottom(vWidget.getPaddingBottom() + vChild._cachedLocationVertical);
  }
  else
  {
    vChild._resetRuntimeBottom();
    vChild._applyRuntimeTop(vWidget.getPaddingTop() + vChild._cachedLocationVertical);
  };
};
