//======================================================================================================================
// A class for managing events.
//
// Dependencies: none
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
if (!org.cmucreatelab) {
   org.cmucreatelab = {};
}
else {
   if (typeof org.cmucreatelab != "object") {
      var orgCmucreatelabExistsMessage = "Error: failed to create org.cmucreatelab namespace: org.cmucreatelab already exists and is not an object";
      alert(orgCmucreatelabExistsMessage);
      throw new Error(orgCmucreatelabExistsMessage);
   }
}

// Repeat the creation and type-checking for the next level
if (!org.cmucreatelab.events) {
   org.cmucreatelab.events = {};
}
else {
   if (typeof org.cmucreatelab.events != "object") {
      var orgCmucreatelabEventsExistsMessage = "Error: failed to create org.cmucreatelab.events namespace: org.cmucreatelab.events already exists and is not an object";
      alert(orgCmucreatelabEventsExistsMessage);
      throw new Error(orgCmucreatelabEventsExistsMessage);
   }
}
//======================================================================================================================

//======================================================================================================================
// CODE
//======================================================================================================================
(function() {
   org.cmucreatelab.events.EventManager = function() {
      var eventListeners = {};

      this.addEventListener = function(eventName, listener) {
         if (eventName && listener && typeof(listener) == "function") {
            if (!eventListeners[eventName]) {
               eventListeners[eventName] = [];
            }

            eventListeners[eventName].push(listener);
         }
      };

      this.removeEventListener = function(eventName, listener) {
         if (eventName && eventListeners[eventName] && listener && typeof(listener) == "function") {
            for (var i = 0; i < eventListeners[eventName].length; i++) {
               if (listener == eventListeners[eventName][i]) {
                  eventListeners[eventName].splice(i, 1);
                  return;
               }
            }
         }
      };

      // TODO: document me
      this.publishEvent = function(eventName) {
         if (eventName) {
            if (this.hasListenersFor(eventName)) {
               // build the array of arguments
               var args = [];
               for (var i = 1; i < arguments.length; i++) {
                  args.push(arguments[i]);
               }

               // notify listeners
               var listeners = eventListeners[eventName];
               for (var j = 0; j < listeners.length; j++) {
                  try {
                     listeners[j].apply(window, args);
                  }
                  catch (e) {
                     console.log(e.name + " while publishing event '" + eventName + "': " + e.message, e);
                  }
               }
            }
         }
      };

      this.hasListenersFor = function(eventName) {
         var listeners = eventListeners[eventName];
         return (typeof listeners !== 'undefined' && listeners.length > 0);
      };
   };
})();