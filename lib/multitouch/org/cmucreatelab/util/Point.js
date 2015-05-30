//======================================================================================================================
// A class for representing a point.  This is a shameful and complete rip-off of the Seadragon.Point class, with the
// only addition being the midpoint(), toSeadragonPoint(), plusXY(), and minusXY() methods.  Otherwise all
// credit belongs to Microsoft.
//
// Dependencies:
// * Microsoft Seadragon Ajax (only if using the toSeadragonPoint() method)
//
// Authors: Microsoft Seadragon Ajax and Chris Bartley (bartley@cmu.edu)
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
if (!org.cmucreatelab.util)
   {
   org.cmucreatelab.util = {};
   }
else
   {
   if (typeof org.cmucreatelab.util != "object")
      {
      var orgCmucreatelabUtilExistsMessage = "Error: failed to create org.cmucreatelab.util namespace: org.cmucreatelab.util already exists and is not an object";
      alert(orgCmucreatelabUtilExistsMessage);
      throw new Error(orgCmucreatelabUtilExistsMessage);
      }
   }
//======================================================================================================================

//======================================================================================================================
// CODE
//======================================================================================================================
(function()
   {
   org.cmucreatelab.util.Point = function(x, y)
      {
      var self = this;
      this.x = typeof(x) == "number" ? x : 0;
      this.y = typeof(y) == "number" ? y : 0;

      this.plus = function(point)
         {
         return new org.cmucreatelab.util.Point(self.x + point.x, self.y + point.y);
         };

      this.plusXY = function(x, y)
         {
         return new org.cmucreatelab.util.Point(self.x + x, self.y + y);
         };

      this.minus = function(point)
         {
         return new org.cmucreatelab.util.Point(self.x - point.x, self.y - point.y);
         };

      this.minusXY = function(x, y)
         {
         return new org.cmucreatelab.util.Point(self.x - x, self.y - y);
         };

      this.times = function(factor)
         {
         return new org.cmucreatelab.util.Point(self.x * factor, self.y * factor);
         };

      this.divide = function(factor)
         {
         return new org.cmucreatelab.util.Point(self.x / factor, self.y / factor);
         };

      this.negate = function()
         {
         return new org.cmucreatelab.util.Point(-self.x, -self.y);
         };

      this.distanceTo = function(point)
         {
         return Math.sqrt(Math.pow(self.x - point.x, 2) +
                          Math.pow(self.y - point.y, 2));
         };

      this.apply = function(func)
         {
         return new org.cmucreatelab.util.Point(func(self.x), func(self.y));
         };

      this.equals = function(point)
         {
         return(point instanceof org.cmucreatelab.util.Point) && (self.x === point.x) && (self.y === point.y);
         };

      this.toString = function()
         {
         return"(" + self.x + "," + self.y + ")";
         };

      this.midpoint = function(point)
         {
         return new org.cmucreatelab.util.Point((self.x + point.x) / 2, (self.y + point.y) / 2);
         };

      this.toSeadragonPoint = function()
         {
         return new Seadragon.Point(self.x, self.y);
         };
      };
   })();


