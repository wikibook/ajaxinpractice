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

#package(color)

************************************************************************ */

var QxColorUtil =
{
  rgb2hsb : function(vRed, vGreen, vBlue)
  {
    var vHue, vSaturation, vBrightness;

    vRed = parseFloat(vRed);
    vGreen = parseFloat(vGreen);
    vBlue = parseFloat(vBlue);

    var cmax = (vRed > vGreen) ? vRed : vGreen;
    if (vBlue > cmax) {
      cmax = vBlue;
    };

    var cmin = (vRed < vGreen) ? vRed : vGreen;
    if (vBlue < cmin) {
      cmin = vBlue;
    };

    vBrightness = cmax / 255.0;

    if (cmax != 0)
    {
      vSaturation = (cmax - cmin) / cmax;
    }
    else
    {
      vSaturation = 0;
    };

    if (vSaturation == 0)
    {
      vHue = 0;
    }
    else
    {
      var redc = (cmax - vRed) / (cmax - cmin);
      var greenc = (cmax - vGreen) / (cmax - cmin);
      var bluec = (cmax - vBlue) / (cmax - cmin);

      if (vRed == cmax)
      {
        vHue = bluec - greenc;
      }
      else if (vGreen == cmax)
      {
        vHue = 2.0 + redc - bluec;
      }
      else
      {
        vHue = 4.0 + greenc - redc;
      };

      vHue = vHue / 6.0;
      if (vHue < 0) vHue = vHue + 1.0;
    };

    return {
      hue : Math.round(vHue * 360),
      saturation : Math.round(vSaturation * 100),
      brightness : Math.round(vBrightness * 100)
    };
  },

  hsb2rgb : function(vHue, vSaturation, vBrightness)
  {
    var i, f, p, q, t, vReturn;

    vHue = parseFloat(vHue/360);
    vSaturation = parseFloat(vSaturation/100);
    vBrightness = parseFloat(vBrightness/100);

    if(vHue >= 1.0) vHue %= 1.0;
    if(vSaturation > 1.0) vSaturation = 1.0;
    if(vBrightness > 1.0) vBrightness = 1.0;

    var tov = Math.floor(255 * vBrightness);

    var vReturn = {};

    if(vSaturation == 0.0)
    {
      vReturn.red = vReturn.green = vReturn.blue = tov;
    }
    else
    {
      vHue *= 6.0;

      i = Math.floor(vHue);

      f = vHue - i;

      p = Math.floor(tov * (1.0 - vSaturation));
      q = Math.floor(tov * (1.0 - (vSaturation * f)));
      t = Math.floor(tov * (1.0 - (vSaturation * (1.0  - f))));

      switch(i)
      {
        case 0:
          vReturn.red = tov;
          vReturn.green = t;
          vReturn.blue = p;
          break;

        case 1:
          vReturn.red = q;
          vReturn.green = tov;
          vReturn.blue = p;
          break;

        case 2:
          vReturn.red = p;
          vReturn.green = tov;
          vReturn.blue = t;
          break;

        case 3:
          vReturn.red = p;
          vReturn.green = q;
          vReturn.blue = tov;
          break;

        case 4:
          vReturn.red = t;
          vReturn.green = p;
          vReturn.blue = tov;
          break;

        case 5:
          vReturn.red = tov;
          vReturn.green = p;
          vReturn.blue = q;
          break;
      };
    };

    return vReturn;
  }
};
