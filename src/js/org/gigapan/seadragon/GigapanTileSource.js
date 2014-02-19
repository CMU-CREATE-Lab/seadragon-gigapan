//======================================================================================================================
// A Seadragon.TileSource for displaying gigapans.  Based on code by Jason Buchheim.
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
   var noSeadragonMsg = "The Seadragon library is required by org.gigapan.seadragon.GigapanTileSource.js";
   alert(noSeadragonMsg);
   throw new Error(noSeadragonMsg);
}
//======================================================================================================================

//======================================================================================================================
// CODE
//======================================================================================================================
(function() {
   org.gigapan.seadragon.GigapanTileSource = function(urlPrefix, width, height) {
      Seadragon.TileSource.call(this, width, height, 256, 0, 8);

      var GC_TILE = ["0", "1", "2", "3"];

      this.getTileUrl = function(level, x, y) {
         if (level < 8) {
            level = 0;
         }
         else {
            if (level >= 8) {
               level = level - 8;
            }
         }
         var name = "r";
         var bit = 1 << level >> 1;
         while (bit) {
            name = name + GC_TILE[(x & bit ? (1) : (0)) + (y & bit ? (2) : (0))];
            bit = bit >> 1;
         }

         var url = urlPrefix;

         // make sure the URL doesn't end with a slash
         if (urlPrefix != null && urlPrefix.indexOf('/', urlPrefix.length - 1) !== -1) {
            url = urlPrefix.substr(0, urlPrefix.length - 1);
         }

         var i = 0;
         while (i < name.length - 3) {
            url = url + ("/" + name.substr(i, 3));
            i = i + 3;
         }
         return (url + "/" + name + '.jpg');
      };

      this.getTileBounds = function(level, x, y) {
         var self = this;
         var dimensionsScaled = self.dimensions.times(self.getLevelScale(level));
         var px = (x === 0) ? 0 : self.tileSize * x - self.tileOverlap;
         var py = (y === 0) ? 0 : self.tileSize * y - self.tileOverlap;
         var sx = self.tileSize + (x === 0 ? 1 : 2) * self.tileOverlap;
         var sy = self.tileSize + (y === 0 ? 1 : 2) * self.tileOverlap;
         var scale = 1.0 / dimensionsScaled.x;
         return new Seadragon.Rect(px * scale, py * scale, sx * scale, sy * scale);
      };

      org.gigapan.seadragon.GigapanTileSource.prototype = new Seadragon.TileSource();
      org.gigapan.seadragon.GigapanTileSource.prototype.constructor = org.gigapan.seadragon.GigapanTileSource;
   };
})();
