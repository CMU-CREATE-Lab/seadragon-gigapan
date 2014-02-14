/*! 
 * Seadragon Ajax 0.8.9 (custom build from source on 2013-01-23 17:05:40.978) 
 * CREATE Lab fork: https://github.com/CMU-CREATE-Lab/seadragon-ajax 
 * http://gallery.expression.microsoft.com/SeadragonAjax 
 * This code is distributed under the license agreement at: 
 * http://go.microsoft.com/fwlink/?LinkId=164943 
 */ 
(function (window, document, Math, undefined) {

// Seadragon.Core.js:

//  This code is distributed under the included license agreement, also
//  available here: http://go.microsoft.com/fwlink/?LinkId=164943

if (!window.Seadragon) {
    window.Seadragon = {};
}

// this line overwrites any previous window.Seadragon value in IE before this file
// executes! since this is a global variable, IE does a forward-reference check
// and deletes any global variables which are declared through var. so for now,
// every piece of code that references Seadragon will just have to implicitly
// refer to window.Seadragon and not this global variable Seadragon.
// UPDATE: re-adding this since we're now wrapping all the code in a function.
var Seadragon = window.Seadragon;

// Seadragon.Config.js:

//  This code is distributed under the included license agreement, also
//  available here: http://go.microsoft.com/fwlink/?LinkId=164943

var SeadragonConfig = Seadragon.Config;

(function() {
    
    // DUPLICATION CHECK -- necessary to prevent overwriting user changes
    if (SeadragonConfig) {
        return;
    }

    SeadragonConfig = Seadragon.Config = {
        
        debugMode: false,
        
        animationTime: 1.5,
        
        blendTime: 0.5,
        
        alwaysBlend: false,
        
        autoHideControls: true,
        
        constrainDuringPan: true,
        
        immediateRender: false,
        
        logarithmicZoom: true,
        
        wrapHorizontal: false,
        
        wrapVertical: false,
        
        wrapOverlays: false,
        
        transformOverlays: false,
        
        // for backwards compatibility, keeping this around and defaulting to null.
        // if it ever has a non-null value, that means it was explicitly set.
        minZoomDimension: null,
        
        minZoomImageRatio: 0.8,
        
        maxZoomPixelRatio: 2,
        
        visibilityRatio: 0.8,
        
        springStiffness: 5.0,
        
        imageLoaderLimit: 2, 
        
        clickTimeThreshold: 200,
        
        clickDistThreshold: 5,
        
        zoomPerClick: 2.0,
        
        zoomPerScroll: Math.pow(2, 1/3),
        
        zoomPerSecond: 2.0,
        
        proxyUrl: null,
        
        imagePath: "img/"
        
    };

})();

// Seadragon.Strings.js:

//  This code is distributed under the included license agreement, also
//  available here: http://go.microsoft.com/fwlink/?LinkId=164943

var SeadragonStrings = Seadragon.Strings;

(function() {

    if (SeadragonStrings) {
        return;     // don't overwrite any strings that may have been added or changed
    }

    SeadragonStrings = Seadragon.Strings = {
        
        Errors: {
            Failure: "Sorry, but Seadragon Ajax can't run on your browser!\n" +
                    "Please try using IE 8 or Firefox 3.\n",
            Dzc: "Sorry, we don't support Deep Zoom Collections!",
            Dzi: "Hmm, this doesn't appear to be a valid Deep Zoom Image.",
            Xml: "Hmm, this doesn't appear to be a valid Deep Zoom Image.",
            Empty: "You asked us to open nothing, so we did just that.",
            ImageFormat: "Sorry, we don't support {0}-based Deep Zoom Images.",
            Security: "It looks like a security restriction stopped us from " +
                    "loading this Deep Zoom Image.",
            Status: "This space unintentionally left blank ({0} {1}).",
            Unknown: "Whoops, something inexplicably went wrong. Sorry!"
        },
        
        Messages: {
            Loading: "Loading..."
        },
        
        Tooltips: {
            FullPage: "Toggle full page",
            Home: "Go home",
            ZoomIn: "Zoom in (you can also use your mouse's scroll wheel)",
            ZoomOut: "Zoom out (you can also use your mouse's scroll wheel)"
        }
        
    };

    SeadragonStrings.getString = function(prop) {
        var props = prop.split('.');
        var string = SeadragonStrings;
        
        // get property, which may contain dots, meaning subproperty
        for (var i = 0; i < props.length; i++) {
            string = string[props[i]] || {};    // in case not a subproperty
        }
        
        // in case the string didn't exist
        if (typeof(string) != "string") {
            string = "";
        }
        
        // regular expression and lambda technique from:
        // http://frogsbrain.wordpress.com/2007/04/28/javascript-stringformat-method/#comment-236
        var args = arguments;
        return string.replace(/\{\d+\}/g, function(capture) {
            var i = parseInt(capture.match(/\d+/)) + 1;
            return i < args.length ? args[i] : "";
        });
    };

    SeadragonStrings.setString = function(prop, value) {
        var props = prop.split('.');
        var container = SeadragonStrings;
        
        // get property's container, up to but not after last dot
        for (var i = 0; i < props.length - 1; i++) {
            if (!container[props[i]]) {
                container[props[i]] = {};
            }
            container = container[props[i]];
        }
        
        container[props[i]] = value;
    };

})();

// Seadragon.Debug.js:

//  This code is distributed under the included license agreement, also
//  available here: http://go.microsoft.com/fwlink/?LinkId=164943

var SeadragonDebug = function() {
    
    // Methods
    
    this.log = function(msg, important) {
        var console = window.console || {};
        var debug = SeadragonConfig.debugMode;
        
        if (debug && console.log) {
            console.log(msg);
        } else if (debug && important) {
            alert(msg);
        }
    };
    
    this.error = function(msg, e) {
        var console = window.console || {};
        var debug = SeadragonConfig.debugMode;
        
        if (debug && console.error) {
            console.error(msg);
        } else if (debug) {
            alert(msg);
        }
        
        if (debug) {
            // since we're debugging, fail fast by crashing
            throw e || new Error(msg);
        }
    };
    
    this.fail = function(msg) {
        alert(SeadragonStrings.getString("Errors.Failure"));
        throw new Error(msg);
    };
    
};

// Seadragon.Debug is a static class, so make it singleton instance
SeadragonDebug = Seadragon.Debug = new SeadragonDebug();

// Seadragon.Profiler.js:

//  This code is distributed under the included license agreement, also
//  available here: http://go.microsoft.com/fwlink/?LinkId=164943

var SeadragonProfiler = Seadragon.Profiler = function() {
    
    // Fields
    
    var self = this;
    
    var midUpdate = false;
    var numUpdates = 0;
    
    var lastBeginTime = null;
    var lastEndTime = null;
    
    var minUpdateTime = Infinity;
    var avgUpdateTime = 0;
    var maxUpdateTime = 0;
    
    var minIdleTime = Infinity;
    var avgIdleTime = 0;
    var maxIdleTime = 0;
    
    // Methods -- UPDATE TIME ACCESSORS
    
    this.getAvgUpdateTime = function() {
        return avgUpdateTime;
    };
    
    this.getMinUpdateTime = function() {
        return minUpdateTime;
    };
    
    this.getMaxUpdateTime = function() {
        return maxUpdateTime;
    };
    
    // Methods -- IDLING TIME ACCESSORS
    
    this.getAvgIdleTime = function() {
        return avgIdleTime;
    };
    
    this.getMinIdleTime = function() {
        return minIdleTime;
    };
    
    this.getMaxIdleTime = function() {
        return maxIdleTime;
    };
    
    // Methods -- GENERAL ACCESSORS 
    
    this.isMidUpdate = function() {
        return midUpdate;
    };
    
    this.getNumUpdates = function() {
        return numUpdates;
    };
    
    // Methods -- MODIFIERS
    
    this.beginUpdate = function() {
        if (midUpdate) {
            self.endUpdate();
        }
        
        midUpdate = true;
        lastBeginTime = new Date().getTime();
        
        if (numUpdates <1) {
            return;     // this is the first update
        }
        
        var time = lastBeginTime - lastEndTime;
        
        avgIdleTime = (avgIdleTime * (numUpdates - 1) + time) / numUpdates;
        
        if (time < minIdleTime) {
            minIdleTime = time;
        }
        if (time > maxIdleTime) {
            maxIdleTime = time;
        }
    };
    
    this.endUpdate = function() {        if (!midUpdate) {
            return;
        }
        
        lastEndTime = new Date().getTime();
        midUpdate = false;
        
        var time = lastEndTime - lastBeginTime;
        
        numUpdates++;
        avgUpdateTime = (avgUpdateTime * (numUpdates - 1) + time) / numUpdates;
        
        if (time < minUpdateTime) {
            minUpdateTime = time;
        }
        if (time > maxUpdateTime) {
            maxUpdateTime = time;
        }
    };
    
    this.clearProfile = function() {
        midUpdate = false;
        numUpdates = 0;
        
        lastBeginTime = null;
        lastEndTime = null;
        
        minUpdateTime = Infinity;
        avgUpdateTime = 0;
        maxUpdateTime = 0;
        
        minIdleTime = Infinity;
        avgIdleTime = 0;
        maxIdleTime = 0;
    };
    
};

// Seadragon.Point.js:

//  This code is distributed under the included license agreement, also
//  available here: http://go.microsoft.com/fwlink/?LinkId=164943

var SeadragonPoint = Seadragon.Point;

(function() {
    
    // preventing duplicate definitions because our code checks instanceof
    // SeadragonPoint, and that breaks if Seadragon.Point is redefined!
    if (SeadragonPoint) {
        return;
    }

    SeadragonPoint = Seadragon.Point = function(x, y) {
        
        // Properties
        
        this.x = typeof(x) == "number" ? x : 0;
        this.y = typeof(y) == "number" ? y : 0;
        
    };

    // Methods
    
    var SDPointPrototype = SeadragonPoint.prototype;

    SDPointPrototype.plus = function(point) {
        return new SeadragonPoint(this.x + point.x, this.y + point.y);
    };

    SDPointPrototype.minus = function(point) {
        return new SeadragonPoint(this.x - point.x, this.y - point.y);
    };

    SDPointPrototype.times = function(factor) {
        return new SeadragonPoint(this.x * factor, this.y * factor);
    };

    SDPointPrototype.divide = function(factor) {
        return new SeadragonPoint(this.x / factor, this.y / factor);
    };

    SDPointPrototype.negate = function() {
        return new SeadragonPoint(-this.x, -this.y);
    };

    SDPointPrototype.distanceTo = function(point) {
        return Math.sqrt(Math.pow(this.x - point.x, 2) +
                        Math.pow(this.y - point.y, 2));
    };

    SDPointPrototype.apply = function(func) {
        return new SeadragonPoint(func(this.x), func(this.y));
    };

    SDPointPrototype.equals = function(point) {
        return (point instanceof SeadragonPoint) &&
                (this.x === point.x) && (this.y === point.y);
    };

    SDPointPrototype.toString = function() {
        return "(" + this.x + "," + this.y + ")";
    };

})();

// Seadragon.Rect.js:

//  This code is distributed under the included license agreement, also
//  available here: http://go.microsoft.com/fwlink/?LinkId=164943

var SeadragonRect = Seadragon.Rect;

(function () {
    
    // preventing duplicate definitions because our code checks instanceof
    // SeadragonRect, and that breaks if Seadragon.Rect is redefined!
    if (SeadragonRect) {
        return;
    }

    SeadragonRect = Seadragon.Rect = function(x, y, width, height) {
        
        // Properties
        
        this.x = typeof(x) == "number" ? x : 0;
        this.y = typeof(y) == "number" ? y : 0;
        this.width = typeof(width) == "number" ? width : 0;
        this.height = typeof(height) == "number" ? height : 0;

    };
    
    // Methods
    
    var SDRectPrototype = SeadragonRect.prototype;
    
    SDRectPrototype.getAspectRatio = function() {
        return this.width / this.height;
    };
    
    SDRectPrototype.getTopLeft = function() {
        return new SeadragonPoint(this.x, this.y);
    };
    
    SDRectPrototype.getBottomRight = function() {
        return new SeadragonPoint(this.x + this.width, this.y + this.height);
    };
    
    SDRectPrototype.getCenter = function() {
        return new SeadragonPoint(this.x + this.width / 2.0,
                        this.y + this.height / 2.0);
    };
    
    SDRectPrototype.getSize = function() {
        return new SeadragonPoint(this.width, this.height);
    };
    
    SDRectPrototype.equals = function(other) {
        return (other instanceof SeadragonRect) &&
                (this.x === other.x) && (this.y === other.y) &&
                (this.width === other.width) && (this.height === other.height);
    };
    
    SDRectPrototype.toString = function() {
        return "[" + this.x + "," + this.y + "," + this.width + "x" +
                this.height + "]";
    };

})();

// Seadragon.Spring.js:

//  This code is distributed under the included license agreement, also
//  available here: http://go.microsoft.com/fwlink/?LinkId=164943

var SeadragonSpring = Seadragon.Spring = function(initialValue) {
    
    // Fields
    
    var currentValue = typeof(initialValue) == "number" ? initialValue : 0;
    var startValue = currentValue;
    var targetValue = currentValue;
    
    var currentTime = new Date().getTime(); // always work in milliseconds
    var startTime = currentTime;
    var targetTime = currentTime;
    
    // Helpers
    
    /**
     * Transform from linear [0,1] to spring [0,1].
     */
    function transform(x) {
        var s = SeadragonConfig.springStiffness;
        return (1.0 - Math.exp(-x * s)) / (1.0 - Math.exp(-s));
    }
    
    // Methods
    
    this.getCurrent = function() {
        return currentValue;
    };
    
    this.getTarget = function() {
        return targetValue;
    };
    
    this.resetTo = function(target) {
        targetValue = target;
        targetTime = currentTime;
        startValue = targetValue;
        startTime = targetTime;
    };
    
    this.springTo = function(target) {
        startValue = currentValue;
        startTime = currentTime;
        targetValue = target;
        targetTime = startTime + 1000 * SeadragonConfig.animationTime;
    };
    
    this.shiftBy = function(delta) {
        startValue += delta;
        targetValue += delta;
    };
    
    this.update = function() {
        currentTime = new Date().getTime();
        currentValue = (currentTime >= targetTime) ? targetValue :
                startValue + (targetValue - startValue) *
                transform((currentTime - startTime) / (targetTime - startTime));
    };
    
};

// Seadragon.Utils.js:

//  This code is distributed under the included license agreement, also
//  available here: http://go.microsoft.com/fwlink/?LinkId=164943

var SeadragonBrowser = Seadragon.Browser = {
    UNKNOWN: 0,
    IE: 1,
    FIREFOX: 2,
    SAFARI: 3,
    CHROME: 4,
    OPERA: 5
};

var SeadragonUtils = function() {
    
    // Fields
    
    var self = this;
    
    var arrActiveX = ["Msxml2.XMLHTTP", "Msxml3.XMLHTTP", "Microsoft.XMLHTTP"];
    var supportedImageFormats = {
        "bmp": false,
        "jpeg": true,
        "jpg": true,
        "png": true,
        "tif": false,
        "wdp": false
    };
    
    var browser = SeadragonBrowser.UNKNOWN;
    var browserVersion = 0;
    var badAlphaBrowser = false;    // updated in constructor
    
    var urlParams = {};
    
    // Constructor
    
    (function() {
        
        // Browser detect
        
        var app = navigator.appName;
        var ver = navigator.appVersion;
        var ua = navigator.userAgent;
        
        if (app == "Microsoft Internet Explorer" &&
                !!window.attachEvent && !!window.ActiveXObject) {
            
            var ieOffset = ua.indexOf("MSIE");
            browser = SeadragonBrowser.IE;
            browserVersion = parseFloat(
                    ua.substring(ieOffset + 5, ua.indexOf(";", ieOffset)));
            
            // update: for intranet sites and compat view list sites, IE sends
            // an IE7 User-Agent to the server to be interoperable, and even if
            // the page requests a later IE version, IE will still report the
            // IE7 UA to JS. we should be robust to this.
            var docMode = document.documentMode;
            if (typeof docMode !== "undefined") {
                browserVersion = docMode;
            }
            
        } else if (app == "Netscape" && !!window.addEventListener) {
            
            var ffOffset = ua.indexOf("Firefox");
            var saOffset = ua.indexOf("Safari");
            var chOffset = ua.indexOf("Chrome");
            
            if (ffOffset >= 0) {
                browser = SeadragonBrowser.FIREFOX;
                browserVersion = parseFloat(ua.substring(ffOffset + 8));
            } else if (saOffset >= 0) {
                var slash = ua.substring(0, saOffset).lastIndexOf("/");
                browser = (chOffset >= 0) ? SeadragonBrowser.CHROME : SeadragonBrowser.SAFARI;
                browserVersion = parseFloat(ua.substring(slash + 1, saOffset));
            }
            
        } else if (app == "Opera" && !!window.opera && !!window.attachEvent) {
            
            browser = SeadragonBrowser.OPERA;
            browserVersion = parseFloat(ver);
            
        }
        
        // Url parameters
        
        var query = window.location.search.substring(1);    // ignore '?'
        var parts = query.split('&');
        
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            var sep = part.indexOf('=');
            
            if (sep > 0) {
                urlParams[part.substring(0, sep)] =
                        decodeURIComponent(part.substring(sep + 1));
            }
        }
        
        // Browser behaviors
        
        // update: chrome 2 no longer has this problem! and now same with IE9!
        badAlphaBrowser =
                (browser == SeadragonBrowser.IE && browserVersion < 9) ||
                (browser == SeadragonBrowser.CHROME && browserVersion < 2);
        
    })();
    
    // Helpers
    
    function getOffsetParent(elmt, isFixed) {
        // IE and Opera "fixed" position elements don't have offset parents.
        // regardless, if it's fixed, its offset parent is the body.
        if (isFixed && elmt != document.body) {
            return document.body;
        } else {
            return elmt.offsetParent;
        }
    }
    
    // Methods
    
    this.getBrowser = function() {
        return browser;
    };
    
    this.getBrowserVersion = function() {
        return browserVersion;
    };
    
    this.getElement = function(elmt) {
        if (typeof(elmt) == "string") {
            elmt = document.getElementById(elmt);
        }
        
        return elmt;
    };
    
    this.getElementPosition = function(elmt) {
        var elmt = self.getElement(elmt);
        var result = new SeadragonPoint();
        
        // technique from:
        // http://www.quirksmode.org/js/findpos.html
        // with special check for "fixed" elements.
        
        var isFixed = self.getElementStyle(elmt).position == "fixed";
        var offsetParent = getOffsetParent(elmt, isFixed);
        
        while (offsetParent) {
            result.x += elmt.offsetLeft;
            result.y += elmt.offsetTop;
            
            if (isFixed) {
                result = result.plus(self.getPageScroll());
            }
            
            elmt = offsetParent;
            isFixed = self.getElementStyle(elmt).position == "fixed";
            offsetParent = getOffsetParent(elmt, isFixed);
        }
        
        return result;
    };
    
    this.getElementSize = function(elmt) {
        var elmt = self.getElement(elmt);
        return new SeadragonPoint(elmt.clientWidth, elmt.clientHeight);
    };
    
    this.getElementStyle = function(elmt) {
        var elmt = self.getElement(elmt);
        
        if (elmt.currentStyle) {
            return elmt.currentStyle;
        } else if (window.getComputedStyle) {
            return window.getComputedStyle(elmt, "");
        } else {
            SeadragonDebug.fail("Unknown element style, no known technique.");
        }
    };
    
    this.getEvent = function(event) {
        return event ? event : window.event;
    };
    
    this.getMousePosition = function(event) {
        var event = self.getEvent(event);
        var result = new SeadragonPoint();
        
        // technique from:
        // http://www.quirksmode.org/js/events_properties.html
        
        if (event.type == "DOMMouseScroll" &&
                browser == SeadragonBrowser.FIREFOX && browserVersion < 3) {
            // hack for FF2 which reports incorrect position for mouse scroll
            result.x = event.screenX;
            result.y = event.screenY;
        } else if (typeof(event.pageX) == "number") {
           result.x = event.pageX;
            result.y = event.pageY;
        } else if (typeof(event.clientX) == "number") {
            result.x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            result.y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        } else {
            SeadragonDebug.fail("Unknown event mouse position, no known technique.");
        }
        
        return result;
    };
    
    this.getMouseScroll = function(event) {
        var event = self.getEvent(event);
        var delta = 0; // default value
        
        // technique from:
        // http://blog.paranoidferret.com/index.php/2007/10/31/javascript-tutorial-the-scroll-wheel/
        
        if (typeof(event.wheelDelta) == "number") {
            delta = event.wheelDelta;
        } else if (typeof(event.detail) == "number") {
            delta = event.detail * -1;
        } else {
            SeadragonDebug.fail("Unknown event mouse scroll, no known technique.");
        }
        
        // normalize value to [-1, 1]
        return delta ? delta / Math.abs(delta) : 0;
    };
    
    this.getPageScroll = function() {
        var result = new SeadragonPoint();
        var docElmt = document.documentElement || {};
        var body = document.body || {};
        
        // technique from:
        // http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
        
        if (typeof(window.pageXOffset) == "number") {
            // most browsers
            result.x = window.pageXOffset;
            result.y = window.pageYOffset;
        } else if (body.scrollLeft || body.scrollTop) {
            // W3C spec, IE6+ in quirks mode
            result.x = body.scrollLeft;
            result.y = body.scrollTop;
        } else if (docElmt.scrollLeft || docElmt.scrollTop) {
            // IE6+ in standards mode
            result.x = docElmt.scrollLeft;
            result.y = docElmt.scrollTop;
        }
        
        // note: we specifically aren't testing for typeof here, because IE sets
        // the appropriate variables undefined instead of 0 under certain
        // conditions. this means we also shouldn't fail if none of the three
        // cases are hit; we'll just assume the page scroll is 0.
        
        return result;
    };
    
    this.getWindowSize = function() {
        var result = new SeadragonPoint();
        var docElmt = document.documentElement || {};
        var body = document.body || {};
        
        // technique from:
        // http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
        
        // important: i originally cleaned up the second and third IE checks to
        // check if the typeof was number. but this fails for quirks mode,
        // because docElmt.clientWidth is indeed a number, but it's incorrectly
        // zero. so no longer checking typeof is number for those cases.
        
        if (typeof(window.innerWidth) == 'number') {
            // non-IE browsers
            result.x = window.innerWidth;
            result.y = window.innerHeight;
        } else if (docElmt.clientWidth || docElmt.clientHeight) {
            // IE6+ in standards mode
            result.x = docElmt.clientWidth;
            result.y = docElmt.clientHeight;
        } else if (body.clientWidth || body.clientHeight) {
            // IE6+ in quirks mode
            result.x = body.clientWidth;
            result.y = body.clientHeight;
        } else {
            SeadragonDebug.fail("Unknown window size, no known technique.");
        }
        
        return result;
    };
    
    this.imageFormatSupported = function(ext) {
        var ext = ext ? ext : "";
        return !!supportedImageFormats[ext.toLowerCase()];
    };
    
    this.makeCenteredNode = function(elmt) {
        var elmt = SeadragonUtils.getElement(elmt);
        var div = self.makeNeutralElement("div");
        var html = [];
        
        // technique for vertically centering (in IE!!!) from:
        // http://www.jakpsatweb.cz/css/css-vertical-center-solution.html
        // with explicit neutralizing of styles added by me.
        html.push('<div style="display:table; height:100%; width:100%;');
        html.push('border:none; margin:0px; padding:0px;'); // neutralizing
        html.push('#position:relative; overflow:hidden; text-align:left;">');
            // the text-align:left guards against incorrect centering in IE
        html.push('<div style="#position:absolute; #top:50%; width:100%; ');
        html.push('border:none; margin:0px; padding:0px;'); // neutralizing
        html.push('display:table-cell; vertical-align:middle;">');
        html.push('<div style="#position:relative; #top:-50%; width:100%; ');
        html.push('border:none; margin:0px; padding:0px;'); // neutralizing
        html.push('text-align:center;"></div></div></div>');
        
        div.innerHTML = html.join('');
        div = div.firstChild;
        
        // now add the element as a child to the inner-most div
        var innerDiv = div;
        var innerDivs = div.getElementsByTagName("div");
        while (innerDivs.length > 0) {
            innerDiv = innerDivs[0];
            innerDivs = innerDiv.getElementsByTagName("div");
        }
        
        innerDiv.appendChild(elmt);
        
        return div;
    };
    
    this.makeNeutralElement = function(tagName) {
        var elmt = document.createElement(tagName);
        var style = elmt.style;
        
        // TODO reset neutral element's style in a better way
        style.background = "transparent none";
        style.border = "none";
        style.margin = "0px";
        style.padding = "0px";
        style.position = "static";
        
        return elmt;
    };
    
    this.makeTransparentImage = function(src) {
        var img = self.makeNeutralElement("img");
        var elmt = null;
        
        if (browser == SeadragonBrowser.IE && browserVersion < 7) {
            elmt = self.makeNeutralElement("span");
            elmt.style.display = "inline-block";
            
            // to size span correctly, load image and get natural size,
            // but don't override any user-set CSS values
            img.onload = function() {
                elmt.style.width = elmt.style.width || img.width + "px";
                elmt.style.height = elmt.style.height || img.height + "px";
                
                img.onload = null;
                img = null;     // to prevent memory leaks in IE
            };
            
            img.src = src;
            elmt.style.filter =
                    "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" +
                    src + "', sizingMethod='scale')";
        } else {
            elmt = img;
            elmt.src = src;
        }
        
        return elmt;
    };
    
    this.setElementOpacity = function(elmt, opacity, usesAlpha) {
        var elmt = self.getElement(elmt);
        
        if (usesAlpha && badAlphaBrowser) {
            // images with alpha channels won't fade well, so round
            opacity = Math.round(opacity);
        }
        
        // for CSS opacity browsers, remove opacity value if it's unnecessary
        if (opacity < 1) {
            elmt.style.opacity = opacity;
        } else {
            elmt.style.opacity = "";
        }
        
        // for CSS filter browsers (IE), remove alpha filter if it's unnecessary.
        // update: doing this always since IE9 beta seems to have broken the
        // behavior if we rely on the programmatic filters collection.
        var prevFilter = elmt.style.filter || "";
        elmt.style.filter = prevFilter.replace(/[\s]*alpha\(.*?\)[\s]*/g, "");
                // important: note the lazy star! this protects against
                // multiple filters; we don't want to delete the other ones.
                // update: also trimming extra whitespace around filter.
        
        if (opacity >= 1) {
            return;
        }
        
        var ieOpacity = Math.round(100 * opacity);
        var ieFilter = " alpha(opacity=" + ieOpacity + ") ";
        
        elmt.style.filter += ieFilter;
        
        // old way -- seems to have broken in IE9's compatibiliy mode:
        // check if this element has filters associated with it (IE only),
        // but prevent bug where IE throws error "Member not found" sometimes.
        //try {
        //    if (elmt.filters && elmt.filters.alpha) {
        //        elmt.filters.alpha.opacity = ieOpacity;
        //    } else {
        //        elmt.style.filter += ieFilter;
        //    }
        //} catch (e) {
        //    elmt.style.filter += ieFilter;
        //}
    };
    
    this.addEvent = function(elmt, eventName, handler, useCapture) {
        var elmt = self.getElement(elmt);
        
        // technique from:
        // http://blog.paranoidferret.com/index.php/2007/08/10/javascript-working-with-events/
        
        if (elmt.addEventListener) {
            if (eventName == "mousewheel") {
                elmt.addEventListener("DOMMouseScroll", handler, useCapture);
            }
            // we are still going to add the mousewheel -- not a mistake!
            // this is for opera, since it uses onmousewheel but needs addEventListener.
            elmt.addEventListener(eventName, handler, useCapture);
        } else if (elmt.attachEvent) {
            elmt.attachEvent("on" + eventName, handler);
            if (useCapture && elmt.setCapture) {
                elmt.setCapture();
            }
        } else {
            SeadragonDebug.fail("Unable to attach event handler, no known technique.");
        }
    };
    
    this.removeEvent = function(elmt, eventName, handler, useCapture) {
        var elmt = self.getElement(elmt);
        
        // technique from:
        // http://blog.paranoidferret.com/index.php/2007/08/10/javascript-working-with-events/
        
        if (elmt.removeEventListener) {
            if (eventName == "mousewheel") {
                elmt.removeEventListener("DOMMouseScroll", handler, useCapture);
            }
            // we are still going to remove the mousewheel -- not a mistake!
            // this is for opera, since it uses onmousewheel but needs removeEventListener.
            elmt.removeEventListener(eventName, handler, useCapture);
        } else if (elmt.detachEvent) {
            elmt.detachEvent("on" + eventName, handler);
            if (useCapture && elmt.releaseCapture) {
                elmt.releaseCapture();
            }
        } else {
            SeadragonDebug.fail("Unable to detach event handler, no known technique.");
        }
    };
    
    this.cancelEvent = function(event) {
        var event = self.getEvent(event);
        
        // technique from:
        // http://blog.paranoidferret.com/index.php/2007/08/10/javascript-working-with-events/
        
        if (event.preventDefault) {
            event.preventDefault();     // W3C for preventing default
        }
        
        event.cancel = true;            // legacy for preventing default
        event.returnValue = false;      // IE for preventing default
    };
    
    this.stopEvent = function(event) {
        var event = self.getEvent(event);
        
        // technique from:
        // http://blog.paranoidferret.com/index.php/2007/08/10/javascript-working-with-events/
        
        if (event.stopPropagation) {
            event.stopPropagation();    // W3C for stopping propagation
        }
        
        event.cancelBubble = true;      // IE for stopping propagation
    };
    
    this.createCallback = function(object, method) {
        // create callback args
        var initialArgs = [];
        for (var i = 2; i < arguments.length; i++) {
            initialArgs.push(arguments[i]);
        }
        
        // create closure to apply method
        return function() {
            // concatenate new args, but make a copy of initialArgs first
            var args = initialArgs.concat([]);
            for (var i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            
            return method.apply(object, args);
        };
    };
    
    this.getUrlParameter = function(key) {
        var value = urlParams[key];
        return value ? value : null;
    };
    
    this.makeAjaxRequest = function(url, callback) {
        var async = typeof(callback) == "function";
        var req = null;
        
        if (async) {
            var actual = callback;
            var callback = function() {
                window.setTimeout(SeadragonUtils.createCallback(null, actual, req), 1);
            };
        }
        
        if (window.ActiveXObject) {
            for (var i = 0; i < arrActiveX.length; i++) {
                try {
                    req = new ActiveXObject(arrActiveX[i]);
                    break;
                } catch (e) {
                    continue;
                }
            }
        } else if (window.XMLHttpRequest) {
            req = new XMLHttpRequest();
        }
        
        if (!req) {
            SeadragonDebug.fail("Browser doesn't support XMLHttpRequest.");
        }
        
        // Proxy support
        if (SeadragonConfig.proxyUrl) {
            url = SeadragonConfig.proxyUrl + url;
        }
        
        if (async) {
            req.onreadystatechange = function() {
                if (req.readyState == 4) {
                    // prevent memory leaks by breaking circular reference now
                    req.onreadystatechange = new Function();
                    callback();
                }
            };
        }
        
        try {
            req.open("GET", url, async);
            req.send(null);
        } catch (e) {
            SeadragonDebug.log(e.name + " while making AJAX request: " + e.message);
            
            req.onreadystatechange = null;
            req = null;
            
            if (async) {
                callback();
            }
        }
        
        return async ? null : req;
    };
    
    this.parseXml = function(string) {
        var xmlDoc = null;
        
        if (window.ActiveXObject) {
            try {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(string);
            } catch (e) {
                SeadragonDebug.log(e.name + " while parsing XML (ActiveX): " + e.message);
            }
        } else if (window.DOMParser) {
            try {
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(string, "text/xml");
            } catch (e) {
                SeadragonDebug.log(e.name + " while parsing XML (DOMParser): " + e.message);
            }
        } else {
            SeadragonDebug.fail("Browser doesn't support XML DOM.");
        }
        
        return xmlDoc;
    };
    
};

// Seadragon.Utils is a static class, so make it singleton instance
SeadragonUtils = Seadragon.Utils = new SeadragonUtils();

// Seadragon.MouseTracker.js:

//  This code is distributed under the included license agreement, also
//  available here: http://go.microsoft.com/fwlink/?LinkId=164943

var SeadragonMouseTracker = Seadragon.MouseTracker;

(function() {
    
    // DUPLICATION CHECK -- necessary here because of private static state
    if (SeadragonMouseTracker) {
        return;
    }
    
    // Constants
    
    // update: IE9 implements the W3C standard event model! =)
    var lteIE8 = SeadragonUtils.getBrowser() == SeadragonBrowser.IE &&
        SeadragonUtils.getBrowserVersion() < 9;
    
    // Static fields
    
    var buttonDownAny = false;
    
    var ieCapturingAny = false;
    var ieTrackersActive = {};      // dictionary from hash to MouseTracker
    var ieTrackersCapturing = [];   // list of trackers interested in capture
    
    // Static helpers
    
    function getMouseAbsolute(event) {
        return SeadragonUtils.getMousePosition(event);
    }
    
    function getMouseRelative(event, elmt) {
        var mouse = SeadragonUtils.getMousePosition(event);
        var offset = SeadragonUtils.getElementPosition(elmt);
        
        return mouse.minus(offset);
    }
    
    /**
     * Returns true if elmtB is a child node of elmtA, or if they're equal.
     */
    function isChild(elmtA, elmtB) {
        var body = document.body;
        while (elmtB && elmtA != elmtB && body != elmtB) {
            try {
                elmtB = elmtB.parentNode;
            } catch (e) {
                // Firefox sometimes fires events for XUL elements, which throws
                // a "permission denied" error. so this is not a child.
                return false;
            }
        }
        return elmtA == elmtB;
    }
    
    function onGlobalMouseDown() {
        buttonDownAny = true;
    }
    
    function onGlobalMouseUp() {
        buttonDownAny = false;
    }
    
    // Static constructor
    
    (function () {
        // the W3C event model lets us listen to the capture phase of events, so
        // to know if the mouse is globally up or down, we'll listen to the
        // capture phase of the window's events. we can't do this in IE, so
        // we'll give it a best effort by listening to the regular bubble phase,
        // and on the document since window isn't legal in IE for mouse events.
        if (lteIE8) {
            SeadragonUtils.addEvent(document, "mousedown", onGlobalMouseDown, false);
            SeadragonUtils.addEvent(document, "mouseup", onGlobalMouseUp, false);
        } else {
            SeadragonUtils.addEvent(window, "mousedown", onGlobalMouseDown, true);
            SeadragonUtils.addEvent(window, "mouseup", onGlobalMouseUp, true);
        }
    })();
    
    // Class
    
    SeadragonMouseTracker = Seadragon.MouseTracker = function(elmt) {
        
        // Fields
        
        var self = this;
        var ieSelf = null;
        
        var hash = Math.random();     // a unique hash for this tracker
        var elmt = SeadragonUtils.getElement(elmt);
        
        var tracking = false;
        var capturing = false;
        var buttonDownElmt = false;
        var insideElmt = false;
        
        var lastPoint = null;           // position of last mouse down/move
        var lastMouseDownTime = null;   // time of last mouse down
        var lastMouseDownPoint = null;  // position of last mouse down
        
        // Properties
        
        this.target = elmt;
        this.enterHandler = null;       // function(tracker, position, buttonDownElmt, buttonDownAny)
        this.exitHandler = null;        // function(tracker, position, buttonDownElmt, buttonDownAny)
        this.pressHandler = null;       // function(tracker, position)
        this.releaseHandler = null;     // function(tracker, position, insideElmtPress, insideElmtRelease)
        this.clickHandler = null;       // function(tracker, position, quick, shift)
        this.dragHandler = null;        // function(tracker, position, delta, shift)
        this.scrollHandler = null;      // function(tracker, position, scroll, shift)
        
        // Helpers
        
        function startTracking() {
            if (!tracking) {
                SeadragonUtils.addEvent(elmt, "mouseover", onMouseOver, false);
                SeadragonUtils.addEvent(elmt, "mouseout", onMouseOut, false);
                SeadragonUtils.addEvent(elmt, "mousedown", onMouseDown, false);
                SeadragonUtils.addEvent(elmt, "mouseup", onMouseUp, false);
                SeadragonUtils.addEvent(elmt, "mousewheel", onMouseScroll, false);
                SeadragonUtils.addEvent(elmt, "click", onMouseClick, false);
                
                tracking = true;
                ieTrackersActive[hash] = ieSelf;
            }
        }
        
        function stopTracking() {
            if (tracking) {
                SeadragonUtils.removeEvent(elmt, "mouseover", onMouseOver, false);
                SeadragonUtils.removeEvent(elmt, "mouseout", onMouseOut, false);
                SeadragonUtils.removeEvent(elmt, "mousedown", onMouseDown, false);
                SeadragonUtils.removeEvent(elmt, "mouseup", onMouseUp, false);
                SeadragonUtils.removeEvent(elmt, "mousewheel", onMouseScroll, false);
                SeadragonUtils.removeEvent(elmt, "click", onMouseClick, false);
                
                releaseMouse();
                tracking = false;
                delete ieTrackersActive[hash];
            }
        }
        
        function captureMouse() {
            if (!capturing) {
                // IE lets the element capture the mouse directly, but other
                // browsers use the capture phase on the highest element.
                if (lteIE8) {
                    // we need to capture the mouse, but we also don't want to
                    // handle mouseup like normally (special case for bubbling)
                    SeadragonUtils.removeEvent(elmt, "mouseup", onMouseUp, false);
                    SeadragonUtils.addEvent(elmt, "mouseup", onMouseUpIE, true);
                    SeadragonUtils.addEvent(elmt, "mousemove", onMouseMoveIE, true);
                } else {
                    SeadragonUtils.addEvent(window, "mouseup", onMouseUpWindow, true);
                    SeadragonUtils.addEvent(window, "mousemove", onMouseMove, true);
                }
                
                capturing = true;
            }
        }
        
        function releaseMouse() {
            if (capturing) {
                // similar reasoning as captureMouse()
                if (lteIE8) {
                    // we need to release the mouse, and also go back to handling
                    // mouseup like normal (no longer a hack for capture phase)
                    SeadragonUtils.removeEvent(elmt, "mousemove", onMouseMoveIE, true);
                    SeadragonUtils.removeEvent(elmt, "mouseup", onMouseUpIE, true);
                    SeadragonUtils.addEvent(elmt, "mouseup", onMouseUp, false);
                } else {
                    SeadragonUtils.removeEvent(window, "mousemove", onMouseMove, true);
                    SeadragonUtils.removeEvent(window, "mouseup", onMouseUpWindow, true);
                }
                
                capturing = false;
            }
        }
        
        // IE-specific helpers
        
        function triggerOthers(eventName, event) {
            // update: protecting against properties added to the Object class's
            // prototype, which can and does happen (e.g. through js libraries)
            var trackers = ieTrackersActive;
            for (var otherHash in trackers) {
                if (trackers.hasOwnProperty(otherHash) && hash != otherHash) {
                    trackers[otherHash][eventName](event);
                }
            }
        }
        
        function hasMouse() {
            return insideElmt;
        }
        
        // Listeners
        
        function onMouseOver(event) {
            var event = SeadragonUtils.getEvent(event);
            
            // IE capturing model doesn't raise or bubble the events on any
            // other element if we're capturing currently. so pass this event to
            // other elements being tracked so they can adjust if the element
            // was from them or from a child. however, IE seems to always fire
            // events originating from parents to those parents, so don't double
            // fire the event if the event originated from a parent.
            if (lteIE8 && capturing && !isChild(event.srcElement, elmt)) {
                triggerOthers("onMouseOver", event);
            }
            
            // similar to onMouseOut() tricky bubbling case...
            var to = event.target ? event.target : event.srcElement;
            var from = event.relatedTarget ? event.relatedTarget : event.fromElement;
            if (!isChild(elmt, to) || isChild(elmt, from)) {
                // the mouseover needs to end on this or a child node, and it
                // needs to start from this or an outer node.
                return;
            }
            
            insideElmt = true;
           
            if (typeof(self.enterHandler) == "function") {
                try {
                    self.enterHandler(self, getMouseRelative(event, elmt),
                            buttonDownElmt, buttonDownAny);
                } catch (e) {
                    // handler threw an error, ignore
                    SeadragonDebug.error(e.name +
                            " while executing enter handler: " + e.message, e);
                }
            }
        }
        
        function onMouseOut(event) {
            var event = SeadragonUtils.getEvent(event);
            
            // similar to onMouseOver() case for IE capture model
            if (lteIE8 && capturing && !isChild(event.srcElement, elmt)) {
                triggerOthers("onMouseOut", event);
            }
            
            // we have to watch out for a tricky case: a mouseout occurs on a
            // child element, but the mouse is still inside the parent element.
            // the mouseout event will bubble up to us. this happens in all
            // browsers, so we need to correct for this. technique from:
            // http://www.quirksmode.org/js/events_mouse.html
            var from = event.target ? event.target : event.srcElement;
            var to = event.relatedTarget ? event.relatedTarget : event.toElement;
            if (!isChild(elmt, from) || isChild(elmt, to)) {
                // the mouseout needs to start from this or a child node, and it
                // needs to end on this or an outer node.
                return;
            }
            
            insideElmt = false;
            
            if (typeof(self.exitHandler) == "function") {
                try {
                    self.exitHandler(self, getMouseRelative(event, elmt),
                            buttonDownElmt, buttonDownAny);
                } catch (e) {
                    // handler threw an error, ignore
                    SeadragonDebug.error(e.name +
                            " while executing exit handler: " + e.message, e);
                }
            }
        }
        
        function onMouseDown(event) {
            var event = SeadragonUtils.getEvent(event);
            
            // don't consider right-clicks (fortunately this is cross-browser)
            if (event.button == 2) {
                return;
            }
            
            buttonDownElmt = true;
            
            lastPoint = getMouseAbsolute(event);
            lastMouseDownPoint = lastPoint;
            lastMouseDownTime = new Date().getTime();
            
           if (typeof(self.pressHandler) == "function") {
                try {
                    self.pressHandler(self, getMouseRelative(event, elmt));
                } catch (e) {
                    // handler threw an error, ignore
                    SeadragonDebug.error(e.name +
                            " while executing press handler: " + e.message, e);
                }
            }
            
            if (self.pressHandler || self.dragHandler) {
                // if a press or drag handler is registered, don't drag-drop images, etc.
                SeadragonUtils.cancelEvent(event);
            }
            
            if (!lteIE8 || !ieCapturingAny) {
                captureMouse();
                ieCapturingAny = true;
                ieTrackersCapturing = [ieSelf];     // reset to empty & add us
            } else if (lteIE8) {
                ieTrackersCapturing.push(ieSelf);   // add us to the list
            }
        }
        
        function onMouseUp(event) {
            var event = SeadragonUtils.getEvent(event);
            var insideElmtPress = buttonDownElmt;
            var insideElmtRelease = insideElmt;
            
            // don't consider right-clicks (fortunately this is cross-browser)
            if (event.button == 2) {
                return;
            }
            
            buttonDownElmt = false;
            
            if (typeof(self.releaseHandler) == "function") {
                try {
                    self.releaseHandler(self, getMouseRelative(event, elmt),
                            insideElmtPress, insideElmtRelease);
                } catch (e) {
                    // handler threw an error, ignore
                    SeadragonDebug.error(e.name +
                            " while executing release handler: " + e.message, e);
                }
            }
            
            // some browsers sometimes don't fire click events when we're also
            // listening for mouseup events. i'm not sure why, it could be
            // something i'm doing. in the meantime, this is a temporary fix.
            if (insideElmtPress && insideElmtRelease) {
                handleMouseClick(event);
            }
        }
        
        /**
         * Only triggered once by the deepest element that initially received
         * the mouse down event. We want to make sure THIS event doesn't bubble.
         * Instead, we want to trigger the elements that initially received the
         * mouse down event (including this one) only if the mouse is no longer
         * inside them. Then, we want to release capture, and emulate a regular
         * mouseup on the event that this event was meant for.
         */
        function onMouseUpIE(event) {
            var event = SeadragonUtils.getEvent(event);
            
            // don't consider right-clicks (fortunately this is cross-browser)
            if (event.button == 2) {
                return;
            }
            
            // first trigger those that were capturing
            for (var i = 0; i < ieTrackersCapturing.length; i++) {
                var tracker = ieTrackersCapturing[i];
                if (!tracker.hasMouse()) {
                    tracker.onMouseUp(event);
                }
            }
            
            // then release capture and emulate a regular event
            releaseMouse();
            ieCapturingAny = false;
            event.srcElement.fireEvent("on" + event.type,
                    document.createEventObject(event));
            
            // make sure to stop this event -- shouldn't bubble up
            SeadragonUtils.stopEvent(event);
        }
        
        /**
         * Only triggered in W3C browsers by elements within which the mouse was
         * initially pressed, since they are now listening to the window for
         * mouseup during the capture phase. We shouldn't handle the mouseup
         * here if the mouse is still inside this element, since the regular
         * mouseup handler will still fire.
         */
        function onMouseUpWindow(event) {
            if (!insideElmt) {
                onMouseUp(event);
            }
            
            releaseMouse();
        }
        
        function onMouseClick(event) {
            // see onMouseUp() bug -- handleClick() is already called by
            // onMouseUp() as a temporary fix, so don't duplicate the call here.
            
            if (self.clickHandler) {                
                // since a click handler was registered, don't follow href's, etc.
                SeadragonUtils.cancelEvent(event);
            }
        }
        
        function handleMouseClick(event) {
            var event = SeadragonUtils.getEvent(event);
            
            // don't consider right-clicks (fortunately this is cross-browser)
            if (event.button == 2) {
                return;
            }
            
            var time = new Date().getTime() - lastMouseDownTime;
            var point = getMouseAbsolute(event);
            var distance = lastMouseDownPoint.distanceTo(point);
            var quick = time <= SeadragonConfig.clickTimeThreshold &&
                    distance <= SeadragonConfig.clickDistThreshold;
            
            if (typeof(self.clickHandler) == "function") {
                try {
                    self.clickHandler(self, getMouseRelative(event, elmt),
                            quick, event.shiftKey);
                } catch (e) {
                    // handler threw an error, ignore
                    SeadragonDebug.error(e.name +
                            " while executing click handler: " + e.message, e);
                }
            }
        }
        
        function onMouseMove(event) {
            var event = SeadragonUtils.getEvent(event);
            var point = getMouseAbsolute(event);
            var delta = point.minus(lastPoint);
            
            lastPoint = point;
            
            if (typeof(self.dragHandler) == "function") {
                try {
                    self.dragHandler(self, getMouseRelative(event, elmt),
                            delta, event.shiftKey);
                } catch (e) {
                    // handler threw an error, ignore
                    SeadragonDebug.error(e.name +
                            " while executing drag handler: " + e.message, e);
                }
                
                // since a drag handler was registered, don't allow highlighting, etc.
                SeadragonUtils.cancelEvent(event);
            }
        }
        
        /**
         * Only triggered once by the deepest element that initially received
         * the mouse down event. Since no other element has captured the mouse,
         * we want to trigger the elements that initially received the mouse
         * down event (including this one).
         */
        function onMouseMoveIE(event) {
            // manually trigger those that are capturing
            for (var i = 0; i < ieTrackersCapturing.length; i++) {
                ieTrackersCapturing[i].onMouseMove(event);
            }
            
            // make sure to stop this event -- shouldn't bubble up. note that at
            // the time of this writing, there is no harm in letting it bubble,
            // but a minor change to our implementation would necessitate this.
            SeadragonUtils.stopEvent(event);
        }
        
        function onMouseScroll(event) {
            var event = SeadragonUtils.getEvent(event);
            var delta = SeadragonUtils.getMouseScroll(event);
            
            if (typeof(self.scrollHandler) == "function") {
                // FF2 and FF3/Mac (possibly others) seem to sometimes fire
                // extraneous scroll events. check for those.
                if (delta) {
                    try {
                        self.scrollHandler(self, getMouseRelative(event, elmt),
                                delta, event.shiftKey);
                    } catch (e) {
                        // handler threw an error, ignore
                        SeadragonDebug.error(e.name +
                                " while executing scroll handler: " + e.message, e);
                    }
                }
                
                // since a scroll handler was registered, don't scroll the page, etc.
                SeadragonUtils.cancelEvent(event);
            }
        }
        
        // Constructor
        
        (function () {
            ieSelf = {
                hasMouse: hasMouse,
                onMouseOver: onMouseOver,
                onMouseOut: onMouseOut,
                onMouseUp: onMouseUp,
                onMouseMove: onMouseMove
            };
        })();
        
        // Methods
        
        this.isTracking = function() {
            return tracking;
        };
        
        this.setTracking = function(track) {
            if (track) {
                startTracking();
            } else {
                stopTracking();
            }
        };
        
    };
    
})();

// Seadragon.EventManager.js:

//  This code is distributed under the included license agreement, also
//  available here: http://go.microsoft.com/fwlink/?LinkId=164943

var SeadragonEventManager = Seadragon.EventManager = function() {
    
    // Fields
    
    var listeners = {}; // dictionary of eventName --> array of handlers
    
    // Methods
    
    this.addListener = function(eventName, handler) {
        if (typeof(handler) != "function") {
            return;
        }
        
        if (!listeners[eventName]) {
            listeners[eventName] = [];
        }
        
        listeners[eventName].push(handler);
    };
    
    this.removeListener = function(eventName, handler) {
        var handlers = listeners[eventName];
        
        if (typeof(handler) != "function") {
            return;
        } else if (!handlers) {
            return;
        }
        
        for (var i = 0; i < handlers.length; i++) {
            if (handler == handlers[i]) {
                handlers.splice(i, 1);
                return;
            }
        }
    };
    
    this.clearListeners = function(eventName) {
        if (listeners[eventName]) {
            delete listeners[eventName];
        }
    };
    
    this.trigger = function(eventName) {
        var handlers = listeners[eventName];
        var args = [];
        
        if (!handlers) {
            return;
        }
        
        for (var i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        
        for (var i = 0; i < handlers.length; i++) {
            try {
                handlers[i].apply(window, args);
            } catch (e) {
                // handler threw an error, ignore, go on to next one
                SeadragonDebug.error(e.name + " while executing " + eventName +
                        " handler: " + e.message, e);
            }
        }
    };
    
};

// Seadragon.ImageLoader.js:

//  This code is distributed under the included license agreement, also
//  available here: http://go.microsoft.com/fwlink/?LinkId=164943

var SeadragonImageLoader;

(function() {
    
    var TIMEOUT = 15000;     // milliseconds after which an image times out
    
    function Job(src, callback) {
        
        // Fields
        
        var image = null;
        var timeout = null;     // IE8 fix: no finishing event raised sometimes
        
        // Helpers
        
        function finish(success) {
            image.onload = null;
            image.onabort = null;
            image.onerror = null;
            
            if (timeout) {
                window.clearTimeout(timeout);
            }
            
            // call on a timeout to ensure asynchronous behavior
            window.setTimeout(function() {
                callback(src, success ? image : null);
            }, 1);
        }
        
        // Methods
        
        this.start = function() {
            image = new Image();
            
            var successFunc = function() { finish(true); };
            var failureFunc = function() { finish(false); };
            var timeoutFunc = function() {
                SeadragonDebug.log("Image timed out: " + src);
                finish(false);
            };
            
            image.onload = successFunc;
            image.onabort = failureFunc;
            image.onerror = failureFunc;
            
            // consider it a failure if the image times out.
            timeout = window.setTimeout(timeoutFunc, TIMEOUT);
            
            image.src = src;
        };
        
    }
    
    SeadragonImageLoader = Seadragon.ImageLoader = function() {
        
        // Fields
        
        var downloading = 0;    // number of Jobs currently downloading
        
        // Helpers
        
        function onComplete(callback, src, image) {
            downloading--;
            if (typeof(callback) == "function") {
                try {
                    callback(image);
                } catch (e) {
                    SeadragonDebug.error(e.name +  " while executing " + src +
                            " callback: " + e.message, e);
                }
            }
        }
        
        // Methods
        
        this.loadImage = function(src, callback) {
            if (downloading >= SeadragonConfig.imageLoaderLimit) {
                return false;
            }
            
            var func = SeadragonUtils.createCallback(null, onComplete, callback);
            var job = new Job(src, func);
            
            downloading++;
            job.start();
            
            return true;
        };
        
    };

})();

// Seadragon.Buttons.js:

//  This code is distributed under the included license agreement, also
//  available here: http://go.microsoft.com/fwlink/?LinkId=164943

var SeadragonButton,
    SeadragonButtonGroup;

(function() {
    
    // Enumerations
    
    var ButtonState = {
        REST: 0,
        GROUP: 1,
        HOVER: 2,
        DOWN: 3
    };
    
    // Button class
    
    SeadragonButton = Seadragon.Button = function(tooltip,
            srcRest, srcGroup, srcHover, srcDown,
            onPress, onRelease, onClick, onEnter, onExit) {
        
        // Fields
        
        var button = SeadragonUtils.makeNeutralElement("span");
        var currentState = ButtonState.GROUP;
        var tracker = new SeadragonMouseTracker(button);
        
        var imgRest = SeadragonUtils.makeTransparentImage(srcRest);
        var imgGroup = SeadragonUtils.makeTransparentImage(srcGroup);
        var imgHover = SeadragonUtils.makeTransparentImage(srcHover);
        var imgDown = SeadragonUtils.makeTransparentImage(srcDown);
        
        var onPress = typeof(onPress) == "function" ? onPress : null;
        var onRelease = typeof(onRelease) == "function" ? onRelease : null;
        var onClick = typeof(onClick) == "function" ? onClick : null;
        var onEnter = typeof(onEnter) == "function" ? onEnter : null;
        var onExit = typeof(onExit) == "function" ? onExit : null;
        
        var fadeDelay = 0;      // begin fading immediately
        var fadeLength = 2000;  // fade over a period of 2 seconds
        var fadeBeginTime = null;
        var shouldFade = false;
        
        // Properties
        
        this.elmt = button;
        
        // Fading helpers
        
        function scheduleFade() {
            window.setTimeout(updateFade, 20);
        }
        
        function updateFade() {
            if (shouldFade) {
                var currentTime = new Date().getTime();
                var deltaTime = currentTime - fadeBeginTime;
                var opacity = 1.0 - deltaTime / fadeLength;
                
                opacity = Math.min(1.0, opacity);
                opacity = Math.max(0.0, opacity);
                
                SeadragonUtils.setElementOpacity(imgGroup, opacity, true);
                if (opacity > 0) {
                    scheduleFade();    // fade again
                }
            }
        }
        
        function beginFading() {
            shouldFade = true;
            fadeBeginTime = new Date().getTime() + fadeDelay;
            window.setTimeout(scheduleFade, fadeDelay);
        }
        
        function stopFading() {
            shouldFade = false;
            SeadragonUtils.setElementOpacity(imgGroup, 1.0, true);
        }
        
        // State helpers
        
        function inTo(newState) {
            if (newState >= ButtonState.GROUP && currentState == ButtonState.REST) {
                stopFading();
                currentState = ButtonState.GROUP;
            }
            
            if (newState >= ButtonState.HOVER && currentState == ButtonState.GROUP) {
                // important: don't explicitly say "visibility: visible".
                // see note in Viewer.setVisible() for explanation.
                imgHover.style.visibility = "";
                currentState = ButtonState.HOVER;
            }
            
            if (newState >= ButtonState.DOWN && currentState == ButtonState.HOVER) {
                // important: don't explicitly say "visibility: visible".
                // see note in Viewer.setVisible() for explanation.
                imgDown.style.visibility = "";
                currentState = ButtonState.DOWN;
            }
        }
        
        function outTo(newState) {
            if (newState <= ButtonState.HOVER && currentState == ButtonState.DOWN) {
                imgDown.style.visibility = "hidden";
                currentState = ButtonState.HOVER;
            }
            
            if (newState <= ButtonState.GROUP && currentState == ButtonState.HOVER) {
                imgHover.style.visibility = "hidden";
                currentState = ButtonState.GROUP;
            }
            
            if (newState <= ButtonState.REST && currentState == ButtonState.GROUP) {
                beginFading();
                currentState = ButtonState.REST;
            }
        }
        
        // Tracker helpers
        
        function enterHandler(tracker, position, buttonDownElmt, buttonDownAny) {
            if (buttonDownElmt) {
                inTo(ButtonState.DOWN);
                if (onEnter) {
                    onEnter();
                }
            } else if (!buttonDownAny) {
                inTo(ButtonState.HOVER);
            }
        }
        
        function exitHandler(tracker, position, buttonDownElmt, buttonDownAny) {
            outTo(ButtonState.GROUP);
            if (buttonDownElmt && onExit) {
                onExit();
            }
        }
        
        function pressHandler(tracker, position) {
            inTo(ButtonState.DOWN);
            if (onPress) {
                onPress();
            }
        }
        
        function releaseHandler(tracker, position, insideElmtPress, insideElmtRelease) {
            if (insideElmtPress && insideElmtRelease) {
                outTo(ButtonState.HOVER);
                if (onRelease) {
                    onRelease();
                }
            } else if (insideElmtPress) {
                outTo(ButtonState.GROUP);
            } else {
                // pressed elsewhere, but released on it. if we ignored the
                // enter event because a button was down, activate hover now
                inTo(ButtonState.HOVER);
            }
        }
        
        function clickHandler(tracker, position, quick, shift) {
            if (onClick && quick) {
                onClick();
            }
        }
        
        // Methods
        
        this.notifyGroupEnter = function() {
            inTo(ButtonState.GROUP);
        };
        
        this.notifyGroupExit = function() {
            outTo(ButtonState.REST);
        };
        
        // Constructor
        
        (function() {
            button.style.display = "inline-block";
            button.style.position = "relative";
            button.title = tooltip;
            
            button.appendChild(imgRest);
            button.appendChild(imgGroup);
            button.appendChild(imgHover);
            button.appendChild(imgDown);
            
            var styleRest = imgRest.style;
            var styleGroup = imgGroup.style;
            var styleHover = imgHover.style;
            var styleDown = imgDown.style;
            
            // DON'T position imgRest absolutely -- let it be inline so it fills
            // up the div, sizing the div appropriately
            styleGroup.position = styleHover.position = styleDown.position = "absolute";
            styleGroup.top = styleHover.top = styleDown.top = "0px";
            styleGroup.left = styleHover.left = styleDown.left = "0px";
            styleHover.visibility = styleDown.visibility = "hidden";
                    // rest and group are always visible
            
            // FF2 is very buggy with inline-block. it squashes the button div,
            // making the group-pressed states' images lower than rest. but
            // apparently, clearing the "top" style fixes this. (note that this
            // breaks the buttons in every other browser, so we're not clearing
            // the "top" style by default...)
            if (SeadragonUtils.getBrowser() == SeadragonBrowser.FIREFOX &&
                    SeadragonUtils.getBrowserVersion() < 3) {
                styleGroup.top = styleHover.top = styleDown.top = ""; 
            }
            
            tracker.enterHandler = enterHandler;
            tracker.exitHandler = exitHandler;
            tracker.pressHandler = pressHandler;
            tracker.releaseHandler = releaseHandler;
            tracker.clickHandler = clickHandler;
            
            tracker.setTracking(true);
            outTo(ButtonState.REST);
        })();
        
    };
    
    // ButtonGroup class
    
    SeadragonButtonGroup = Seadragon.ButtonGroup = function(buttons) {
        
       // Fields
        
        var group = SeadragonUtils.makeNeutralElement("span");
        var buttons = buttons.concat([]);   // copy
        var tracker = new SeadragonMouseTracker(group);
        
        // Properties
        
        this.elmt = group;
        
        // Tracker helpers
        
        function enterHandler(tracker, position, buttonDownElmt, buttonDownAny) {
            // somewhat office ribbon style -- we do this regardless of whether
            // the mouse is down from elsewhere. it's a nice soft glow effect.
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].notifyGroupEnter();
            }
        }
        
        function exitHandler(tracker, position, buttonDownElmt, buttonDownAny) {
            if (!buttonDownElmt) {
                // only go to rest if the mouse isn't down from a button
                for (var i = 0; i < buttons.length; i++) {
                    buttons[i].notifyGroupExit();
                }
            }
        }
        
        function releaseHandler(tracker, position, insideElmtPress, insideElmtRelease) {
            if (!insideElmtRelease) {
                // this means was the mouse was inside the div during press, so
                // since it's no longer inside the div during release, it left
                // the div. but onDivExit() ignored it since the mouse was down
                // from the div, so we'll go out to rest state now.
                for (var i = 0; i < buttons.length; i++) {
                    buttons[i].notifyGroupExit();
                }
            }
        }
        
        // Methods
        
        this.emulateEnter = function() {
            enterHandler();
        };
        
        this.emulateExit = function() {
            exitHandler();
        };
        
        // Constructor
        
        (function() {
            group.style.display = "inline-block";
            
            for (var i = 0; i < buttons.length; i++) {
                group.appendChild(buttons[i].elmt);
            }
            
            tracker.enterHandler = enterHandler;
            tracker.exitHandler = exitHandler;
            tracker.releaseHandler = releaseHandler;
            
            tracker.setTracking(true);
        })();
        
    };
    
})();

// Seadragon.TileSource.js:

//  This code is distributed under the included license agreement, also
//  available here: http://go.microsoft.com/fwlink/?LinkId=164943

var SeadragonTileSource = Seadragon.TileSource = function(
        width, height, tileSize, tileOverlap, minLevel, maxLevel) {
    
    // Fields
    
    var self = this;
    var normHeight = height / width;
    
    // Properties
    
    this.width = width;
    this.height = height;
    this.aspectRatio = width / height;
    this.dimensions = new SeadragonPoint(width, height);
    this.minLevel = minLevel ? minLevel : 0;
    this.maxLevel = maxLevel ? maxLevel :
            Math.ceil(Math.log(Math.max(width, height)) / Math.log(2));
    this.tileSize = tileSize ? tileSize : 0;
    this.tileOverlap = tileOverlap ? tileOverlap : 0;
    
    // Methods
    
    this.getLevelScale = function(level) {
        // equivalent to Math.pow(0.5, numLevels - level);
        return 1 / (1 << (self.maxLevel - level));
    };
    
    this.getNumTiles = function(level) {
        var scale = self.getLevelScale(level);
        var x = Math.ceil(scale * width / self.tileSize);
        var y = Math.ceil(scale * height / self.tileSize);
        
        return new SeadragonPoint(x, y);
    };
    
    this.getPixelRatio = function(level) {
        var imageSizeScaled = self.dimensions.times(self.getLevelScale(level));
        var rx = 1.0 / imageSizeScaled.x;
        var ry = 1.0 / imageSizeScaled.y;
        
        return new SeadragonPoint(rx, ry);
    };
    
    this.getTileAtPoint = function(level, point) {
        // support wrapping by taking less-than-full tiles into account!
        // this is necessary in order to properly wrap low-res tiles.
        var scaledSize = self.dimensions.times(self.getLevelScale(level));
        var pixel = point.times(scaledSize.x);
        var tx, ty;
        
        // optimize for the non-wrapping case, but support wrapping
        if (point.x >= 0.0 && point.x <= 1.0) {
            tx = Math.floor(pixel.x / self.tileSize);
        } else {
            tx = Math.ceil(scaledSize.x / self.tileSize) * Math.floor(pixel.x / scaledSize.x) +
                    Math.floor(((scaledSize.x + (pixel.x % scaledSize.x)) % scaledSize.x) / self.tileSize);
        }
        
        // same thing vertically
        if (point.y >= 0.0 && point.y <= normHeight) {
            ty = Math.floor(pixel.y / self.tileSize);
        } else {
            ty = Math.ceil(scaledSize.y / self.tileSize) * Math.floor(pixel.y / scaledSize.y) +
                    Math.floor(((scaledSize.y + (pixel.y % scaledSize.y)) % scaledSize.y) / self.tileSize);
        }
        
        return new SeadragonPoint(tx, ty);
    };
    
    this.getTileBounds = function(level, x, y) {
        // work in scaled pixels for this level
        var dimensionsScaled = self.dimensions.times(self.getLevelScale(level));
        
        // find position, adjust for no overlap data on top and left edges
        var px = (x === 0) ? 0 : self.tileSize * x - self.tileOverlap;
        var py = (y === 0) ? 0 : self.tileSize * y - self.tileOverlap;
        
        // find size, adjust for no overlap data on top and left edges
        var sx = self.tileSize + (x === 0 ? 1 : 2) * self.tileOverlap;
        var sy = self.tileSize + (y === 0 ? 1 : 2) * self.tileOverlap;
        
        // adjust size for single-tile levels where the image size is smaller
        // than the regular tile size, and for tiles on the bottom and right
        // edges that would exceed the image bounds
        sx = Math.min(sx, dimensionsScaled.x - px);
        sy = Math.min(sy, dimensionsScaled.y - py);
        
        // finally, normalize...
        // note that isotropic coordinates ==> only dividing by scaled x!
        var scale = 1.0 / dimensionsScaled.x;
        return new SeadragonRect(px * scale, py * scale, sx * scale, sy * scale);
    };
    
    this.getTileUrl = function(level, x, y) {
        throw new Error("Method not implemented.");
    };
    
    this.tileExists = function(level, x, y) {
        var numTiles = self.getNumTiles(level);
        return level >= self.minLevel && level <= self.maxLevel &&
                x >= 0 && y >= 0 && x < numTiles.x && y < numTiles.y;
    };
    
};

// Seadragon.DisplayRect.js:

//  This code is distributed under the included license agreement, also
//  available here: http://go.microsoft.com/fwlink/?LinkId=164943

var SeadragonDisplayRect = Seadragon.DisplayRect = function(x, y, width, height, minLevel, maxLevel) {
    
    // Inheritance
    
    SeadragonRect.apply(this, arguments);
    
    // Properties (extended)
    
    this.minLevel = minLevel;
    this.maxLevel = maxLevel;
    
};

SeadragonDisplayRect.prototype = new SeadragonRect();

// Seadragon.DeepZoom.js:

//  This code is distributed under the included license agreement, also
//  available here: http://go.microsoft.com/fwlink/?LinkId=164943

var SeadragonDziTileSource = Seadragon.DziTileSource = function(
        width, height, tileSize, tileOverlap, tilesUrl, tileFormat, displayRects) {
    
    // Inheritance
    
    SeadragonTileSource.apply(this, [width, height, tileSize, tileOverlap]);
    
    // Fields
    
    var self = this;
    var levelRects = {};    // 1D dictionary [level] --> array of DisplayRects
    
    // Properties
    
    this.fileFormat = tileFormat;   // deprecated old property ("file" instead of "tile")
    this.tileFormat = tileFormat;
    this.displayRects = displayRects;
    
    // Constructor
    
    (function() {
        if (!displayRects) {
            return;
        }
        
        for (var i = displayRects.length - 1; i >= 0; i--) {
            var rect = displayRects[i];
            for (var level = rect.minLevel; level <= rect.maxLevel; level++) {
                if (!levelRects[level]) {
                    levelRects[level] = [];
                }
                levelRects[level].push(rect);
            }
        }
    })();
    
    // Methods -- OVERRIDDEN
    
    this.getTileUrl = function(level, x, y) {
        // using array join because it's faster than string concatenation
        return [tilesUrl, level, '/', x, '_', y, '.', tileFormat].join('');
    };
    
    this.tileExists = function(level, x, y) {
        var rects = levelRects[level];
        
        if (!rects || !rects.length) {
            return true;
        }
        
        var scale = self.getLevelScale(level);
        
        for (var i = rects.length - 1; i >= 0; i--) {
            var rect = rects[i];
            
            // check level
            if (level < rect.minLevel || level > rect.maxLevel) {
                continue;
            }
            
            // transform rectangle coordinates to this level
            var xMin = rect.x * scale;
            var yMin = rect.y * scale;
            var xMax = xMin + rect.width * scale;
            var yMax = yMin + rect.height * scale;
            
            // convert to rows and columns -- note that we're ignoring tile
            // overlap, but it's a reasonable approximation. it errs on the side
            // of false positives, which is much better than false negatives.
            xMin = Math.floor(xMin / tileSize);
            yMin = Math.floor(yMin / tileSize);
            xMax = Math.ceil(xMax / tileSize);
            yMax = Math.ceil(yMax / tileSize);
            
            if (xMin <= x && x < xMax && yMin <= y && y < yMax) {
                return true;
            }
        }
        
        return false;
    };
    
};

SeadragonDziTileSource.prototype = new SeadragonTileSource();



(function() {
    
    // Helpers -- Errors
    
    function DziError(message) {
        Error.apply(this, arguments);
        this.message = message;
    }
    
    DziError.prototype = new Error();
    
    function getError(e) {
        if (!(e instanceof DziError)) {
            // shouldn't happen, but if it does, fail fast or at least log it
            SeadragonDebug.error(e.name + " while creating DZI from XML: " + e.message);
            e = new DziError(SeadragonStrings.getString("Errors.Unknown"));
        }
        
        return e;
    }
    
    // Helpers -- URL
    
    function getTilesUrl(xmlUrl) {
        var urlParts = xmlUrl.split('/');
        var filename = urlParts[urlParts.length - 1];
        var lastDot = filename.lastIndexOf('.');
        
        if (lastDot > -1) {
            urlParts[urlParts.length - 1] = filename.slice(0, lastDot);
        }
        
        return urlParts.join('/') + "_files/";
    }
    
    // Helpers -- XML
    
    function processResponse(xhr, tilesUrl) {
        if (!xhr) {
            throw new DziError(SeadragonStrings.getString("Errors.Security"));
        } else if (xhr.status !== 200 && xhr.status !== 0) {
            // chrome has bug where it sends "OK" for 404
            var status = xhr.status;
            var statusText = (status == 404) ? "Not Found" : xhr.statusText;
            throw new DziError(SeadragonStrings.getString("Errors.Status", status, statusText));
        }
        
        var doc = null;
        
        if (xhr.responseXML && xhr.responseXML.documentElement) {
            doc = xhr.responseXML;
        } else if (xhr.responseText)  {
            doc = SeadragonUtils.parseXml(xhr.responseText);
        }
        
        return processXml(doc, tilesUrl);
    }
    
    function processXml(xmlDoc, tilesUrl) {
        if (!xmlDoc || !xmlDoc.documentElement) {
            throw new DziError(SeadragonStrings.getString("Errors.Xml"));
        }
        
        var root = xmlDoc.documentElement;
        var rootName = root.tagName;
        
        if (rootName == "Image") {
            try {
                return processDzi(root, tilesUrl);
            } catch (e) {
                var defMsg = SeadragonStrings.getString("Errors.Dzi");
                throw (e instanceof DziError) ? e : new DziError(defMsg);
            }
        } else if (rootName == "Collection") {
            throw new DziError(SeadragonStrings.getString("Errors.Dzc"));
        } else if (rootName == "Error") {
            return processError(root);
        }
        
        throw new DziError(SeadragonStrings.getString("Errors.Dzi"));
    }
    
    function processDzi(imageNode, tilesUrl) {
        var tileFormat = imageNode.getAttribute("Format");
        
        if (!SeadragonUtils.imageFormatSupported(tileFormat)) {
            throw new DziError(SeadragonStrings.getString("Errors.ImageFormat",
                    tileFormat.toUpperCase()));
        }
        
        var sizeNode = imageNode.getElementsByTagName("Size")[0];
        var dispRectNodes = imageNode.getElementsByTagName("DisplayRect");
        
        var width = parseInt(sizeNode.getAttribute("Width"), 10);
        var height = parseInt(sizeNode.getAttribute("Height"), 10);
        var tileSize = parseInt(imageNode.getAttribute("TileSize"));
        var tileOverlap = parseInt(imageNode.getAttribute("Overlap"));
        var dispRects = [];
        
        for (var i = 0; i < dispRectNodes.length; i++) {
            var dispRectNode = dispRectNodes[i];
            var rectNode = dispRectNode.getElementsByTagName("Rect")[0];
            
            dispRects.push(new SeadragonDisplayRect( 
                parseInt(rectNode.getAttribute("X"), 10),
                parseInt(rectNode.getAttribute("Y"), 10),
                parseInt(rectNode.getAttribute("Width"), 10),
                parseInt(rectNode.getAttribute("Height"), 10),
                // TEMP not sure why we did this -- seems like it's wrong.
                // commenting out the hardcoded 0 and using the XML's value.
                //0,  // ignore MinLevel attribute, bug in Deep Zoom Composer
                parseInt(dispRectNode.getAttribute("MinLevel"), 10),
                parseInt(dispRectNode.getAttribute("MaxLevel"), 10)
            ));
        }
        
        return new SeadragonDziTileSource(width, height, tileSize, tileOverlap,
                tilesUrl, tileFormat, dispRects);
    }
    
    function processError(errorNode) {
        var messageNode = errorNode.getElementsByTagName("Message")[0];
        var message = messageNode.firstChild.nodeValue;
        
        throw new DziError(message);
    }
    
    // Methods -- FACTORIES
    
    SeadragonDziTileSource.getTilesUrl = getTilesUrl;
        // expose this publicly because it's useful for multiple clients
    
    SeadragonDziTileSource.createFromJson = function(jsonObj, callback) {
        var async = typeof(callback) == "function";
        var source, error;
        var dzi = jsonObj;
        
        if (!dzi || (!dzi.url && !dzi.tilesUrl)) {
            error = new DziError(SeadragonStrings.getString("Errors.Empty"));
            
        } else {
            
            try {
                
                var displayRects = dzi.displayRects;
                if (displayRects && displayRects.length) {
                    for (var i = 0, n = displayRects.length; i < n; i++) {
                        var dr = displayRects[i];
                        displayRects[i] = new SeadragonDisplayRect(
                            dr.x || dr[0],
                            dr.y || dr[1],
                            dr.width || dr[2],
                            dr.height || dr[3],
                            dr.minLevel || dr[4],
                            dr.maxLevel || dr[5]
                        );
                    }
                }
                
                source = new SeadragonDziTileSource(
                    dzi.width,
                    dzi.height,
                    dzi.tileSize,
                    dzi.tileOverlap,
                    dzi.tilesUrl || getTilesUrl(dzi.url),
                    dzi.tileFormat,
                    dzi.displayRects
                );
                
                source.xmlUrl = dzi.url;
                
            } catch (e) {
                error = getError(e);
            }
            
        }
        
        if (async) {
            window.setTimeout(SeadragonUtils.createCallback(null, callback, source, error && error.message), 1);
        } else if (error) {
            throw error;
        } else {
            return source;
        }
    };
    
    SeadragonDziTileSource.createFromXml = function(xmlUrl, xmlString, callback) {
        var async = typeof(callback) == "function";
        var error = null;
        
        if (!xmlUrl) {
            error = SeadragonStrings.getString("Errors.Empty");
            if (async) {
                window.setTimeout(function() {
                    callback(null, error);
                }, 1);
                return null;
            }
            throw new DziError(error);
        }
        
        var tilesUrl = getTilesUrl(xmlUrl);
        
        function finish(func, obj) {
            try {
                var source = func(obj, tilesUrl);
                source.xmlUrl = xmlUrl;
                return source;
            } catch (e) {
                if (async) {
                    error = getError(e).message;
                    return null;
                } else {
                    throw getError(e);
                }
            }
        }
        
        if (async) {
            if (xmlString) {
                window.setTimeout(function() {
                    var source = finish(processXml, SeadragonUtils.parseXml(xmlString));
                    callback(source, error);    // call after finish sets error
                }, 1);
            } else {
                SeadragonUtils.makeAjaxRequest(xmlUrl, function(xhr) {
                    var source = finish(processResponse, xhr);
                    callback(source, error);    // call after finish sets error
                });
            }
            
            return null;
        }
        
        // synchronous version
        if (xmlString) {
            return finish(processXml, SeadragonUtils.parseXml(xmlString));
        } else {
            return finish(processResponse, SeadragonUtils.makeAjaxRequest(xmlUrl));
        }
    };
    
})();

// Seadragon.Viewport.js:

//  This code is distributed under the included license agreement, also
//  available here: http://go.microsoft.com/fwlink/?LinkId=164943

var SeadragonViewport = Seadragon.Viewport = function(containerSize, contentSize) {
    
    // Fields
    
    var self = this;
    
    var containerSize = new SeadragonPoint(containerSize.x, containerSize.y); // copy
    var contentAspect = contentSize.x / contentSize.y;
    var contentHeight = contentSize.y / contentSize.x;
    
    var centerSpringX = new SeadragonSpring(0);
    var centerSpringY = new SeadragonSpring(0);
    var zoomSpring = new SeadragonSpring(SeadragonConfig.logarithmicZoom ? 0 : 1);
    var zoomPoint = null;
    
    var homeBounds = new SeadragonRect(0, 0, 1, contentHeight);
    var homeCenter = homeBounds.getCenter();
    
    var LN2 = Math.LN2;
    
    // Helpers
    
    function init() {
        self.goHome(true);
        self.update();
    }
    
    function log2(x) {
        return Math.log(x) / LN2;
    }
    
    function pow2(x) {
        return Math.pow(2, x);
    }
    
    function clamp(x, min, max) {
        return Math.min(Math.max(x, min), max);
    }
    
    function clampPointToRect(point, rect) {
        var xOld = point.x,
            yOld = point.y,
            xNew = clamp(xOld, rect.x, rect.x + rect.width),
            yNew = clamp(yOld, rect.y, rect.y + rect.height);
        
        return (xOld === xNew && yOld === yNew) ? point :
                new SeadragonPoint(xNew, yNew);
    }
    
    function getCenterConstraintRect(current) {
        var zoom = self.getZoom(current),
            width = 1.0 / zoom,
            height = width / self.getAspectRatio(),
            visibilityRatio = SeadragonConfig.visibilityRatio,
            xMin = (visibilityRatio - 0.5) * width,
            yMin = (visibilityRatio - 0.5) * height,
            xDelta = 1.0 - 2 * xMin,
            yDelta = contentHeight - 2 * yMin;
        
        if (xDelta < 0) {
            xMin += (0.5 * xDelta);
            xDelta = 0;
        }
        
        if (yDelta < 0) {
            yMin += (0.5 * yDelta);
            yDelta = 0;
        }
        
        return new Seadragon.Rect(xMin, yMin, xDelta, yDelta);
    }
    
    // Methods -- CONSTRAINT HELPERS
    
    this.getHomeBounds = function () {
        // fit home bounds to viewport's aspect ratio, maintaining center.
        // this is the same logic as in fitBounds().
        
        var viewportAspect = self.getAspectRatio();
        var homeBoundsFit = new SeadragonRect(
            homeBounds.x, homeBounds.y, homeBounds.width, homeBounds.height);
        
        if (contentAspect >= viewportAspect) {
            // width is bigger relative to viewport, resize height
            homeBoundsFit.height = homeBounds.width / viewportAspect;
            homeBoundsFit.y = homeCenter.y - homeBoundsFit.height / 2;
        } else {
            // height is bigger relative to viewport, resize width
            homeBoundsFit.width = homeBounds.height * viewportAspect;
            homeBoundsFit.x = homeCenter.x - homeBoundsFit.width / 2;
        }
        
        return homeBoundsFit;
    };
    
    this.getHomeCenter = function () {
        return homeCenter;
    };

    this.getHomeZoom = function () {
        // if content is wider, we'll fit width, otherwise height
        var aspectFactor = contentAspect / self.getAspectRatio();
        return (aspectFactor >= 1) ? 1 : aspectFactor;
    };
    
    this.getMinCenter = function (current) {
        return getCenterConstraintRect(current).getTopLeft();
    };
    
    this.getMaxCenter = function (current) {
        return getCenterConstraintRect(current).getBottomRight();
    };

    this.getMinZoom = function () {
        var homeZoom = self.getHomeZoom();

        // for backwards compatibility, respect minZoomDimension if present
        if (SeadragonConfig.minZoomDimension) {
            var zoom = (contentSize.x <= contentSize.y) ?
                SeadragonConfig.minZoomDimension / containerSize.x :
                SeadragonConfig.minZoomDimension / (containerSize.x * contentHeight);
        } else {
            var zoom = SeadragonConfig.minZoomImageRatio * homeZoom;
        }

        return Math.min(zoom, homeZoom);
    };

    this.getMaxZoom = function () {
        var zoom = contentSize.x * SeadragonConfig.maxZoomPixelRatio / containerSize.x;
        return Math.max(zoom, self.getHomeZoom());
    };
        
    // Methods -- ACCESSORS

    this.getAspectRatio = function () {
        return containerSize.x / containerSize.y;
    };
    
    this.getContainerSize = function() {
        return new SeadragonPoint(containerSize.x, containerSize.y);
    };
    
    this.getBounds = function(current) {
        var center = self.getCenter(current);
        var width = 1.0 / self.getZoom(current);
        var height = width / self.getAspectRatio();
        
        return new SeadragonRect(center.x - width / 2.0, center.y - height / 2.0,
            width, height);
    };
    
    this.getCenter = function(current) {
        var centerCurrent = new SeadragonPoint(
            centerSpringX.getCurrent(), centerSpringY.getCurrent());
        var centerTarget = new SeadragonPoint(
            centerSpringX.getTarget(), centerSpringY.getTarget());
        
        if (current) {
            return centerCurrent;
        } else if (!zoomPoint) {
            // no adjustment necessary since we're not zooming
            return centerTarget;
        }
        
        // to get the target center, we need to adjust for the zoom point.
        // we'll do this in the same way as the update() method.
        
        // manually calculate bounds based on this unadjusted target center.
        // this is mostly a duplicate of getBounds() above. note that this is
        // based on the TARGET zoom but the CURRENT center.
        var zoom = self.getZoom();
        var width = 1.0 / zoom;
        var height = width / self.getAspectRatio();
        var bounds = new SeadragonRect(
            centerCurrent.x - width / 2.0,
            centerCurrent.y - height / 2.0,
            width,
            height
        );
        
        // the conversions here are identical to the pixelFromPoint() and
        // deltaPointsFromPixels() methods.
        var oldZoomPixel = self.pixelFromPoint(zoomPoint, true);
        var newZoomPixel = zoomPoint.minus(bounds.getTopLeft()).times(containerSize.x / bounds.width);
        var deltaZoomPixels = newZoomPixel.minus(oldZoomPixel);
        var deltaZoomPoints = deltaZoomPixels.divide(containerSize.x * zoom);
        
        // finally, shift center to negate the change.
        return centerTarget.plus(deltaZoomPoints);
    };
    
    this.getZoom = function(current) {
        var zoom;
        if (current) {
            zoom = zoomSpring.getCurrent();
            return SeadragonConfig.logarithmicZoom ? pow2(zoom) : zoom;
        } else {
            zoom = zoomSpring.getTarget();
            return SeadragonConfig.logarithmicZoom ? pow2(zoom) : zoom;
        }
    };
    
    // Methods -- MODIFIERS
    
    this.applyConstraints = function(immediately) {
        // first, apply zoom constraints
        var oldZoom = self.getZoom();
        var newZoom = clamp(oldZoom, self.getMinZoom(), self.getMaxZoom());
        if (oldZoom != newZoom) {
            self.zoomTo(newZoom, zoomPoint, immediately);
        }
        
        // then, apply pan constraints -- but do so via fitBounds() in order to
        // account for (and adjust) the zoom point! also ignore constraints if
        // content is being wrapped! but differentiate horizontal vs. vertical.
        var oldCenter = self.getCenter();
        var newCenter = clampPointToRect(oldCenter, getCenterConstraintRect());
        if (SeadragonConfig.wrapHorizontal) {
            newCenter.x = oldCenter.x;
        }
        if (SeadragonConfig.wrapVertical) {
            newCenter.y = oldCenter.y;
        }
        if (!oldCenter.equals(newCenter)) {
            var width = 1.0 / newZoom,
                height = width / self.getAspectRatio();
            self.fitBounds(new SeadragonRect(
                newCenter.x - 0.5 * width,
                newCenter.y - 0.5 * height,
                width,
                height
            ), immediately);
        }
    };
    
    this.ensureVisible = function(immediately) {
        // for backwards compatibility
        self.applyConstraints(immediately);
    };
    
    this.fitBounds = function(bounds, immediately) {
        var aspect = self.getAspectRatio();
        var center = bounds.getCenter();
        
        // resize bounds to match viewport's aspect ratio, maintaining center.
        // note that zoom = 1/width, and width = height*aspect.
        var newBounds = new SeadragonRect(bounds.x, bounds.y, bounds.width, bounds.height);
        if (newBounds.getAspectRatio() >= aspect) {
            // width is bigger relative to viewport, resize height
            newBounds.height = bounds.width / aspect;
            newBounds.y = center.y - newBounds.height / 2;
        } else {
            // height is bigger relative to viewport, resize width
            newBounds.width = bounds.height * aspect;
            newBounds.x = center.x - newBounds.width / 2;
        }
        
        // stop movement first! this prevents the operation from missing
        self.panTo(self.getCenter(true), true);
        self.zoomTo(self.getZoom(true), null, true);
        
        // capture old values for bounds and width. we need both, but we'll
        // also use both for redundancy, to protect against precision errors.
        // note: use target bounds, since update() hasn't been called yet!
        var oldBounds = self.getBounds();
        var oldZoom = self.getZoom();
        
        // if we're already at the correct zoom, just pan and we're done.
        // we'll check both zoom and bounds for redundancy, to protect against
        // precision errors (see note below).
        var newZoom = 1.0 / newBounds.width;
        if (newZoom == oldZoom || newBounds.width == oldBounds.width) {
            self.panTo(center, immediately);
            return;
        }
        
        // otherwise, we need to zoom about the only point whose pixel transform
        // is constant between the old and new bounds. this is just tricky math.
        var refPoint = oldBounds.getTopLeft().times(containerSize.x / oldBounds.width).minus(
                newBounds.getTopLeft().times(containerSize.x / newBounds.width)).divide(
                containerSize.x / oldBounds.width - containerSize.x / newBounds.width);
        
        // note: that last line (cS.x / oldB.w - cS.x / newB.w) was causing a
        // divide by 0 in the case that oldBounds.width == newBounds.width.
        // that should have been picked up by the zoom check, but in certain
        // cases, the math is slightly off and the zooms are different. so now,
        // the zoom check has an extra check added.
        
        self.zoomTo(newZoom, refPoint, immediately);
    };
   
    this.goHome = function(immediately) {
        // calculate center adjusted for zooming
        var center = self.getCenter();
        
        // if we're wrapping horizontally, "unwind" the horizontal spring
        if (SeadragonConfig.wrapHorizontal) {
            // this puts center.x into the range [0, 1) always
            center.x = (1 + (center.x % 1)) % 1;
            centerSpringX.resetTo(center.x);
            centerSpringX.update();
        }
        
        // if we're wrapping vertically, "unwind" the vertical spring
        if (SeadragonConfig.wrapVertical) {
            // this puts center.y into the range e.g. [0, 0.75) always
            center.y = (contentHeight + (center.y % contentHeight)) % contentHeight;
            centerSpringY.resetTo(center.y);
            centerSpringY.update();
        }
        
        self.fitBounds(homeBounds, immediately);
    };
    
    this.panBy = function(delta, immediately) {
        self.panTo(self.getCenter().plus(delta), immediately);
    };
    
    this.panTo = function(center, immediately) {
        // we have to account for zoomPoint here, i.e. if we're in the middle
        // of a zoom about some point and panTo() is called, we should be
        // spring to some center that will get us to the specified center.
        // the logic here is thus the exact inverse of the getCenter() method.
        
        if (immediately) {
            centerSpringX.resetTo(center.x);
            centerSpringY.resetTo(center.y);
            return;
        }
        
        if (!zoomPoint) {
            centerSpringX.springTo(center.x);
            centerSpringY.springTo(center.y);
            return;
        }
                
        // manually calculate bounds based on this unadjusted target center.
        // this is mostly a duplicate of getBounds() above. note that this is
        // based on the TARGET zoom but the CURRENT center.
        var zoom = self.getZoom();
        var width = 1.0 / zoom;
        var height = width / self.getAspectRatio();
        var bounds = new SeadragonRect(
            centerSpringX.getCurrent() - width / 2.0,
            centerSpringY.getCurrent() - height / 2.0,
            width,
            height
        );
        
        // the conversions here are identical to the pixelFromPoint() and
        // deltaPointsFromPixels() methods.
        var oldZoomPixel = self.pixelFromPoint(zoomPoint, true);
        var newZoomPixel = zoomPoint.minus(bounds.getTopLeft()).times(containerSize.x / bounds.width);
        var deltaZoomPixels = newZoomPixel.minus(oldZoomPixel);
        var deltaZoomPoints = deltaZoomPixels.divide(containerSize.x * zoom);
        
        // finally, shift center to negate the change.
        var centerTarget = center.minus(deltaZoomPoints);
        
        centerSpringX.springTo(centerTarget.x);
        centerSpringY.springTo(centerTarget.y);
    };
    
    this.zoomBy = function(factor, refPoint, immediately) {
        self.zoomTo(self.getZoom() * factor, refPoint, immediately);
    };
    
    this.zoomTo = function(zoom, refPoint, immediately) {
        // we used to constrain zoom automatically here; now it needs to be
        // explicitly constrained, via applyConstraints().
        //zoom = clamp(zoom, self.getMinZoom(), self.getMaxZoom());
        
        if (immediately) {
            zoomSpring.resetTo(SeadragonConfig.logarithmicZoom ? log2(zoom) : zoom);
        } else {
            zoomSpring.springTo(SeadragonConfig.logarithmicZoom ? log2(zoom) : zoom);
        }
        
        zoomPoint = refPoint instanceof SeadragonPoint ? refPoint : null;
    };
    
    this.resize = function(newContainerSize, maintain) {
        // default behavior: just ensure the visible content remains visible.
        // note that this keeps the center (relative to the content) constant.
        var oldBounds = self.getBounds();
        var newBounds = oldBounds;
        var widthDeltaFactor = newContainerSize.x / containerSize.x;
        
        // update container size, but make copy first
        containerSize = new SeadragonPoint(newContainerSize.x, newContainerSize.y);
        
        if (maintain) {
            // no resize relative to screen, resize relative to viewport.
            // keep origin constant, zoom out (increase bounds) by delta factor.
            newBounds.width = oldBounds.width * widthDeltaFactor;
            newBounds.height = newBounds.width / self.getAspectRatio(); 
        }
        
        self.fitBounds(newBounds, true);
    };
    
    this.update = function() {
        var oldCenterX = centerSpringX.getCurrent();
        var oldCenterY = centerSpringY.getCurrent();
        var oldZoom = zoomSpring.getCurrent();
        
        // remember position of zoom point
        if (zoomPoint) {
            var oldZoomPixel = self.pixelFromPoint(zoomPoint, true);
        }
        
        // now update zoom only, don't update pan yet
        zoomSpring.update();
        
        // adjust for change in position of zoom point, if we've zoomed
        if (zoomPoint && zoomSpring.getCurrent() != oldZoom) {
            var newZoomPixel = self.pixelFromPoint(zoomPoint, true);
            var deltaZoomPixels = newZoomPixel.minus(oldZoomPixel);
            var deltaZoomPoints = self.deltaPointsFromPixels(deltaZoomPixels, true);
            
            // shift pan to negate the change
            centerSpringX.shiftBy(deltaZoomPoints.x);
            centerSpringY.shiftBy(deltaZoomPoints.y);
        } else {
            // don't try to adjust next time; this improves performance
            zoomPoint = null;
        }
        
        // now after adjustment, update pan
        centerSpringX.update();
        centerSpringY.update();
        
        return centerSpringX.getCurrent() != oldCenterX ||
                centerSpringY.getCurrent() != oldCenterY ||
                zoomSpring.getCurrent() != oldZoom;
    };
    
    // Methods -- CONVERSION HELPERS
    
    this.deltaPixelsFromPoints = function(deltaPoints, current) {
        return deltaPoints.times(containerSize.x * self.getZoom(current));
    };
    
    this.deltaPointsFromPixels = function(deltaPixels, current) {
        return deltaPixels.divide(containerSize.x * self.getZoom(current));
    };
    
    this.pixelFromPoint = function(point, current) {
        var bounds = self.getBounds(current);
        return point.minus(bounds.getTopLeft()).times(containerSize.x / bounds.width);
    };
    
    this.pointFromPixel = function(pixel, current) {
        var bounds = self.getBounds(current);
        return pixel.divide(containerSize.x / bounds.width).plus(bounds.getTopLeft());
    };
    
    // Constructor
    
    init();
    
};

// Seadragon.Drawer.js:

//  This code is distributed under the included license agreement, also
//  available here: http://go.microsoft.com/fwlink/?LinkId=164943

var SeadragonDrawer,
    SeadragonOverlayPlacement;

(function() {
    
    // Constants
    
    var QUOTA = 100;    // the max number of images we should keep in memory
    var MIN_PIXEL_RATIO = 0.5;  // the most shrunk a tile should be
    
    // Method of drawing
    
    var browser = SeadragonUtils.getBrowser();
    var browserVer = SeadragonUtils.getBrowserVersion();
    var userAgent = navigator.userAgent;
    
    // check if browser supports <canvas>.
    // update: IE9 returns type "object" instead of "function"...
    var hasCanvas = !!(document.createElement("canvas").getContext);
    
    // we use this style for a lot of our checks, so caching it here:
    var docElmt = document.documentElement || {};
    var docElmtStyle = docElmt.style || {};
    
    // check if browser supports CSS transforms. using this technique:
    // http://www.zachstronaut.com/posts/2009/02/17/animate-css-transforms-firefox-webkit.html
    // also, the spec says translate values need to include units (e.g. "px"),
    // but webkit chokes on units. we need to check for this bug.
    var hasCssTransforms = false;
    var cssTransformProperties = ["msTransform", "WebkitTransform", "MozTransform"];
    var cssTransformProperty, cssTransformNoUnits;
    
    while (cssTransformProperty = cssTransformProperties.shift()) {
        if (typeof docElmtStyle[cssTransformProperty] !== "undefined") {
            hasCssTransforms = true;
            cssTransformNoUnits = /webkit/i.test(cssTransformProperty);
            break;
        }
    }
    
    // we'll use a similar technique to check for CSS transitions.
    // TEMP the value for CSS transition-property is the CSS name of the
    // property you want transitioned, e.g. "-webkit-transform", and NOT the
    // JavaScript name, e.g. "WebkitTransform". so for the time being, we're
    // hardcoding this stuff to just webkit instead of general checking.
    var cssTransformPropertyCssName = "-webkit-transform";
    var cssTransitionProperty = "WebkitTransition";
    var hasCssTransitions =
        typeof docElmtStyle[cssTransitionProperty] !== "undefined";
    
    // check if browser is IE, or supports IE's proprietary DirectX filters.
    // specifically, the matrix transform filter is similar to CSS transforms!
    // http://msdn.microsoft.com/en-us/library/ms533014(v=VS.85).aspx
    var IE_MATRIX_FILTER = "progid:DXImageTransform.Microsoft.Matrix";
    var IE_MATRIX_FILTER_REGEXP = new RegExp(
        IE_MATRIX_FILTER + "\\(.*?\\)", 'g');
    
    // TEMP checking for the presence of the "filters" property isn't really
    // strong feature detection, so added an explicit IE check. that's fine?
    // update: also trying catch this since IE9 throws an error here.
    var hasIeFilters = (function() {
        try {
            return (browser == SeadragonBrowser.IE) &&
                !!(document.documentElement.filters);
        } catch (e) {
            return false;
        }
    })();
    
    // in general, <canvas> is great because it's standardized and stable for
    // the functionality we need. plus, firefox, opera and safari 4 all have
    // subpixel precision inside <canvas>. CSS transforms also seem to get us
    // subpixel precision, and more broadly, across firefox, safari 4 and
    // chrome. both <canvas> and CSS transform
    // have potential to be hardware accelerated, so deciding between the two
    // comes down to subpixel precision and perf based on experimentation.
    // note that IE provides proprietary matrix transforms which also get us
    // subpixel precision!! for fallback, we use regular CSS position/size.
    // UPDATE: IE's matrix transforms are dog-slow, no good unfortunately.
    // but, we may still be able to use them somehow, maybe once per frame on
    // just the canvas and not multiple times per frame on each tile.
    // TODO investigate IE matrix transforms on canvas instead of per tile.
    // TEMP for now, turning off IE matrix transforms altogether.
    var badCanvas =     // due to no subpixel precision
            (browser == SeadragonBrowser.SAFARI && browserVer < 4)
    var useCanvas = hasCanvas && !badCanvas;
    var useCssTransforms = !useCanvas && hasCssTransforms;
    var useIeFilters = false;
    
    // UPDATE: safari 4 on Mac OS X 10.6 (snow leopard) and safari mobile on
    // iPhone OS 3 hardware accelerate CSS transforms when combined with CSS
    // transitions, so use them there over <canvas>!
    // UPDATE: this causes flickers on the iPhone; removing support for now.
    //var acceleratedTransforms =
    //    browser == SeadragonBrowser.SAFARI && userAgent.match(/Mac OS X/) && (
    //        // case 1: safari 4 (desktop and iPad)
    //        browserVer >= 4 ||
    //        // case 2: safari mobile, might be 3
    //        userAgent.match(/Mobile\//));
    //if (hasCssTransforms && hasCssTransitions && acceleratedTransforms) {
    //    useCanvas = false;
    //    useCssTransforms = true;
    //}
    
    // regardless, in IE, we use <img> tags. unfortunately, in IE, <img> tags
    // use a crappy nearest-neighbor interpolation by default. IE7+ lets us
    // change this via a proprietary CSS property. unfortunately, changing it to
    // bicubic caused tile seams in IE7 -- but not IE8! even IE8 in compat mode
    // has no tile seams. so we need to detect IE8 regardless of mode; we do so
    // via document.documentMode, introduced in IE8 for all modes. finally, in
    // IE7, we'll explicitly say nearest-neighbor, otherwise if the user zooms
    // the page, IE7 would implicitly change it to bicubic, causing tile seams.
    var MS_INTERPOLATION_MODE = (typeof document.documentMode !== "undefined") ?
            "bicubic" : "nearest-neighbor";
    
    // Tiles
    
    function Tile(level, x, y, bounds, exists, url) {
        // Core
        this.level = level;
        this.x = x;
        this.y = y;
        this.bounds = bounds;   // where this tile fits, in normalized coordinates
        this.exists = exists;   // part of sparse image? tile hasn't failed to load?
        
        // Image
        this.url = url;         // the URL of this tile's image
        this.elmt = null;       // the HTML element for this tile
        this.image = null;      // the Image object for this tile
        this.loaded = false;    // is this tile loaded?
        this.loading = false;   // or is this tile loading?
        
        // Drawing
        this.style = null;      // alias of this.elmt.style
        this.position = null;   // this tile's position on screen, in pixels
        this.size = null;       // this tile's size on screen, in pixels
        this.blendStart = null; // the start time of this tile's blending
        this.opacity = null;    // the current opacity this tile should be
        this.distance = null;   // the distance of this tile to the viewport center
        this.visibility = null; // the visibility score of this tile
        
        // Caching
        this.beingDrawn = false;// whether this tile is currently being drawn
        this.lastDrawnTime = 0; // when the tile was last drawn
        this.lastTouchTime = 0; // the time that tile was last touched (though not necessarily drawn)
    }
    
    Tile.prototype.toString = function() {
        return this.level + "/" + this.x + "_" + this.y;
    };
    
    Tile.prototype.drawHTML = function(container) {
        if (!this.loaded) {
            SeadragonDebug.error("Attempting to draw tile " + this.toString() +
                    " when it's not yet loaded.");
            return;
        }
        
        // initialize if first time
        if (!this.elmt) {
            this.elmt = SeadragonUtils.makeNeutralElement("img");
            this.elmt.src = this.url; 
            this.style = this.elmt.style;
            this.style.position = "absolute";
            this.style.msInterpolationMode = MS_INTERPOLATION_MODE;
                // IE only property. see note above for explanation.
            
            if (useCssTransforms) {
                this.style[cssTransformProperty + "Origin"] = "0px 0px";
                // TEMP commenting out CSS transitions for now; not stable yet.
                //if (hasCssTransitions) {
                //    this.style[cssTransitionProperty + "Property"] = cssTransformPropertyCssName;
                //    this.style[cssTransitionProperty + "Duration"] = ".01666667s";   // TEMP 1/60th of a second
                //}
            }
        }
        
        var elmt = this.elmt;
        var image = this.image;
        var style = this.style;
        var position = this.position;
        var size = this.size;
        
        if (elmt.parentNode != container) {
            container.appendChild(elmt);
        }
        
        if (useCssTransforms) {
            
            // warning! sometimes chrome doesn't have this new <img> element
            // loaded yet, even though it's a clone of another <img> element
            // that is loaded. so we use the width and height properties of the
            // original <img> (the image variable instead of this one (elmt).
            style[cssTransformProperty] = [
                'matrix(',
                (size.x / image.width).toFixed(8),
                ',0,0,',
                (size.y / image.height).toFixed(8),
                ',',
                position.x.toFixed(8),
                cssTransformNoUnits ? ',' : 'px,',
                position.y.toFixed(8),
                cssTransformNoUnits ? ')' : 'px)'
            ].join('');
            
        } else if (useIeFilters) {
            
            var containerWidth = container.clientWidth,
                containerHeight = container.clientHeight;
            
            style.width = containerWidth + "px";
            style.height = containerHeight + "px";
            style.filter = [
                'progid:DXImageTransform.Microsoft.Matrix(',
                'M11=',
                (size.x / containerWidth).toFixed(8),
                ',M22=',
                (size.y / containerHeight).toFixed(8),
                ',Dx=',
                position.x.toFixed(8),
                ',Dy=',
                position.y.toFixed(8),
                ')'
            ].join('');
            
        } else {
            
            position = position.apply(Math.floor);
            size = size.apply(Math.ceil);
            
            style.left = position.x + "px";
            style.top = position.y + "px";
            style.width = size.x + "px";
            style.height = size.y + "px";
            
        }
        
        // TEMP because we know exactly whether we're using IE filters or not,
        // short-circuitting this utils call to optimize the logic.
        // UPDATE: we're no longer using IE filters, so reverting this logic.
        SeadragonUtils.setElementOpacity(elmt, this.opacity);
        //var opacity = this.opacity;
        //if (useIeFilters && opacity < 1) {
        //    style.filter += " alpha(opacity=" + Math.round(100 * opacity) + ")";
        //} else {
        //    style.opacity = (opacity < 1) ? opacity : '';
        //}
    };
    
    Tile.prototype.drawCanvas = function(context) {
        if (!this.loaded) {
            SeadragonDebug.error("Attempting to draw tile " + this.toString() +
                    " when it's not yet loaded.");
            return;
        }
        
        var position = this.position;
        var size = this.size;
            
        context.globalAlpha = this.opacity;
        context.drawImage(this.image, position.x, position.y, size.x, size.y);
    };
    
    Tile.prototype.unload = function() {
        if (this.elmt && this.elmt.parentNode) {
            this.elmt.parentNode.removeChild(this.elmt);
        }
        
        this.elmt = null;
        this.image = null;
        this.loaded = false;
        this.loading = false;
    }
    
    // Overlays
    
    SeadragonOverlayPlacement = Seadragon.OverlayPlacement = {
        CENTER: 0,
        TOP_LEFT: 1,
        TOP: 2,
        TOP_RIGHT: 3,
        RIGHT: 4,
        BOTTOM_RIGHT: 5,
        BOTTOM: 6,
        BOTTOM_LEFT: 7,
        LEFT: 8
    };
    
    /**
     * Creates an "adjustment" function for a given overlay placement that
     * adjusts an overlay's position depending on its size and placement. This
     * gives better perf during draw loop since we don't need to re-check and
     * re-calculate the adjustment every single iteration.
     */
    function createAdjustmentFunction(placement) {
        switch (placement) {
            case SeadragonOverlayPlacement.TOP_LEFT:
                return function(position, size) {
                    // no adjustment needed
                };
            case SeadragonOverlayPlacement.TOP:
                return function(position, size) {
                    position.x -= size.x / 2;
                    // no y adjustment needed
                };
            case SeadragonOverlayPlacement.TOP_RIGHT:
                return function(position, size) {
                    position.x -= size.x;
                    // no y adjustment needed
                };
            case SeadragonOverlayPlacement.RIGHT:
                return function(position, size) {
                    position.x -= size.x;
                    position.y -= size.y / 2;
                };
            case SeadragonOverlayPlacement.BOTTOM_RIGHT:
                return function(position, size) {
                    position.x -= size.x;
                    position.y -= size.y;
                };
            case SeadragonOverlayPlacement.BOTTOM:
                return function(position, size) {
                    position.x -= size.x / 2;
                    position.y -= size.y;
                };
            case SeadragonOverlayPlacement.BOTTOM_LEFT:
                return function(position, size) {
                    // no x adjustment needed
                    position.y -= size.y;
                };
            case SeadragonOverlayPlacement.LEFT:
                return function(position, size) {
                    // no x adjustment needed
                    position.y -= size.y / 2;
                };
            case SeadragonOverlayPlacement.CENTER:
            default:
                return function(position, size) {
                    position.x -= size.x / 2;
                    position.y -= size.y / 2;
                };
        }
    }
    
    function Overlay(elmt, loc, placement) {
        // Core
        this.elmt = elmt;
        this.scales = (loc instanceof SeadragonRect);
        this.bounds = new SeadragonRect(loc.x, loc.y, loc.width, loc.height);
        // Drawing
        this.adjust = createAdjustmentFunction(loc instanceof SeadragonPoint ?
                placement : SeadragonOverlayPlacement.TOP_LEFT);    // rects are always top-left
        this.position = new SeadragonPoint(loc.x, loc.y);
        this.size = new SeadragonPoint(loc.width, loc.height);
        this.style = elmt.style;
        this.naturalSize = new SeadragonPoint(elmt.clientWidth, elmt.clientHeight);
    }
    
    Overlay.prototype.destroy = function() {
        var elmt = this.elmt;
        var style = this.style;
        
        if (elmt.parentNode) {
            elmt.parentNode.removeChild(elmt);
        }
        
        style.top = "";
        style.left = "";
        style.position = "";
        
        if (this.scales) {
            style.width = "";
            style.height = "";
        }
    };
    
    Overlay.prototype.drawHTML = function(container) {
        var elmt = this.elmt;
        var style = this.style;
        var scales = this.scales;
        var naturalSize = this.naturalSize;
        
        if (elmt.parentNode != container) {
            container.appendChild(elmt);
            style.position = "absolute";
            naturalSize.x = elmt.clientWidth;
            naturalSize.y = elmt.clientHeight;
        }
        
        var position = this.position;
        var size = this.size;
        
        // override calculated size if this element doesn't scale with image
        if (!scales) {
            size.x = naturalSize.x = naturalSize.x || elmt.clientWidth;
            size.y = naturalSize.y = naturalSize.y || elmt.clientHeight;
        }
        
        // adjust position based on placement (default is center)
        this.adjust(position, size);
        
        if (SeadragonConfig.transformOverlays && hasCssTransforms) {
            
            style[cssTransformProperty + "Origin"] = "0px 0px";
            style[cssTransformProperty] = [
                'translate(',
                position.x.toFixed(8),
                'px,',  // webkit correctly accepts length units for translate() func
                position.y.toFixed(8),
                'px)'
            ].join('');
            
            if (scales) {
                
                if (!elmt.clientWidth) {
                    style.width = "100%";
                }
                if (!elmt.clientHeight) {
                    style.height = "100%";
                }
                
                style[cssTransformProperty] += [
                    ' scale(',
                    (size.x / elmt.clientWidth).toFixed(8),
                    ',',
                    (size.y / elmt.clientHeight).toFixed(8),
                    ')'
                ].join('');
                
            }
            
        } else if (SeadragonConfig.transformOverlays && useIeFilters) {
            
            var containerWidth = container.clientWidth,
                containerHeight = container.clientHeight;
            
            style.width = containerWidth + "px";
            style.height = containerHeight + "px";
            style.filter = [
                'progid:DXImageTransform.Microsoft.Matrix(',
                'M11=',
                (size.x / containerWidth).toFixed(8),
                ',M22=',
                (size.y / containerHeight).toFixed(8),
                ',Dx=',
                position.x.toFixed(8),
                ',Dy=',
                position.y.toFixed(8),
                ')'
            ].join('');
            
        } else {
            
            position = position.apply(Math.floor);
            size = size.apply(Math.ceil);
            
            style.left = position.x + "px";
            style.top = position.y + "px";
            
            if (scales) {
                style.width = size.x + "px";
                style.height = size.y + "px";
            }
            
        }
    };
    
    Overlay.prototype.update = function(loc, placement) {
        this.scales = (loc instanceof SeadragonRect);
        this.bounds = new SeadragonRect(loc.x, loc.y, loc.width, loc.height);
        this.adjust = createAdjustmentFunction(loc instanceof SeadragonPoint ?
                placement : SeadragonOverlayPlacement.TOP_LEFT);    // rects are always top-left
    };
    
    // Drawer
    
    SeadragonDrawer = Seadragon.Drawer = function(source, viewport, elmt) {
        
        // Implementation note:
        // 
        // This class draws two types of things: tiles and overlays. Currently,
        // only HTML elements are supported overlay types, so they will always
        // be inserted into the DOM. Tiles are images, which allows them to be
        // both inserted into the DOM or to be drawn onto a <canvas> element.
        // 
        // Higher-res (higher-level) tiles need to be drawn above lower-res
        // (lower-level) tiles. Overlays need to be drawn above all tiles. For
        // tiles drawn using <canvas>, this is easy. For tiles drawn as HTML,
        // and for overlays, we can use the CSS z-index property, but that has
        // issues in full page. So instead, we can achieve natural z-ordering
        // through the order of the elements in the container.
        // 
        // To do this, in the HTML mode, we add the tiles not to the container
        // directly, but to a div inside the container. This div is the first
        // child of the container. The overlays are added to the container
        // directly, after that div. This ensures that the overlays are always
        // drawn above the tiles.
        // 
        // In the below fields, the canvas field refers to the <canvas> element
        // if we're drawing with canvas, or the div that contains the tiles if
        // we're drawing with HTML.
        // 
        // Minor note: we remove and re-add tiles to the div every frame, but we
        // can't do this with overlays, as it breaks browser event behavior.
        
        // Fields
        
        var container = SeadragonUtils.getElement(elmt);
        var canvas = SeadragonUtils.makeNeutralElement(useCanvas ? "canvas" : "div");
        var context = useCanvas ? canvas.getContext("2d") : null;
        
        var imageLoader = new SeadragonImageLoader();
        var profiler = new SeadragonProfiler();
        
        var minLevel = source.minLevel;
        var maxLevel = source.maxLevel;
        var tileSize = source.tileSize;
        var tileOverlap = source.tileOverlap;
        var normHeight = source.height / source.width;
        
        var cacheNumTiles = {};     // 1d dictionary [level] --> Point
        var cachePixelRatios = {};  // 1d dictionary [level] --> Point
        var tilesMatrix = {};       // 3d dictionary [level][x][y] --> Tile
        var tilesLoaded = [];       // unordered list of Tiles with loaded images
        var coverage = {};          // 3d dictionary [level][x][y] --> Boolean
        
        var overlays = [];          // unordered list of Overlays added
        var lastDrawn = [];         // unordered list of Tiles drawn last frame
        var lastFrameTime = 0;      // the timestamp of the previous frame
        var lastResetTime = 0;
        var midUpdate = false;
        var updateAgain = true;
        
        // Properties
        
        this.elmt = container;
        this.profiler = profiler;
        
        // Constructor
        
        (function() {
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            canvas.style.position = "absolute";
            container.style.textAlign = "left";    // explicit left-align
            container.appendChild(canvas);
        })();
        
        // Helpers -- CACHES
        
        function getNumTiles(level) {
            if (!cacheNumTiles[level]) {
                cacheNumTiles[level] = source.getNumTiles(level);
            }
            
            return cacheNumTiles[level];
        }
        
        function getPixelRatio(level) {
            if (!cachePixelRatios[level]) {
                cachePixelRatios[level] = source.getPixelRatio(level);
            }
            
            return cachePixelRatios[level];
        }
        
        // Helpers -- TILES
        
        function getTile(level, x, y, time, numTilesX, numTilesY) {
            if (!tilesMatrix[level]) {
                tilesMatrix[level] = {};
            }
            if (!tilesMatrix[level][x]) {
                tilesMatrix[level][x] = {};
            }
            
            // initialize tile object if first time
            if (!tilesMatrix[level][x][y]) {
                // where applicable, adjust x and y to support wrapping.
                var xMod = (numTilesX + (x % numTilesX)) % numTilesX;
                var yMod = (numTilesY + (y % numTilesY)) % numTilesY;
                var bounds = source.getTileBounds(level, xMod, yMod);
                var exists = source.tileExists(level, xMod, yMod);
                var url = source.getTileUrl(level, xMod, yMod);
                
                // also adjust bounds to support wrapping.
                bounds.x += 1.0 * (x - xMod) / numTilesX;
                bounds.y += normHeight * (y - yMod) / numTilesY;
                
                tilesMatrix[level][x][y] = new Tile(level, x, y, bounds, exists, url);
            }
            
            var tile = tilesMatrix[level][x][y];
            
            // mark tile as touched so we don't reset it too soon
            tile.lastTouchTime = time;
            
            return tile;
        }
        
        function loadTile(tile, time) {
            tile.loading = imageLoader.loadImage(tile.url,
                    SeadragonUtils.createCallback(null, onTileLoad, tile, time));
        }
        
        function onTileLoad(tile, time, image) {
            tile.loading = false;
            
            if (midUpdate) {
                SeadragonDebug.error("Tile load callback in middle of drawing routine.");
                return;
            } else if (!image) {
                SeadragonDebug.log("Tile " + tile + " failed to load: " + tile.url);
                tile.exists = false;
                return;
            } else if (time < lastResetTime) {
                SeadragonDebug.log("Ignoring tile " + tile + " loaded before reset: " + tile.url);
                return;
            }
            
            tile.loaded = true;
            tile.image = image;
            
            var insertionIndex = tilesLoaded.length;
            
            if (tilesLoaded.length >= QUOTA) {
                var cutoff = Math.ceil(Math.log(tileSize) / Math.log(2));
                    // don't delete any single-tile levels. this takes priority.
                
                var worstTile = null;
                var worstTileIndex = -1;
                
                for (var i = tilesLoaded.length - 1; i >= 0; i--) {
                    var prevTile = tilesLoaded[i];
                    
                    if (prevTile.level <= cutoff || prevTile.beingDrawn) {
                        continue;
                    } else if (!worstTile) {
                        worstTile = prevTile;
                        worstTileIndex = i;
                        continue;
                    }
                    
                    var prevTime = prevTile.lastTouchTime;
                    var worstTime = worstTile.lastTouchTime;
                    var prevLevel = prevTile.level;
                    var worstLevel = worstTile.level;
                    
                    if (prevTime < worstTime ||
                            (prevTime == worstTime && prevLevel > worstLevel)) {
                        worstTile = prevTile;
                        worstTileIndex = i;
                    }
                }
                
                if (worstTile && worstTileIndex >= 0) {
                    worstTile.unload();
                    insertionIndex = worstTileIndex;
                    // note: we don't want or need to delete the actual Tile
                    // object from tilesMatrix; that's negligible memory.
                }
            }
            
            tilesLoaded[insertionIndex] = tile;
            updateAgain = true;
        }
        
        function clearTiles() {
            tilesMatrix = {};
            tilesLoaded = [];
        }
        
        // Helpers -- COVERAGE
        
        // Coverage scheme: it's required that in the draw routine, coverage for
        // every tile within the viewport is initially explicitly set to false.
        // This way, if a given level's coverage has been initialized, and a tile
        // isn't found, it means it's offscreen and thus provides coverage (since
        // there's no content needed to be covered). And if every tile that is found
        // does provide coverage, the entire visible level provides coverage.
        
        /**
         * Returns true if the given tile provides coverage to lower-level tiles of
         * lower resolution representing the same content. If neither x nor y is
         * given, returns true if the entire visible level provides coverage.
         * 
         * Note that out-of-bounds tiles provide coverage in this sense, since
         * there's no content that they would need to cover. Tiles at non-existent
         * levels that are within the image bounds, however, do not.
         */
        function providesCoverage(level, x, y) {
            if (!coverage[level]) {
                return false;
            }
            
            if (x === undefined || y === undefined) {
                // check that every visible tile provides coverage.
                // update: protecting against properties added to the Object
                // class's prototype, which can definitely (and does) happen.
                var rows = coverage[level];
                for (var i in rows) {
                    if (rows.hasOwnProperty(i)) {
                        var cols = rows[i];
                        for (var j in cols) {
                            if (cols.hasOwnProperty(j) && !cols[j]) {
                               return false;
                            }
                        }
                    }
                }
                
                return true;
            }
            
            return (coverage[level][x] === undefined ||
                    coverage[level][x][y] === undefined ||
                    coverage[level][x][y] === true);
        }
        
        /**
         * Returns true if the given tile is completely covered by higher-level
         * tiles of higher resolution representing the same content. If neither x
         * nor y is given, returns true if the entire visible level is covered.
         */
        function isCovered(level, x, y) {
            if (x === undefined || y === undefined) {
                return providesCoverage(level+1);
            } else {
                return (providesCoverage(level+1, 2*x, 2*y) &&
                        providesCoverage(level+1, 2*x, 2*y + 1) &&
                        providesCoverage(level+1, 2*x + 1, 2*y) &&
                        providesCoverage(level+1, 2*x + 1, 2*y + 1));
            }
        }
        
        /**
         * Sets whether the given tile provides coverage or not.
         */
        function setCoverage(level, x, y, covers) {
            if (!coverage[level]) {
                SeadragonDebug.error("Setting coverage for a tile before its " +
                        "level's coverage has been reset: " + level);
                return;
            }
            
            if (!coverage[level][x]) {
                coverage[level][x] = {};
            }
            
            coverage[level][x][y] = covers;
        }
        
        /**
         * Resets coverage information for the given level. This should be called
         * after every draw routine. Note that at the beginning of the next draw
         * routine, coverage for every visible tile should be explicitly set. 
         */
        function resetCoverage(level) {
            coverage[level] = {};
        }
        
        // Helpers -- SCORING
        
        function compareTiles(prevBest, tile) {
            // figure out if this tile is better than the previous best tile...
            // note that if there is no prevBest, this is automatically better.
            if (!prevBest) {
                return tile;
            }
            
            if (tile.visibility > prevBest.visibility) {
                return tile;
            } else if (tile.visibility == prevBest.visibility) {
                if (tile.distance < prevBest.distance) {
                    return tile;
                }
            }
            
            return prevBest;
        }
        
        // Helpers -- OVERLAYS
        
        function getOverlayIndex(elmt) {
            for (var i = overlays.length - 1; i >= 0; i--) {
                if (overlays[i].elmt == elmt) {
                    return i;
                }
            }
            
            return -1;
        }
        
        // Helpers -- CORE
        
        function updateActual() {
            // assume we won't need to update again after this update.
            // we'll set this if we find a reason to update again.
            updateAgain = false;
            
            // make local references to variables & functions referenced in
            // loops in order to improve perf
            var _canvas = canvas;
            var _context = context;
            var _container = container;
            var _useCanvas = useCanvas;
            var _lastDrawn = lastDrawn;
            
            // the tiles that were drawn last frame, but won't be this frame,
            // can be cleared from the cache, so they should be marked as such.
            while (_lastDrawn.length > 0) {
                var tile = _lastDrawn.pop();
                tile.beingDrawn = false;
            }
            
            // we need the size of the viewport (in pixels) in multiple places
            var viewportSize = viewport.getContainerSize();
            var viewportWidth = viewportSize.x;
            var viewportHeight = viewportSize.y;
            
            // clear canvas, whether in <canvas> mode or HTML mode.
            // this is important as scene may be empty this frame.
            if (_useCanvas) {
                _canvas.width = viewportWidth;
                _canvas.height = viewportHeight;
                _context.clearRect(0, 0, viewportWidth, viewportHeight);
                    // this last line shouldn't be needed. setting the width and
                    // height should clear <canvas>, but Firefox doesn't always.
            } else {
                _canvas.innerHTML = "";
            }
            
            // if viewport is off image entirely, don't bother drawing.
            // UPDATE: logic modified to support horizontal/vertical wrapping.
            var viewportBounds = viewport.getBounds(true);
            var viewportTL = viewportBounds.getTopLeft();
            var viewportBR = viewportBounds.getBottomRight();
            if (!SeadragonConfig.wrapHorizontal &&
                    (viewportBR.x < 0 || viewportTL.x > 1)) {
                // we're not wrapping horizontally, and viewport is off in x
                return;
            } else if (!SeadragonConfig.wrapVertical &&
                    (viewportBR.y < 0 || viewportTL.y > normHeight)) {
                // we're not wrapping vertically, and viewport is off in y
                return;
            }
            
            // the below section is commented out because it's more relevant to
            // collections, where you don't want 10 items to all load their xml
            // at the same time when 9 of them won't be in the viewport soon.
            
//            // but even if the viewport is currently on the image, don't force
//            // tiles to load if the viewport target is off the image
//            var viewportTargetBounds = getViewportBounds(false);
//            var viewportTargetTL = viewportTargetBounds.getTopLeft();
//            var viewportTargetBR = viewportTargetBounds.getBottomRight();
//            var willBeOff = viewportTargetBR.x < 0 || viewportTargetBR.y < 0 ||
//                    viewportTargetTL.x > 1 || viewportTargetTL.y > normHeight;
            
            // make local references to functions and variables used in loops to
            // improve perf
            var _getNumTiles = getNumTiles;
            var _getPixelRatio = getPixelRatio;
            var _getTile = getTile;
            var _isCovered = isCovered;
            var _setCoverage = setCoverage;
            var _resetCoverage = resetCoverage;
            var _providesCoverage = providesCoverage;
            var _tileOverlap = tileOverlap;
            var _lastFrameTime = lastFrameTime;
            var isChrome = (browser === SeadragonBrowser.CHROME);
            // same for Math functions
            var _abs = Math.abs;
            var _ceil = Math.ceil;
            var _floor = Math.floor;
            var _log = Math.log;
            var _max = Math.max;
            var _min = Math.min;
            // and Viewport functions
            var _deltaPixelsFromPoints = viewport.deltaPixelsFromPoints;
            var _pixelFromPoint = viewport.pixelFromPoint;
            // and TileSource functions
            var _getTileAtPoint = source.getTileAtPoint;
            // and Config properties
            var alwaysBlend = SeadragonConfig.alwaysBlend;
            var blendTimeMillis = 1000 * SeadragonConfig.blendTime;
            var immediateRender = SeadragonConfig.immediateRender;
            var minDimension = SeadragonConfig.minZoomDimension;   // for backwards compatibility
            var minImageRatio = SeadragonConfig.minImageRatio;
            var wrapHorizontal = SeadragonConfig.wrapHorizontal;
            var wrapVertical = SeadragonConfig.wrapVertical;
            var wrapOverlays = SeadragonConfig.wrapOverlays;
            
            // restrain bounds of viewport relative to image.
            // UPDATE: logic modified to support horizontal/vertical wrapping.
            if (!wrapHorizontal) {
                viewportTL.x = _max(viewportTL.x, 0);
                viewportBR.x = _min(viewportBR.x, 1);
            }
            if (!wrapVertical) {
                viewportTL.y = _max(viewportTL.y, 0);
                viewportBR.y = _min(viewportBR.y, normHeight);
            }
            
            var best = null;
            var haveDrawn = false;
            var currentTime = new Date().getTime();
            
            // calculate values for scoring -- this is based on TARGET values
            var viewportCenterPoint = viewport.getCenter();
            var viewportCenterPixel = _pixelFromPoint(viewportCenterPoint);
            var zeroRatioT = _deltaPixelsFromPoints(_getPixelRatio(0), false).x;
            var optimalPixelRatio = immediateRender ? 1 : zeroRatioT;
            
            // adjust levels to iterate over -- this is based on CURRENT values
            // TODO change this logic to use minImageRatio, but for backwards
            // compatibility, use minDimension if it's been explicitly set.
            // TEMP for now, original minDimension logic with default 64.
            minDimension = minDimension || 64;
            var lowestLevel = _max(minLevel, _floor(_log(minDimension) / _log(2)));
            var zeroRatioC = _deltaPixelsFromPoints(_getPixelRatio(0), true).x;
            var highestLevel = _min(maxLevel,
                    _floor(_log(zeroRatioC / MIN_PIXEL_RATIO) / _log(2)));
            
            // with very small images, this edge case can occur...
            lowestLevel = _min(lowestLevel, highestLevel);
            
            for (var level = highestLevel; level >= lowestLevel; level--) {
                var drawLevel = false;
                var renderPixelRatioC = _deltaPixelsFromPoints(
                        _getPixelRatio(level), true).x;     // note the .x!
                
                // if we haven't drawn yet, only draw level if tiles are big enough
                if ((!haveDrawn && renderPixelRatioC >= MIN_PIXEL_RATIO) ||
                        level == lowestLevel) {
                    drawLevel = true;
                    haveDrawn = true;
                } else if (!haveDrawn) {
                    continue;
                }
                
                _resetCoverage(level);
                
                // calculate scores applicable to all tiles on this level --
                // note that we're basing visibility on the TARGET pixel ratio
                var levelOpacity = _min(1, (renderPixelRatioC - 0.5) / 0.5);
                var renderPixelRatioT = _deltaPixelsFromPoints(
                        _getPixelRatio(level), false).x;
                var levelVisibility = optimalPixelRatio /
                        _abs(optimalPixelRatio - renderPixelRatioT);
                
                // only iterate over visible tiles
                var tileTL = _getTileAtPoint(level, viewportTL);
                var tileBR = _getTileAtPoint(level, viewportBR);
                var numTiles = _getNumTiles(level);
                var numTilesX = numTiles.x;
                var numTilesY = numTiles.y;
                if (!wrapHorizontal) {
                    tileBR.x = _min(tileBR.x, numTilesX - 1);
                }
                if (!wrapVertical) {
                    tileBR.y = _min(tileBR.y, numTilesY - 1);
                }
                
                for (var x = tileTL.x; x <= tileBR.x; x++) {
                    for (var y = tileTL.y; y <= tileBR.y; y++) {
                        var tile = _getTile(level, x, y, currentTime, numTilesX, numTilesY);
                        var drawTile = drawLevel;
                        
                        // assume this tile doesn't cover initially
                        _setCoverage(level, x, y, false);
                        
                        if (!tile.exists) {
                            // not part of sparse image, or failed to load
                            continue;
                        }
                    
                        // if we've drawn a higher-resolution level and we're not
                        // going to draw this level, then say this tile does cover
                        // if it's covered by higher-resolution tiles. if we're not
                        // covered, then we should draw this tile regardless.
                        if (haveDrawn && !drawTile) {
                            if (_isCovered(level, x, y)) {
                                _setCoverage(level, x, y, true);
                            } else {
                                drawTile = true;
                            }
                        }
                        
                        if (!drawTile) {
                            continue;
                        }
                        
                        // calculate tile's position and size in pixels
                        var boundsTL = tile.bounds.getTopLeft();
                        var boundsSize = tile.bounds.getSize();
                        var positionC = _pixelFromPoint(boundsTL, true);
                        var sizeC = _deltaPixelsFromPoints(boundsSize, true);
                        
                        // if there is no tile overlap, we need to oversize the
                        // tiles by 1px to prevent seams at imperfect zooms.
                        // fortunately, this is not an issue with regular dzi's
                        // created from Deep Zoom Composer, which uses overlap.
                        if (!_tileOverlap) { 
                            sizeC = sizeC.plus(new SeadragonPoint(1, 1));
                        }
                        
                        // calculate distance from center of viewport -- note
                        // that this is based on tile's TARGET position
                        var positionT = _pixelFromPoint(boundsTL, false);
                        var sizeT = _deltaPixelsFromPoints(boundsSize, false);
                        var tileCenter = positionT.plus(sizeT.divide(2));
                        var tileDistance = viewportCenterPixel.distanceTo(tileCenter);
                        
                        // update tile's scores and values
                        tile.position = positionC;
                        tile.size = sizeC;
                        tile.distance = tileDistance;
                        tile.visibility = levelVisibility;
                        
                        if (tile.loaded) {
                            if (!tile.blendStart) {
                                // image was just added, blend it
                                tile.blendStart = currentTime;
                            }
                            
                            var deltaTime = currentTime - tile.blendStart;
                            var opacity = (blendTimeMillis === 0) ? 1 :
                                _min(1, deltaTime / blendTimeMillis);
                            
                            if (alwaysBlend) {
                                opacity *= levelOpacity;
                            }
                            
                            tile.opacity = opacity;
                            
                            // queue tile for drawing in reverse order
                            _lastDrawn.push(tile);
                            
                            // if fully blended in, this tile now provides coverage,
                            // otherwise we need to update again to keep blending
                            if (opacity >= 1) {
                                _setCoverage(level, x, y, true);
                            
                                // workaround for chrome's weird flickering issue
                                if (isChrome && tile.lastDrawnTime !== _lastFrameTime) {
                                    _setCoverage(level, x, y, false);
                                }
                            } else if (deltaTime < blendTimeMillis) {
                                updateAgain = true;
                            }
                            
                            // new: remember that it was drawn this frame
                            tile.lastDrawnTime = currentTime;
                        } else if (tile.loading) {
                            // nothing to see here, move on
                        } else {
                            // means tile isn't loaded yet, so score it
                            best = compareTiles(best, tile);
                        }
                    }
                }
                
                // we may not need to draw any more lower-res levels
                if (_providesCoverage(level)) {
                    break;
                }
            }
            
            // now draw the tiles, but in reverse order since we want higher-res
            // tiles to be drawn on top of lower-res ones. also mark each tile
            // as being drawn so it won't get cleared from the cache.
            for (var i = _lastDrawn.length - 1; i >= 0; i--) {
                var tile = _lastDrawn[i];
                
                if (_useCanvas) {
                    tile.drawCanvas(_context);
                } else {
                    tile.drawHTML(_canvas);
                }
                
                tile.beingDrawn = true;
            }
            
            // draw the overlays -- TODO optimize based on viewport like tiles,
            // but this is tricky for non-scaling overlays like pins...
            var numOverlays = overlays.length;
            
            for (var i = 0; i < numOverlays; i++) {
                var overlay = overlays[i];
                var bounds = overlay.bounds;
                var overlayTL = bounds.getTopLeft();    // in normalized coords
                
                // wrap overlays if specified
                if (wrapOverlays && wrapHorizontal) {
                    // TEMP this isn't perfect, e.g. view center is at -2.1 and
                    // overlay is at 0.1, this will use -2.9 instead of -1.9.
                    overlayTL.x += _floor(viewportCenterPoint.x);
                }
                if (wrapOverlays && wrapVertical) {
                    // TODO wrap overlays vertically
                }
                
                overlay.position = _pixelFromPoint(overlayTL, true);
                overlay.size = _deltaPixelsFromPoints(bounds.getSize(), true);
                
                overlay.drawHTML(container);
            }
            
            // load next tile if there is one to load
            if (best) {
                loadTile(best, currentTime);
                updateAgain = true; // because we haven't finished drawing, so
                                    // we should be re-evaluating and re-scoring
            }
            
            // new: save this frame's timestamp to enable comparing times
            lastFrameTime = currentTime;
        }
        
        // Methods -- OVERLAYS
        
        this.addOverlay = function(elmt, loc, placement) {
            var elmt = SeadragonUtils.getElement(elmt);
            
            if (getOverlayIndex(elmt) >= 0) {
                return;     // they're trying to add a duplicate overlay
            }
            
            overlays.push(new Overlay(elmt, loc, placement));
            updateAgain = true;     // TODO do we really need this?
        };
        
        this.updateOverlay = function(elmt, loc, placement) {
            var elmt = SeadragonUtils.getElement(elmt);
            var i = getOverlayIndex(elmt);
            
            if (i >= 0) {
                overlays[i].update(loc, placement);
                updateAgain = true;     // TODO do we really need this?
            }
        };
       
        this.removeOverlay = function(elmt) {
            var elmt = SeadragonUtils.getElement(elmt);
            var i = getOverlayIndex(elmt);
            
            if (i >= 0) {
                overlays[i].destroy();
                overlays.splice(i, 1);
                updateAgain = true;     // TODO do we really need this?
            }
        };
        
        this.clearOverlays = function() {
            while (overlays.length > 0) {
                overlays.pop().destroy();
                updateAgain = true;     // TODO do we really need this?
                                        // TODO it also doesn't need to be in the loop.
            }
        };
        
        // Methods -- CORE
        
        this.needsUpdate = function() {
            return updateAgain;
        };
        
        this.numTilesLoaded = function() {
            return tilesLoaded.length;
        };
        
        this.reset = function() {
            clearTiles();
            lastResetTime = new Date().getTime();
            updateAgain = true;
        };
        
        this.update = function() {
            profiler.beginUpdate();
            midUpdate = true;
            updateActual();
            midUpdate = false;
            profiler.endUpdate();
        };
    
        this.idle = function() {
            // TODO idling function
        };
        
    };
    
})();

// Seadragon.Viewer.js:

//  This code is distributed under the included license agreement, also
//  available here: http://go.microsoft.com/fwlink/?LinkId=164943

var SeadragonViewer,
    SeadragonControlAnchor;

(function() {
    
    // Constants
    
    var SIGNAL = "----seadragon----";
    
    // Private static
    
    var browser = SeadragonUtils.getBrowser();
    
    // Controls
    
    SeadragonControlAnchor = Seadragon.ControlAnchor = {
        NONE: 0,
        TOP_LEFT: 1,
        TOP_RIGHT: 2,
        BOTTOM_RIGHT: 3,
        BOTTOM_LEFT: 4
    };
    
    /**
     * Adds the given element to the given container based on the given anchor,
     * such that all new elements anchored to a right edge are shown to the left
     * of existing elements anchored to the same edge.
     */
    function addToAnchor(elmt, anchor, container) {
        if (anchor == SeadragonControlAnchor.TOP_RIGHT || anchor == SeadragonControlAnchor.BOTTOM_RIGHT) {
            container.insertBefore(elmt, container.firstChild);
        } else {
            container.appendChild(elmt);
        }
    }
    
    function Control(elmt, anchor, container) {
        // Fields
        var wrapper = SeadragonUtils.makeNeutralElement("span");
        
        // Properties
        this.elmt = elmt;
        this.anchor = anchor;
        this.container = container;
        this.wrapper = wrapper;
        
        // Constructor
        wrapper.style.display = "inline-block";
        wrapper.appendChild(elmt);
        if (anchor == SeadragonControlAnchor.NONE) {
            wrapper.style.width = wrapper.style.height = "100%";    // IE6 fix
        }
        
        addToAnchor(wrapper, anchor, container);
    }
    
    Control.prototype.destroy = function() {
        this.wrapper.removeChild(this.elmt);
        this.container.removeChild(this.wrapper);
    };
    
    Control.prototype.isVisible = function() {
        // see note in setVisible() below about using "display: none"
        return this.wrapper.style.display != "none";
    };
    
    Control.prototype.setVisible = function(visible) {
        // using "display: none" instead of "visibility: hidden" so that mouse
        // events are no longer blocked by this invisible control.
        this.wrapper.style.display = visible ? "inline-block" : "none";
    };
    
    Control.prototype.setOpacity = function(opacity) {
        // like with setVisible() above, we really should be working with the
        // wrapper element and not the passed in element directly, so that we
        // don't conflict with the developer's own opacity settings. but this
        // doesn't work in IE always, so for our controls, use a hack for now...
        if (this.elmt[SIGNAL] && browser == SeadragonBrowser.IE) {
            SeadragonUtils.setElementOpacity(this.elmt, opacity, true);
        } else {
            SeadragonUtils.setElementOpacity(this.wrapper, opacity, true);
        }
    }
    
    // Navigation control
    
    var FULL_PAGE = "fullpage";
    var HOME = "home";
    var ZOOM_IN = "zoomin";
    var ZOOM_OUT = "zoomout";
    
    var REST = "_rest.png";
    var GROUP = "_grouphover.png";
    var HOVER = "_hover.png";
    var DOWN = "_pressed.png";
    
    function makeNavControl(viewer) {
        var group = null;
        var zooming = false;    // whether we should be continuously zooming
        var zoomFactor = null;  // how much we should be continuously zooming by
        var lastZoomTime = null;
        
        function onHome() {
            if (viewer.viewport) {
                viewer.viewport.goHome();
            }
        }
        
        function onFullPage() {
            viewer.setFullPage(!viewer.isFullPage());
            group.emulateExit();  // correct for no mouseout event on change
            
            if (viewer.viewport) {
                viewer.viewport.applyConstraints();
            }
        }
        
        function beginZoomingIn() {
            lastZoomTime = new Date().getTime();
            zoomFactor = SeadragonConfig.zoomPerSecond;
            zooming = true;
            scheduleZoom();
        }
        
        function beginZoomingOut() {
            lastZoomTime = new Date().getTime();
            zoomFactor = 1.0 / SeadragonConfig.zoomPerSecond;
            zooming = true;
            scheduleZoom();
        }
        
        function endZooming() {
            zooming = false;
        }
        
        function scheduleZoom() {
            window.setTimeout(doZoom, 10);
        }
        
        function doZoom() {
            if (zooming && viewer.viewport) {
                var currentTime = new Date().getTime();
                var deltaTime = currentTime - lastZoomTime;
                var adjustedFactor = Math.pow(zoomFactor, deltaTime / 1000);
                
                viewer.viewport.zoomBy(adjustedFactor);
                viewer.viewport.applyConstraints();
                lastZoomTime = currentTime;
                scheduleZoom();
            }
        }
        
        function doSingleZoomIn() {
            if (viewer.viewport) {
                zooming = false;
                viewer.viewport.zoomBy(SeadragonConfig.zoomPerClick / 1.0);
                viewer.viewport.applyConstraints();
            }
        }
        
        function doSingleZoomOut() {
            if (viewer.viewport) {
                zooming = false;
                viewer.viewport.zoomBy(1.0 / SeadragonConfig.zoomPerClick);
                viewer.viewport.applyConstraints();
            }
        }
        
        function lightUp() {
            group.emulateEnter();
            group.emulateExit();
        }
        
        function url(prefix, postfix) {
            return SeadragonConfig.imagePath + prefix + postfix; 
        }
        
        var zoomIn = new SeadragonButton(SeadragonStrings.getString("Tooltips.ZoomIn"),
                url(ZOOM_IN, REST), url(ZOOM_IN, GROUP), url(ZOOM_IN, HOVER),
                url(ZOOM_IN, DOWN), beginZoomingIn, endZooming, doSingleZoomIn,
                beginZoomingIn, endZooming);
        
        var zoomOut = new SeadragonButton(SeadragonStrings.getString("Tooltips.ZoomOut"),
                url(ZOOM_OUT, REST), url(ZOOM_OUT, GROUP), url(ZOOM_OUT, HOVER),
                url(ZOOM_OUT, DOWN), beginZoomingOut, endZooming, doSingleZoomOut,
                beginZoomingOut, endZooming);
        
        var goHome = new SeadragonButton(SeadragonStrings.getString("Tooltips.Home"),
                url(HOME, REST), url(HOME, GROUP), url(HOME, HOVER),
                url(HOME, DOWN), null, onHome, null, null, null);
        
        var fullPage = new SeadragonButton(SeadragonStrings.getString("Tooltips.FullPage"),
                url(FULL_PAGE, REST), url(FULL_PAGE, GROUP), url(FULL_PAGE, HOVER),
                url(FULL_PAGE, DOWN), null, onFullPage, null, null, null);
        
        group = new SeadragonButtonGroup([zoomIn, zoomOut, goHome, fullPage]);
        group.elmt[SIGNAL] = true;   // hack to get our controls to fade
        
        viewer.addEventListener("open", lightUp);
        
        return group.elmt;
    }
    
    // Viewer
    
    SeadragonViewer = Seadragon.Viewer = function(container) {
        
        // Fields
        
        var self = this;
        
        var parent = SeadragonUtils.getElement(container);
        var container = SeadragonUtils.makeNeutralElement("div");
        var canvas = SeadragonUtils.makeNeutralElement("div");
        
        var controlsTL = SeadragonUtils.makeNeutralElement("div");
        var controlsTR = SeadragonUtils.makeNeutralElement("div");
        var controlsBR = SeadragonUtils.makeNeutralElement("div");
        var controlsBL = SeadragonUtils.makeNeutralElement("div");
        
        var source = null;
        var drawer = null;
        var viewport = null;
        var profiler = null;
        
        var eventManager = new SeadragonEventManager();
        var innerTracker = new SeadragonMouseTracker(canvas);
        var outerTracker = new SeadragonMouseTracker(container);
        
        var controls = [];
        var controlsShouldFade = true;
        var controlsFadeBeginTime = null;
        var navControl = null;
        
        var controlsFadeDelay = 1000;   // begin fading after 1 second
        var controlsFadeLength = 2000;  // fade over 2 second period
        var controlsFadeBeginTime = null;
        var controlsShouldFade = false;
        
        var bodyWidth = document.body.style.width;
        var bodyHeight = document.body.style.height;
        var bodyOverflow = document.body.style.overflow;
        var docOverflow = document.documentElement.style.overflow;
        
        var fsBoundsDelta = new SeadragonPoint(1, 1);
        var prevContainerSize = null;
        
        var lastOpenStartTime = 0;
        var lastOpenEndTime = 0;
        
        var mouseDownPixel = null;
        var mouseDownCenter = null;
        
        var animating = false;
        var forceRedraw = false;
        var mouseInside = false;
        
        // Properties
        
        this.container = parent;
        this.elmt = container;
        
        this.source = null;
        this.drawer = null;
        this.viewport = null;
        this.profiler = null;
        
        this.tracker = innerTracker;
        
        // Helpers -- UI
        
        function initialize() {
            // copy style objects to improve perf
            var canvasStyle = canvas.style;
            var containerStyle = container.style;
            var controlsTLStyle = controlsTL.style;
            var controlsTRStyle = controlsTR.style;
            var controlsBRStyle = controlsBR.style;
            var controlsBLStyle = controlsBL.style;
            
            containerStyle.width = "100%";
            containerStyle.height = "100%";
            containerStyle.position = "relative";
            containerStyle.left = "0px";
            containerStyle.top = "0px";
            containerStyle.textAlign = "left";  // needed to protect against
                                                // incorrect centering
            
            canvasStyle.width = "100%";
            canvasStyle.height = "100%";
            canvasStyle.overflow = "hidden";
            canvasStyle.position = "absolute";
            canvasStyle.top = "0px";
            canvasStyle.left = "0px";
            
            controlsTLStyle.position = controlsTRStyle.position =
                    controlsBRStyle.position = controlsBLStyle.position =
                    "absolute";
            
            controlsTLStyle.top = controlsTRStyle.top = "0px";
            controlsTLStyle.left = controlsBLStyle.left = "0px";
            controlsTRStyle.right = controlsBRStyle.right = "0px";
            controlsBLStyle.bottom = controlsBRStyle.bottom = "0px";
            
            // mouse tracker handler for canvas (pan and zoom)
            innerTracker.clickHandler = onCanvasClick;
            innerTracker.pressHandler = onCanvasPress;
            innerTracker.dragHandler = onCanvasDrag;
            innerTracker.releaseHandler = onCanvasRelease;
            innerTracker.scrollHandler = onCanvasScroll;
            innerTracker.setTracking(true);     // default state
            
            // create default navigation control
            navControl = makeNavControl(self);
            navControl.style.marginRight = "4px";
            navControl.style.marginBottom = "4px";
            self.addControl(navControl, SeadragonControlAnchor.BOTTOM_RIGHT);
            
            // mouse tracker handler for container (controls fading)
            outerTracker.enterHandler = onContainerEnter;
            outerTracker.exitHandler = onContainerExit;
            outerTracker.releaseHandler = onContainerRelease;
            outerTracker.setTracking(true); // always tracking
            window.setTimeout(beginControlsAutoHide, 1);    // initial fade out
            
            //append to DOM only at end
            container.appendChild(canvas);
            container.appendChild(controlsTL);
            container.appendChild(controlsTR);
            container.appendChild(controlsBR);
            container.appendChild(controlsBL);
            parent.innerHTML = "";          // clear any existing content...
            parent.appendChild(container);  // ...then add the real container
        }
        
        function setMessage(message) {
            var textNode = document.createTextNode(message);
            
            canvas.innerHTML = "";
            canvas.appendChild(SeadragonUtils.makeCenteredNode(textNode));
            
            var textStyle = textNode.parentNode.style;
            
            // explicit styles for error message
            //textStyle.color = "white";    // TEMP uncommenting this; very obtrusive
            textStyle.fontFamily = "verdana";
            textStyle.fontSize = "13px";
            textStyle.fontSizeAdjust = "none";
            textStyle.fontStyle = "normal";
            textStyle.fontStretch = "normal";
            textStyle.fontVariant = "normal";
            textStyle.fontWeight = "normal";
            textStyle.lineHeight = "1em";
            textStyle.textAlign = "center";
            textStyle.textDecoration = "none";
        }
        
        // Helpers -- CORE
        
        function beforeOpen() {
            if (source) {
                onClose();
            }
            
            lastOpenStartTime = new Date().getTime();   // to ignore earlier opens
            
            // show loading message after a delay if it still hasn't loaded
            window.setTimeout(function() {
                if (lastOpenStartTime > lastOpenEndTime) {
                    setMessage(SeadragonStrings.getString("Messages.Loading"));
                }
            }, 2000);
            
            return lastOpenStartTime;
        }
        
        function onOpen(time, _source, error) {
            lastOpenEndTime = new Date().getTime();
            
            if (time < lastOpenStartTime) {
                SeadragonDebug.log("Ignoring out-of-date open.");
                eventManager.trigger("ignore", self);
                return;
            } else if (!_source) {
                setMessage(error);
                eventManager.trigger("error", self);
                return;
            }
            
            // clear any previous message
            canvas.innerHTML = "";
            prevContainerSize = SeadragonUtils.getElementSize(container);
            
            // UPDATE: if the container is collapsed, we should delay opening
            // since we don't know yet what the home zoom should be, so opening
            // when the container gets layout will allow us to gracefully and
            // correctly start at home. this also prevents viewport NaN values.
            // what timeout value should we use? it's arbitrary, but given that
            // this generally only occurs in embed scenarios where the image is
            // opened before the page has even finished loading, we'll use very
            // small timeout values to be crisp and responsive. note that this
            // polling is necessary; there is no good cross-browser event here.
            if (prevContainerSize.x === 0 || prevContainerSize.y === 0) {
                window.setTimeout(function () {
                    onOpen(time, _source, error);
                }, 10);
                return;
            }
            
            // assign fields
            source = _source;
            viewport = new SeadragonViewport(prevContainerSize, source.dimensions);
            drawer = new SeadragonDrawer(source, viewport, canvas);
            profiler = new SeadragonProfiler();
            
            // assign properties
            self.source = source;
            self.viewport = viewport;
            self.drawer = drawer;
            self.profiler = profiler;
            
            // begin updating
            animating = false;
            forceRedraw = true;
            scheduleUpdate(updateMulti);
            eventManager.trigger("open", self);
        }
        
        function onClose() {
            // TODO need destroy() methods to prevent leaks? check for null if so.
            
            // nullify fields and properties
            self.source = source = null;
            self.viewport = viewport = null;
            self.drawer = drawer = null;
            self.profiler = profiler = null;
            
            // clear all tiles and any message
            canvas.innerHTML = "";
        }
        
        function scheduleUpdate(updateFunc, prevUpdateTime) {
            // if we're animating, update as fast as possible to stay smooth
            if (animating) {
                return window.setTimeout(updateFunc, 1);
            }
            
            // if no previous update, consider this an update
            var currentTime = new Date().getTime();
            var prevUpdateTime = prevUpdateTime ? prevUpdateTime : currentTime;
            var targetTime = prevUpdateTime + 1000 / 60;    // 60 fps ideal
            
            // calculate delta time to be a positive number
            var deltaTime = Math.max(1, targetTime - currentTime);
            return window.setTimeout(updateFunc, deltaTime);
        }
        
        function updateOnce() {
            if (!source) {
                return;
            }
            
            profiler.beginUpdate();
            
            var containerSize = SeadragonUtils.getElementSize(container);
            
            // UPDATE: don't break if the viewer was collapsed or hidden!
            // in that case, go ahead still update normally as we were before,
            // but don't notify the viewport of the resize! prevents NaN bug.
            if (!containerSize.equals(prevContainerSize) &&
                    containerSize.x > 0 && containerSize.y > 0) {
                viewport.resize(containerSize, true); // maintain image position
                prevContainerSize = containerSize;
                eventManager.trigger("resize", self);
            }
            
            var animated = viewport.update();
            
            if (!animating && animated) {
                // we weren't animating, and now we did ==> animation start
                eventManager.trigger("animationstart", self);
                abortControlsAutoHide();
            }
            
            if (animated) {
                // viewport moved
                drawer.update();
                eventManager.trigger("animation", self);
            } else if (forceRedraw || drawer.needsUpdate()) {
                // need to load or blend images, etc.
                drawer.update();
                forceRedraw = false;
            } else {
                // no changes, so preload images, etc.
                drawer.idle();
            }
            
            if (animating && !animated) {
                // we were animating, and now we're not anymore ==> animation finish
                eventManager.trigger("animationfinish", self);
                
                // if the mouse has left the container, begin fading controls
                if (!mouseInside) {
                    beginControlsAutoHide();
                }
            }
            
            animating = animated;
            
            profiler.endUpdate();
        }
        
        function updateMulti() {
            if (!source) {
                return;
            }
            
            var beginTime = new Date().getTime();
            
            updateOnce();
            scheduleUpdate(arguments.callee, beginTime);
        }
        
        // Controls
        
        function getControlIndex(elmt) {
            for (var i = controls.length - 1; i >= 0; i--) {
                if (controls[i].elmt == elmt) {
                    return i;
                }
            }
            
            return -1;
        }
        
        function scheduleControlsFade() {
            window.setTimeout(updateControlsFade, 20);
        }
        
        function updateControlsFade() {
            if (controlsShouldFade) {
                var currentTime = new Date().getTime();
                var deltaTime = currentTime - controlsFadeBeginTime;
                var opacity = 1.0 - deltaTime / controlsFadeLength;
                
                opacity = Math.min(1.0, opacity);
                opacity = Math.max(0.0, opacity);
                
                for (var i = controls.length - 1; i >= 0; i--) {
                    controls[i].setOpacity(opacity);
                }
                
                if (opacity > 0) {
                    scheduleControlsFade();    // fade again
                }
            }
        }
        
        function abortControlsAutoHide() {
            controlsShouldFade = false;
            for (var i = controls.length - 1; i >= 0; i--) {
                controls[i].setOpacity(1.0);
            }
        }
        
        function beginControlsAutoHide() {
            if (!SeadragonConfig.autoHideControls) {
                return;
            }
            
            controlsShouldFade = true;
            controlsFadeBeginTime = new Date().getTime() + controlsFadeDelay;
            window.setTimeout(scheduleControlsFade, controlsFadeDelay);
        }
        
        // Mouse interaction with container
        
        function onContainerEnter(tracker, position, buttonDownElmt, buttonDownAny) {
            mouseInside = true;
            abortControlsAutoHide();
        }
        
        function onContainerExit(tracker, position, buttonDownElmt, buttonDownAny) {
            // fade controls out over time, only if the mouse isn't down from
            // within the container (e.g. panning, or using a control)
            if (!buttonDownElmt) {
                mouseInside = false;
                if (!animating) {
                    beginControlsAutoHide();
                }
            }
        }
        
        function onContainerRelease(tracker, position, insideElmtPress, insideElmtRelease) {
            // the mouse may have exited the container and we ignored it if the
            // mouse was down from within the container. now when the mouse is
            // released, we should fade the controls out now.
            if (!insideElmtRelease) {
                mouseInside = false;
                if (!animating) {
                    beginControlsAutoHide();
                }
            }
        }
        
        // Mouse interaction with canvas
        
        function onCanvasClick(tracker, position, quick, shift) {
            if (viewport && quick) {    // ignore clicks where mouse moved
                var zoomPerClick = SeadragonConfig.zoomPerClick;
                var factor = shift ? 1.0 / zoomPerClick : zoomPerClick;
                viewport.zoomBy(factor, viewport.pointFromPixel(position, true));
                viewport.applyConstraints();
            }
        }
        
        function onCanvasPress(tracker, position) {
            if (viewport) {
                mouseDownPixel = position;
                mouseDownCenter = viewport.getCenter();
            }
        }
        
        function onCanvasDrag(tracker, position, delta, shift) {
            if (viewport) {
                // note that in both cases, we're negating delta pixels since
                // dragging is opposite of panning. analogy is adobe viewer,
                // dragging up scrolls down.
                if (SeadragonConfig.constrainDuringPan) {
                    var deltaPixels = position.minus(mouseDownPixel);
                    var deltaPoints = viewport.deltaPointsFromPixels(deltaPixels.negate(), true);
                    viewport.panTo(mouseDownCenter.plus(deltaPoints));
                    viewport.applyConstraints();
                } else {
                    viewport.panBy(viewport.deltaPointsFromPixels(delta.negate(), true));
                }
            }
        }
        
        function onCanvasRelease(tracker, position, insideElmtPress, insideElmtRelease) {
            if (insideElmtPress && viewport) {
                viewport.applyConstraints();
            }
        }
        
        function onCanvasScroll(tracker, position, delta, shift) {
            if (viewport) {
                var factor = Math.pow(SeadragonConfig.zoomPerScroll, delta);
                viewport.zoomBy(factor, viewport.pointFromPixel(position, true));
                viewport.applyConstraints();
            }
        }
		
		// Keyboard interaction
		
		function onPageKeyDown(event) {
			event = SeadragonUtils.getEvent(event);
			if (event.keyCode === 27) {    // 27 means esc key
				self.setFullPage(false);
			}
		}
        
        // Methods -- IMAGE
        
        this.isOpen = function() {
            return !!source;
        };
        
        this.openDzi = function(xmlUrlOrJsonObj, xmlString) {
            var currentTime = beforeOpen();
            var callback = SeadragonUtils.createCallback(null, onOpen, currentTime);
            
            switch (typeof(xmlUrlOrJsonObj)) {
            case "string":
                SeadragonDziTileSource.createFromXml(xmlUrlOrJsonObj, xmlString, callback);
                break;
            default:
                SeadragonDziTileSource.createFromJson(xmlUrlOrJsonObj, callback);
                break;
            }
        };
        
        this.openTileSource = function(tileSource) {
            var currentTime = beforeOpen();
            window.setTimeout(function() {
                onOpen(currentTime, tileSource);
            }, 1);
        };        
        this.close = function() {
            if (!source) {
                return;
            }
            
            onClose();
        };
        
        // Methods -- CONTROLS
        
        this.addControl = function(elmt, anchor) {
            var elmt = SeadragonUtils.getElement(elmt);
            
            if (getControlIndex(elmt) >= 0) {
                return;     // they're trying to add a duplicate control
            }
            
            var div = null;
            
            switch (anchor) {
                case SeadragonControlAnchor.TOP_RIGHT:
                    div = controlsTR;
                    elmt.style.position = "relative";
                    break;
                case SeadragonControlAnchor.BOTTOM_RIGHT:
                    div = controlsBR;
                    elmt.style.position = "relative";
                    break;
                case SeadragonControlAnchor.BOTTOM_LEFT:
                    div = controlsBL;
                    elmt.style.position = "relative";
                    break;
                case SeadragonControlAnchor.TOP_LEFT:
                    div = controlsTL;
                    elmt.style.position = "relative";
                    break;
                case SeadragonControlAnchor.NONE:
                default:
                    div = container;
                    elmt.style.position = "absolute";
                    break;
            }
            
            controls.push(new Control(elmt, anchor, div));
        };
        
        this.removeControl = function(elmt) {
            var elmt = SeadragonUtils.getElement(elmt);
            var i = getControlIndex(elmt);
            
            if (i >= 0) {
                controls[i].destroy();
                controls.splice(i, 1);
            }
        };
        
        this.clearControls = function() {
            while (controls.length > 0) {
                controls.pop().destroy();
            }
        };
        
        this.getNavControl = function() {
            return navControl;
        };
        
        // Methods -- UI
        
        this.isDashboardEnabled = function() {
            for (var i = controls.length - 1; i >= 0; i--) {
                if (controls[i].isVisible()) {
                    return true;
                }
            }
            
            return false;
        };
        
        this.isFullPage = function() {
            return container.parentNode == document.body;
        };
        
        this.isMouseNavEnabled = function() {
            return innerTracker.isTracking();
        };
        
        this.isVisible = function() {
            return container.style.visibility != "hidden";
        };
        
        this.setDashboardEnabled = function(enabled) {
            for (var i = controls.length - 1; i >= 0; i--) {
                controls[i].setVisible(enabled);
            }
        };
        
        this.setFullPage = function(fullPage) {
            if (fullPage == self.isFullPage()) {
                return;
            }
            
            // copy locally to improve perf
            var body = document.body;
            var bodyStyle = body.style;
            var docStyle = document.documentElement.style;
            var containerStyle = container.style;
            var canvasStyle = canvas.style;
            
            if (fullPage) {
                // change overflow, but preserve what current values are
                bodyOverflow = bodyStyle.overflow;
                docOverflow = docStyle.overflow;
                bodyStyle.overflow = "hidden";
                docStyle.overflow = "hidden";
                
                // IE6 needs the body width/height to be 100% also
                bodyWidth = bodyStyle.width;
                bodyHeight = bodyStyle.height;
                bodyStyle.width = "100%";
                bodyStyle.height = "100%";
                
                // always show black background, etc., for fullpage
                canvasStyle.backgroundColor = "black";
                canvasStyle.color = "white";
                
                // make container attached to the window, immune to scrolling,
                // and above any other things with a z-index set.
                containerStyle.position = "fixed";
                containerStyle.zIndex = "99999999";
                
                body.appendChild(container);
                prevContainerSize = SeadragonUtils.getWindowSize();
				
				// add keyboard listener for esc key, to exit full page.
				// add it on document because browsers won't give an arbitrary
				// element (e.g. this viewer) keyboard focus, and adding it to
				// window doesn't work properly in IE.
				SeadragonUtils.addEvent(document, "keydown", onPageKeyDown);
                
                onContainerEnter();     // mouse will be inside container now
            } else {
                // restore previous values for overflow
                bodyStyle.overflow = bodyOverflow;
                docStyle.overflow = docOverflow;
                
                // IE6 needed to overwrite the body width/height also
                bodyStyle.width = bodyWidth;
                bodyStyle.height = bodyHeight;
                
                // return to inheriting style
                canvasStyle.backgroundColor = "";
                canvasStyle.color = "";
                
                // make container be inline on page again, and auto z-index
                containerStyle.position = "relative";
                containerStyle.zIndex = "";
                
                parent.appendChild(container);
                prevContainerSize = SeadragonUtils.getElementSize(parent);
				
				// remove keyboard listener for esc key
				SeadragonUtils.removeEvent(document, "keydown", onPageKeyDown);
                
                onContainerExit();      // mouse will likely be outside now
            }
            
            if (viewport) {
                var oldBounds = viewport.getBounds();
                viewport.resize(prevContainerSize);
                var newBounds = viewport.getBounds();
            
                if (fullPage) {
                    // going to fullpage, remember how much bounds changed by.
                    fsBoundsDelta = new SeadragonPoint(newBounds.width / oldBounds.width,
                        newBounds.height / oldBounds.height);
                } else {
                    // leaving fullpage, negate how much the fullpage zoomed by.
                    // note that we have to negate the bigger of the two changes.
                    // we have to zoom about the center of the new bounds, but
                    // that's NOT the zoom point. so we have to manually update
                    // first so that that center becomes the viewport center.
                    viewport.update();
                    viewport.zoomBy(Math.max(fsBoundsDelta.x, fsBoundsDelta.y),
                            null, true);
                }
                
                forceRedraw = true;
                eventManager.trigger("resize", self);
                updateOnce();
            }
        };
        
        this.setMouseNavEnabled = function(enabled) {
            innerTracker.setTracking(enabled);
        };
        
        this.setVisible = function(visible) {
            // important: don't explicitly say "visibility: visible", because
            // the W3C spec actually says children of hidden elements that have
            // "visibility: visible" should still be rendered. that's usually
            // not what we (or developers) want. browsers are inconsistent in
            // this regard, but IE seems to follow this spec.
            container.style.visibility = visible ? "" : "hidden";
        };
        
        this.showMessage = function(message, delay) {
            if (!delay) {
                setMessage(message);
                return;
            }
            
            window.setTimeout(function() {
                if (!self.isOpen()) {
                    setMessage(message);
                }
            }, delay);
        };
        
        // Methods -- EVENT HANDLING
        
        this.addEventListener = function(eventName, handler) {
            eventManager.addListener(eventName, handler);
        };
        
        this.removeEventListener = function(eventName, handler) {
            eventManager.removeListener(eventName, handler);
        };
        
        // Constructor
        
        initialize();
        
    };

})();

})(window, document, Math);