//======================================================================================================================
// Some utilities for working with gigapans and seadragon.
//
// Dependencies: Microsoft Seadragon Ajax (http://livelabs.com/seadragon-ajax/)
//
// Author: Chris Bartley (bartley@cmu.edu)
//======================================================================================================================

//======================================================================================================================
// VERIFY NAMESPACE
//======================================================================================================================
// Create the global symbol "org" if it doesn't exist.  Throw an error if it does exist but is not an object.
var org;
if (!org) {
   org = {};
}
else {
   if (typeof org != "object") {
      var orgExistsMessage = "Error: failed to create org namespace: org already exists and is not an object";
      alert(orgExistsMessage);
      throw new Error(orgExistsMessage);
   }
}

// Repeat the creation and type-checking for the next level
if (!org.gigapan) {
   org.gigapan = {};
}
else {
   if (typeof org.gigapan != "object") {
      var orgGigapanExistsMessage = "Error: failed to create org.gigapan namespace: org.gigapan already exists and is not an object";
      alert(orgGigapanExistsMessage);
      throw new Error(orgGigapanExistsMessage);
   }
}

// Repeat the creation and type-checking for the next level
if (!org.gigapan.seadragon) {
   org.gigapan.seadragon = {};
}
else {
   if (typeof org.gigapan.seadragon != "object") {
      var orgGigapanSeadragonExistsMessage = "Error: failed to create org.gigapan.seadragon namespace: org.gigapan.seadragon already exists and is not an object";
      alert(orgGigapanSeadragonExistsMessage);
      throw new Error(orgGigapanSeadragonExistsMessage);
   }
}
//======================================================================================================================

//======================================================================================================================
// DEPENDECIES
//======================================================================================================================
if (!window.Seadragon) {
   var noSeadragonMsg = "The Seadragon library is required by org.gigapan.seadragon.SeadragonUtils.js";
   alert(noSeadragonMsg);
   throw new Error(noSeadragonMsg);
}
//======================================================================================================================

//======================================================================================================================
// CODE
//======================================================================================================================
(function() {
   org.gigapan.seadragon.SeadragonUtils = function() {
   };

   org.gigapan.seadragon.SeadragonUtils.convertGigapanRectToSeadragonRect = function(xmin, ymin, xmax, ymax, gigapanWidth) {
      var xmin2 = xmin / gigapanWidth;
      var ymin2 = ymin / gigapanWidth;
      var xmax2 = xmax / gigapanWidth;
      var ymax2 = ymax / gigapanWidth;

      return new Seadragon.Rect(xmin2,
                                ymin2,
                                xmax2 - xmin2,
                                ymax2 - ymin2);
   };

   org.gigapan.seadragon.SeadragonUtils.convertGigapanRectToSeadragonRect2 = function(rect, gigapanWidth) {
      var topLeft = rect.getTopLeft();
      var bottomRight = rect.getBottomRight();
      return org.gigapan.seadragon.SeadragonUtils.convertGigapanRectToSeadragonRect(topLeft.x,
                                                                                    topLeft.y,
                                                                                    bottomRight.x,
                                                                                    bottomRight.y,
                                                                                    gigapanWidth);
   };

   org.gigapan.seadragon.SeadragonUtils.convertSeadragonRectToGigapanRect = function(xmin, ymin, xmax, ymax, gigapanWidth) {
      var xmin2 = xmin * gigapanWidth;
      var ymin2 = ymin * gigapanWidth;
      var xmax2 = xmax * gigapanWidth;
      var ymax2 = ymax * gigapanWidth;
      return new Seadragon.Rect(xmin2,
                                ymin2,
                                xmax2 - xmin2,
                                ymax2 - ymin2);
   };

   org.gigapan.seadragon.SeadragonUtils.convertSeadragonRectToGigapanRect2 = function(rect, gigapanWidth) {
      var topLeft = rect.getTopLeft();
      var bottomRight = rect.getBottomRight();
      return org.gigapan.seadragon.SeadragonUtils.convertSeadragonRectToGigapanRect(topLeft.x,
                                                                                    topLeft.y,
                                                                                    bottomRight.x,
                                                                                    bottomRight.y,
                                                                                    gigapanWidth);
   };

   org.gigapan.seadragon.SeadragonUtils.convertSeadragonPointToGigapanPoint = function(seadragonPoint, gigapanWidth) {
      return new Seadragon.Point(seadragonPoint.x * gigapanWidth,
                                 seadragonPoint.y * gigapanWidth);
   };

   org.gigapan.seadragon.SeadragonUtils.convertSeadragonViewerCoordsToSeadragonCoords = function(pointInViewerCoords, viewer) {
      return viewer.viewport.pointFromPixel(pointInViewerCoords, true);
   };

   org.gigapan.seadragon.SeadragonUtils.convertPageCoordsToSeadragonViewerCoords = function(pointInPageCoords, viewer) {
      var viewerPositionInPageCoords = Seadragon.Utils.getElementPosition(viewer.elmt);
      return pointInPageCoords.minus(viewerPositionInPageCoords);
   };

   org.gigapan.seadragon.SeadragonUtils.convertPageCoordsToSeadragonCoords = function(pointInPageCoords, viewer) {
      var pointInViewerCoords = this.convertPageCoordsToSeadragonViewerCoords(pointInPageCoords, viewer);
      return this.convertSeadragonViewerCoordsToSeadragonCoords(pointInViewerCoords, viewer);
   };

})();
//======================================================================================================================
