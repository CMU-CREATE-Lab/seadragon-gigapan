describe("GigapanUtils", function() {
   var GigapanUtils = org.gigapan.GigapanUtils;

   describe("when the id is undefined", function() {
      it("createTileSourceUrlPrefixForGigapan should throw a TypeError", function() {
         expect(function() {
            GigapanUtils.createTileSourceUrlPrefixForGigapan();
         }).toThrow();
      });
   });

   describe("when the id is null", function() {
      it("createTileSourceUrlPrefixForGigapan should throw a TypeError", function() {
         expect(function() {
            GigapanUtils.createTileSourceUrlPrefixForGigapan(null);
         }).toThrow();
      });
   });

   describe("when the id is not an positive integer", function() {
      it("createTileSourceUrlPrefixForGigapan should throw a TypeError", function() {
         var invalidIds = [-10, -1, 0, "", true, false, "bubba", {}, []];
         for (var i = 0; i < invalidIds.length; i++) {
            var id = invalidIds[i];
            expect(function() {
               GigapanUtils.createTileSourceUrlPrefixForGigapan(id);
            }).toThrow();
         }
      });
   });

   describe("when the id is valid", function() {
      var idToTileN = {456 : "00", 1000 : "01", 2000 : "02", 10000 : "10", 123456 : "123"};
      describe("and the authKey is undefined", function() {
         it("createTileSourceUrlPrefixForGigapan should return a valid URL", function() {
            for (var id in idToTileN) {
               var tileN = idToTileN[id];
               expect(GigapanUtils.createTileSourceUrlPrefixForGigapan(id)).toBe("http://tile" + tileN + ".gigapan.org/gigapans0/" + id + "/tiles");
            }
         });
      });
      describe("and the authKey is null", function() {
         it("createTileSourceUrlPrefixForGigapan should return a valid URL", function() {
            for (var id in idToTileN) {
               var tileN = idToTileN[id];
               expect(GigapanUtils.createTileSourceUrlPrefixForGigapan(id, null)).toBe("http://tile" + tileN + ".gigapan.org/gigapans0/" + id + "/tiles");
            }
         });
      });
      describe("and the (trimmed) authKey is the empty string", function() {
         it("createTileSourceUrlPrefixForGigapan should return a valid URL", function() {
            for (var id in idToTileN) {
               var tileN = idToTileN[id];
               var expected = "http://tile" + tileN + ".gigapan.org/gigapans0/" + id + "/tiles";
               expect(GigapanUtils.createTileSourceUrlPrefixForGigapan(id, "")).toBe(expected);
               expect(GigapanUtils.createTileSourceUrlPrefixForGigapan(id, " ")).toBe(expected);
               expect(GigapanUtils.createTileSourceUrlPrefixForGigapan(id, "\n")).toBe(expected);
               expect(GigapanUtils.createTileSourceUrlPrefixForGigapan(id, "\t")).toBe(expected);
            }
         });
      });
      describe("and the authKey is non-empty", function() {
         it("createTileSourceUrlPrefixForGigapan should return a valid URL", function() {
            for (var id in idToTileN) {
               var tileN = idToTileN[id];
               expect(GigapanUtils.createTileSourceUrlPrefixForGigapan(id, "bubba")).toBe("http://tile" + tileN + ".gigapan.org/gigapans0/" + id + "/tiles.bubba");
            }
         });
      });
   });
});