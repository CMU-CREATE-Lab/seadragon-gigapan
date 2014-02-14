//======================================================================================================================
// Some utilities for working with gigapans.
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
//======================================================================================================================

//======================================================================================================================
// CODE
//======================================================================================================================
(function() {
   org.gigapan.GigapanUtils = function() {
   };

   /**
    * Creates the tile server URL prefix for gigapan with the given ID and (optionally) auth key.
    * @param id the ID of the gigapan (required)
    * @param authKey the auth key of the gigapan (optional)
    * @returns {string} the tile server URL prefix
    */
   org.gigapan.GigapanUtils.createTileSourceUrlPrefixForGigapan = function(id, authKey) {
      // compute the index of the tile server for this gigapan (note: this may change in the future, perhaps without warning!)
      var tileServerIndex = '' + Math.floor(id / 1000);
      if (tileServerIndex.length < 2) {
         tileServerIndex = '0' + tileServerIndex;
      }

      var urlPrefix = "http://tile" + tileServerIndex + ".gigapan.org/gigapans0/" + gigapan.id + "/tiles";

      if (typeof authKey !== 'undefined' && authKey != null && authKey.length > 0) {
         urlPrefix += "." + authKey;
      }

      return urlPrefix;
   };
})();
//======================================================================================================================
