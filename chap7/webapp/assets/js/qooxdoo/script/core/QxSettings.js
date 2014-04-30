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

#package(core)
#require(QxDefaultSettings)

************************************************************************ */

// hide from global scope
(function() {

// check and create global storage if not available already
if (typeof QxSettings === "undefined") {
  QxSettings = {};
};

// merge settings from default settings
for (var vKey in QxDefaultSettings)
{
  if (typeof QxSettings[vKey] === "undefined") {
    QxSettings[vKey] = QxDefaultSettings[vKey];
  };
};

// hide from global scope
})();
