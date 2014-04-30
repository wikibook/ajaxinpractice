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

function QxVerticalBoxLayoutImpl(vWidget) {
  QxLayoutImpl.call(this, vWidget);
};

QxVerticalBoxLayoutImpl.extend(QxLayoutImpl, "QxVerticalBoxLayoutImpl");

QxVerticalBoxLayoutImpl.addProperty({ name : "enableFlexSupport", type : QxConst.TYPEOF_BOOLEAN, defaultValue : true });



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


  Inherits from QxLayoutImpl:
  [02] COMPUTE NEEDED DIMENSIONS FOR AN INDIVIDUAL CHILD
  [11] DISPOSER
*/



/*
---------------------------------------------------------------------------
  [01] COMPUTE BOX DIMENSIONS FOR AN INDIVIDUAL CHILD
---------------------------------------------------------------------------
*/

/*!
  Compute and return the box width of the given child.
*/
proto.computeChildBoxWidth = function(vChild)
{
  if (this.getWidget().getStretchChildrenOrthogonalAxis() && vChild._computedWidthTypeNull && vChild.getAllowStretchX()) {
    return this.getWidget().getInnerWidth();
  };

  return vChild.getWidthValue() || vChild._computeBoxWidthFallback();
};

/*!
  Compute and return the box height of the given child.
*/
proto.computeChildBoxHeight = function(vChild) {
  return vChild.getHeightValue() || vChild._computeBoxHeightFallback();
};

/*!
  Computes the height of all flexible children.
*/
proto.computeChildrenFlexHeight = function()
{
  if (this._childrenFlexHeightComputed || !this.getEnableFlexSupport()) {
    return;
  };

  this._childrenFlexHeightComputed = true;

  // this.debug("computeChildrenFlexHeight");

  var vWidget = this.getWidget();
  var vChildren = vWidget.getVisibleChildren();
  var vChildrenLength = vChildren.length;
  var vCurrentChild;
  var vFlexibleChildren = [];
  var vAvailHeight = vWidget.getInnerHeight();
  var vUsedHeight = vWidget.getSpacing() * (vChildrenLength-1);
  var vIterator;


  // *************************************************************
  // 1. Compute the sum of all static sized children and finding
  //    all flexible children.
  // *************************************************************
  for (vIterator=0; vIterator<vChildrenLength; vIterator++)
  {
    vCurrentChild = vChildren[vIterator];

    if (vCurrentChild._computedHeightTypeFlex)
    {
      vFlexibleChildren.push(vCurrentChild);

      if (vWidget._computedHeightTypeAuto) {
        vUsedHeight += vCurrentChild.getPreferredBoxHeight();
      };
    }
    else
    {
      vUsedHeight += vCurrentChild.getOuterHeight();
    };
  };

  // this.debug("Height: " + vUsedHeight + "/" + vAvailHeight);
  // this.debug("Flexible Count: " + vFlexibleChildren.length);


  // *************************************************************
  // 2. Compute the sum of all flexible children heights
  // *************************************************************
  var vRemainingHeight = vAvailHeight - vUsedHeight;
  var vFlexibleChildrenLength = vFlexibleChildren.length;
  var vPrioritySum = 0;

  for (vIterator=0; vIterator<vFlexibleChildrenLength; vIterator++) {
    vPrioritySum += vFlexibleChildren[vIterator]._computedHeightParsed;
  };


  // *************************************************************
  // 3. Calculating the size of each 'part'.
  // *************************************************************
  var vPartHeight = vRemainingHeight / vPrioritySum;


  if (!vWidget.getUseAdvancedFlexAllocation())
  {
    // *************************************************************
    // 4a. Computing the flex height value of each flexible child
    //     and add the height to the usedHeight, so that we can
    //     fix rounding problems later.
    // *************************************************************
    for (vIterator=0; vIterator<vFlexibleChildrenLength; vIterator++)
    {
      vCurrentChild = vFlexibleChildren[vIterator];

      vCurrentChild._computedHeightFlexValue = Math.round(vCurrentChild._computedHeightParsed * vPartHeight);
      vUsedHeight += vCurrentChild._computedHeightFlexValue;
    };
  }
  else
  {
    // *************************************************************
    // 4b. Calculating the diff. Which means respect the min/max
    //     height configuration in flex and store the higher/lower
    //     data in a diff.
    // *************************************************************

    var vAllocationDiff = 0;
    var vMinAllocationLoops, vFlexibleChildrenLength, vAdjust, vCurrentAllocationSum, vFactorSum, vComputedFlexibleHeight;

    for (vIterator=0; vIterator<vFlexibleChildrenLength; vIterator++)
    {
      vCurrentChild = vFlexibleChildren[vIterator];

      vComputedFlexibleHeight = vCurrentChild._computedHeightFlexValue = vCurrentChild._computedHeightParsed * vPartHeight;
      vAllocationDiff += vComputedFlexibleHeight - vComputedFlexibleHeight.limit(vCurrentChild.getMinHeightValue(), vCurrentChild.getMaxHeightValue());
    };

    // Rounding diff
    vAllocationDiff = Math.round(vAllocationDiff);

    if (vAllocationDiff == 0)
    {
      // *************************************************************
      // 5a. If the diff is equal zero we must not do anything more
      //     and do nearly identical the same like in 4a. which means
      //     to round the calculated flex value and add it to the
      //     used height so we can fix rounding problems later.
      // *************************************************************

      // Rounding values and fixing rounding errors
      for (vIterator=0; vIterator<vFlexibleChildrenLength; vIterator++)
      {
        vCurrentChild = vFlexibleChildren[vIterator];

        vCurrentChild._computedHeightFlexValue = Math.round(vCurrentChild._computedHeightFlexValue);
        vUsedHeight += vCurrentChild._computedHeightFlexValue;
      };
    }
    else
    {
      // *************************************************************
      // 5b. Find maximum loops of each adjustable child to adjust
      //     the height until the min/max height limits are reached.
      // *************************************************************

      var vUp = vAllocationDiff > 0;
      for (vIterator=vFlexibleChildrenLength-1; vIterator>=0; vIterator--)
      {
        vCurrentChild = vFlexibleChildren[vIterator];

        if (vUp)
        {
          vAdjust = (vCurrentChild.getMaxHeightValue() || Infinity) - vCurrentChild._computedHeightFlexValue;

          if (vAdjust > 0)
          {
            vCurrentChild._allocationLoops = Math.floor(vAdjust / vCurrentChild._computedHeightParsed);
          }
          else
          {
            vFlexibleChildren.removeAt(vIterator);

            vCurrentChild._computedHeightFlexValue = Math.round(vCurrentChild._computedHeightFlexValue);
            vUsedHeight += Math.round(vCurrentChild._computedHeightFlexValue + vAdjust);
          };
        }
        else
        {
          vAdjust = QxUtil.isValidNumber(vCurrentChild.getMinHeightValue()) ? vCurrentChild._computedHeightFlexValue - vCurrentChild.getMinHeightValue() : vCurrentChild._computedHeightFlexValue;

          if (vAdjust > 0)
          {
            vCurrentChild._allocationLoops = Math.floor(vAdjust / vCurrentChild._computedHeightParsed);
          }
          else
          {
            vFlexibleChildren.removeAt(vIterator);

            vCurrentChild._computedHeightFlexValue = Math.round(vCurrentChild._computedHeightFlexValue);
            vUsedHeight += Math.round(vCurrentChild._computedHeightFlexValue - vAdjust);
          };
        };
      };

      // *************************************************************
      // 6. Try to reallocate the height between flexible children
      //    so that the requirements through min/max limits
      //    are satisfied.
      // *************************************************************
      while (vAllocationDiff != 0 && vFlexibleChildrenLength > 0)
      {
        vFlexibleChildrenLength = vFlexibleChildren.length;
        vMinAllocationLoops = Infinity;
        vFactorSum = 0;

        // Find minimal loop amount
        for (vIterator=0; vIterator<vFlexibleChildrenLength; vIterator++)
        {
          vMinAllocationLoops = Math.min(vMinAllocationLoops, vFlexibleChildren[vIterator]._allocationLoops);
          vFactorSum += vFlexibleChildren[vIterator]._computedHeightParsed;
        };

        // Be sure that the adjustment is not bigger/smaller than diff
        vCurrentAllocationSum = Math.min(vFactorSum * vMinAllocationLoops, vAllocationDiff);

        // this.debug("Diff: " + vAllocationDiff);
        // this.debug("Min Loops: " + vMinAllocationLoops);
        // this.debug("Sum: " + vCurrentAllocationSum);
        // this.debug("Factor: " + vFactorSum);

        // Reducing diff by current sum
        vAllocationDiff -= vCurrentAllocationSum;

        // Adding sizes to children to adjust
        for (vIterator=vFlexibleChildrenLength-1; vIterator>=0; vIterator--)
        {
          vCurrentChild = vFlexibleChildren[vIterator];
          vCurrentChild._computedHeightFlexValue += vCurrentAllocationSum / vFactorSum * vCurrentChild._computedHeightParsed;

          if (vCurrentChild._allocationLoops == vMinAllocationLoops)
          {
            vCurrentChild._computedHeightFlexValue = Math.round(vCurrentChild._computedHeightFlexValue);

            vUsedHeight += vCurrentChild._computedHeightFlexValue;
            delete vCurrentChild._allocationLoops;
            vFlexibleChildren.removeAt(vIterator);
          }
          else
          {
            if (vAllocationDiff == 0)
            {
              vCurrentChild._computedHeightFlexValue = Math.round(vCurrentChild._computedHeightFlexValue);
              vUsedHeight += vCurrentChild._computedHeightFlexValue;
              delete vCurrentChild._allocationLoops;
            }
            else
            {
              vCurrentChild._allocationLoops -= vMinAllocationLoops;
            };
          };
        };
      };
    };
  };

  // *************************************************************
  // 7. Fix rounding errors
  // *************************************************************
  vCurrentChild._computedHeightFlexValue += vAvailHeight - vUsedHeight;
};

proto.invalidateChildrenFlexHeight = function() {
  delete this._childrenFlexHeightComputed;
};





/*
---------------------------------------------------------------------------
  [03] COMPUTE NEEDED DIMENSIONS FOR ALL CHILDREN
---------------------------------------------------------------------------
*/

/*!
  Compute and return the height needed by all children of this widget
*/
proto.computeChildrenNeededHeight = function()
{
  var w = this.getWidget();
  return QxLayoutImpl.prototype.computeChildrenNeededHeight_sum.call(this) + ((w.getVisibleChildrenLength()-1) * w.getSpacing());
};






/*
---------------------------------------------------------------------------
  [04] UPDATE LAYOUT WHEN A CHILD CHANGES ITS OUTER DIMENSIONS
---------------------------------------------------------------------------
*/

/*!
  Things to do and layout when any of the childs changes its outer height.
  Needed by layouts where the children depends on each-other, like flow- or box-layouts.
*/
proto.updateSelfOnChildOuterHeightChange = function(vChild)
{
  // if a childrens outer height changes we need to update our accumulated
  // height of all childrens (used for middle or bottom alignments)
  this.getWidget()._invalidateAccumulatedChildrenOuterHeight();
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
  // use variables here to be sure to call both methods.
  var vUpdatePercent = vChild._recomputePercentX();
  var vUpdateStretch = vChild._recomputeStretchingX();

  // priority to childs internal alignment
  if ((vChild.getHorizontalAlign() || this.getWidget().getHorizontalChildrenAlign()) == QxConst.ALIGN_CENTER) {
    vChild.addToLayoutChanges(QxConst.JOB_LOCATIONX);
  };

  // inform the caller if there were any notable changes occured
  return vUpdatePercent || vUpdateStretch;
};

/*!
  Actions that should be done if the inner height of the widget was changed.
  Normally this includes update to percent values and ranges.
*/
proto.updateChildOnInnerHeightChange = function(vChild)
{
  if (this.getWidget().getVerticalChildrenAlign() == QxConst.ALIGN_MIDDLE) {
    vChild.addToLayoutChanges(QxConst.JOB_LOCATIONY);
  };

  // use variables here to be sure to call both methods.
  var vUpdatePercent = vChild._recomputePercentY();
  var vUpdateFlex = vChild._recomputeFlexY();

  // inform the caller if there were any notable changes occured
  return vUpdatePercent || vUpdateFlex;
};







/*
---------------------------------------------------------------------------
  [06] UPDATE LAYOUT ON JOB QUEUE FLUSH
---------------------------------------------------------------------------
*/

/*!
  Invalidate and recompute things because of job in queue (before the rest of job handling will be executed).
*/
proto.updateSelfOnJobQueueFlush = function(vJobQueue)
{
  if (vJobQueue.addChild || vJobQueue.removeChild) {
    this.getWidget()._invalidateAccumulatedChildrenOuterHeight();
  };
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
  var vStretchX=false, vStretchY=false;
  var vWidget = this.getWidget();

  // switching the orientation need updates for stretching on both axis
  if (vQueue.orientation) {
    vStretchX = vStretchY = true;
  };

  // different updates depending from the current orientation (or the new one)
  if (vQueue.spacing || vQueue.orientation || vQueue.reverseChildrenOrder || vQueue.verticalChildrenAlign) {
    vWidget._addChildrenToLayoutQueue(QxConst.JOB_LOCATIONY);
  };

  if (vQueue.horizontalChildrenAlign) {
    vWidget._addChildrenToLayoutQueue(QxConst.JOB_LOCATIONX);
  };

  if (vQueue.stretchChildrenOrthogonalAxis) {
    vStretchX = true;
  };

  // if stretching should be reworked reset the previous one and add
  // a layout job to update the width respectively height.
  if (vStretchX)
  {
    vWidget._recomputeChildrenStretchingX();
    vWidget._addChildrenToLayoutQueue(QxConst.PROPERTY_WIDTH);
  };

  if (vStretchY)
  {
    vWidget._recomputeChildrenStretchingY();
    vWidget._addChildrenToLayoutQueue(QxConst.PROPERTY_HEIGHT);
  };

  return true;
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

  // Fix index to be at the first flex child
  if (this.getEnableFlexSupport())
  {
    for (var i=0; i<chl; i++)
    {
      chc = ch[i];
      if (chc.getHasFlexY()) 
      {
        vIndex = Math.min(vIndex, i);
        break;
      };
    }; 
    
    i=-1;  
  };
  
  // Handle differently depending on layout mode
  switch(w.getLayoutMode())
  {
    case QxConst.ALIGN_BOTTOM:
    case QxConst.ALIGN_TOP_REVERSED:
      while((chc=ch[++i]) && i<vIndex) {
        chc.addToLayoutChanges(QxConst.JOB_LOCATIONY);
      };

      break;

    case QxConst.ALIGN_MIDDLE:
    case QxConst.ALIGN_MIDDLE_REVERSED:
      while(chc=ch[++i]) {
        chc.addToLayoutChanges(QxConst.JOB_LOCATIONY);
      };

      break;

    default:
      i+=vIndex;
      while(chc=ch[++i]) {
        chc.addToLayoutChanges(QxConst.JOB_LOCATIONY);
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
  var vChildren = this.getWidget().getVisibleChildren();

  var vStart = Math.min(vIndex, vOldIndex);
  var vStop = Math.max(vIndex, vOldIndex)+1;

  for (var i=vStart; i<vStop; i++) {
    vChildren[i].addToLayoutChanges(QxConst.JOB_LOCATIONY);
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
  var w=this.getWidget(), ch=w.getVisibleChildren(), chl=ch.length, chc, i;

  // This block is needed for flex handling and
  // will inform flex children if there was any
  // change to the other content
  if (this.getEnableFlexSupport())
  {
    this.invalidateChildrenFlexHeight();

    for (i=0; i<chl; i++)
    {
      chc = ch[i];
      if (chc.getHasFlexY())
      {
        chc._computedHeightValue = null;

        if (chc._recomputeBoxHeight())
        {
          chc._recomputeOuterHeight();
          chc._recomputeInnerHeight();
        };

        vChildrenQueue[chc.toHashCode()] = chc;
        chc._layoutChanges.height = true;
      };
    };
  };

  switch(w.getLayoutMode())
  {
    case QxConst.ALIGN_BOTTOM:
    case QxConst.ALIGN_TOP_REVERSED:
      // find the last child which has a layout request
      for (var i=chl-1; i>=0 && !vChildrenQueue[ch[i].toHashCode()]; i--) {};

      // layout all children before this last child
      for (var j=0; j<=i; j++) {
        w._layoutChild(chc=ch[j]);
      };

      break;

    case QxConst.ALIGN_MIDDLE:
    case QxConst.ALIGN_MIDDLE_REVERSED:
      // re-layout all children
      i = -1;
      while(chc=ch[++i]) {
        w._layoutChild(chc);
      };

      break;

    default:
      // layout all childs from the first child
      // with an own layout request to the end
      i = -1;
      var changed=false;
      while(chc=ch[++i])
      {
        if (changed || vChildrenQueue[chc.toHashCode()])
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

/*!
  This is called from QxWidget and  it's task is to apply the layout
  (excluding border and padding) to the child.
*/
proto.layoutChild = function(vChild, vJobs)
{
  this.layoutChild_sizeX(vChild, vJobs);
  this.layoutChild_sizeY(vChild, vJobs);

  this.layoutChild_sizeLimitX(vChild, vJobs);
  this.layoutChild_sizeLimitY(vChild, vJobs);

  this.layoutChild_locationX(vChild, vJobs);
  this.layoutChild_locationY(vChild, vJobs);

  this.layoutChild_marginX(vChild, vJobs);
  this.layoutChild_marginY(vChild, vJobs);
};

if (QxClient.isMshtml() || QxClient.isOpera())
{
  proto.layoutChild_sizeX = function(vChild, vJobs)
  {
    if (vJobs.initial || vJobs.width || vJobs.minWidth || vJobs.maxWidth)
    {
      if ((vChild._isWidthEssential() && (!vChild._computedWidthTypeNull || !vChild._computedMinWidthTypeNull || !vChild._computedMaxWidthTypeNull)) || (vChild.getAllowStretchX() && this.getWidget().getStretchChildrenOrthogonalAxis()))
      {
        vChild._applyRuntimeWidth(vChild.getBoxWidth());
      }
      else
      {
        vChild._resetRuntimeWidth();
      };
    };
  };

  proto.layoutChild_sizeY = function(vChild, vJobs)
  {
    if (vJobs.initial || vJobs.height || vJobs.minHeight || vJobs.maxHeight)
    {
      if (vChild._isHeightEssential() && (!vChild._computedHeightTypeNull || !vChild._computedMinHeightTypeNull || !vChild._computedMaxHeightTypeNull))
      {
        vChild._applyRuntimeHeight(vChild.getBoxHeight());
      }
      else
      {
        vChild._resetRuntimeHeight();
      };
    };
  };
}
else
{
  proto.layoutChild_sizeX = function(vChild, vJobs)
  {
    if (vJobs.initial || vJobs.width)
    {
      if (vChild._isWidthEssential() && !vChild._computedWidthTypeNull)
      {
        vChild._applyRuntimeWidth(vChild.getWidthValue());
      }
      else
      {
        vChild._resetRuntimeWidth();
      };
    };
  };

  proto.layoutChild_sizeY = function(vChild, vJobs)
  {
    if (vJobs.initial || vJobs.height)
    {
      if (vChild._isHeightEssential() && !vChild._computedHeightTypeNull)
      {
        vChild._applyRuntimeHeight(vChild.getHeightValue());
      }
      else
      {
        vChild._resetRuntimeHeight();
      };
    };
  };
};

proto.layoutChild_locationY = function(vChild, vJobs)
{
  var vWidget = this.getWidget();

  // handle first child
  if (vWidget.getFirstVisibleChild() == vChild)
  {
    switch(vWidget.getLayoutMode())
    {
      case QxConst.ALIGN_BOTTOM:
      case QxConst.ALIGN_TOP_REVERSED:
        var vPos = vWidget.getPaddingBottom() + vWidget.getAccumulatedChildrenOuterHeight() - vChild.getOuterHeight();
        break;

      case QxConst.ALIGN_MIDDLE:
      case QxConst.ALIGN_MIDDLE_REVERSED:
        var vPos = vWidget.getPaddingTop() + Math.round((vWidget.getInnerHeight() - vWidget.getAccumulatedChildrenOuterHeight()) / 2);
        break;

      default:
        var vPos = vWidget.getPaddingTop();
    };
  }

  // handle any following child
  else
  {
    var vPrev = vChild.getPreviousVisibleSibling();

    switch(vWidget.getLayoutMode())
    {
      case QxConst.ALIGN_BOTTOM:
      case QxConst.ALIGN_TOP_REVERSED:
        var vPos = vPrev._cachedLocationVertical - vChild.getOuterHeight() - vWidget.getSpacing();
        break;

      default:
        var vPos = vPrev._cachedLocationVertical + vPrev.getOuterHeight() + vWidget.getSpacing();
    };
  };

  // store for next sibling
  vChild._cachedLocationVertical = vPos;

  // apply styles
  switch(this.getWidget().getLayoutMode())
  {
    case QxConst.ALIGN_BOTTOM:
    case QxConst.ALIGN_BOTTOM_REVERSED:
    case QxConst.ALIGN_MIDDLE_REVERSED:
      // add relative positions (like 'position:relative' in css)
      vPos += !vChild._computedBottomTypeNull ? vChild.getBottomValue() : !vChild._computedTopTypeNull ? -(vChild.getTopValue()) : 0;

      vChild._resetRuntimeTop();
      vChild._applyRuntimeBottom(vPos);
      break;

    default:
      // add relative positions (like 'position:relative' in css)
      vPos += !vChild._computedTopTypeNull ? vChild.getTopValue() : !vChild._computedBottomTypeNull ? -(vChild.getBottomValue()) : 0;

      vChild._resetRuntimeBottom();
      vChild._applyRuntimeTop(vPos);
  };
};

proto.layoutChild_locationX = function(vChild, vJobs)
{
  var vWidget = this.getWidget();

  // special stretching support
  if (QxClient.isGecko() && vChild.getAllowStretchX() && vWidget.getStretchChildrenOrthogonalAxis() && vChild._computedWidthTypeNull)
  {
    vChild._applyRuntimeLeft(vWidget.getPaddingLeft() || 0);
    vChild._applyRuntimeRight(vWidget.getPaddingRight() || 0);

    return;
  };

  // priority to childs internal alignment
  var vAlign = vChild.getHorizontalAlign() || vWidget.getHorizontalChildrenAlign();

  // handle center alignment
  var vPos = vAlign == QxConst.ALIGN_CENTER ? Math.round((vWidget.getInnerWidth() - vChild.getOuterWidth()) / 2) : 0;

  // the right alignment use the real 'right' styleproperty to
  // use the best available method in modern browsers
  if (vAlign == QxConst.ALIGN_RIGHT)
  {
    // add parent padding
    vPos += vWidget.getPaddingRight();

    // relative positions (like 'position:relative' in css)
    if (!vChild._computedRightTypeNull) {
      vPos += vChild.getRightValue();
    }
    else if (!vChild._computedLeftTypeNull) {
      vPos -= vChild.getLeftValue();
    };

    // apply styles
    vChild._resetRuntimeLeft();
    vChild._applyRuntimeRight(vPos);
  }
  else
  {
    // add parent padding
    vPos += vWidget.getPaddingLeft();

    // relative positions (like 'position:relative' in css)
    if (!vChild._computedLeftTypeNull) {
      vPos += vChild.getLeftValue();
    }
    else if (!vChild._computedRightTypeNull) {
      vPos -= vChild.getRightValue();
    };

    // apply styles
    vChild._resetRuntimeRight();
    vChild._applyRuntimeLeft(vPos);
  };
};
