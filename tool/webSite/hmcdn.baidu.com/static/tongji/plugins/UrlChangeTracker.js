! function() {
    "use strict";
    var e = function(e, n, t) {
        e.attachEvent ? e.attachEvent("on" + n, function(n) {
            t.call(e, n)
        }) : e.addEventListener && e.addEventListener(n, t, !1)
    };

    function o(n, e) {
        return "[object " + e + "]" === {}.toString.call(n)
    }
    var n, t, i, r, a = Object.assign || function(n) {
            if (o(n, "Object"))
                for (var e = 1, t = arguments.length; e < t; e++) {
                    var i = arguments[e];
                    if (null != i)
                        for (var r in i = Object(i)) Object.prototype.hasOwnProperty.call(i, r) && (n[r] = i[r])
                }
            return n
        },
        h = ((-1 === (n = window.navigator.userAgent).indexOf("Android 2.") && -1 === n.indexOf("Android 4.0") || -1 === n.indexOf("Mobile Safari") || -1 !== n.indexOf("Chrome") || -1 !== n.indexOf("Windows Phone")) && window.history && window.history, (-1 === (t = window.navigator.userAgent).indexOf("Android 2.") && -1 === t.indexOf("Android 4.0") || -1 === t.indexOf("Mobile Safari") || -1 !== t.indexOf("Chrome") || -1 !== t.indexOf("Windows Phone")) && window.history && "pushState" in window.history);

    function d(n) {
        try {
            var e = {
                shouldTrackUrlChange: this.shouldTrackUrlChange
            };
            this.opts = a(e, n), this.path = this.getPath(), this.bindEvents()
        } catch (n) {
            console && console.log("UrlChangeTracker error: ", n)
        }
    }
    d.prototype = {
        getPath: function() {
            try {
                return window.location.pathname + window.location.search + window.location.hash
            } catch (n) {
                return ""
            }
        },
        bindEvents: function() {
            var n = this;
            h ? (this.proxy(history, "pushState", function() {
                n.handleUrlChange(!0)
            }), this.proxy(history, "replaceState", function() {
                n.handleUrlChange(!1)
            }), e(window, "popstate", function() {
                n.ensureSlash() && n.handleUrlChange(!0)
            })) : e(window, "hashchange", function() {
                n.ensureSlash() && n.handleUrlChange(!0)
            })
        },
        ensureSlash: function() {
            var n = function() {
                var n = window.location.href,
                    e = n.indexOf("#");
                if (e < 0) return "";
                var t = (n = n.slice(e + 1)).indexOf("?");
                if (t < 0) {
                    var i = n.indexOf("#");
                    n = -1 < i ? decodeURI(n.slice(0, i)) + n.slice(i) : decodeURI(n)
                } else n = decodeURI(n.slice(0, t)) + n.slice(t);
                return n
            }();
            return "/" === n.charAt(0) || "!" === n.charAt(0)
        },
        handleUrlChange: function(t) {
            var i = this;
            setTimeout(function() {
                var n = i.path,
                    e = i.getPath();
                i.opts.shouldTrackUrlChange(e, n) && n !== e && (i.path = e, t && i.sendPageview(e, n))
            }, 0)
        },
        sendPageview: function(n, e) {
            window._hmt = window._hmt || [], window._hmt.push(["_trackPageDuration"]), window._hmt.push(["_setReferrerOverride", e]), window._hmt.push(["_trackPageview", n])
        },
        shouldTrackUrlChange: function(n, e) {
            return !(!n || !e)
        },
        proxy: function(n, e, t) {
            var i = n[e];
            n[e] = function() {
                i.apply(n, arguments), o(t, "Function") && t(Array.prototype.slice.call(arguments))
            }
        }
    }, i = "UrlChangeTracker", r = d, window._hmt = window._hmt || [], window._hmt.push(["_providePlugin", i, r])
}();