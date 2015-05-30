//======================================================================================================================
// Class for tracking org.cmucreatelab.multitouch.Touch objects.
//
// Supported events:
// * tap(org.cmucreatelab.util.Point touchPoint,
//       int elapsedTouchTime,
//       Event event)
// * pan(org.cmucreatelab.util.Point pixelDeltaFromPrevious,
//       Event event)
// * pinch-start(org.cmucreatelab.multitouch.Touch touch1,
//               org.cmucreatelab.multitouch.Touch touch2,
//               org.cmucreatelab.util.Point pinchMidpoint,
//               Event event)
// * pinch(int scaleDeltaX,
//         int scaleDeltaY,
//         int scaleDeltaXY,
//         org.cmucreatelab.multitouch.Touch touch1,
//         org.cmucreatelab.multitouch.Touch touch2,
//         Event event)
//
// Dependencies:
// * org.cmucreatelab.util.Point
// * org.cmucreatelab.multitouch.Touch
// * org.cmucreatelab.events.EventManager.js
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
if (!org.cmucreatelab.multitouch.Touch)
   {
   var noTouchMsg = "The org.cmucreatelab.multitouch.Touch library is required by org.cmucreatelab.multitouch.TouchManager.js";
   alert(noTouchMsg);
   throw new Error(noTouchMsg);
   }
if (!org.cmucreatelab.events.EventManager)
   {
   var noEventManagerMsg = "The org.cmucreatelab.events.EventManager library is required by org.cmucreatelab.multitouch.TouchManager.js";
   alert(noEventManagerMsg);
   throw new Error(noEventManagerMsg);
   }
//======================================================================================================================

//======================================================================================================================
// CODE
//======================================================================================================================
(function()
   {
   var HASH_MAP_KEY_PREFIX = 't';

   org.cmucreatelab.multitouch.TouchManager = function()
      {
      var eventManager = new org.cmucreatelab.events.EventManager();
      var size = 0;  // need to keep track of size separately since touch is a hash map and you can't use the length param for hash maps
      var touches = [];
      var touchesForIPadWorkaround = [];
      var previousScaleX = 1;
      var previousScaleY = 1;
      var previousScaleXY = 1;
      var pinchMidpoint = null;
      var isTapEvent = false;

      // ===============================================================================================================
      // Public methods
      // ===============================================================================================================

      this.onTouchStart = function(event)
         {
         if (event)
            {
            event.preventDefault();

            // register the changed touch(es)
            var changedTouches = event['changedTouches'];
            for (var i = 0; i < changedTouches.length; i++)
               {
               registerTouch(changedTouches.item(i));
               }

            pinchStartHelper(event);
            }
         };

      this.onTouchStartMozilla = function(event)
         {
         if (event)
            {
            copyMozillaEventProperties(event);

            event.preventDefault();

            registerTouch(event);

            pinchStartHelper(event);
            }
         };

      this.onTouchMove = function(event)
         {
         if (event)
            {
            event.preventDefault();

            isTapEvent = false;

            // update the changed touch(es)
            var changedTouches = event['changedTouches'];
            for (var i = 0; i < changedTouches.length; i++)
               {
               updateTouch(changedTouches.item(i));
               }

            // handle panning if there's only 1 registered touch
            if (size == 1)
               {
               touchMovePanningHelper(changedTouches.item(0)['identifier'], event);
               }
            else if (size == 2) // handle pinch if there are 2 registered touches
               {
               touchMovePinchHelper(event);
               }
            }
         };

      this.onTouchMoveMozilla = function(event)
         {
         if (event)
            {
            event.preventDefault();

            copyMozillaEventProperties(event);

            // Firefox will continuously fire move events even when the location hasn't changed, so this code
            // checks for that and ignores the spurious events

            var touch = touches[getMapKey(event['identifier'])];

            if (typeof touch !== 'undefined' &&
                touch != null &&
                (touch.getCurrentPoint().x != event['pageX'] ||
                 touch.getCurrentPoint().y != event['pageY']))
               {
               isTapEvent = false;

               // update the changed touch
               event['pageX'] = event['layerX'];
               event['pageY'] = event['layerY'];
               event['identifier'] = event['streamId'];
               updateTouch(event);

               // handle panning if there's only 1 registered touch
               if (size == 1)
                  {
                  touchMovePanningHelper(event['identifier'], event);
                  }
               else if (size == 2) // handle pinch if there are 2 registered touches
                  {
                  touchMovePinchHelper(event);
                  }
               }
            }
         };

      this.onTouchEndOrCancel = function(event)
         {
         doTouchEndOrCancel(event);
         };

      this.onTouchEndMozilla = function(event)
         {
         if (event)
            {
            copyMozillaEventProperties(event);

            // unregister the touch
            unregisterTouch(event, false, event);
            }
         };

      // ===============================================================================================================
      // Private methods
      // ===============================================================================================================

      var getMapKey = function(touchEventIdentifier)
         {
         return HASH_MAP_KEY_PREFIX + touchEventIdentifier;
         };

      var getTouch = function(touchEventIdentifier)
         {
         return touches[getMapKey(touchEventIdentifier)];
         };

      var setTouch = function(newTouch)
         {
         touches[getMapKey(newTouch.getIdentifier())] = newTouch;
         size++;

         // flag the touches as not being unique if there's more than one (this is needed for tap detection)
         if (size > 1)
            {
            for (var key in touches)
               {
               var existingTouch = touches[key];
               if (existingTouch)
                  {
                  existingTouch.flagThisTouchAsNotBeingTheOnlyOne();
                  }
               }
            }

         // this might be the start of a tap event, so mark the flag true if this is the only tap currently registered
         isTapEvent = (!isTapEvent && size == 1);
         };

      var registerTouch = function(touchEvent)
         {
         if (touchEvent)
            {
            var touch = getTouch(touchEvent['identifier']);
            if (touch)
               {
               // A register could be triggered for a touch we're already tracking due to a bug in Safari/531.21.10 on
               // iPad (see https://devforums.apple.com/thread/54742).  So just treat it like an update.
               touch.update(touchEvent);
               }
            else
               {
               var mapKey = getMapKey(touchEvent['identifier']);
               touch = touchesForIPadWorkaround[mapKey];
               if (touch)
                  {
                  delete touchesForIPadWorkaround[mapKey];
                  setTouch(touch);
                  isTapEvent = false;
                  }
               else
                  {
                  setTouch(new org.cmucreatelab.multitouch.Touch(touchEvent));
                  }
               }
            }
         };

      var updateTouch = function(touchObj)
         {
         // a touch update means there was movement, so don't consider it a tap
         isTapEvent = false;

         if (touchObj)
            {
            var touch = getTouch(touchObj['identifier']);
            if (touch)
               {
               touch.update(touchObj);
               }
            else
               {
               // This can happen if the touch is initiated on an element which isn't listening for touch events, but
               // then moves on to an element that is. For now, just log a warning and treat it like a new registration.
               console.log("WARNING: registering touch that may have initiated on an element that isn't listening for touches!");
               setTouch(new org.cmucreatelab.multitouch.Touch(touchObj));
               }
            }
         };

      var unregisterTouch = function(touchObj, needsIPadWorkaround, event)
         {
         if (touchObj)
            {
            var touch = getTouch(touchObj['identifier']);
            if (touch)
               {
               var mapKey = getMapKey(touchObj['identifier']);

               // store this touch if we need to work around the iPad bug
               if (needsIPadWorkaround)
                  {
                  touchesForIPadWorkaround[mapKey] = touches[mapKey];
                  }
               delete touches[mapKey];
               size--;

               // if the size is now zero and the flag is still true and this was the only touch, then we've caught a tap!
               if (size == 0 && isTapEvent && touch.isThisTheOnlyTouch())
                  {
                  // compute the total time of the tap
                  var elapsedTouchTime = new Date().getTime() - touch.getStartingTimestamp();

                  // clone the point for publication to listeners
                  var currentTouchPoint = touch.getCurrentPoint();
                  var touchPoint = new org.cmucreatelab.util.Point(currentTouchPoint['x'], currentTouchPoint['y'])

                  // notify all tap handlers
                  eventManager.publishEvent('tap', touchPoint, elapsedTouchTime, event);
                  }
               }
            else
               {
               console.log("WARNING: unregistering unknown touch [" + touchObj['identifier'] + "]");
               }
            }

         // mark the tap event flag false
         isTapEvent = false;
         };

      var getTouchesAsArray = function()
         {
         var touchesArray = [];
         for (var key in touches)
            {
            touchesArray[touchesArray.length] = touches[key];
            }

         return touchesArray;
         };

      var pinchStartHelper = function(event)
         {
         if (size == 2)
            {
            // reset pinch params
            previousScaleX = 1;
            previousScaleY = 1;
            previousScaleXY = 1;
            pinchMidpoint = null;

            var theTouches = getTouchesAsArray();

            if (theTouches[0] && theTouches[1])
               {
               // We now need to add the scale and distance properties to the two events.  Distance will be in pixel
               // units and the scale is the distance between two fingers since the start of an event as a multiplier of
               // the initial distance.  We'll update both distance and scale in every touchMove event. The initial
               // value of scale is 1.0.  If less than 1.0 the gesture is pinch close to zoom out.  If greater than 1.0
               // the gesture is pinch open to zoom in.
               var currentPoint0 = theTouches[0].getCurrentPoint();
               var currentPoint1 = theTouches[1].getCurrentPoint();
               var distanceX = Math.abs(currentPoint0.x - currentPoint1.x);
               var distanceY = Math.abs(currentPoint0.y - currentPoint1.y);
               var distanceXY = currentPoint0.distanceTo(currentPoint1);
               var scaleX = 1;
               var scaleY = 1;
               var scaleXY = 1;

               theTouches[0]['distanceX'] = distanceX;
               theTouches[0]['distanceY'] = distanceY;
               theTouches[0]['distanceXY'] = distanceXY;
               theTouches[0]['scaleX'] = scaleX;
               theTouches[0]['scaleY'] = scaleY;
               theTouches[0]['scaleXY'] = scaleXY;
               theTouches[1]['distanceX'] = distanceX;
               theTouches[1]['distanceY'] = distanceY;
               theTouches[1]['distanceXY'] = distanceXY;
               theTouches[1]['scaleX'] = scaleX;
               theTouches[1]['scaleY'] = scaleY;
               theTouches[1]['scaleXY'] = scaleXY;

               // compute the midPoint
               var theMidpoint = currentPoint0.midpoint(currentPoint1);

               // notify all pinch handlers
               eventManager.publishEvent('pinch-start', theTouches[0], theTouches[1], theMidpoint, event);
               }
            }
         };

      var touchMovePanningHelper = function(touchIdentifier, event)
         {
         // handle panning if there's only 1 registered touch
         if (size == 1)
            {
            var touch = touches[getMapKey(touchIdentifier)];
            if (touch)
               {
               var pixelDeltaFromPrevious = touch.getDeltaFromPrevious();

               // notify all pan handlers
               eventManager.publishEvent('pan', pixelDeltaFromPrevious, event);
               }
            }
         };

      var touchMovePinchHelper = function(event)
         {
         if (size == 2) // handle pinch if there are 2 registered touches
            {
            // update touch distance and scale, so the pinchGestureHelper will work
            var theTouches = getTouchesAsArray();
            if (theTouches[0] && theTouches[1])
               {
               var currentPoint0 = theTouches[0].getCurrentPoint();
               var currentPoint1 = theTouches[1].getCurrentPoint();

               var previousDistanceX = theTouches[0]['distanceX'];
               var previousDistanceY = theTouches[0]['distanceY'];
               var previousDistanceXY = theTouches[0]['distanceXY'];
               var newDistanceX = Math.abs(currentPoint0.x - currentPoint1.x);
               var newDistanceY = Math.abs(currentPoint0.y - currentPoint1.y);
               var newDistanceXY = currentPoint0.distanceTo(currentPoint1);
               var scaleX = newDistanceX / previousDistanceX;
               var scaleY = newDistanceY / previousDistanceY;
               var scaleXY = newDistanceXY / previousDistanceXY;

               theTouches[0]['scaleX'] = scaleX;
               theTouches[0]['scaleY'] = scaleY;
               theTouches[0]['scaleXY'] = scaleXY;
               theTouches[1]['scaleX'] = scaleX;
               theTouches[1]['scaleY'] = scaleY;
               theTouches[1]['scaleXY'] = scaleXY;

               // compute the zoom scale difference and then clamp it to within [.8, 1.2]
               var scaleDeltaX = 1 + scaleX - previousScaleX;
               var scaleDeltaY = 1 + scaleY - previousScaleY;
               var scaleDeltaXY = 1 + scaleXY - previousScaleXY;

               // notify all pinch handlers
               eventManager.publishEvent('pinch', scaleDeltaX, scaleDeltaY, scaleDeltaXY, theTouches[0], theTouches[1], event);

               previousScaleX = scaleX;
               previousScaleY = scaleY;
               previousScaleXY = scaleXY;
               }
            else
               {
               console.log("ERROR: 2 registered touches, but getTouchesAsArray() failed to return both!");
               }
            }
         };

      var doTouchEndOrCancel = function(event)
         {
         if (event)
            {
            // unregister the changed touch(es)
            var changedTouches = event['changedTouches'];

            // NOTE: there's apparently a bug in Safari/531.21.10 on iPad (see https://devforums.apple.com/thread/54742)
            // which causes all touches to be considered changedTouches when more than one finger is touching and one
            // is removed.  Crap.
            var needsIPadWorkaround = (changedTouches.length > 1);
            if (needsIPadWorkaround)
               {
               isTapEvent = false;
               }

            for (var i = 0; i < changedTouches.length; i++)
               {
               unregisterTouch(changedTouches.item(i), needsIPadWorkaround, event);
               }
            }
         };

      // Mozilla uses different names for some properties, so this code makes sure the ones we're interested in exist.
      var copyMozillaEventProperties = function(event)
         {
         if (event)
            {
            event['pageX'] = event['layerX'];
            event['pageY'] = event['layerY'];
            event['identifier'] = event['streamId'];
            }
         };

      this.addEventListener = eventManager.addEventListener;
      this.removeEventListener = eventManager.removeEventListener;
      this.publishEvent = eventManager.publishEvent;
      };
   })();


