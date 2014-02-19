//======================================================================================================================
// A tool used for creating snapshots of gigapans.  The tool must be instantiated after page load.  The constructor
// requires one argument and has an optional second argument:
// 1) An instance of a Seadragon.Viewer in which the snapshot tool will be placed as an overlay.
// 2) A configuration object containing either or both of the following properties:
//    * aspectRatio:  The aspect ratio (width / height) to which snapshots should be constrained.  If undefined or null,
//                    the snapshot aspect ratio will not be constrained.
//    * useMask:      A boolean specifying whether the greyed-out mask around the snapshot bounds should be shown when
//                    snapshotting.  Defaults to false if undefined.
//
// Users must ensure that the setGigapanDimensions() method is called 1) before the tool is made visible and; 2) any
// time a new gigapan is loaded in the viewer.
//
// Dependencies:
// * jQuery (http://jquery.com/)
// * Microsoft Seadragon Ajax (http://livelabs.com/seadragon-ajax/)
// * org.gigapan.seadragon.SeadragonUtils
// * org.gigapan.snapshot.SnapshotTool.css
//
// Authors: Chris Bartley (bartley@cmu.edu), Jim Garrison
//======================================================================================================================

//======================================================================================================================
// VERIFY NAMESPACE
//======================================================================================================================
// Create the global symbol "org" if it doesn't exist.  Throw an error if it does exist but is not an object.
var org;
if (!org) {
   org = {};
}
else if (typeof org != "object") {
   var orgExistsMessage = "Error: failed to create org namespace: org already exists and is not an object";
   alert(orgExistsMessage);
   throw new Error(orgExistsMessage);
}

// Repeat the creation and type-checking for the next level
if (!org.gigapan) {
   org.gigapan = {};
}
else if (typeof org.gigapan != "object") {
   var orgGigapanExistsMessage = "Error: failed to create org.gigapan namespace: org.gigapan already exists and is not an object";
   alert(orgGigapanExistsMessage);
   throw new Error(orgGigapanExistsMessage);
}

// Repeat the creation and type-checking for the next level
if (!org.gigapan.snapshot) {
   org.gigapan.snapshot = {};
}
else if (typeof org.gigapan.snapshot != "object") {
   var orgGigapanSnapshotExistsMessage = "Error: failed to create org.gigapan.snapshot namespace: org.gigapan.snapshot already exists and is not an object";
   alert(orgGigapanSnapshotExistsMessage);
   throw new Error(orgGigapanSnapshotExistsMessage);
}
//======================================================================================================================

//======================================================================================================================
// DEPENDECIES
//======================================================================================================================
if (!window.$) {
   var nojQueryMsg = "The jQuery library is required by org.gigapan.snapshot.SnapshotTool.js";
   alert(nojQueryMsg);
   throw new Error(nojQueryMsg);
}
//----------------------------------------------------------------------------------------------------------------------
if (!window.Seadragon) {
   var noSeadragonMsg = "The Seadragon library is required by org.gigapan.snapshot.SnapshotTool.js";
   alert(noSeadragonMsg);
   throw new Error(noSeadragonMsg);
}
//----------------------------------------------------------------------------------------------------------------------
if (!window.org.gigapan.seadragon.SeadragonUtils) {
   var noSeadragonUtilsMsg = "The org.gigapan.seadragon.SeadragonUtils library is required by org.gigapan.snapshot.SnapshotTool.js";
   alert(noSeadragonUtilsMsg);
   throw new Error(noSeadragonUtilsMsg);
}
//======================================================================================================================

//======================================================================================================================
// CODE
//======================================================================================================================
(function() {
   var jQuery = window.$;
   var SeadragonUtils = org.gigapan.seadragon.SeadragonUtils;

   var DEFAULT_ASPECT_RATIO = null;    // Aspect ratio of the snapshot. If null or undefined, then no constraint is used.
   var DEFAULT_USE_MASK = false;       // whether the mask should be applied

   var gigapanWidth = null;
   var gigapanHeight = null;

   function determineShadedAreaRect(i, bounds_rect) {
      var dimensions = new Seadragon.Point(1, 1 / viewer.source.aspectRatio);
      var rv;
      if (i == 0) {
         rv = new Seadragon.Rect(0, 0, bounds_rect.x, bounds_rect.y + bounds_rect.height);
      }
      else if (i == 1) {
         rv = new Seadragon.Rect(bounds_rect.x, 0, dimensions.x - bounds_rect.x, bounds_rect.y);
      }
      else if (i == 2) {
         rv = new Seadragon.Rect(bounds_rect.x + bounds_rect.width, bounds_rect.y, dimensions.x - bounds_rect.x - bounds_rect.width, dimensions.y - bounds_rect.y);
      }
      else if (i == 3) {
         rv = new Seadragon.Rect(0, bounds_rect.y + bounds_rect.height, bounds_rect.x + bounds_rect.width, dimensions.y - bounds_rect.y - bounds_rect.height);
      }

      rv.width = Math.max(0, rv.width);
      rv.height = Math.max(0, rv.height);

      return rv;
   }

   org.gigapan.snapshot.SnapshotTool = function(viewer, desiredConfig) {
      var snapshotToolBoundsSelector = null;
      var snapshotToolBoundsHandles = new Array(8);   // in clockwise order starting from top-left corner
      var snapshotToolBoundsHandlePositionsInPointsCoords = new Array(snapshotToolBoundsHandles.length);
      var snapshotToolBoundsHandleMouseTrackers = new Array(snapshotToolBoundsHandles.length);
      var snapshotToolShadedAreas = new Array(4);
      var snapshotToolBoundsSelectorMouseTracker = null;
      var isSnapshotToolVisible = false;

      var config = {
         aspectRatio : DEFAULT_ASPECT_RATIO,
         useMask : DEFAULT_USE_MASK
      };
      if (typeof desiredConfig !== 'undefined' && desiredConfig != null) {
         if (desiredConfig.hasOwnProperty('aspectRatio')) {
            config['aspectRatio'] = desiredConfig['aspectRatio'];
         }
         if (desiredConfig.hasOwnProperty('useMask')) {
            config['useMask'] = desiredConfig['useMask'];
         }
      }
      var willUseMask = (config['useMask'] !== undefined && config['useMask'] == true);
      var willConstrainSnapshotAspectRatio = (config['aspectRatio'] !== undefined && config['aspectRatio'] != null);
      var snapshotAspectRatio = (willConstrainSnapshotAspectRatio) ? Math.abs(config['aspectRatio']) : DEFAULT_ASPECT_RATIO;

      // ------------------------------------------------------------------------------------------------------------------
      // create the snapshot tool bounds selector
      snapshotToolBoundsSelector = document.createElement("div");
      snapshotToolBoundsSelector.id = "snapshot_tool_bounds_selector";
      snapshotToolBoundsSelector.className = "snapshot_tool_bounds_selector";

      // create an inner div so we have a combination black/white border
      jQuery(snapshotToolBoundsSelector).append("<div></div>");

      // create the snapshot tool bounds handles
      jQuery.each(snapshotToolBoundsHandles,
                  function(i) {
                     snapshotToolBoundsHandles[i] = document.createElement("div");
                     snapshotToolBoundsHandles[i].id = "snapshot_tool_bounds_handle_" + i;
                     snapshotToolBoundsHandles[i].className = "snapshot_tool_bounds_handle";
                  });

      // create the snapshot tool shaded areas
      jQuery.each(snapshotToolShadedAreas,
                  function(i) {
                     snapshotToolShadedAreas[i] = jQuery('<div><div></div></div>')[0];
                     if (willUseMask) {
                        $(snapshotToolShadedAreas[i]).addClass("snapshot_tool_shaded_area");
                     }
                  });

      // ------------------------------------------------------------------------------------------------------------------
      // A listener to keep track of the the snapshot tool's bounds handle positions (in seadragon points).  We need to do
      // this because there's currently no way to query the seadragon Drawer to get the current position of an overlay.  We
      // don't want to simply compute the position from the current pixel position since the precision varies with the zoom
      // level.  See: http://getsatisfaction.com/livelabs/topics/how_to_get_current_position_of_an_overlay
      var snapshotToolBoundsHandlePositionListener = function(newBoundsHandlePositionsInPointsCoords) {
         if (newBoundsHandlePositionsInPointsCoords) {
            for (var j = 0; j < newBoundsHandlePositionsInPointsCoords.length; j++) {
               snapshotToolBoundsHandlePositionsInPointsCoords[j] = newBoundsHandlePositionsInPointsCoords[j];
            }
         }
      };

      // ------------------------------------------------------------------------------------------------------------------
      // create a mouse tracker for the snapshot bounds rectangle

      snapshotToolBoundsSelectorMouseTracker = new SnapshotBoundsMouseTracker(snapshotToolBoundsSelector, viewer, snapshotToolBoundsHandles, snapshotToolShadedAreas, snapshotToolBoundsHandlePositionListener);
      snapshotToolBoundsSelectorMouseTracker.setTracking(true);  // begin tracking

      // ------------------------------------------------------------------------------------------------------------------

      // create mouse trackers for the snapshot bounds handles
      jQuery.each(snapshotToolBoundsHandles,
                  function(i) {
                     var oppositeHandleIndex = (i + 4 >= 8) ? i - 4 : i + 4;
                     snapshotToolBoundsHandleMouseTrackers[i] = new SnapshotBoundsHandleMouseTracker(
                           i,
                           oppositeHandleIndex,
                           snapshotToolBoundsHandles,
                           viewer,
                           snapshotToolShadedAreas,
                           snapshotToolBoundsSelector,
                           snapshotToolBoundsHandlePositionListener,
                           willConstrainSnapshotAspectRatio,
                           snapshotAspectRatio);
                     snapshotToolBoundsHandleMouseTrackers[i].setTracking(true);  // begin tracking
                  });

      // ------------------------------------------------------------------------------------------------------------------

      // Create an event listener which will turn on/off the snapshot tool mouse listeners if the viewer is animating
      var setSnapshotToolEnabledBasedOnAnimationState = function(isAnimating) {
         snapshotToolBoundsSelectorMouseTracker.setTracking(!isAnimating);

         jQuery.each(snapshotToolBoundsHandles,
                     function(i) {
                        snapshotToolBoundsHandleMouseTrackers[i].setTracking(!isAnimating);
                     });

         var boundsSelectorClassName = (isAnimating) ? "snapshot_tool_bounds_selector_disabled" : "snapshot_tool_bounds_selector";
         var boundsSelectorHandlesClassName = (isAnimating) ? "snapshot_tool_bounds_handle_disabled" : "snapshot_tool_bounds_handle";

         snapshotToolBoundsSelector.className = boundsSelectorClassName;
         jQuery.each(snapshotToolBoundsHandles,
                     function(i) {
                        snapshotToolBoundsHandles[i].className = boundsSelectorHandlesClassName;
                     });

      };

      // register the listeners with the viewer
      viewer.addEventListener("animationstart",
                              function() {
                                 setSnapshotToolEnabledBasedOnAnimationState(true);
                              });
      viewer.addEventListener("animationfinish",
                              function() {
                                 setSnapshotToolEnabledBasedOnAnimationState(false);
                              });
      // ---------------------------------------------------------------------------------------------------------------
      /**
       * Registers the width and height of the gigapan with the snapshot tool.  It is critical that this method be
       * called 1) before the tool is made visible and; 2) any time a new gigapan is loaded in the viewer.
       */
      this.setGigapanDimensions = function(width, height) {
         gigapanWidth = width;
         gigapanHeight = height;

         // tell the bounds rect and the handles what the min/max coordinates are so the user can't drag the bounds rect
         // outside of the bounds of the gigapan
         var pointsCoordinatesRangeRect = new Seadragon.Rect(0, 0, 1, height / width);
         snapshotToolBoundsSelectorMouseTracker.setPointsCoordinatesRangeRect(pointsCoordinatesRangeRect);
         jQuery.each(snapshotToolBoundsHandleMouseTrackers,
                     function(i) {
                        snapshotToolBoundsHandleMouseTrackers[i].setPointsCoordinatesRangeRect(pointsCoordinatesRangeRect);
                     });
      };

      /**
       * Returns a Seadragon.Rect specifying the current bounds (in Gigapan coordinates) of the snapshot tool.
       */
      this.getToolBoundsInGigapanCoords = function() {
         var topLeftCornerInGigapanCoords = SeadragonUtils.convertSeadragonPointToGigapanPoint(snapshotToolBoundsHandlePositionsInPointsCoords[0], gigapanWidth);
         var bottomRightCornerInGigapanCoords = SeadragonUtils.convertSeadragonPointToGigapanPoint(snapshotToolBoundsHandlePositionsInPointsCoords[4], gigapanWidth);

         return new Seadragon.Rect(
               topLeftCornerInGigapanCoords.x,
               topLeftCornerInGigapanCoords.y,
               bottomRightCornerInGigapanCoords.x - topLeftCornerInGigapanCoords.x,
               bottomRightCornerInGigapanCoords.y - topLeftCornerInGigapanCoords.y
         );
      };

      /**
       * Returns a Seadragon.Rect specifying the current bounds (in Seadragon coordinates) of the snapshot tool.
       */
      this.getToolBoundsInSeadragonCoords = function() {
         var topLeftCornerInSeadragonCoords = snapshotToolBoundsHandlePositionsInPointsCoords[0];
         var bottomRightCornerInSeadragonCoords = snapshotToolBoundsHandlePositionsInPointsCoords[4];

         return new Seadragon.Rect(
               topLeftCornerInSeadragonCoords.x,
               topLeftCornerInSeadragonCoords.y,
               bottomRightCornerInSeadragonCoords.x - topLeftCornerInSeadragonCoords.x,
               bottomRightCornerInSeadragonCoords.y - topLeftCornerInSeadragonCoords.y
         );
      };

      /**
       * Sets the snapshot tool's bounds to the given Rect (in Seadragon coordinates)
       */
      this.setToolBoundsInSeadragonCoords = function(boundsRectInPointsCoords) {
         if (!this.isVisible) {
            throw "Cannot set snapshot bounds if the tool is not visible";
         }
         // fixme: add some sanity checks here.  if we're currently dragging, there may be unexpected results.
         //        On the other hand, I don't know how a user will cause this function to be called if they are dragging.

         var topLeftInPointsCoords = boundsRectInPointsCoords.getTopLeft();
         var dimensionsInPointsCoords = boundsRectInPointsCoords.getSize();
         var halfDimensionsInPointsCoords = dimensionsInPointsCoords.divide(2);

         viewer.drawer.updateOverlay(snapshotToolBoundsSelector, boundsRectInPointsCoords);

         //update the movement for all the handles
         var boundsHandlePositions = new Array(8);
         boundsHandlePositions[0] = topLeftInPointsCoords;  // top left
         boundsHandlePositions[1] = topLeftInPointsCoords.plus(new Seadragon.Point(halfDimensionsInPointsCoords.x, 0));  // top edge
         boundsHandlePositions[2] = topLeftInPointsCoords.plus(new Seadragon.Point(dimensionsInPointsCoords.x, 0));  // top right
         boundsHandlePositions[3] = topLeftInPointsCoords.plus(new Seadragon.Point(dimensionsInPointsCoords.x, halfDimensionsInPointsCoords.y)); // right edge
         boundsHandlePositions[4] = topLeftInPointsCoords.plus(dimensionsInPointsCoords);  // bottom right
         boundsHandlePositions[5] = topLeftInPointsCoords.plus(new Seadragon.Point(halfDimensionsInPointsCoords.x, dimensionsInPointsCoords.y)); // bottom edge
         boundsHandlePositions[6] = topLeftInPointsCoords.plus(new Seadragon.Point(0, dimensionsInPointsCoords.y));  // bottom left
         boundsHandlePositions[7] = topLeftInPointsCoords.plus(new Seadragon.Point(0, halfDimensionsInPointsCoords.y)); // left edge
         for (var i = 0; i < snapshotToolBoundsHandles.length; i++) {
            viewer.drawer.updateOverlay(
                  snapshotToolBoundsHandles[i],
                  boundsHandlePositions[i],
                  Seadragon.OverlayPlacement.CENTER);
         }

         // update shaded areas
         if (Seadragon.Utils.getBrowser() != Seadragon.Browser.IE) {
            viewer.drawer.updateOverlay(snapshotToolShadedAreas[0], determineShadedAreaRect(0, boundsRectInPointsCoords));
            viewer.drawer.updateOverlay(snapshotToolShadedAreas[1], determineShadedAreaRect(1, boundsRectInPointsCoords));
            viewer.drawer.updateOverlay(snapshotToolShadedAreas[2], determineShadedAreaRect(2, boundsRectInPointsCoords));
            viewer.drawer.updateOverlay(snapshotToolShadedAreas[3], determineShadedAreaRect(3, boundsRectInPointsCoords));
         }

         // notify the listener (if any) of the change in the bounds handle positions
         snapshotToolBoundsHandlePositionListener(boundsHandlePositions);
      };

      /**
       * Returns true if the snapshot tool is currently visible, false otherwise.
       */
      this.isVisible = function() {
         return isSnapshotToolVisible;
      };

      /**
       * Sets the visibility of the snapshot tool.  The tool is made visible if willMakeVisible is true and will be
       * hidden otherwise.
       */
      this.setVisible = function(willMakeVisible) {
         if (willMakeVisible && !isSnapshotToolVisible) {
            // ---------------------------------------------------------------------------------------------------------------
            // Compute position for snapshot bounds selector.  Do so by first finding the visible portion of the gigapan in
            // the viewer, then finding the center of the visible portion, then sizing the initial bounds rect so that it has
            // the proper aspect ratio and is centered in the visible area.

            // First get the gigapan top-left and bottom-right corners in pixel coordinates
            var gigapanBoundsInPointsCoords = SeadragonUtils.convertGigapanRectToSeadragonRect(0, 0, gigapanWidth, gigapanHeight, gigapanWidth);
            var gigapanTopLeftInPixelCoords = viewer.viewport.pixelFromPoint(gigapanBoundsInPointsCoords.getTopLeft());
            var gigapanBottomRightInPixelCoords = viewer.viewport.pixelFromPoint(gigapanBoundsInPointsCoords.getBottomRight());
            var viewportTopLeftInPixelCoords = new Seadragon.Rect(0, 0);
            var viewportBottomRightInPixelCoords = viewer.viewport.getContainerSize();

            // compute the corners of the intersection rect (algorithm from: http://coding.derkeiler.com/Archive/C_CPP/comp.lang.c/2004-12/2748.html)
            var topLeftOfVisiblePortionInPixelCoordinates = new Seadragon.Point(
                  Math.max(gigapanTopLeftInPixelCoords.x, viewportTopLeftInPixelCoords.x),
                  Math.max(gigapanTopLeftInPixelCoords.y, viewportTopLeftInPixelCoords.y)
            );
            var bottomRightOfVisiblePortionInPixelCoordinates = new Seadragon.Point(
                  Math.min(gigapanBottomRightInPixelCoords.x, viewportBottomRightInPixelCoords.x),
                  Math.min(gigapanBottomRightInPixelCoords.y, viewportBottomRightInPixelCoords.y)
            );

            // make sure the intersection is non-empty
            var boundsRectCenterInPixelCoords = null;
            var boundsRectDimensionsInPixelCoords = null;
            if (bottomRightOfVisiblePortionInPixelCoordinates.x > topLeftOfVisiblePortionInPixelCoordinates.x &&
                bottomRightOfVisiblePortionInPixelCoordinates.y > topLeftOfVisiblePortionInPixelCoordinates.y) {
               var intersectingRectInPixelCoords = new Seadragon.Rect(
                     topLeftOfVisiblePortionInPixelCoordinates.x,
                     topLeftOfVisiblePortionInPixelCoordinates.y,
                     bottomRightOfVisiblePortionInPixelCoordinates.x - topLeftOfVisiblePortionInPixelCoordinates.x,
                     bottomRightOfVisiblePortionInPixelCoordinates.y - topLeftOfVisiblePortionInPixelCoordinates.y
               );

               boundsRectCenterInPixelCoords = intersectingRectInPixelCoords.getCenter();

               // If constraining the aspect ratio, then choose bounds such that we maximize one edge up to 90%, and the
               // other edge is determined by the aspect ratio
               if (willConstrainSnapshotAspectRatio) {
                  var intersectingRectAspectRatio = intersectingRectInPixelCoords.width / intersectingRectInPixelCoords.height;
                  if (snapshotAspectRatio > intersectingRectAspectRatio) {
                     var width = 0.9 * intersectingRectInPixelCoords.width;
                     boundsRectDimensionsInPixelCoords = new Seadragon.Point(width, 1 / snapshotAspectRatio * width);
                  }
                  else {
                     var height = 0.9 * intersectingRectInPixelCoords.height;
                     boundsRectDimensionsInPixelCoords = new Seadragon.Point(snapshotAspectRatio * height, height);
                  }
               }
               else {
                  boundsRectDimensionsInPixelCoords = new Seadragon.Point(0.9 * intersectingRectInPixelCoords.width,
                                                                          0.9 * intersectingRectInPixelCoords.height);
               }
            }
            else {
               // Handle the case where there's no intersection between the gigapan and the viewer (i.e. there's no visible
               // portion).  This can happen if you go to fullscreen mode, drag the pano as far to a corner as you can,
               // then leave fullscreen mode and engage the snapshot tool.
               var gigapanDimensionsInPixelCoords = gigapanBottomRightInPixelCoords.minus(gigapanTopLeftInPixelCoords);
               boundsRectCenterInPixelCoords = gigapanDimensionsInPixelCoords.divide(2).plus(gigapanTopLeftInPixelCoords);
               boundsRectDimensionsInPixelCoords = new Seadragon.Point(
                           gigapanDimensionsInPixelCoords.x * 0.9,
                           gigapanDimensionsInPixelCoords.y * 0.9
               );
            }

            var dimensionsInPointsCoords = viewer.viewport.deltaPointsFromPixels(boundsRectDimensionsInPixelCoords);
            var halfDimensionsInPointsCoords = dimensionsInPointsCoords.divide(2);

            var boundsRectCenterInPointsCoords = viewer.viewport.pointFromPixel(boundsRectCenterInPixelCoords);
            var topLeftInPointsCoords = boundsRectCenterInPointsCoords.minus(halfDimensionsInPointsCoords);

            var boundsRectInPointsCoords = new Seadragon.Rect(
                  topLeftInPointsCoords.x,
                  topLeftInPointsCoords.y,
                  dimensionsInPointsCoords.x,
                  dimensionsInPointsCoords.y);

            // add the shaded areas
            if (Seadragon.Utils.getBrowser() != Seadragon.Browser.IE) {
               viewer.drawer.addOverlay(snapshotToolShadedAreas[0], determineShadedAreaRect(0, boundsRectInPointsCoords));
               viewer.drawer.addOverlay(snapshotToolShadedAreas[1], determineShadedAreaRect(1, boundsRectInPointsCoords));
               viewer.drawer.addOverlay(snapshotToolShadedAreas[2], determineShadedAreaRect(2, boundsRectInPointsCoords));
               viewer.drawer.addOverlay(snapshotToolShadedAreas[3], determineShadedAreaRect(3, boundsRectInPointsCoords));
            }

            // add the bounds rectangle overlay to the viewer
            viewer.drawer.addOverlay(snapshotToolBoundsSelector, boundsRectInPointsCoords);
            // ---------------------------------------------------------------------------------------------------------
            // define the positions for the bounds handles
            snapshotToolBoundsHandlePositionsInPointsCoords[0] = topLeftInPointsCoords;  // top left
            snapshotToolBoundsHandlePositionsInPointsCoords[1] = boundsRectCenterInPointsCoords.minus(new Seadragon.Point(0, halfDimensionsInPointsCoords.y));  // top edge
            snapshotToolBoundsHandlePositionsInPointsCoords[2] = boundsRectCenterInPointsCoords.plus(new Seadragon.Point(halfDimensionsInPointsCoords.x, -halfDimensionsInPointsCoords.y));  // top right
            snapshotToolBoundsHandlePositionsInPointsCoords[3] = boundsRectCenterInPointsCoords.plus(new Seadragon.Point(halfDimensionsInPointsCoords.x, 0)); // right edge
            snapshotToolBoundsHandlePositionsInPointsCoords[4] = boundsRectCenterInPointsCoords.plus(halfDimensionsInPointsCoords);  // bottom right
            snapshotToolBoundsHandlePositionsInPointsCoords[5] = boundsRectCenterInPointsCoords.plus(new Seadragon.Point(0, halfDimensionsInPointsCoords.y)); // bottom edge
            snapshotToolBoundsHandlePositionsInPointsCoords[6] = boundsRectCenterInPointsCoords.plus(new Seadragon.Point(-halfDimensionsInPointsCoords.x, halfDimensionsInPointsCoords.y));  // bottom left
            snapshotToolBoundsHandlePositionsInPointsCoords[7] = boundsRectCenterInPointsCoords.minus(new Seadragon.Point(halfDimensionsInPointsCoords.x, 0)); // left edge
            // ---------------------------------------------------------------------------------------------------------
            // add the bounds handles
            jQuery.each(snapshotToolBoundsHandles,
                        function(i) {
                           viewer.drawer.addOverlay(snapshotToolBoundsHandles[i], snapshotToolBoundsHandlePositionsInPointsCoords[i], Seadragon.OverlayPlacement.CENTER);
                        });
            // ---------------------------------------------------------------------------------------------------------
            isSnapshotToolVisible = true;
         }
         else if (!willMakeVisible && isSnapshotToolVisible) {
            viewer.drawer.removeOverlay(snapshotToolBoundsSelector);
            jQuery.each(snapshotToolBoundsHandles,
                        function(i) {
                           viewer.drawer.removeOverlay(snapshotToolBoundsHandles[i]);
                        });
            if (Seadragon.Utils.getBrowser() != Seadragon.Browser.IE) {
               jQuery.each(snapshotToolShadedAreas,
                           function(i) {
                              viewer.drawer.removeOverlay(snapshotToolShadedAreas[i]);
                           });
            }

            isSnapshotToolVisible = false;
         }
      };
   };
   // ==================================================================================================================
   SnapshotBoundsMouseTracker.prototype = new DraggableWidgetMouseTracker(null, null);
   SnapshotBoundsMouseTracker.prototype.constructor = SnapshotBoundsMouseTracker;

   function SnapshotBoundsMouseTracker(element, viewer, handles, shadedAreas, handlePositionListener) {
      DraggableWidgetMouseTracker.call(this, element, viewer);
      this.theElement = element;
      this.handles = handles;
      this.handlePositionListener = handlePositionListener;

      this.pressHandlerSuper = this.pressHandler;
      this.pressHandler = function(tracker, position) {
         this.pressHandlerSuper.apply(this, arguments);
         this.theElement.className = "snapshot_tool_bounds_selector_active";
      };

      this.dragHandler = function(tracker, position, delta, shift) {
         this.elementLocationInPixelCoords = this.elementLocationInPixelCoords.plus(delta);

         var originalLocationInPointsCoords = viewer.viewport.pointFromPixel(this.elementLocationInPixelCoords);
         var dimensionsInPixelCoords = Seadragon.Utils.getElementSize(this.theElement);
         var dimensionsInPointsCoords = viewer.viewport.deltaPointsFromPixels(dimensionsInPixelCoords);
         var halfDimensionsInPixelCoords = dimensionsInPixelCoords.divide(2);
         var halfDimensionsInPointsCoords = viewer.viewport.deltaPointsFromPixels(halfDimensionsInPixelCoords);

         var topLeftInPointsCoords = originalLocationInPointsCoords.minus(halfDimensionsInPointsCoords);

         // now make sure we're still within the bounds of the image
         if (this.getPointsCoordinatesRangeRect()) {
            var topLeftAllowed = this.getPointsCoordinatesRangeRect().getTopLeft();
            var bottomRightAllowed = this.getPointsCoordinatesRangeRect().getBottomRight();
            if (topLeftInPointsCoords.x < topLeftAllowed.x) {
               topLeftInPointsCoords.x = topLeftAllowed.x;
            }
            if (topLeftInPointsCoords.x + dimensionsInPointsCoords.x > bottomRightAllowed.x) {
               topLeftInPointsCoords.x = bottomRightAllowed.x - dimensionsInPointsCoords.x;
            }
            if (topLeftInPointsCoords.y < topLeftAllowed.y) {
               topLeftInPointsCoords.y = topLeftAllowed.y;
            }
            if (topLeftInPointsCoords.y + dimensionsInPointsCoords.y > bottomRightAllowed.y) {
               topLeftInPointsCoords.y = bottomRightAllowed.y - dimensionsInPointsCoords.y;
            }
         }

         var boundsRectInPointsCoords = new Seadragon.Rect(
               topLeftInPointsCoords.x,
               topLeftInPointsCoords.y,
               dimensionsInPointsCoords.x,
               dimensionsInPointsCoords.y);
         this.viewer.drawer.updateOverlay(this.theElement, boundsRectInPointsCoords);

         //update the movement for all the handles
         var boundsHandlePositions = new Array(8);
         boundsHandlePositions[0] = topLeftInPointsCoords;  // top left
         boundsHandlePositions[1] = topLeftInPointsCoords.plus(new Seadragon.Point(halfDimensionsInPointsCoords.x, 0));  // top edge
         boundsHandlePositions[2] = topLeftInPointsCoords.plus(new Seadragon.Point(dimensionsInPointsCoords.x, 0));  // top right
         boundsHandlePositions[3] = topLeftInPointsCoords.plus(new Seadragon.Point(dimensionsInPointsCoords.x, halfDimensionsInPointsCoords.y)); // right edge
         boundsHandlePositions[4] = topLeftInPointsCoords.plus(dimensionsInPointsCoords);  // bottom right
         boundsHandlePositions[5] = topLeftInPointsCoords.plus(new Seadragon.Point(halfDimensionsInPointsCoords.x, dimensionsInPointsCoords.y)); // bottom edge
         boundsHandlePositions[6] = topLeftInPointsCoords.plus(new Seadragon.Point(0, dimensionsInPointsCoords.y));  // bottom left
         boundsHandlePositions[7] = topLeftInPointsCoords.plus(new Seadragon.Point(0, halfDimensionsInPointsCoords.y)); // left edge
         for (var i = 0; i < handles.length; i++) {
            this.viewer.drawer.updateOverlay(
                  this.handles[i],
                  boundsHandlePositions[i],
                  Seadragon.OverlayPlacement.CENTER);
         }

         // update shaded areas
         if (Seadragon.Utils.getBrowser() != Seadragon.Browser.IE) {
            viewer.drawer.updateOverlay(shadedAreas[0], determineShadedAreaRect(0, boundsRectInPointsCoords));
            viewer.drawer.updateOverlay(shadedAreas[1], determineShadedAreaRect(1, boundsRectInPointsCoords));
            viewer.drawer.updateOverlay(shadedAreas[2], determineShadedAreaRect(2, boundsRectInPointsCoords));
            viewer.drawer.updateOverlay(shadedAreas[3], determineShadedAreaRect(3, boundsRectInPointsCoords));
         }

         // notify the listener (if any) of the change in the bounds handle positions
         if (this.handlePositionListener) {
            this.handlePositionListener(boundsHandlePositions);
         }
      };

      this.releaseHandlerSuper = this.releaseHandler;
      this.releaseHandler = function(tracker, position, insideElmtPress, insideElmtRelease) {
         this.releaseHandlerSuper.apply(this, arguments);
         this.theElement.className = "snapshot_tool_bounds_selector";
      };
   }

   // ==================================================================================================================
   SnapshotBoundsHandleMouseTracker.prototype = new DraggableWidgetMouseTracker(null, null);
   SnapshotBoundsHandleMouseTracker.prototype.constructor = SnapshotBoundsHandleMouseTracker;

   function SnapshotBoundsHandleMouseTracker(activeHandleIndex, oppositeHandleIndex, handleElements, viewer, shadedAreas, bounds, handlePositionListener, willConstrainSnapshotAspectRatio, snapshotAspectRatio) {
      DraggableWidgetMouseTracker.call(this, handleElements[activeHandleIndex], viewer);
      this.activeHandleIndex = activeHandleIndex;
      this.oppositeHandleIndex = oppositeHandleIndex;
      this.handleElements = handleElements;
      this.activeHandleElement = handleElements[activeHandleIndex];
      this.oppositeHandleElement = handleElements[oppositeHandleIndex];
      this.bounds = bounds;
      this.handlePositionListener = handlePositionListener;
      this.willConstrainSnapshotAspectRatio = willConstrainSnapshotAspectRatio;
      this.snapshotAspectRatio = snapshotAspectRatio;
      this.boundRectMinWidthInPixels = 20;
      this.boundRectMinHeightInPixels = 20;
      this.cumulativeDelta = null;

      this.xSign = [-1, 0, 1, 1, 1, 0, -1, -1][activeHandleIndex];
      this.ySign = [-1, -1, -1, 0, 1, 1, 1, 0][activeHandleIndex];
      this.isDraggingTopOrBottomEdge = (this.xSign == 0);
      this.isDraggingLeftOrRightEdge = (this.ySign == 0);

      // adjust the min width or min height of the bounding rect according to
      // whether the aspect ratio is wider than it is tall or taller than it is wide
      if (this.willConstrainSnapshotAspectRatio) {
         if (this.snapshotAspectRatio >= 1) {
            this.boundRectMinWidthInPixels = this.snapshotAspectRatio * this.boundRectMinHeightInPixels;
         }
         else {
            this.boundRectMinHeightInPixels = this.boundRectMinHeightInPixels / this.snapshotAspectRatio;
         }
      }

      this.computeSign = function(v1, v2) {
         if (v1 - v2 < 0) {
            return -1;
         }
         else if (v1 - v2 > 0) {
            return 1;
         }
         return 0;
      };

      this.pressHandlerSuper = this.pressHandler;
      this.pressHandler = function(tracker, position) {
         this.pressHandlerSuper.apply(this, arguments);
         this.activeHandleElement.className = "snapshot_tool_bounds_handle_active";

         this.activeHandleElementInPixelCoords = this.getCenterPointOfElementInPixelCoords(this.activeHandleElement);
         this.oppositeHandleElementInPixelCoords = this.getCenterPointOfElementInPixelCoords(this.oppositeHandleElement);

         this.cumulativeDelta = new Seadragon.Point(0, 0);

         this.originalActiveHandleElementPositionInPixelCoords = new Seadragon.Point(
               this.activeHandleElementInPixelCoords.x,
               this.activeHandleElementInPixelCoords.y
         );
         this.mousePositionInPixelCoords = new Seadragon.Point(
               this.originalActiveHandleElementPositionInPixelCoords.x,
               this.originalActiveHandleElementPositionInPixelCoords.y
         );
      };

      this.dragHandlerSuper = this.dragHandler;
      this.dragHandler = function(tracker, position, delta, shift) {
         this.cumulativeDelta = this.cumulativeDelta.plus(delta);
         this.mousePositionInPixelCoords = this.originalActiveHandleElementPositionInPixelCoords.plus(this.cumulativeDelta);

         // make sure the mouse is within the bounds of the panorama
         var gigapanBoundsInPointsCoords = SeadragonUtils.convertGigapanRectToSeadragonRect(0, 0, gigapanWidth, gigapanHeight, gigapanWidth);
         var gigapanTopLeftBounds = viewer.viewport.pixelFromPoint(gigapanBoundsInPointsCoords.getTopLeft());
         var gigapanBottomRightBounds = viewer.viewport.pixelFromPoint(gigapanBoundsInPointsCoords.getBottomRight());
         var topLeftBounds = viewer.viewport.pixelFromPoint(gigapanBoundsInPointsCoords.getTopLeft());
         var bottomRightBounds = viewer.viewport.pixelFromPoint(gigapanBoundsInPointsCoords.getBottomRight());
         if (this.willConstrainSnapshotAspectRatio) {
            if (this.isDraggingTopOrBottomEdge) {
               var lengthToEdge = Math.min(this.oppositeHandleElementInPixelCoords.x - topLeftBounds.x, bottomRightBounds.x - this.oppositeHandleElementInPixelCoords.x);
               var maxHeight = lengthToEdge / this.snapshotAspectRatio * 2;
               topLeftBounds.y = Math.max(topLeftBounds.y, this.oppositeHandleElementInPixelCoords.y - maxHeight);
               bottomRightBounds.y = Math.min(bottomRightBounds.y, this.oppositeHandleElementInPixelCoords.y + maxHeight);
            }
            else if (this.isDraggingLeftOrRightEdge) {
               var lengthToEdge = Math.min(this.oppositeHandleElementInPixelCoords.y - topLeftBounds.y, bottomRightBounds.y - this.oppositeHandleElementInPixelCoords.y);
               var maxWidth = lengthToEdge * this.snapshotAspectRatio * 2;
               topLeftBounds.x = Math.max(topLeftBounds.x, this.oppositeHandleElementInPixelCoords.x - maxWidth);
               bottomRightBounds.x = Math.min(bottomRightBounds.x, this.oppositeHandleElementInPixelCoords.x + maxWidth);
            }
            else {
               if (this.originalActiveHandleElementPositionInPixelCoords.x > this.oppositeHandleElementInPixelCoords.x) {
                  bottomRightBounds.y = Math.min(bottomRightBounds.y, this.oppositeHandleElementInPixelCoords.y + (gigapanBottomRightBounds.x - this.oppositeHandleElementInPixelCoords.x) / this.snapshotAspectRatio);
                  topLeftBounds.y = Math.max(topLeftBounds.y, this.oppositeHandleElementInPixelCoords.y - (gigapanBottomRightBounds.x - this.oppositeHandleElementInPixelCoords.x) / this.snapshotAspectRatio);
               }
               else {
                  bottomRightBounds.y = Math.min(bottomRightBounds.y, this.oppositeHandleElementInPixelCoords.y - (gigapanTopLeftBounds.x - this.oppositeHandleElementInPixelCoords.x) / this.snapshotAspectRatio);
                  topLeftBounds.y = Math.max(topLeftBounds.y, this.oppositeHandleElementInPixelCoords.y + (gigapanTopLeftBounds.x - this.oppositeHandleElementInPixelCoords.x) / this.snapshotAspectRatio);
               }
               if (this.originalActiveHandleElementPositionInPixelCoords.y > this.oppositeHandleElementInPixelCoords.y) {
                  bottomRightBounds.x = Math.min(bottomRightBounds.x, this.oppositeHandleElementInPixelCoords.x + (gigapanBottomRightBounds.y - this.oppositeHandleElementInPixelCoords.y) * this.snapshotAspectRatio);
                  topLeftBounds.x = Math.max(topLeftBounds.x, this.oppositeHandleElementInPixelCoords.x - (gigapanBottomRightBounds.y - this.oppositeHandleElementInPixelCoords.y) * this.snapshotAspectRatio);
               }
               else {
                  bottomRightBounds.x = Math.min(bottomRightBounds.x, this.oppositeHandleElementInPixelCoords.x - (gigapanTopLeftBounds.y - this.oppositeHandleElementInPixelCoords.y) * this.snapshotAspectRatio);
                  topLeftBounds.x = Math.max(topLeftBounds.x, this.oppositeHandleElementInPixelCoords.x + (gigapanTopLeftBounds.y - this.oppositeHandleElementInPixelCoords.y) * this.snapshotAspectRatio);
               }
            }
         }
         if (this.originalActiveHandleElementPositionInPixelCoords.x > this.oppositeHandleElementInPixelCoords.x) {
            topLeftBounds.x = Math.max(topLeftBounds.x, this.oppositeHandleElementInPixelCoords.x);
         }
         else {
            bottomRightBounds.x = Math.min(bottomRightBounds.x, this.oppositeHandleElementInPixelCoords.x);
         }
         if (this.originalActiveHandleElementPositionInPixelCoords.y > this.oppositeHandleElementInPixelCoords.y) {
            topLeftBounds.y = Math.max(topLeftBounds.y, this.oppositeHandleElementInPixelCoords.y);
         }
         else {
            bottomRightBounds.y = Math.min(bottomRightBounds.y, this.oppositeHandleElementInPixelCoords.y);
         }
         var targetPositionInPixelCoords = new Seadragon.Point(
               Math.min(Math.max(this.mousePositionInPixelCoords.x, topLeftBounds.x), bottomRightBounds.x),
               Math.min(Math.max(this.mousePositionInPixelCoords.y, topLeftBounds.y), bottomRightBounds.y)
         );

         // get the current bounds
         var currentBoundsDimesionsInPixels = Seadragon.Utils.getElementSize(bounds);

         // compute new desired dimensions of the bounding box (correcting them if dragging on an edge)
         var desiredDimensions = this.oppositeHandleElementInPixelCoords.minus(targetPositionInPixelCoords).apply(Math.abs);
         if (this.isDraggingTopOrBottomEdge) {
            desiredDimensions.x = currentBoundsDimesionsInPixels.x;
         }
         else if (this.isDraggingLeftOrRightEdge) {
            desiredDimensions.y = currentBoundsDimesionsInPixels.y;
         }

         // adjust the desired dimensions to the desired aspect ratio, if necessary
         if (this.willConstrainSnapshotAspectRatio) {
            if (this.isDraggingTopOrBottomEdge) {
               desiredDimensions.x = desiredDimensions.y * this.snapshotAspectRatio;
            }
            else if (this.isDraggingLeftOrRightEdge) {
               desiredDimensions.y = desiredDimensions.x / this.snapshotAspectRatio;
            }
            else {
               // Compute the two possible dimensions which conform to the desired aspect ratio, then pick the one
               // that works.  The one that works will equal the desired dimension along one axis and be greater
               // along the other axis.
               var possibleDimensions1 = new Seadragon.Point(desiredDimensions.x, desiredDimensions.x / this.snapshotAspectRatio);
               var possibleDimensions2 = new Seadragon.Point(desiredDimensions.y * this.snapshotAspectRatio, desiredDimensions.y);
               desiredDimensions = (possibleDimensions1.y >= desiredDimensions.y) ? possibleDimensions1 : possibleDimensions2;
            }
         }

         // make sure bounding box isn't too small.
         desiredDimensions.x = Math.max(this.boundRectMinWidthInPixels, desiredDimensions.x);
         desiredDimensions.y = Math.max(this.boundRectMinHeightInPixels, desiredDimensions.y);

         // compute the top-left and bottom-right corners of the bounding box
         var topLeftCornerInPixelCoords = null;
         var bottomRightCornerInPixelCoords = null;
         if (this.isDraggingTopOrBottomEdge) {
            // update the position of the active handle element
            this.activeHandleElementInPixelCoords.y = this.oppositeHandleElementInPixelCoords.y + this.ySign * desiredDimensions.y;

            var halfWidth = desiredDimensions.x / 2;
            topLeftCornerInPixelCoords = new Seadragon.Point(
                        this.oppositeHandleElementInPixelCoords.x - halfWidth,
                        Math.min(this.activeHandleElementInPixelCoords.y, this.oppositeHandleElementInPixelCoords.y)
            );
            bottomRightCornerInPixelCoords = new Seadragon.Point(
                        this.oppositeHandleElementInPixelCoords.x + halfWidth,
                        Math.max(this.activeHandleElementInPixelCoords.y, this.oppositeHandleElementInPixelCoords.y)
            );
         }
         else if (this.isDraggingLeftOrRightEdge) {
            // update the position of the active handle element
            this.activeHandleElementInPixelCoords.x = this.oppositeHandleElementInPixelCoords.x + this.xSign * desiredDimensions.x;

            var halfHeight = desiredDimensions.y / 2;
            topLeftCornerInPixelCoords = new Seadragon.Point(
                  Math.min(this.activeHandleElementInPixelCoords.x, this.oppositeHandleElementInPixelCoords.x),
                  this.oppositeHandleElementInPixelCoords.y - halfHeight
            );
            bottomRightCornerInPixelCoords = new Seadragon.Point(
                  Math.max(this.activeHandleElementInPixelCoords.x, this.oppositeHandleElementInPixelCoords.x),
                  this.oppositeHandleElementInPixelCoords.y + halfHeight
            );
         }
         else {
            // update the position of the active handle element
            this.activeHandleElementInPixelCoords.x = this.oppositeHandleElementInPixelCoords.x + this.xSign * desiredDimensions.x;
            this.activeHandleElementInPixelCoords.y = this.oppositeHandleElementInPixelCoords.y + this.ySign * desiredDimensions.y;

            topLeftCornerInPixelCoords = new Seadragon.Point(
                  Math.min(this.activeHandleElementInPixelCoords.x, this.oppositeHandleElementInPixelCoords.x),
                  Math.min(this.activeHandleElementInPixelCoords.y, this.oppositeHandleElementInPixelCoords.y)
            );
            bottomRightCornerInPixelCoords = new Seadragon.Point(
                  Math.max(this.activeHandleElementInPixelCoords.x, this.oppositeHandleElementInPixelCoords.x),
                  Math.max(this.activeHandleElementInPixelCoords.y, this.oppositeHandleElementInPixelCoords.y)
            );
         }

         // ensuring the bounding box was not too small may have moved it outside the bounds of the
         // panorama.  If this is the case, we exit right now without updating anything
         if (this.activeHandleElementInPixelCoords.x < gigapanTopLeftBounds.x
                   || this.activeHandleElementInPixelCoords.y < gigapanTopLeftBounds.y
                   || this.activeHandleElementInPixelCoords.x > gigapanBottomRightBounds.x
               || this.activeHandleElementInPixelCoords.y > gigapanBottomRightBounds.y) {
            return;
         }

         // call the parent method, now that we are sure we are updating
         this.dragHandlerSuper.apply(this, arguments);

         // update the position of the bounds rect
         var topLeftInPointsCoords = this.viewer.viewport.pointFromPixel(topLeftCornerInPixelCoords);
         var boundsDimensionsInPointsCoords = viewer.viewport.deltaPointsFromPixels(bottomRightCornerInPixelCoords.minus(topLeftCornerInPixelCoords));
         var boundsRectInPointsCoords = new Seadragon.Rect(
               topLeftInPointsCoords.x,
               topLeftInPointsCoords.y,
               boundsDimensionsInPointsCoords.x,
               boundsDimensionsInPointsCoords.y
         );
         this.viewer.drawer.updateOverlay(this.bounds, boundsRectInPointsCoords);

         // update the positions of all the handles
         var halfBoundsDimensionsInPointsCoords = boundsDimensionsInPointsCoords.divide(2);
         var boundsCenterInPointsCoords = topLeftInPointsCoords.plus(halfBoundsDimensionsInPointsCoords);
         var boundsHandlePositions = new Array(8);
         boundsHandlePositions[0] = topLeftInPointsCoords;  // top left
         boundsHandlePositions[1] = boundsCenterInPointsCoords.minus(new Seadragon.Point(0, halfBoundsDimensionsInPointsCoords.y));  // top edge
         boundsHandlePositions[2] = boundsCenterInPointsCoords.plus(new Seadragon.Point(halfBoundsDimensionsInPointsCoords.x, -halfBoundsDimensionsInPointsCoords.y));  // top right
         boundsHandlePositions[3] = boundsCenterInPointsCoords.plus(new Seadragon.Point(halfBoundsDimensionsInPointsCoords.x, 0)); // right edge
         boundsHandlePositions[4] = boundsCenterInPointsCoords.plus(halfBoundsDimensionsInPointsCoords);  // bottom right
         boundsHandlePositions[5] = boundsCenterInPointsCoords.plus(new Seadragon.Point(0, halfBoundsDimensionsInPointsCoords.y)); // bottom edge
         boundsHandlePositions[6] = boundsCenterInPointsCoords.plus(new Seadragon.Point(-halfBoundsDimensionsInPointsCoords.x, halfBoundsDimensionsInPointsCoords.y));  // bottom left
         boundsHandlePositions[7] = boundsCenterInPointsCoords.minus(new Seadragon.Point(halfBoundsDimensionsInPointsCoords.x, 0)); // left edge
         for (var i = 0; i < this.handleElements.length; i++) {
            this.viewer.drawer.updateOverlay(
                  this.handleElements[i],
                  boundsHandlePositions[i],
                  Seadragon.OverlayPlacement.CENTER);
         }

         // update shaded areas
         if (Seadragon.Utils.getBrowser() != Seadragon.Browser.IE) {
            viewer.drawer.updateOverlay(shadedAreas[0], determineShadedAreaRect(0, boundsRectInPointsCoords));
            viewer.drawer.updateOverlay(shadedAreas[1], determineShadedAreaRect(1, boundsRectInPointsCoords));
            viewer.drawer.updateOverlay(shadedAreas[2], determineShadedAreaRect(2, boundsRectInPointsCoords));
            viewer.drawer.updateOverlay(shadedAreas[3], determineShadedAreaRect(3, boundsRectInPointsCoords));
         }

         // notify the listener (if any) of the change in the bounds handle positions
         if (this.handlePositionListener) {
            this.handlePositionListener(boundsHandlePositions);
         }
      };

      this.releaseHandlerSuper = this.releaseHandler;
      this.releaseHandler = function(tracker, position, insideElmtPress, insideElmtRelease) {
         this.releaseHandlerSuper.apply(this, arguments);
         this.activeHandleElement.className = "snapshot_tool_bounds_handle";
         this.cumulativeDelta = new Seadragon.Point(0, 0);
      };
   }

   // ==================================================================================================================
})();

// ==================================================================================================================
DraggableWidgetMouseTracker.prototype = new Seadragon.MouseTracker();
DraggableWidgetMouseTracker.prototype.constructor = DraggableWidgetMouseTracker;

function DraggableWidgetMouseTracker(element, viewer) {
   Seadragon.MouseTracker.call(this, element);
   this.viewer = viewer;
   this.theElement = element;
   this.pointsCoordinatesRangeRect = null;

   // TODO: Move this to SeadragonUtils
   this.getCenterPointOfElementInPixelCoords = function(elmt) {
      var elementHalfDimensions = Seadragon.Utils.getElementSize(elmt).divide(2);

      var topLeftCorner = Seadragon.Utils.getElementPosition(elmt).minus(Seadragon.Utils.getElementPosition(this.viewer.elmt));

      return topLeftCorner.plus(elementHalfDimensions);
   };

   this.getCenterPointInSeadragonCoords = function() {
      return this.viewer.viewport.pointFromPixel(this.getCenterPointOfElementInPixelCoords(this.theElement));
   };

   this.pressHandler = function(tracker, position) {
      this.viewer.setMouseNavEnabled(false);

      // remember where the widget was originally drawn
      this.elementLocationInPixelCoords = this.getCenterPointOfElementInPixelCoords(this.theElement);
   };

   this.dragHandler = function(tracker, position, delta, shift) {
      // update the overlay's location by adding the delta
      this.elementLocationInPixelCoords = this.elementLocationInPixelCoords.plus(delta);

      // update the overlay
      this.viewer.drawer.updateOverlay(
            this.theElement,
            this.viewer.viewport.pointFromPixel(this.elementLocationInPixelCoords),
            Seadragon.OverlayPlacement.CENTER);
   };

   this.releaseHandler = function(tracker, position, insideElmtPress, insideElmtRelease) {
      if (!insideElmtPress) {
         return;         // ignore releases from outside
      }

      this.elementLocationInPixelCoords = null;

      this.viewer.setMouseNavEnabled(true);
   };

   // Defines the area in which the object controlled by this MouseTracker is allowed to move.
   this.setPointsCoordinatesRangeRect = function(pointsCoordinatesRangeRect) {
      this.pointsCoordinatesRangeRect = pointsCoordinatesRangeRect;
   };

   // Returns a Seadragon.Rect representing the area in which the object controlled by this MouseTracker is allowed to
   // move.  Coordinates are in Seadragon points.
   this.getPointsCoordinatesRangeRect = function() {
      return this.pointsCoordinatesRangeRect;
   };

   // Returns a Seadragon.Rect representing the area in which the object controlled by this MouseTracker is allowed to
   // move.  Coordinates are in pixels.
   this.getPixelCoordinatesRangeRect = function() {
      var topLeftInPointsCoords = this.viewer.viewport.pixelFromPoint(this.pointsCoordinatesRangeRect.getTopLeft());
      var bottomRightInPointsCoords = this.viewer.viewport.pixelFromPoint(this.pointsCoordinatesRangeRect.getBottomRight());
      return new Seadragon.Rect(
            topLeftInPointsCoords.x,
            topLeftInPointsCoords.y,
            bottomRightInPointsCoords.x - topLeftInPointsCoords.x,
            bottomRightInPointsCoords.y - topLeftInPointsCoords.y
      );
   };
}

// ==================================================================================================================

