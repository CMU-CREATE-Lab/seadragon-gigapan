//======================================================================================================================
// Class for tracking TouchEvent data.
//
// Dependencies:
// * org.cmucreatelab.util.Point
//
// Author: Chris Bartley (bartley@cmu.edu)
//======================================================================================================================

//======================================================================================================================
// VERIFY NAMESPACE
//======================================================================================================================
// Create the global symbol "org" if it doesn't exist.  Throw an error if it does exist but is not an object.
var org;
if (!org)
   {
   org = {};
   }
else
   {
   if (typeof org != "object")
      {
      var orgExistsMessage = "Error: failed to create org namespace: org already exists and is not an object";
      alert(orgExistsMessage);
      throw new Error(orgExistsMessage);
      }
   }

// Repeat the creation and type-checking for the next level
if (!org.cmucreatelab)
   {
   org.cmucreatelab = {};
   }
else
   {
   if (typeof org.cmucreatelab != "object")
      {
      var orgCmucreatelabExistsMessage = "Error: failed to create org.cmucreatelab namespace: org.cmucreatelab already exists and is not an object";
      alert(orgCmucreatelabExistsMessage);
      throw new Error(orgCmucreatelabExistsMessage);
      }
   }

// Repeat the creation and type-checking for the next level
if (!org.cmucreatelab.multitouch)
   {
   org.cmucreatelab.multitouch = {};
   }
else
   {
   if (typeof org.cmucreatelab.multitouch != "object")
      {
      var orgCmucreatelabMultitouchExistsMessage = "Error: failed to create org.cmucreatelab.multitouch namespace: org.cmucreatelab.multitouch already exists and is not an object";
      alert(orgCmucreatelabMultitouchExistsMessage);
      throw new Error(orgCmucreatelabMultitouchExistsMessage);
      }
   }
//======================================================================================================================

//======================================================================================================================
// DEPENDECIES
//======================================================================================================================
if (!org.cmucreatelab.util.Point)
   {
   var noPointMsg = "The org.cmucreatelab.util.Point library is required by org.cmucreatelab.multitouch.TouchManager.js";
   alert(noPointMsg);
   throw new Error(noPointMsg);
   }
//======================================================================================================================

//======================================================================================================================
// CODE
//======================================================================================================================
(function()
   {
   org.cmucreatelab.multitouch.Touch = function(touchEvent)
      {
      var startingTimestamp = new Date().getTime();
      var identifier = touchEvent['identifier'];
      var previousPoint = new org.cmucreatelab.util.Point(touchEvent['pageX'], touchEvent['pageY']);
      var currentPoint = new org.cmucreatelab.util.Point(touchEvent['pageX'], touchEvent['pageY']);
      var isThisTheOnlyTouch = true;

      this.update = function(touchEvent)
         {
         previousPoint.x = currentPoint.x;
         previousPoint.y = currentPoint.y;
         currentPoint.x = touchEvent['pageX'];
         currentPoint.y = touchEvent['pageY'];
         };

      this.getIdentifier = function()
         {
         return identifier;
         };

      this.getCurrentPoint = function()
         {
         return currentPoint;
         };

      this.getPreviousPoint = function()
         {
         return previousPoint;
         };

      this.getDeltaFromPrevious = function()
         {
         return previousPoint.minus(currentPoint);
         };

      this.getStartingTimestamp = function()
         {
         return startingTimestamp;
         };

      this.flagThisTouchAsNotBeingTheOnlyOne = function()
         {
         isThisTheOnlyTouch = false;
         };

      this.isThisTheOnlyTouch = function()
         {
         return isThisTheOnlyTouch;
         }
      };
   })();


