/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(1),

	    WPSPA = __webpack_require__(2),
	    Controllers = __webpack_require__(16),
	    Directives = __webpack_require__(21);

	$(function () {
	    var app = new WPSPA(),
	        mainController = new Controllers.Main(app),
	        animationController = new Controllers.Animation(app),
	        html = new Directives.Html(app),
	        head = new Directives.Head(app);
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	// loads from global wordpress instance
	module.exports = window.jQuery.noConflict();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {var Router = __webpack_require__(3),
	    ConfigLoader = __webpack_require__(12),
	    ContentLoader = __webpack_require__(15);

	/**
	 * @class Application
	 * @constructor
	 */
	function Application() {
	    var self = this;

	    this.$timeout = function (callback, wait) {
	        if(window.requestAnimationFrame){
	            window.requestAnimationFrame(callback)
	        } else {
	            callback();
	        }
	    };
	    this.$window = $(window);
	    this.$root = $('.spa-content');
	    this.meta = {
	        baseHREF : $('head base').attr('href')
	    };
	    this.configLoader = new ConfigLoader(this);
	    this.contentLoader = new ContentLoader(this);

	    this.router = new Router(this.meta.baseHREF);
	    this.router.on(/.*/, function (path) {
	        self.emit.call(self, '$locationChangeSuccess', path, self.previousPath);
	        self.previousPath = path;
	    });
	    /*
	     this.router.configure({
	     html5history: true,
	     on: function () {
	     self.emit.apply(self, ['$locationChangeSuccess'].concat(arguments));
	     }
	     });
	     this.router.init();
	     */
	}

	Application.prototype = {
	    events: {},
	    extendModule: function (module) {
	        var extendedProps = [
	            '$timeout',
	            '$window',
	            '$root',
	            'meta',
	            'configLoader',
	            'contentLoader',
	            'router'
	        ];
	        for (var propIdx in extendedProps) {
	            if (extendedProps.hasOwnProperty(propIdx)) {
	                module[extendedProps[propIdx]] = this[extendedProps[propIdx]]
	            }
	        }
	    },
	    on: function (event, callback) {
	        this.events[event] = this.events[event] || [];
	        this.events[event].push({
	            callback: callback,
	            context: this
	        });
	    },
	    emit: function (event) {
	        var listeners = this.events[event] || [],
	            listenerIdx = 0,
	            listener = listeners[listenerIdx];

	        while (listener) {
	            listener.callback.apply(listener.context, arguments);
	            listenerIdx++;
	            listener = listeners[listenerIdx];
	        }
	    }
	};

	module.exports = Application;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var url = __webpack_require__(4);

	function Router(base) {
	    var self = this;

	    this.history = __webpack_require__(11);
	    this.base = base;
	    this.routes = [];
	    this.history.Adapter.bind(window, 'statechange', function () {
	        var state = self.history.getState(),
	            path = state.data.path,
	            routeHandlerIdx = 0,
	            routeHandler = self.routes[routeHandlerIdx];
	        console.log('statechange:', state);
	        while (routeHandler) {
	            if (routeHandler.path.test(path)) {
	                routeHandler.callback(path);
	            }
	            routeHandlerIdx++;
	            routeHandler = self.routes[routeHandlerIdx];
	        }
	    });
	}

	Router.prototype = {
	    on: function (path, callback) {
	        this.routes.push({
	            path: path,
	            callback: callback
	        })
	    },
	    path: function (path) {
	        this.history.pushState({path: path}, null, url.resolve(this.base, path));
	    }
	};

	module.exports = Router;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	var punycode = __webpack_require__(5);
	var util = __webpack_require__(7);

	exports.parse = urlParse;
	exports.resolve = urlResolve;
	exports.resolveObject = urlResolveObject;
	exports.format = urlFormat;

	exports.Url = Url;

	function Url() {
	  this.protocol = null;
	  this.slashes = null;
	  this.auth = null;
	  this.host = null;
	  this.port = null;
	  this.hostname = null;
	  this.hash = null;
	  this.search = null;
	  this.query = null;
	  this.pathname = null;
	  this.path = null;
	  this.href = null;
	}

	// Reference: RFC 3986, RFC 1808, RFC 2396

	// define these here so at least they only have to be
	// compiled once on the first module load.
	var protocolPattern = /^([a-z0-9.+-]+:)/i,
	    portPattern = /:[0-9]*$/,

	    // Special case for a simple path URL
	    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

	    // RFC 2396: characters reserved for delimiting URLs.
	    // We actually just auto-escape these.
	    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

	    // RFC 2396: characters not allowed for various reasons.
	    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

	    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
	    autoEscape = ['\''].concat(unwise),
	    // Characters that are never ever allowed in a hostname.
	    // Note that any invalid chars are also handled, but these
	    // are the ones that are *expected* to be seen, so we fast-path
	    // them.
	    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
	    hostEndingChars = ['/', '?', '#'],
	    hostnameMaxLen = 255,
	    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
	    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
	    // protocols that can allow "unsafe" and "unwise" chars.
	    unsafeProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that never have a hostname.
	    hostlessProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that always contain a // bit.
	    slashedProtocol = {
	      'http': true,
	      'https': true,
	      'ftp': true,
	      'gopher': true,
	      'file': true,
	      'http:': true,
	      'https:': true,
	      'ftp:': true,
	      'gopher:': true,
	      'file:': true
	    },
	    querystring = __webpack_require__(8);

	function urlParse(url, parseQueryString, slashesDenoteHost) {
	  if (url && util.isObject(url) && url instanceof Url) return url;

	  var u = new Url;
	  u.parse(url, parseQueryString, slashesDenoteHost);
	  return u;
	}

	Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
	  if (!util.isString(url)) {
	    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
	  }

	  // Copy chrome, IE, opera backslash-handling behavior.
	  // Back slashes before the query string get converted to forward slashes
	  // See: https://code.google.com/p/chromium/issues/detail?id=25916
	  var queryIndex = url.indexOf('?'),
	      splitter =
	          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
	      uSplit = url.split(splitter),
	      slashRegex = /\\/g;
	  uSplit[0] = uSplit[0].replace(slashRegex, '/');
	  url = uSplit.join(splitter);

	  var rest = url;

	  // trim before proceeding.
	  // This is to support parse stuff like "  http://foo.com  \n"
	  rest = rest.trim();

	  if (!slashesDenoteHost && url.split('#').length === 1) {
	    // Try fast path regexp
	    var simplePath = simplePathPattern.exec(rest);
	    if (simplePath) {
	      this.path = rest;
	      this.href = rest;
	      this.pathname = simplePath[1];
	      if (simplePath[2]) {
	        this.search = simplePath[2];
	        if (parseQueryString) {
	          this.query = querystring.parse(this.search.substr(1));
	        } else {
	          this.query = this.search.substr(1);
	        }
	      } else if (parseQueryString) {
	        this.search = '';
	        this.query = {};
	      }
	      return this;
	    }
	  }

	  var proto = protocolPattern.exec(rest);
	  if (proto) {
	    proto = proto[0];
	    var lowerProto = proto.toLowerCase();
	    this.protocol = lowerProto;
	    rest = rest.substr(proto.length);
	  }

	  // figure out if it's got a host
	  // user@server is *always* interpreted as a hostname, and url
	  // resolution will treat //foo/bar as host=foo,path=bar because that's
	  // how the browser resolves relative URLs.
	  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
	    var slashes = rest.substr(0, 2) === '//';
	    if (slashes && !(proto && hostlessProtocol[proto])) {
	      rest = rest.substr(2);
	      this.slashes = true;
	    }
	  }

	  if (!hostlessProtocol[proto] &&
	      (slashes || (proto && !slashedProtocol[proto]))) {

	    // there's a hostname.
	    // the first instance of /, ?, ;, or # ends the host.
	    //
	    // If there is an @ in the hostname, then non-host chars *are* allowed
	    // to the left of the last @ sign, unless some host-ending character
	    // comes *before* the @-sign.
	    // URLs are obnoxious.
	    //
	    // ex:
	    // http://a@b@c/ => user:a@b host:c
	    // http://a@b?@c => user:a host:c path:/?@c

	    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
	    // Review our test case against browsers more comprehensively.

	    // find the first instance of any hostEndingChars
	    var hostEnd = -1;
	    for (var i = 0; i < hostEndingChars.length; i++) {
	      var hec = rest.indexOf(hostEndingChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }

	    // at this point, either we have an explicit point where the
	    // auth portion cannot go past, or the last @ char is the decider.
	    var auth, atSign;
	    if (hostEnd === -1) {
	      // atSign can be anywhere.
	      atSign = rest.lastIndexOf('@');
	    } else {
	      // atSign must be in auth portion.
	      // http://a@b/c@d => host:b auth:a path:/c@d
	      atSign = rest.lastIndexOf('@', hostEnd);
	    }

	    // Now we have a portion which is definitely the auth.
	    // Pull that off.
	    if (atSign !== -1) {
	      auth = rest.slice(0, atSign);
	      rest = rest.slice(atSign + 1);
	      this.auth = decodeURIComponent(auth);
	    }

	    // the host is the remaining to the left of the first non-host char
	    hostEnd = -1;
	    for (var i = 0; i < nonHostChars.length; i++) {
	      var hec = rest.indexOf(nonHostChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }
	    // if we still have not hit it, then the entire thing is a host.
	    if (hostEnd === -1)
	      hostEnd = rest.length;

	    this.host = rest.slice(0, hostEnd);
	    rest = rest.slice(hostEnd);

	    // pull out port.
	    this.parseHost();

	    // we've indicated that there is a hostname,
	    // so even if it's empty, it has to be present.
	    this.hostname = this.hostname || '';

	    // if hostname begins with [ and ends with ]
	    // assume that it's an IPv6 address.
	    var ipv6Hostname = this.hostname[0] === '[' &&
	        this.hostname[this.hostname.length - 1] === ']';

	    // validate a little.
	    if (!ipv6Hostname) {
	      var hostparts = this.hostname.split(/\./);
	      for (var i = 0, l = hostparts.length; i < l; i++) {
	        var part = hostparts[i];
	        if (!part) continue;
	        if (!part.match(hostnamePartPattern)) {
	          var newpart = '';
	          for (var j = 0, k = part.length; j < k; j++) {
	            if (part.charCodeAt(j) > 127) {
	              // we replace non-ASCII char with a temporary placeholder
	              // we need this to make sure size of hostname is not
	              // broken by replacing non-ASCII by nothing
	              newpart += 'x';
	            } else {
	              newpart += part[j];
	            }
	          }
	          // we test again with ASCII char only
	          if (!newpart.match(hostnamePartPattern)) {
	            var validParts = hostparts.slice(0, i);
	            var notHost = hostparts.slice(i + 1);
	            var bit = part.match(hostnamePartStart);
	            if (bit) {
	              validParts.push(bit[1]);
	              notHost.unshift(bit[2]);
	            }
	            if (notHost.length) {
	              rest = '/' + notHost.join('.') + rest;
	            }
	            this.hostname = validParts.join('.');
	            break;
	          }
	        }
	      }
	    }

	    if (this.hostname.length > hostnameMaxLen) {
	      this.hostname = '';
	    } else {
	      // hostnames are always lower case.
	      this.hostname = this.hostname.toLowerCase();
	    }

	    if (!ipv6Hostname) {
	      // IDNA Support: Returns a punycoded representation of "domain".
	      // It only converts parts of the domain name that
	      // have non-ASCII characters, i.e. it doesn't matter if
	      // you call it with a domain that already is ASCII-only.
	      this.hostname = punycode.toASCII(this.hostname);
	    }

	    var p = this.port ? ':' + this.port : '';
	    var h = this.hostname || '';
	    this.host = h + p;
	    this.href += this.host;

	    // strip [ and ] from the hostname
	    // the host field still retains them, though
	    if (ipv6Hostname) {
	      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
	      if (rest[0] !== '/') {
	        rest = '/' + rest;
	      }
	    }
	  }

	  // now rest is set to the post-host stuff.
	  // chop off any delim chars.
	  if (!unsafeProtocol[lowerProto]) {

	    // First, make 100% sure that any "autoEscape" chars get
	    // escaped, even if encodeURIComponent doesn't think they
	    // need to be.
	    for (var i = 0, l = autoEscape.length; i < l; i++) {
	      var ae = autoEscape[i];
	      if (rest.indexOf(ae) === -1)
	        continue;
	      var esc = encodeURIComponent(ae);
	      if (esc === ae) {
	        esc = escape(ae);
	      }
	      rest = rest.split(ae).join(esc);
	    }
	  }


	  // chop off from the tail first.
	  var hash = rest.indexOf('#');
	  if (hash !== -1) {
	    // got a fragment string.
	    this.hash = rest.substr(hash);
	    rest = rest.slice(0, hash);
	  }
	  var qm = rest.indexOf('?');
	  if (qm !== -1) {
	    this.search = rest.substr(qm);
	    this.query = rest.substr(qm + 1);
	    if (parseQueryString) {
	      this.query = querystring.parse(this.query);
	    }
	    rest = rest.slice(0, qm);
	  } else if (parseQueryString) {
	    // no query string, but parseQueryString still requested
	    this.search = '';
	    this.query = {};
	  }
	  if (rest) this.pathname = rest;
	  if (slashedProtocol[lowerProto] &&
	      this.hostname && !this.pathname) {
	    this.pathname = '/';
	  }

	  //to support http.request
	  if (this.pathname || this.search) {
	    var p = this.pathname || '';
	    var s = this.search || '';
	    this.path = p + s;
	  }

	  // finally, reconstruct the href based on what has been validated.
	  this.href = this.format();
	  return this;
	};

	// format a parsed object into a url string
	function urlFormat(obj) {
	  // ensure it's an object, and not a string url.
	  // If it's an obj, this is a no-op.
	  // this way, you can call url_format() on strings
	  // to clean up potentially wonky urls.
	  if (util.isString(obj)) obj = urlParse(obj);
	  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
	  return obj.format();
	}

	Url.prototype.format = function() {
	  var auth = this.auth || '';
	  if (auth) {
	    auth = encodeURIComponent(auth);
	    auth = auth.replace(/%3A/i, ':');
	    auth += '@';
	  }

	  var protocol = this.protocol || '',
	      pathname = this.pathname || '',
	      hash = this.hash || '',
	      host = false,
	      query = '';

	  if (this.host) {
	    host = auth + this.host;
	  } else if (this.hostname) {
	    host = auth + (this.hostname.indexOf(':') === -1 ?
	        this.hostname :
	        '[' + this.hostname + ']');
	    if (this.port) {
	      host += ':' + this.port;
	    }
	  }

	  if (this.query &&
	      util.isObject(this.query) &&
	      Object.keys(this.query).length) {
	    query = querystring.stringify(this.query);
	  }

	  var search = this.search || (query && ('?' + query)) || '';

	  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

	  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
	  // unless they had them to begin with.
	  if (this.slashes ||
	      (!protocol || slashedProtocol[protocol]) && host !== false) {
	    host = '//' + (host || '');
	    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
	  } else if (!host) {
	    host = '';
	  }

	  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
	  if (search && search.charAt(0) !== '?') search = '?' + search;

	  pathname = pathname.replace(/[?#]/g, function(match) {
	    return encodeURIComponent(match);
	  });
	  search = search.replace('#', '%23');

	  return protocol + host + pathname + search + hash;
	};

	function urlResolve(source, relative) {
	  return urlParse(source, false, true).resolve(relative);
	}

	Url.prototype.resolve = function(relative) {
	  return this.resolveObject(urlParse(relative, false, true)).format();
	};

	function urlResolveObject(source, relative) {
	  if (!source) return relative;
	  return urlParse(source, false, true).resolveObject(relative);
	}

	Url.prototype.resolveObject = function(relative) {
	  if (util.isString(relative)) {
	    var rel = new Url();
	    rel.parse(relative, false, true);
	    relative = rel;
	  }

	  var result = new Url();
	  var tkeys = Object.keys(this);
	  for (var tk = 0; tk < tkeys.length; tk++) {
	    var tkey = tkeys[tk];
	    result[tkey] = this[tkey];
	  }

	  // hash is always overridden, no matter what.
	  // even href="" will remove it.
	  result.hash = relative.hash;

	  // if the relative url is empty, then there's nothing left to do here.
	  if (relative.href === '') {
	    result.href = result.format();
	    return result;
	  }

	  // hrefs like //foo/bar always cut to the protocol.
	  if (relative.slashes && !relative.protocol) {
	    // take everything except the protocol from relative
	    var rkeys = Object.keys(relative);
	    for (var rk = 0; rk < rkeys.length; rk++) {
	      var rkey = rkeys[rk];
	      if (rkey !== 'protocol')
	        result[rkey] = relative[rkey];
	    }

	    //urlParse appends trailing / to urls like http://www.example.com
	    if (slashedProtocol[result.protocol] &&
	        result.hostname && !result.pathname) {
	      result.path = result.pathname = '/';
	    }

	    result.href = result.format();
	    return result;
	  }

	  if (relative.protocol && relative.protocol !== result.protocol) {
	    // if it's a known url protocol, then changing
	    // the protocol does weird things
	    // first, if it's not file:, then we MUST have a host,
	    // and if there was a path
	    // to begin with, then we MUST have a path.
	    // if it is file:, then the host is dropped,
	    // because that's known to be hostless.
	    // anything else is assumed to be absolute.
	    if (!slashedProtocol[relative.protocol]) {
	      var keys = Object.keys(relative);
	      for (var v = 0; v < keys.length; v++) {
	        var k = keys[v];
	        result[k] = relative[k];
	      }
	      result.href = result.format();
	      return result;
	    }

	    result.protocol = relative.protocol;
	    if (!relative.host && !hostlessProtocol[relative.protocol]) {
	      var relPath = (relative.pathname || '').split('/');
	      while (relPath.length && !(relative.host = relPath.shift()));
	      if (!relative.host) relative.host = '';
	      if (!relative.hostname) relative.hostname = '';
	      if (relPath[0] !== '') relPath.unshift('');
	      if (relPath.length < 2) relPath.unshift('');
	      result.pathname = relPath.join('/');
	    } else {
	      result.pathname = relative.pathname;
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    result.host = relative.host || '';
	    result.auth = relative.auth;
	    result.hostname = relative.hostname || relative.host;
	    result.port = relative.port;
	    // to support http.request
	    if (result.pathname || result.search) {
	      var p = result.pathname || '';
	      var s = result.search || '';
	      result.path = p + s;
	    }
	    result.slashes = result.slashes || relative.slashes;
	    result.href = result.format();
	    return result;
	  }

	  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
	      isRelAbs = (
	          relative.host ||
	          relative.pathname && relative.pathname.charAt(0) === '/'
	      ),
	      mustEndAbs = (isRelAbs || isSourceAbs ||
	                    (result.host && relative.pathname)),
	      removeAllDots = mustEndAbs,
	      srcPath = result.pathname && result.pathname.split('/') || [],
	      relPath = relative.pathname && relative.pathname.split('/') || [],
	      psychotic = result.protocol && !slashedProtocol[result.protocol];

	  // if the url is a non-slashed url, then relative
	  // links like ../.. should be able
	  // to crawl up to the hostname, as well.  This is strange.
	  // result.protocol has already been set by now.
	  // Later on, put the first path part into the host field.
	  if (psychotic) {
	    result.hostname = '';
	    result.port = null;
	    if (result.host) {
	      if (srcPath[0] === '') srcPath[0] = result.host;
	      else srcPath.unshift(result.host);
	    }
	    result.host = '';
	    if (relative.protocol) {
	      relative.hostname = null;
	      relative.port = null;
	      if (relative.host) {
	        if (relPath[0] === '') relPath[0] = relative.host;
	        else relPath.unshift(relative.host);
	      }
	      relative.host = null;
	    }
	    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
	  }

	  if (isRelAbs) {
	    // it's absolute.
	    result.host = (relative.host || relative.host === '') ?
	                  relative.host : result.host;
	    result.hostname = (relative.hostname || relative.hostname === '') ?
	                      relative.hostname : result.hostname;
	    result.search = relative.search;
	    result.query = relative.query;
	    srcPath = relPath;
	    // fall through to the dot-handling below.
	  } else if (relPath.length) {
	    // it's relative
	    // throw away the existing file, and take the new path instead.
	    if (!srcPath) srcPath = [];
	    srcPath.pop();
	    srcPath = srcPath.concat(relPath);
	    result.search = relative.search;
	    result.query = relative.query;
	  } else if (!util.isNullOrUndefined(relative.search)) {
	    // just pull out the search.
	    // like href='?foo'.
	    // Put this after the other two cases because it simplifies the booleans
	    if (psychotic) {
	      result.hostname = result.host = srcPath.shift();
	      //occationaly the auth can get stuck only in host
	      //this especially happens in cases like
	      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	      var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                       result.host.split('@') : false;
	      if (authInHost) {
	        result.auth = authInHost.shift();
	        result.host = result.hostname = authInHost.shift();
	      }
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    //to support http.request
	    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
	      result.path = (result.pathname ? result.pathname : '') +
	                    (result.search ? result.search : '');
	    }
	    result.href = result.format();
	    return result;
	  }

	  if (!srcPath.length) {
	    // no path at all.  easy.
	    // we've already handled the other stuff above.
	    result.pathname = null;
	    //to support http.request
	    if (result.search) {
	      result.path = '/' + result.search;
	    } else {
	      result.path = null;
	    }
	    result.href = result.format();
	    return result;
	  }

	  // if a url ENDs in . or .., then it must get a trailing slash.
	  // however, if it ends in anything else non-slashy,
	  // then it must NOT get a trailing slash.
	  var last = srcPath.slice(-1)[0];
	  var hasTrailingSlash = (
	      (result.host || relative.host || srcPath.length > 1) &&
	      (last === '.' || last === '..') || last === '');

	  // strip single dots, resolve double dots to parent dir
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = srcPath.length; i >= 0; i--) {
	    last = srcPath[i];
	    if (last === '.') {
	      srcPath.splice(i, 1);
	    } else if (last === '..') {
	      srcPath.splice(i, 1);
	      up++;
	    } else if (up) {
	      srcPath.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (!mustEndAbs && !removeAllDots) {
	    for (; up--; up) {
	      srcPath.unshift('..');
	    }
	  }

	  if (mustEndAbs && srcPath[0] !== '' &&
	      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
	    srcPath.unshift('');
	  }

	  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
	    srcPath.push('');
	  }

	  var isAbsolute = srcPath[0] === '' ||
	      (srcPath[0] && srcPath[0].charAt(0) === '/');

	  // put the host back
	  if (psychotic) {
	    result.hostname = result.host = isAbsolute ? '' :
	                                    srcPath.length ? srcPath.shift() : '';
	    //occationaly the auth can get stuck only in host
	    //this especially happens in cases like
	    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	    var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                     result.host.split('@') : false;
	    if (authInHost) {
	      result.auth = authInHost.shift();
	      result.host = result.hostname = authInHost.shift();
	    }
	  }

	  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

	  if (mustEndAbs && !isAbsolute) {
	    srcPath.unshift('');
	  }

	  if (!srcPath.length) {
	    result.pathname = null;
	    result.path = null;
	  } else {
	    result.pathname = srcPath.join('/');
	  }

	  //to support request.http
	  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
	    result.path = (result.pathname ? result.pathname : '') +
	                  (result.search ? result.search : '');
	  }
	  result.auth = relative.auth || result.auth;
	  result.slashes = result.slashes || relative.slashes;
	  result.href = result.format();
	  return result;
	};

	Url.prototype.parseHost = function() {
	  var host = this.host;
	  var port = portPattern.exec(host);
	  if (port) {
	    port = port[0];
	    if (port !== ':') {
	      this.port = port.substr(1);
	    }
	    host = host.substr(0, host.length - port.length);
	  }
	  if (host) this.hostname = host;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/punycode v1.4.1 by @mathias */
	;(function(root) {

		/** Detect free variables */
		var freeExports = typeof exports == 'object' && exports &&
			!exports.nodeType && exports;
		var freeModule = typeof module == 'object' && module &&
			!module.nodeType && module;
		var freeGlobal = typeof global == 'object' && global;
		if (
			freeGlobal.global === freeGlobal ||
			freeGlobal.window === freeGlobal ||
			freeGlobal.self === freeGlobal
		) {
			root = freeGlobal;
		}

		/**
		 * The `punycode` object.
		 * @name punycode
		 * @type Object
		 */
		var punycode,

		/** Highest positive signed 32-bit float value */
		maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

		/** Bootstring parameters */
		base = 36,
		tMin = 1,
		tMax = 26,
		skew = 38,
		damp = 700,
		initialBias = 72,
		initialN = 128, // 0x80
		delimiter = '-', // '\x2D'

		/** Regular expressions */
		regexPunycode = /^xn--/,
		regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
		regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

		/** Error messages */
		errors = {
			'overflow': 'Overflow: input needs wider integers to process',
			'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
			'invalid-input': 'Invalid input'
		},

		/** Convenience shortcuts */
		baseMinusTMin = base - tMin,
		floor = Math.floor,
		stringFromCharCode = String.fromCharCode,

		/** Temporary variable */
		key;

		/*--------------------------------------------------------------------------*/

		/**
		 * A generic error utility function.
		 * @private
		 * @param {String} type The error type.
		 * @returns {Error} Throws a `RangeError` with the applicable error message.
		 */
		function error(type) {
			throw new RangeError(errors[type]);
		}

		/**
		 * A generic `Array#map` utility function.
		 * @private
		 * @param {Array} array The array to iterate over.
		 * @param {Function} callback The function that gets called for every array
		 * item.
		 * @returns {Array} A new array of values returned by the callback function.
		 */
		function map(array, fn) {
			var length = array.length;
			var result = [];
			while (length--) {
				result[length] = fn(array[length]);
			}
			return result;
		}

		/**
		 * A simple `Array#map`-like wrapper to work with domain name strings or email
		 * addresses.
		 * @private
		 * @param {String} domain The domain name or email address.
		 * @param {Function} callback The function that gets called for every
		 * character.
		 * @returns {Array} A new string of characters returned by the callback
		 * function.
		 */
		function mapDomain(string, fn) {
			var parts = string.split('@');
			var result = '';
			if (parts.length > 1) {
				// In email addresses, only the domain name should be punycoded. Leave
				// the local part (i.e. everything up to `@`) intact.
				result = parts[0] + '@';
				string = parts[1];
			}
			// Avoid `split(regex)` for IE8 compatibility. See #17.
			string = string.replace(regexSeparators, '\x2E');
			var labels = string.split('.');
			var encoded = map(labels, fn).join('.');
			return result + encoded;
		}

		/**
		 * Creates an array containing the numeric code points of each Unicode
		 * character in the string. While JavaScript uses UCS-2 internally,
		 * this function will convert a pair of surrogate halves (each of which
		 * UCS-2 exposes as separate characters) into a single code point,
		 * matching UTF-16.
		 * @see `punycode.ucs2.encode`
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode.ucs2
		 * @name decode
		 * @param {String} string The Unicode input string (UCS-2).
		 * @returns {Array} The new array of code points.
		 */
		function ucs2decode(string) {
			var output = [],
			    counter = 0,
			    length = string.length,
			    value,
			    extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}

		/**
		 * Creates a string based on an array of numeric code points.
		 * @see `punycode.ucs2.decode`
		 * @memberOf punycode.ucs2
		 * @name encode
		 * @param {Array} codePoints The array of numeric code points.
		 * @returns {String} The new Unicode string (UCS-2).
		 */
		function ucs2encode(array) {
			return map(array, function(value) {
				var output = '';
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
				return output;
			}).join('');
		}

		/**
		 * Converts a basic code point into a digit/integer.
		 * @see `digitToBasic()`
		 * @private
		 * @param {Number} codePoint The basic numeric code point value.
		 * @returns {Number} The numeric value of a basic code point (for use in
		 * representing integers) in the range `0` to `base - 1`, or `base` if
		 * the code point does not represent a value.
		 */
		function basicToDigit(codePoint) {
			if (codePoint - 48 < 10) {
				return codePoint - 22;
			}
			if (codePoint - 65 < 26) {
				return codePoint - 65;
			}
			if (codePoint - 97 < 26) {
				return codePoint - 97;
			}
			return base;
		}

		/**
		 * Converts a digit/integer into a basic code point.
		 * @see `basicToDigit()`
		 * @private
		 * @param {Number} digit The numeric value of a basic code point.
		 * @returns {Number} The basic code point whose value (when used for
		 * representing integers) is `digit`, which needs to be in the range
		 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
		 * used; else, the lowercase form is used. The behavior is undefined
		 * if `flag` is non-zero and `digit` has no uppercase form.
		 */
		function digitToBasic(digit, flag) {
			//  0..25 map to ASCII a..z or A..Z
			// 26..35 map to ASCII 0..9
			return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
		}

		/**
		 * Bias adaptation function as per section 3.4 of RFC 3492.
		 * https://tools.ietf.org/html/rfc3492#section-3.4
		 * @private
		 */
		function adapt(delta, numPoints, firstTime) {
			var k = 0;
			delta = firstTime ? floor(delta / damp) : delta >> 1;
			delta += floor(delta / numPoints);
			for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
				delta = floor(delta / baseMinusTMin);
			}
			return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		}

		/**
		 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
		 * symbols.
		 * @memberOf punycode
		 * @param {String} input The Punycode string of ASCII-only symbols.
		 * @returns {String} The resulting string of Unicode symbols.
		 */
		function decode(input) {
			// Don't use UCS-2
			var output = [],
			    inputLength = input.length,
			    out,
			    i = 0,
			    n = initialN,
			    bias = initialBias,
			    basic,
			    j,
			    index,
			    oldi,
			    w,
			    k,
			    digit,
			    t,
			    /** Cached calculation results */
			    baseMinusT;

			// Handle the basic code points: let `basic` be the number of input code
			// points before the last delimiter, or `0` if there is none, then copy
			// the first basic code points to the output.

			basic = input.lastIndexOf(delimiter);
			if (basic < 0) {
				basic = 0;
			}

			for (j = 0; j < basic; ++j) {
				// if it's not a basic code point
				if (input.charCodeAt(j) >= 0x80) {
					error('not-basic');
				}
				output.push(input.charCodeAt(j));
			}

			// Main decoding loop: start just after the last delimiter if any basic code
			// points were copied; start at the beginning otherwise.

			for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

				// `index` is the index of the next character to be consumed.
				// Decode a generalized variable-length integer into `delta`,
				// which gets added to `i`. The overflow checking is easier
				// if we increase `i` as we go, then subtract off its starting
				// value at the end to obtain `delta`.
				for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

					if (index >= inputLength) {
						error('invalid-input');
					}

					digit = basicToDigit(input.charCodeAt(index++));

					if (digit >= base || digit > floor((maxInt - i) / w)) {
						error('overflow');
					}

					i += digit * w;
					t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

					if (digit < t) {
						break;
					}

					baseMinusT = base - t;
					if (w > floor(maxInt / baseMinusT)) {
						error('overflow');
					}

					w *= baseMinusT;

				}

				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi == 0);

				// `i` was supposed to wrap around from `out` to `0`,
				// incrementing `n` each time, so we'll fix that now:
				if (floor(i / out) > maxInt - n) {
					error('overflow');
				}

				n += floor(i / out);
				i %= out;

				// Insert `n` at position `i` of the output
				output.splice(i++, 0, n);

			}

			return ucs2encode(output);
		}

		/**
		 * Converts a string of Unicode symbols (e.g. a domain name label) to a
		 * Punycode string of ASCII-only symbols.
		 * @memberOf punycode
		 * @param {String} input The string of Unicode symbols.
		 * @returns {String} The resulting Punycode string of ASCII-only symbols.
		 */
		function encode(input) {
			var n,
			    delta,
			    handledCPCount,
			    basicLength,
			    bias,
			    j,
			    m,
			    q,
			    k,
			    t,
			    currentValue,
			    output = [],
			    /** `inputLength` will hold the number of code points in `input`. */
			    inputLength,
			    /** Cached calculation results */
			    handledCPCountPlusOne,
			    baseMinusT,
			    qMinusT;

			// Convert the input in UCS-2 to Unicode
			input = ucs2decode(input);

			// Cache the length
			inputLength = input.length;

			// Initialize the state
			n = initialN;
			delta = 0;
			bias = initialBias;

			// Handle the basic code points
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < 0x80) {
					output.push(stringFromCharCode(currentValue));
				}
			}

			handledCPCount = basicLength = output.length;

			// `handledCPCount` is the number of code points that have been handled;
			// `basicLength` is the number of basic code points.

			// Finish the basic string - if it is not empty - with a delimiter
			if (basicLength) {
				output.push(delimiter);
			}

			// Main encoding loop:
			while (handledCPCount < inputLength) {

				// All non-basic code points < n have been handled already. Find the next
				// larger one:
				for (m = maxInt, j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue >= n && currentValue < m) {
						m = currentValue;
					}
				}

				// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
				// but guard against overflow
				handledCPCountPlusOne = handledCPCount + 1;
				if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
					error('overflow');
				}

				delta += (m - n) * handledCPCountPlusOne;
				n = m;

				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];

					if (currentValue < n && ++delta > maxInt) {
						error('overflow');
					}

					if (currentValue == n) {
						// Represent delta as a generalized variable-length integer
						for (q = delta, k = base; /* no condition */; k += base) {
							t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
							if (q < t) {
								break;
							}
							qMinusT = q - t;
							baseMinusT = base - t;
							output.push(
								stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
							);
							q = floor(qMinusT / baseMinusT);
						}

						output.push(stringFromCharCode(digitToBasic(q, 0)));
						bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
						delta = 0;
						++handledCPCount;
					}
				}

				++delta;
				++n;

			}
			return output.join('');
		}

		/**
		 * Converts a Punycode string representing a domain name or an email address
		 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
		 * it doesn't matter if you call it on a string that has already been
		 * converted to Unicode.
		 * @memberOf punycode
		 * @param {String} input The Punycoded domain name or email address to
		 * convert to Unicode.
		 * @returns {String} The Unicode representation of the given Punycode
		 * string.
		 */
		function toUnicode(input) {
			return mapDomain(input, function(string) {
				return regexPunycode.test(string)
					? decode(string.slice(4).toLowerCase())
					: string;
			});
		}

		/**
		 * Converts a Unicode string representing a domain name or an email address to
		 * Punycode. Only the non-ASCII parts of the domain name will be converted,
		 * i.e. it doesn't matter if you call it with a domain that's already in
		 * ASCII.
		 * @memberOf punycode
		 * @param {String} input The domain name or email address to convert, as a
		 * Unicode string.
		 * @returns {String} The Punycode representation of the given domain name or
		 * email address.
		 */
		function toASCII(input) {
			return mapDomain(input, function(string) {
				return regexNonASCII.test(string)
					? 'xn--' + encode(string)
					: string;
			});
		}

		/*--------------------------------------------------------------------------*/

		/** Define the public API */
		punycode = {
			/**
			 * A string representing the current Punycode.js version number.
			 * @memberOf punycode
			 * @type String
			 */
			'version': '1.4.1',
			/**
			 * An object of methods to convert from JavaScript's internal character
			 * representation (UCS-2) to Unicode code points, and back.
			 * @see <https://mathiasbynens.be/notes/javascript-encoding>
			 * @memberOf punycode
			 * @type Object
			 */
			'ucs2': {
				'decode': ucs2decode,
				'encode': ucs2encode
			},
			'decode': decode,
			'encode': encode,
			'toASCII': toASCII,
			'toUnicode': toUnicode
		};

		/** Expose `punycode` */
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return punycode;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (freeExports && freeModule) {
			if (module.exports == freeExports) {
				// in Node.js, io.js, or RingoJS v0.8.0+
				freeModule.exports = punycode;
			} else {
				// in Narwhal or RingoJS v0.7.0-
				for (key in punycode) {
					punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
				}
			}
		} else {
			// in Rhino or a web browser
			root.punycode = punycode;
		}

	}(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)(module), (function() { return this; }())))

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  isString: function(arg) {
	    return typeof(arg) === 'string';
	  },
	  isObject: function(arg) {
	    return typeof(arg) === 'object' && arg !== null;
	  },
	  isNull: function(arg) {
	    return arg === null;
	  },
	  isNullOrUndefined: function(arg) {
	    return arg == null;
	  }
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.decode = exports.parse = __webpack_require__(9);
	exports.encode = exports.stringify = __webpack_require__(10);


/***/ },
/* 9 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	module.exports = function(qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};

	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }

	  var regexp = /\+/g;
	  qs = qs.split(sep);

	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }

	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }

	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr, vstr, k, v;

	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }

	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);

	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (Array.isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }

	  return obj;
	};


/***/ },
/* 10 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	var stringifyPrimitive = function(v) {
	  switch (typeof v) {
	    case 'string':
	      return v;

	    case 'boolean':
	      return v ? 'true' : 'false';

	    case 'number':
	      return isFinite(v) ? v : '';

	    default:
	      return '';
	  }
	};

	module.exports = function(obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }

	  if (typeof obj === 'object') {
	    return Object.keys(obj).map(function(k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (Array.isArray(obj[k])) {
	        return obj[k].map(function(v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);

	  }

	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq +
	         encodeURIComponent(stringifyPrimitive(obj));
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * History.js Native Adapter
	 * @author Benjamin Arthur Lupton <contact@balupton.com>
	 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
	 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
	 */

	// Closure
	(function(window,undefined){
		"use strict";

		// Localise Globals
		var History = window.History = window.History||{};

		// Check Existence
		if ( typeof History.Adapter !== 'undefined' ) {
			throw new Error('History.js Adapter has already been loaded...');
		}

		// Add the Adapter
		History.Adapter = {
			/**
			 * History.Adapter.handlers[uid][eventName] = Array
			 */
			handlers: {},

			/**
			 * History.Adapter._uid
			 * The current element unique identifier
			 */
			_uid: 1,

			/**
			 * History.Adapter.uid(element)
			 * @param {Element} element
			 * @return {String} uid
			 */
			uid: function(element){
				return element._uid || (element._uid = History.Adapter._uid++);
			},

			/**
			 * History.Adapter.bind(el,event,callback)
			 * @param {Element} element
			 * @param {String} eventName - custom and standard events
			 * @param {Function} callback
			 * @return
			 */
			bind: function(element,eventName,callback){
				// Prepare
				var uid = History.Adapter.uid(element);

				// Apply Listener
				History.Adapter.handlers[uid] = History.Adapter.handlers[uid] || {};
				History.Adapter.handlers[uid][eventName] = History.Adapter.handlers[uid][eventName] || [];
				History.Adapter.handlers[uid][eventName].push(callback);

				// Bind Global Listener
				element['on'+eventName] = (function(element,eventName){
					return function(event){
						History.Adapter.trigger(element,eventName,event);
					};
				})(element,eventName);
			},

			/**
			 * History.Adapter.trigger(el,event)
			 * @param {Element} element
			 * @param {String} eventName - custom and standard events
			 * @param {Object} event - a object of event data
			 * @return
			 */
			trigger: function(element,eventName,event){
				// Prepare
				event = event || {};
				var uid = History.Adapter.uid(element),
					i,n;

				// Apply Listener
				History.Adapter.handlers[uid] = History.Adapter.handlers[uid] || {};
				History.Adapter.handlers[uid][eventName] = History.Adapter.handlers[uid][eventName] || [];

				// Fire Listeners
				for ( i=0,n=History.Adapter.handlers[uid][eventName].length; i<n; ++i ) {
					History.Adapter.handlers[uid][eventName][i].apply(this,[event]);
				}
			},

			/**
			 * History.Adapter.extractEventData(key,event,extra)
			 * @param {String} key - key for the event data to extract
			 * @param {String} event - custom and standard events
			 * @return {mixed}
			 */
			extractEventData: function(key,event){
				var result = (event && event[key]) || undefined;
				return result;
			},

			/**
			 * History.Adapter.onDomLoad(callback)
			 * @param {Function} callback
			 * @return
			 */
			onDomLoad: function(callback) {
				var timeout = window.setTimeout(function(){
					callback();
				},2000);
				window.onload = function(){
					clearTimeout(timeout);
					callback();
				};
			}
		};

		// Try to Initialise History
		if ( typeof History.init !== 'undefined' ) {
			History.init();
		}

	})(window);
	/**
	 * History.js Core
	 * @author Benjamin Arthur Lupton <contact@balupton.com>
	 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
	 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
	 */

	(function(window,undefined){
		"use strict";

		// ========================================================================
		// Initialise

		// Localise Globals
		var
			console = window.console||undefined, // Prevent a JSLint complain
			document = window.document, // Make sure we are using the correct document
			navigator = window.navigator, // Make sure we are using the correct navigator
			sessionStorage = false, // sessionStorage
			setTimeout = window.setTimeout,
			clearTimeout = window.clearTimeout,
			setInterval = window.setInterval,
			clearInterval = window.clearInterval,
			JSON = window.JSON,
			alert = window.alert,
			History = window.History = window.History||{}, // Public History Object
			history = window.history; // Old History Object

		try {
			sessionStorage = window.sessionStorage; // This will throw an exception in some browsers when cookies/localStorage are explicitly disabled (i.e. Chrome)
			sessionStorage.setItem('TEST', '1');
			sessionStorage.removeItem('TEST');
		} catch(e) {
			sessionStorage = false;
		}

		// MooTools Compatibility
		JSON.stringify = JSON.stringify||JSON.encode;
		JSON.parse = JSON.parse||JSON.decode;

		// Check Existence
		if ( typeof History.init !== 'undefined' ) {
			throw new Error('History.js Core has already been loaded...');
		}

		// Initialise History
		History.init = function(options){
			// Check Load Status of Adapter
			if ( typeof History.Adapter === 'undefined' ) {
				return false;
			}

			// Check Load Status of Core
			if ( typeof History.initCore !== 'undefined' ) {
				History.initCore();
			}

			// Check Load Status of HTML4 Support
			if ( typeof History.initHtml4 !== 'undefined' ) {
				History.initHtml4();
			}

			// Return true
			return true;
		};


		// ========================================================================
		// Initialise Core

		// Initialise Core
		History.initCore = function(options){
			// Initialise
			if ( typeof History.initCore.initialized !== 'undefined' ) {
				// Already Loaded
				return false;
			}
			else {
				History.initCore.initialized = true;
			}


			// ====================================================================
			// Options

			/**
			 * History.options
			 * Configurable options
			 */
			History.options = History.options||{};

			/**
			 * History.options.hashChangeInterval
			 * How long should the interval be before hashchange checks
			 */
			History.options.hashChangeInterval = History.options.hashChangeInterval || 100;

			/**
			 * History.options.safariPollInterval
			 * How long should the interval be before safari poll checks
			 */
			History.options.safariPollInterval = History.options.safariPollInterval || 500;

			/**
			 * History.options.doubleCheckInterval
			 * How long should the interval be before we perform a double check
			 */
			History.options.doubleCheckInterval = History.options.doubleCheckInterval || 500;

			/**
			 * History.options.disableSuid
			 * Force History not to append suid
			 */
			History.options.disableSuid = History.options.disableSuid || false;

			/**
			 * History.options.storeInterval
			 * How long should we wait between store calls
			 */
			History.options.storeInterval = History.options.storeInterval || 1000;

			/**
			 * History.options.busyDelay
			 * How long should we wait between busy events
			 */
			History.options.busyDelay = History.options.busyDelay || 250;

			/**
			 * History.options.debug
			 * If true will enable debug messages to be logged
			 */
			History.options.debug = History.options.debug || false;

			/**
			 * History.options.initialTitle
			 * What is the title of the initial state
			 */
			History.options.initialTitle = History.options.initialTitle || document.title;

			/**
			 * History.options.html4Mode
			 * If true, will force HTMl4 mode (hashtags)
			 */
			History.options.html4Mode = History.options.html4Mode || false;

			/**
			 * History.options.delayInit
			 * Want to override default options and call init manually.
			 */
			History.options.delayInit = History.options.delayInit || false;


			// ====================================================================
			// Interval record

			/**
			 * History.intervalList
			 * List of intervals set, to be cleared when document is unloaded.
			 */
			History.intervalList = [];

			/**
			 * History.clearAllIntervals
			 * Clears all setInterval instances.
			 */
			History.clearAllIntervals = function(){
				var i, il = History.intervalList;
				if (typeof il !== "undefined" && il !== null) {
					for (i = 0; i < il.length; i++) {
						clearInterval(il[i]);
					}
					History.intervalList = null;
				}
			};


			// ====================================================================
			// Debug

			/**
			 * History.debug(message,...)
			 * Logs the passed arguments if debug enabled
			 */
			History.debug = function(){
				if ( (History.options.debug||false) ) {
					History.log.apply(History,arguments);
				}
			};

			/**
			 * History.log(message,...)
			 * Logs the passed arguments
			 */
			History.log = function(){
				// Prepare
				var
					consoleExists = !(typeof console === 'undefined' || typeof console.log === 'undefined' || typeof console.log.apply === 'undefined'),
					textarea = document.getElementById('log'),
					message,
					i,n,
					args,arg
					;

				// Write to Console
				if ( consoleExists ) {
					args = Array.prototype.slice.call(arguments);
					message = args.shift();
					if ( typeof console.debug !== 'undefined' ) {
						console.debug.apply(console,[message,args]);
					}
					else {
						console.log.apply(console,[message,args]);
					}
				}
				else {
					message = ("\n"+arguments[0]+"\n");
				}

				// Write to log
				for ( i=1,n=arguments.length; i<n; ++i ) {
					arg = arguments[i];
					if ( typeof arg === 'object' && typeof JSON !== 'undefined' ) {
						try {
							arg = JSON.stringify(arg);
						}
						catch ( Exception ) {
							// Recursive Object
						}
					}
					message += "\n"+arg+"\n";
				}

				// Textarea
				if ( textarea ) {
					textarea.value += message+"\n-----\n";
					textarea.scrollTop = textarea.scrollHeight - textarea.clientHeight;
				}
				// No Textarea, No Console
				else if ( !consoleExists ) {
					alert(message);
				}

				// Return true
				return true;
			};


			// ====================================================================
			// Emulated Status

			/**
			 * History.getInternetExplorerMajorVersion()
			 * Get's the major version of Internet Explorer
			 * @return {integer}
			 * @license Public Domain
			 * @author Benjamin Arthur Lupton <contact@balupton.com>
			 * @author James Padolsey <https://gist.github.com/527683>
			 */
			History.getInternetExplorerMajorVersion = function(){
				var result = History.getInternetExplorerMajorVersion.cached =
						(typeof History.getInternetExplorerMajorVersion.cached !== 'undefined')
					?	History.getInternetExplorerMajorVersion.cached
					:	(function(){
							var v = 3,
									div = document.createElement('div'),
									all = div.getElementsByTagName('i');
							while ( (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->') && all[0] ) {}
							return (v > 4) ? v : false;
						})()
					;
				return result;
			};

			/**
			 * History.isInternetExplorer()
			 * Are we using Internet Explorer?
			 * @return {boolean}
			 * @license Public Domain
			 * @author Benjamin Arthur Lupton <contact@balupton.com>
			 */
			History.isInternetExplorer = function(){
				var result =
					History.isInternetExplorer.cached =
					(typeof History.isInternetExplorer.cached !== 'undefined')
						?	History.isInternetExplorer.cached
						:	Boolean(History.getInternetExplorerMajorVersion())
					;
				return result;
			};

			/**
			 * History.emulated
			 * Which features require emulating?
			 */

			if (History.options.html4Mode) {
				History.emulated = {
					pushState : true,
					hashChange: true
				};
			}

			else {

				History.emulated = {
					pushState: !Boolean(
						window.history && window.history.pushState && window.history.replaceState
						&& !(
							(/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i).test(navigator.userAgent) /* disable for versions of iOS before version 4.3 (8F190) */
							|| (/AppleWebKit\/5([0-2]|3[0-2])/i).test(navigator.userAgent) /* disable for the mercury iOS browser, or at least older versions of the webkit engine */
						)
					),
					hashChange: Boolean(
						!(('onhashchange' in window) || ('onhashchange' in document))
						||
						(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 8)
					)
				};
			}

			/**
			 * History.enabled
			 * Is History enabled?
			 */
			History.enabled = !History.emulated.pushState;

			/**
			 * History.bugs
			 * Which bugs are present
			 */
			History.bugs = {
				/**
				 * Safari 5 and Safari iOS 4 fail to return to the correct state once a hash is replaced by a `replaceState` call
				 * https://bugs.webkit.org/show_bug.cgi?id=56249
				 */
				setHash: Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent)),

				/**
				 * Safari 5 and Safari iOS 4 sometimes fail to apply the state change under busy conditions
				 * https://bugs.webkit.org/show_bug.cgi?id=42940
				 */
				safariPoll: Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent)),

				/**
				 * MSIE 6 and 7 sometimes do not apply a hash even it was told to (requiring a second call to the apply function)
				 */
				ieDoubleCheck: Boolean(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 8),

				/**
				 * MSIE 6 requires the entire hash to be encoded for the hashes to trigger the onHashChange event
				 */
				hashEscape: Boolean(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 7)
			};

			/**
			 * History.isEmptyObject(obj)
			 * Checks to see if the Object is Empty
			 * @param {Object} obj
			 * @return {boolean}
			 */
			History.isEmptyObject = function(obj) {
				for ( var name in obj ) {
					if ( obj.hasOwnProperty(name) ) {
						return false;
					}
				}
				return true;
			};

			/**
			 * History.cloneObject(obj)
			 * Clones a object and eliminate all references to the original contexts
			 * @param {Object} obj
			 * @return {Object}
			 */
			History.cloneObject = function(obj) {
				var hash,newObj;
				if ( obj ) {
					hash = JSON.stringify(obj);
					newObj = JSON.parse(hash);
				}
				else {
					newObj = {};
				}
				return newObj;
			};


			// ====================================================================
			// URL Helpers

			/**
			 * History.getRootUrl()
			 * Turns "http://mysite.com/dir/page.html?asd" into "http://mysite.com"
			 * @return {String} rootUrl
			 */
			History.getRootUrl = function(){
				// Create
				var rootUrl = document.location.protocol+'//'+(document.location.hostname||document.location.host);
				if ( document.location.port||false ) {
					rootUrl += ':'+document.location.port;
				}
				rootUrl += '/';

				// Return
				return rootUrl;
			};

			/**
			 * History.getBaseHref()
			 * Fetches the `href` attribute of the `<base href="...">` element if it exists
			 * @return {String} baseHref
			 */
			History.getBaseHref = function(){
				// Create
				var
					baseElements = document.getElementsByTagName('base'),
					baseElement = null,
					baseHref = '';

				// Test for Base Element
				if ( baseElements.length === 1 ) {
					// Prepare for Base Element
					baseElement = baseElements[0];
					baseHref = baseElement.href.replace(/[^\/]+$/,'');
				}

				// Adjust trailing slash
				baseHref = baseHref.replace(/\/+$/,'');
				if ( baseHref ) baseHref += '/';

				// Return
				return baseHref;
			};

			/**
			 * History.getBaseUrl()
			 * Fetches the baseHref or basePageUrl or rootUrl (whichever one exists first)
			 * @return {String} baseUrl
			 */
			History.getBaseUrl = function(){
				// Create
				var baseUrl = History.getBaseHref()||History.getBasePageUrl()||History.getRootUrl();

				// Return
				return baseUrl;
			};

			/**
			 * History.getPageUrl()
			 * Fetches the URL of the current page
			 * @return {String} pageUrl
			 */
			History.getPageUrl = function(){
				// Fetch
				var
					State = History.getState(false,false),
					stateUrl = (State||{}).url||History.getLocationHref(),
					pageUrl;

				// Create
				pageUrl = stateUrl.replace(/\/+$/,'').replace(/[^\/]+$/,function(part,index,string){
					return (/\./).test(part) ? part : part+'/';
				});

				// Return
				return pageUrl;
			};

			/**
			 * History.getBasePageUrl()
			 * Fetches the Url of the directory of the current page
			 * @return {String} basePageUrl
			 */
			History.getBasePageUrl = function(){
				// Create
				var basePageUrl = (History.getLocationHref()).replace(/[#\?].*/,'').replace(/[^\/]+$/,function(part,index,string){
					return (/[^\/]$/).test(part) ? '' : part;
				}).replace(/\/+$/,'')+'/';

				// Return
				return basePageUrl;
			};

			/**
			 * History.getFullUrl(url)
			 * Ensures that we have an absolute URL and not a relative URL
			 * @param {string} url
			 * @param {Boolean} allowBaseHref
			 * @return {string} fullUrl
			 */
			History.getFullUrl = function(url,allowBaseHref){
				// Prepare
				var fullUrl = url, firstChar = url.substring(0,1);
				allowBaseHref = (typeof allowBaseHref === 'undefined') ? true : allowBaseHref;

				// Check
				if ( /[a-z]+\:\/\//.test(url) ) {
					// Full URL
				}
				else if ( firstChar === '/' ) {
					// Root URL
					fullUrl = History.getRootUrl()+url.replace(/^\/+/,'');
				}
				else if ( firstChar === '#' ) {
					// Anchor URL
					fullUrl = History.getPageUrl().replace(/#.*/,'')+url;
				}
				else if ( firstChar === '?' ) {
					// Query URL
					fullUrl = History.getPageUrl().replace(/[\?#].*/,'')+url;
				}
				else {
					// Relative URL
					if ( allowBaseHref ) {
						fullUrl = History.getBaseUrl()+url.replace(/^(\.\/)+/,'');
					} else {
						fullUrl = History.getBasePageUrl()+url.replace(/^(\.\/)+/,'');
					}
					// We have an if condition above as we do not want hashes
					// which are relative to the baseHref in our URLs
					// as if the baseHref changes, then all our bookmarks
					// would now point to different locations
					// whereas the basePageUrl will always stay the same
				}

				// Return
				return fullUrl.replace(/\#$/,'');
			};

			/**
			 * History.getShortUrl(url)
			 * Ensures that we have a relative URL and not a absolute URL
			 * @param {string} url
			 * @return {string} url
			 */
			History.getShortUrl = function(url){
				// Prepare
				var shortUrl = url, baseUrl = History.getBaseUrl(), rootUrl = History.getRootUrl();

				// Trim baseUrl
				if ( History.emulated.pushState ) {
					// We are in a if statement as when pushState is not emulated
					// The actual url these short urls are relative to can change
					// So within the same session, we the url may end up somewhere different
					shortUrl = shortUrl.replace(baseUrl,'');
				}

				// Trim rootUrl
				shortUrl = shortUrl.replace(rootUrl,'/');

				// Ensure we can still detect it as a state
				if ( History.isTraditionalAnchor(shortUrl) ) {
					shortUrl = './'+shortUrl;
				}

				// Clean It
				shortUrl = shortUrl.replace(/^(\.\/)+/g,'./').replace(/\#$/,'');

				// Return
				return shortUrl;
			};

			/**
			 * History.getLocationHref(document)
			 * Returns a normalized version of document.location.href
			 * accounting for browser inconsistencies, etc.
			 *
			 * This URL will be URI-encoded and will include the hash
			 *
			 * @param {object} document
			 * @return {string} url
			 */
			History.getLocationHref = function(doc) {
				doc = doc || document;

				// most of the time, this will be true
				if (doc.URL === doc.location.href)
					return doc.location.href;

				// some versions of webkit URI-decode document.location.href
				// but they leave document.URL in an encoded state
				if (doc.location.href === decodeURIComponent(doc.URL))
					return doc.URL;

				// FF 3.6 only updates document.URL when a page is reloaded
				// document.location.href is updated correctly
				if (doc.location.hash && decodeURIComponent(doc.location.href.replace(/^[^#]+/, "")) === doc.location.hash)
					return doc.location.href;

				if (doc.URL.indexOf('#') == -1 && doc.location.href.indexOf('#') != -1)
					return doc.location.href;
				
				return doc.URL || doc.location.href;
			};


			// ====================================================================
			// State Storage

			/**
			 * History.store
			 * The store for all session specific data
			 */
			History.store = {};

			/**
			 * History.idToState
			 * 1-1: State ID to State Object
			 */
			History.idToState = History.idToState||{};

			/**
			 * History.stateToId
			 * 1-1: State String to State ID
			 */
			History.stateToId = History.stateToId||{};

			/**
			 * History.urlToId
			 * 1-1: State URL to State ID
			 */
			History.urlToId = History.urlToId||{};

			/**
			 * History.storedStates
			 * Store the states in an array
			 */
			History.storedStates = History.storedStates||[];

			/**
			 * History.savedStates
			 * Saved the states in an array
			 */
			History.savedStates = History.savedStates||[];

			/**
			 * History.noramlizeStore()
			 * Noramlize the store by adding necessary values
			 */
			History.normalizeStore = function(){
				History.store.idToState = History.store.idToState||{};
				History.store.urlToId = History.store.urlToId||{};
				History.store.stateToId = History.store.stateToId||{};
			};

			/**
			 * History.getState()
			 * Get an object containing the data, title and url of the current state
			 * @param {Boolean} friendly
			 * @param {Boolean} create
			 * @return {Object} State
			 */
			History.getState = function(friendly,create){
				// Prepare
				if ( typeof friendly === 'undefined' ) { friendly = true; }
				if ( typeof create === 'undefined' ) { create = true; }

				// Fetch
				var State = History.getLastSavedState();

				// Create
				if ( !State && create ) {
					State = History.createStateObject();
				}

				// Adjust
				if ( friendly ) {
					State = History.cloneObject(State);
					State.url = State.cleanUrl||State.url;
				}

				// Return
				return State;
			};

			/**
			 * History.getIdByState(State)
			 * Gets a ID for a State
			 * @param {State} newState
			 * @return {String} id
			 */
			History.getIdByState = function(newState){

				// Fetch ID
				var id = History.extractId(newState.url),
					str;

				if ( !id ) {
					// Find ID via State String
					str = History.getStateString(newState);
					if ( typeof History.stateToId[str] !== 'undefined' ) {
						id = History.stateToId[str];
					}
					else if ( typeof History.store.stateToId[str] !== 'undefined' ) {
						id = History.store.stateToId[str];
					}
					else {
						// Generate a new ID
						while ( true ) {
							id = (new Date()).getTime() + String(Math.random()).replace(/\D/g,'');
							if ( typeof History.idToState[id] === 'undefined' && typeof History.store.idToState[id] === 'undefined' ) {
								break;
							}
						}

						// Apply the new State to the ID
						History.stateToId[str] = id;
						History.idToState[id] = newState;
					}
				}

				// Return ID
				return id;
			};

			/**
			 * History.normalizeState(State)
			 * Expands a State Object
			 * @param {object} State
			 * @return {object}
			 */
			History.normalizeState = function(oldState){
				// Variables
				var newState, dataNotEmpty;

				// Prepare
				if ( !oldState || (typeof oldState !== 'object') ) {
					oldState = {};
				}

				// Check
				if ( typeof oldState.normalized !== 'undefined' ) {
					return oldState;
				}

				// Adjust
				if ( !oldState.data || (typeof oldState.data !== 'object') ) {
					oldState.data = {};
				}

				// ----------------------------------------------------------------

				// Create
				newState = {};
				newState.normalized = true;
				newState.title = oldState.title||'';
				newState.url = History.getFullUrl(oldState.url?oldState.url:(History.getLocationHref()));
				newState.hash = History.getShortUrl(newState.url);
				newState.data = History.cloneObject(oldState.data);

				// Fetch ID
				newState.id = History.getIdByState(newState);

				// ----------------------------------------------------------------

				// Clean the URL
				newState.cleanUrl = newState.url.replace(/\??\&_suid.*/,'');
				newState.url = newState.cleanUrl;

				// Check to see if we have more than just a url
				dataNotEmpty = !History.isEmptyObject(newState.data);

				// Apply
				if ( (newState.title || dataNotEmpty) && History.options.disableSuid !== true ) {
					// Add ID to Hash
					newState.hash = History.getShortUrl(newState.url).replace(/\??\&_suid.*/,'');
					if ( !/\?/.test(newState.hash) ) {
						newState.hash += '?';
					}
					newState.hash += '&_suid='+newState.id;
				}

				// Create the Hashed URL
				newState.hashedUrl = History.getFullUrl(newState.hash);

				// ----------------------------------------------------------------

				// Update the URL if we have a duplicate
				if ( (History.emulated.pushState || History.bugs.safariPoll) && History.hasUrlDuplicate(newState) ) {
					newState.url = newState.hashedUrl;
				}

				// ----------------------------------------------------------------

				// Return
				return newState;
			};

			/**
			 * History.createStateObject(data,title,url)
			 * Creates a object based on the data, title and url state params
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {object}
			 */
			History.createStateObject = function(data,title,url){
				// Hashify
				var State = {
					'data': data,
					'title': title,
					'url': url
				};

				// Expand the State
				State = History.normalizeState(State);

				// Return object
				return State;
			};

			/**
			 * History.getStateById(id)
			 * Get a state by it's UID
			 * @param {String} id
			 */
			History.getStateById = function(id){
				// Prepare
				id = String(id);

				// Retrieve
				var State = History.idToState[id] || History.store.idToState[id] || undefined;

				// Return State
				return State;
			};

			/**
			 * Get a State's String
			 * @param {State} passedState
			 */
			History.getStateString = function(passedState){
				// Prepare
				var State, cleanedState, str;

				// Fetch
				State = History.normalizeState(passedState);

				// Clean
				cleanedState = {
					data: State.data,
					title: passedState.title,
					url: passedState.url
				};

				// Fetch
				str = JSON.stringify(cleanedState);

				// Return
				return str;
			};

			/**
			 * Get a State's ID
			 * @param {State} passedState
			 * @return {String} id
			 */
			History.getStateId = function(passedState){
				// Prepare
				var State, id;

				// Fetch
				State = History.normalizeState(passedState);

				// Fetch
				id = State.id;

				// Return
				return id;
			};

			/**
			 * History.getHashByState(State)
			 * Creates a Hash for the State Object
			 * @param {State} passedState
			 * @return {String} hash
			 */
			History.getHashByState = function(passedState){
				// Prepare
				var State, hash;

				// Fetch
				State = History.normalizeState(passedState);

				// Hash
				hash = State.hash;

				// Return
				return hash;
			};

			/**
			 * History.extractId(url_or_hash)
			 * Get a State ID by it's URL or Hash
			 * @param {string} url_or_hash
			 * @return {string} id
			 */
			History.extractId = function ( url_or_hash ) {
				// Prepare
				var id,parts,url, tmp;

				// Extract
				
				// If the URL has a #, use the id from before the #
				if (url_or_hash.indexOf('#') != -1)
				{
					tmp = url_or_hash.split("#")[0];
				}
				else
				{
					tmp = url_or_hash;
				}
				
				parts = /(.*)\&_suid=([0-9]+)$/.exec(tmp);
				url = parts ? (parts[1]||url_or_hash) : url_or_hash;
				id = parts ? String(parts[2]||'') : '';

				// Return
				return id||false;
			};

			/**
			 * History.isTraditionalAnchor
			 * Checks to see if the url is a traditional anchor or not
			 * @param {String} url_or_hash
			 * @return {Boolean}
			 */
			History.isTraditionalAnchor = function(url_or_hash){
				// Check
				var isTraditional = !(/[\/\?\.]/.test(url_or_hash));

				// Return
				return isTraditional;
			};

			/**
			 * History.extractState
			 * Get a State by it's URL or Hash
			 * @param {String} url_or_hash
			 * @return {State|null}
			 */
			History.extractState = function(url_or_hash,create){
				// Prepare
				var State = null, id, url;
				create = create||false;

				// Fetch SUID
				id = History.extractId(url_or_hash);
				if ( id ) {
					State = History.getStateById(id);
				}

				// Fetch SUID returned no State
				if ( !State ) {
					// Fetch URL
					url = History.getFullUrl(url_or_hash);

					// Check URL
					id = History.getIdByUrl(url)||false;
					if ( id ) {
						State = History.getStateById(id);
					}

					// Create State
					if ( !State && create && !History.isTraditionalAnchor(url_or_hash) ) {
						State = History.createStateObject(null,null,url);
					}
				}

				// Return
				return State;
			};

			/**
			 * History.getIdByUrl()
			 * Get a State ID by a State URL
			 */
			History.getIdByUrl = function(url){
				// Fetch
				var id = History.urlToId[url] || History.store.urlToId[url] || undefined;

				// Return
				return id;
			};

			/**
			 * History.getLastSavedState()
			 * Get an object containing the data, title and url of the current state
			 * @return {Object} State
			 */
			History.getLastSavedState = function(){
				return History.savedStates[History.savedStates.length-1]||undefined;
			};

			/**
			 * History.getLastStoredState()
			 * Get an object containing the data, title and url of the current state
			 * @return {Object} State
			 */
			History.getLastStoredState = function(){
				return History.storedStates[History.storedStates.length-1]||undefined;
			};

			/**
			 * History.hasUrlDuplicate
			 * Checks if a Url will have a url conflict
			 * @param {Object} newState
			 * @return {Boolean} hasDuplicate
			 */
			History.hasUrlDuplicate = function(newState) {
				// Prepare
				var hasDuplicate = false,
					oldState;

				// Fetch
				oldState = History.extractState(newState.url);

				// Check
				hasDuplicate = oldState && oldState.id !== newState.id;

				// Return
				return hasDuplicate;
			};

			/**
			 * History.storeState
			 * Store a State
			 * @param {Object} newState
			 * @return {Object} newState
			 */
			History.storeState = function(newState){
				// Store the State
				History.urlToId[newState.url] = newState.id;

				// Push the State
				History.storedStates.push(History.cloneObject(newState));

				// Return newState
				return newState;
			};

			/**
			 * History.isLastSavedState(newState)
			 * Tests to see if the state is the last state
			 * @param {Object} newState
			 * @return {boolean} isLast
			 */
			History.isLastSavedState = function(newState){
				// Prepare
				var isLast = false,
					newId, oldState, oldId;

				// Check
				if ( History.savedStates.length ) {
					newId = newState.id;
					oldState = History.getLastSavedState();
					oldId = oldState.id;

					// Check
					isLast = (newId === oldId);
				}

				// Return
				return isLast;
			};

			/**
			 * History.saveState
			 * Push a State
			 * @param {Object} newState
			 * @return {boolean} changed
			 */
			History.saveState = function(newState){
				// Check Hash
				if ( History.isLastSavedState(newState) ) {
					return false;
				}

				// Push the State
				History.savedStates.push(History.cloneObject(newState));

				// Return true
				return true;
			};

			/**
			 * History.getStateByIndex()
			 * Gets a state by the index
			 * @param {integer} index
			 * @return {Object}
			 */
			History.getStateByIndex = function(index){
				// Prepare
				var State = null;

				// Handle
				if ( typeof index === 'undefined' ) {
					// Get the last inserted
					State = History.savedStates[History.savedStates.length-1];
				}
				else if ( index < 0 ) {
					// Get from the end
					State = History.savedStates[History.savedStates.length+index];
				}
				else {
					// Get from the beginning
					State = History.savedStates[index];
				}

				// Return State
				return State;
			};
			
			/**
			 * History.getCurrentIndex()
			 * Gets the current index
			 * @return (integer)
			*/
			History.getCurrentIndex = function(){
				// Prepare
				var index = null;
				
				// No states saved
				if(History.savedStates.length < 1) {
					index = 0;
				}
				else {
					index = History.savedStates.length-1;
				}
				return index;
			};

			// ====================================================================
			// Hash Helpers

			/**
			 * History.getHash()
			 * @param {Location=} location
			 * Gets the current document hash
			 * Note: unlike location.hash, this is guaranteed to return the escaped hash in all browsers
			 * @return {string}
			 */
			History.getHash = function(doc){
				var url = History.getLocationHref(doc),
					hash;
				hash = History.getHashByUrl(url);
				return hash;
			};

			/**
			 * History.unescapeHash()
			 * normalize and Unescape a Hash
			 * @param {String} hash
			 * @return {string}
			 */
			History.unescapeHash = function(hash){
				// Prepare
				var result = History.normalizeHash(hash);

				// Unescape hash
				result = decodeURIComponent(result);

				// Return result
				return result;
			};

			/**
			 * History.normalizeHash()
			 * normalize a hash across browsers
			 * @return {string}
			 */
			History.normalizeHash = function(hash){
				// Prepare
				var result = hash.replace(/[^#]*#/,'').replace(/#.*/, '');

				// Return result
				return result;
			};

			/**
			 * History.setHash(hash)
			 * Sets the document hash
			 * @param {string} hash
			 * @return {History}
			 */
			History.setHash = function(hash,queue){
				// Prepare
				var State, pageUrl;

				// Handle Queueing
				if ( queue !== false && History.busy() ) {
					// Wait + Push to Queue
					//History.debug('History.setHash: we must wait', arguments);
					History.pushQueue({
						scope: History,
						callback: History.setHash,
						args: arguments,
						queue: queue
					});
					return false;
				}

				// Log
				//History.debug('History.setHash: called',hash);

				// Make Busy + Continue
				History.busy(true);

				// Check if hash is a state
				State = History.extractState(hash,true);
				if ( State && !History.emulated.pushState ) {
					// Hash is a state so skip the setHash
					//History.debug('History.setHash: Hash is a state so skipping the hash set with a direct pushState call',arguments);

					// PushState
					History.pushState(State.data,State.title,State.url,false);
				}
				else if ( History.getHash() !== hash ) {
					// Hash is a proper hash, so apply it

					// Handle browser bugs
					if ( History.bugs.setHash ) {
						// Fix Safari Bug https://bugs.webkit.org/show_bug.cgi?id=56249

						// Fetch the base page
						pageUrl = History.getPageUrl();

						// Safari hash apply
						History.pushState(null,null,pageUrl+'#'+hash,false);
					}
					else {
						// Normal hash apply
						document.location.hash = hash;
					}
				}

				// Chain
				return History;
			};

			/**
			 * History.escape()
			 * normalize and Escape a Hash
			 * @return {string}
			 */
			History.escapeHash = function(hash){
				// Prepare
				var result = History.normalizeHash(hash);

				// Escape hash
				result = window.encodeURIComponent(result);

				// IE6 Escape Bug
				if ( !History.bugs.hashEscape ) {
					// Restore common parts
					result = result
						.replace(/\%21/g,'!')
						.replace(/\%26/g,'&')
						.replace(/\%3D/g,'=')
						.replace(/\%3F/g,'?');
				}

				// Return result
				return result;
			};

			/**
			 * History.getHashByUrl(url)
			 * Extracts the Hash from a URL
			 * @param {string} url
			 * @return {string} url
			 */
			History.getHashByUrl = function(url){
				// Extract the hash
				var hash = String(url)
					.replace(/([^#]*)#?([^#]*)#?(.*)/, '$2')
					;

				// Unescape hash
				hash = History.unescapeHash(hash);

				// Return hash
				return hash;
			};

			/**
			 * History.setTitle(title)
			 * Applies the title to the document
			 * @param {State} newState
			 * @return {Boolean}
			 */
			History.setTitle = function(newState){
				// Prepare
				var title = newState.title,
					firstState;

				// Initial
				if ( !title ) {
					firstState = History.getStateByIndex(0);
					if ( firstState && firstState.url === newState.url ) {
						title = firstState.title||History.options.initialTitle;
					}
				}

				// Apply
				try {
					document.getElementsByTagName('title')[0].innerHTML = title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
				}
				catch ( Exception ) { }
				document.title = title;

				// Chain
				return History;
			};


			// ====================================================================
			// Queueing

			/**
			 * History.queues
			 * The list of queues to use
			 * First In, First Out
			 */
			History.queues = [];

			/**
			 * History.busy(value)
			 * @param {boolean} value [optional]
			 * @return {boolean} busy
			 */
			History.busy = function(value){
				// Apply
				if ( typeof value !== 'undefined' ) {
					//History.debug('History.busy: changing ['+(History.busy.flag||false)+'] to ['+(value||false)+']', History.queues.length);
					History.busy.flag = value;
				}
				// Default
				else if ( typeof History.busy.flag === 'undefined' ) {
					History.busy.flag = false;
				}

				// Queue
				if ( !History.busy.flag ) {
					// Execute the next item in the queue
					clearTimeout(History.busy.timeout);
					var fireNext = function(){
						var i, queue, item;
						if ( History.busy.flag ) return;
						for ( i=History.queues.length-1; i >= 0; --i ) {
							queue = History.queues[i];
							if ( queue.length === 0 ) continue;
							item = queue.shift();
							History.fireQueueItem(item);
							History.busy.timeout = setTimeout(fireNext,History.options.busyDelay);
						}
					};
					History.busy.timeout = setTimeout(fireNext,History.options.busyDelay);
				}

				// Return
				return History.busy.flag;
			};

			/**
			 * History.busy.flag
			 */
			History.busy.flag = false;

			/**
			 * History.fireQueueItem(item)
			 * Fire a Queue Item
			 * @param {Object} item
			 * @return {Mixed} result
			 */
			History.fireQueueItem = function(item){
				return item.callback.apply(item.scope||History,item.args||[]);
			};

			/**
			 * History.pushQueue(callback,args)
			 * Add an item to the queue
			 * @param {Object} item [scope,callback,args,queue]
			 */
			History.pushQueue = function(item){
				// Prepare the queue
				History.queues[item.queue||0] = History.queues[item.queue||0]||[];

				// Add to the queue
				History.queues[item.queue||0].push(item);

				// Chain
				return History;
			};

			/**
			 * History.queue (item,queue), (func,queue), (func), (item)
			 * Either firs the item now if not busy, or adds it to the queue
			 */
			History.queue = function(item,queue){
				// Prepare
				if ( typeof item === 'function' ) {
					item = {
						callback: item
					};
				}
				if ( typeof queue !== 'undefined' ) {
					item.queue = queue;
				}

				// Handle
				if ( History.busy() ) {
					History.pushQueue(item);
				} else {
					History.fireQueueItem(item);
				}

				// Chain
				return History;
			};

			/**
			 * History.clearQueue()
			 * Clears the Queue
			 */
			History.clearQueue = function(){
				History.busy.flag = false;
				History.queues = [];
				return History;
			};


			// ====================================================================
			// IE Bug Fix

			/**
			 * History.stateChanged
			 * States whether or not the state has changed since the last double check was initialised
			 */
			History.stateChanged = false;

			/**
			 * History.doubleChecker
			 * Contains the timeout used for the double checks
			 */
			History.doubleChecker = false;

			/**
			 * History.doubleCheckComplete()
			 * Complete a double check
			 * @return {History}
			 */
			History.doubleCheckComplete = function(){
				// Update
				History.stateChanged = true;

				// Clear
				History.doubleCheckClear();

				// Chain
				return History;
			};

			/**
			 * History.doubleCheckClear()
			 * Clear a double check
			 * @return {History}
			 */
			History.doubleCheckClear = function(){
				// Clear
				if ( History.doubleChecker ) {
					clearTimeout(History.doubleChecker);
					History.doubleChecker = false;
				}

				// Chain
				return History;
			};

			/**
			 * History.doubleCheck()
			 * Create a double check
			 * @return {History}
			 */
			History.doubleCheck = function(tryAgain){
				// Reset
				History.stateChanged = false;
				History.doubleCheckClear();

				// Fix IE6,IE7 bug where calling history.back or history.forward does not actually change the hash (whereas doing it manually does)
				// Fix Safari 5 bug where sometimes the state does not change: https://bugs.webkit.org/show_bug.cgi?id=42940
				if ( History.bugs.ieDoubleCheck ) {
					// Apply Check
					History.doubleChecker = setTimeout(
						function(){
							History.doubleCheckClear();
							if ( !History.stateChanged ) {
								//History.debug('History.doubleCheck: State has not yet changed, trying again', arguments);
								// Re-Attempt
								tryAgain();
							}
							return true;
						},
						History.options.doubleCheckInterval
					);
				}

				// Chain
				return History;
			};


			// ====================================================================
			// Safari Bug Fix

			/**
			 * History.safariStatePoll()
			 * Poll the current state
			 * @return {History}
			 */
			History.safariStatePoll = function(){
				// Poll the URL

				// Get the Last State which has the new URL
				var
					urlState = History.extractState(History.getLocationHref()),
					newState;

				// Check for a difference
				if ( !History.isLastSavedState(urlState) ) {
					newState = urlState;
				}
				else {
					return;
				}

				// Check if we have a state with that url
				// If not create it
				if ( !newState ) {
					//History.debug('History.safariStatePoll: new');
					newState = History.createStateObject();
				}

				// Apply the New State
				//History.debug('History.safariStatePoll: trigger');
				History.Adapter.trigger(window,'popstate');

				// Chain
				return History;
			};


			// ====================================================================
			// State Aliases

			/**
			 * History.back(queue)
			 * Send the browser history back one item
			 * @param {Integer} queue [optional]
			 */
			History.back = function(queue){
				//History.debug('History.back: called', arguments);

				// Handle Queueing
				if ( queue !== false && History.busy() ) {
					// Wait + Push to Queue
					//History.debug('History.back: we must wait', arguments);
					History.pushQueue({
						scope: History,
						callback: History.back,
						args: arguments,
						queue: queue
					});
					return false;
				}

				// Make Busy + Continue
				History.busy(true);

				// Fix certain browser bugs that prevent the state from changing
				History.doubleCheck(function(){
					History.back(false);
				});

				// Go back
				history.go(-1);

				// End back closure
				return true;
			};

			/**
			 * History.forward(queue)
			 * Send the browser history forward one item
			 * @param {Integer} queue [optional]
			 */
			History.forward = function(queue){
				//History.debug('History.forward: called', arguments);

				// Handle Queueing
				if ( queue !== false && History.busy() ) {
					// Wait + Push to Queue
					//History.debug('History.forward: we must wait', arguments);
					History.pushQueue({
						scope: History,
						callback: History.forward,
						args: arguments,
						queue: queue
					});
					return false;
				}

				// Make Busy + Continue
				History.busy(true);

				// Fix certain browser bugs that prevent the state from changing
				History.doubleCheck(function(){
					History.forward(false);
				});

				// Go forward
				history.go(1);

				// End forward closure
				return true;
			};

			/**
			 * History.go(index,queue)
			 * Send the browser history back or forward index times
			 * @param {Integer} queue [optional]
			 */
			History.go = function(index,queue){
				//History.debug('History.go: called', arguments);

				// Prepare
				var i;

				// Handle
				if ( index > 0 ) {
					// Forward
					for ( i=1; i<=index; ++i ) {
						History.forward(queue);
					}
				}
				else if ( index < 0 ) {
					// Backward
					for ( i=-1; i>=index; --i ) {
						History.back(queue);
					}
				}
				else {
					throw new Error('History.go: History.go requires a positive or negative integer passed.');
				}

				// Chain
				return History;
			};


			// ====================================================================
			// HTML5 State Support

			// Non-Native pushState Implementation
			if ( History.emulated.pushState ) {
				/*
				 * Provide Skeleton for HTML4 Browsers
				 */

				// Prepare
				var emptyFunction = function(){};
				History.pushState = History.pushState||emptyFunction;
				History.replaceState = History.replaceState||emptyFunction;
			} // History.emulated.pushState

			// Native pushState Implementation
			else {
				/*
				 * Use native HTML5 History API Implementation
				 */

				/**
				 * History.onPopState(event,extra)
				 * Refresh the Current State
				 */
				History.onPopState = function(event,extra){
					// Prepare
					var stateId = false, newState = false, currentHash, currentState;

					// Reset the double check
					History.doubleCheckComplete();

					// Check for a Hash, and handle apporiatly
					currentHash = History.getHash();
					if ( currentHash ) {
						// Expand Hash
						currentState = History.extractState(currentHash||History.getLocationHref(),true);
						if ( currentState ) {
							// We were able to parse it, it must be a State!
							// Let's forward to replaceState
							//History.debug('History.onPopState: state anchor', currentHash, currentState);
							History.replaceState(currentState.data, currentState.title, currentState.url, false);
						}
						else {
							// Traditional Anchor
							//History.debug('History.onPopState: traditional anchor', currentHash);
							History.Adapter.trigger(window,'anchorchange');
							History.busy(false);
						}

						// We don't care for hashes
						History.expectedStateId = false;
						return false;
					}

					// Ensure
					stateId = History.Adapter.extractEventData('state',event,extra) || false;

					// Fetch State
					if ( stateId ) {
						// Vanilla: Back/forward button was used
						newState = History.getStateById(stateId);
					}
					else if ( History.expectedStateId ) {
						// Vanilla: A new state was pushed, and popstate was called manually
						newState = History.getStateById(History.expectedStateId);
					}
					else {
						// Initial State
						newState = History.extractState(History.getLocationHref());
					}

					// The State did not exist in our store
					if ( !newState ) {
						// Regenerate the State
						newState = History.createStateObject(null,null,History.getLocationHref());
					}

					// Clean
					History.expectedStateId = false;

					// Check if we are the same state
					if ( History.isLastSavedState(newState) ) {
						// There has been no change (just the page's hash has finally propagated)
						//History.debug('History.onPopState: no change', newState, History.savedStates);
						History.busy(false);
						return false;
					}

					// Store the State
					History.storeState(newState);
					History.saveState(newState);

					// Force update of the title
					History.setTitle(newState);

					// Fire Our Event
					History.Adapter.trigger(window,'statechange');
					History.busy(false);

					// Return true
					return true;
				};
				History.Adapter.bind(window,'popstate',History.onPopState);

				/**
				 * History.pushState(data,title,url)
				 * Add a new State to the history object, become it, and trigger onpopstate
				 * We have to trigger for HTML4 compatibility
				 * @param {object} data
				 * @param {string} title
				 * @param {string} url
				 * @return {true}
				 */
				History.pushState = function(data,title,url,queue){
					//History.debug('History.pushState: called', arguments);

					// Check the State
					if ( History.getHashByUrl(url) && History.emulated.pushState ) {
						throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
					}

					// Handle Queueing
					if ( queue !== false && History.busy() ) {
						// Wait + Push to Queue
						//History.debug('History.pushState: we must wait', arguments);
						History.pushQueue({
							scope: History,
							callback: History.pushState,
							args: arguments,
							queue: queue
						});
						return false;
					}

					// Make Busy + Continue
					History.busy(true);

					// Create the newState
					var newState = History.createStateObject(data,title,url);

					// Check it
					if ( History.isLastSavedState(newState) ) {
						// Won't be a change
						History.busy(false);
					}
					else {
						// Store the newState
						History.storeState(newState);
						History.expectedStateId = newState.id;

						// Push the newState
						history.pushState(newState.id,newState.title,newState.url);

						// Fire HTML5 Event
						History.Adapter.trigger(window,'popstate');
					}

					// End pushState closure
					return true;
				};

				/**
				 * History.replaceState(data,title,url)
				 * Replace the State and trigger onpopstate
				 * We have to trigger for HTML4 compatibility
				 * @param {object} data
				 * @param {string} title
				 * @param {string} url
				 * @return {true}
				 */
				History.replaceState = function(data,title,url,queue){
					//History.debug('History.replaceState: called', arguments);

					// Check the State
					if ( History.getHashByUrl(url) && History.emulated.pushState ) {
						throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
					}

					// Handle Queueing
					if ( queue !== false && History.busy() ) {
						// Wait + Push to Queue
						//History.debug('History.replaceState: we must wait', arguments);
						History.pushQueue({
							scope: History,
							callback: History.replaceState,
							args: arguments,
							queue: queue
						});
						return false;
					}

					// Make Busy + Continue
					History.busy(true);

					// Create the newState
					var newState = History.createStateObject(data,title,url);

					// Check it
					if ( History.isLastSavedState(newState) ) {
						// Won't be a change
						History.busy(false);
					}
					else {
						// Store the newState
						History.storeState(newState);
						History.expectedStateId = newState.id;

						// Push the newState
						history.replaceState(newState.id,newState.title,newState.url);

						// Fire HTML5 Event
						History.Adapter.trigger(window,'popstate');
					}

					// End replaceState closure
					return true;
				};

			} // !History.emulated.pushState


			// ====================================================================
			// Initialise

			/**
			 * Load the Store
			 */
			if ( sessionStorage ) {
				// Fetch
				try {
					History.store = JSON.parse(sessionStorage.getItem('History.store'))||{};
				}
				catch ( err ) {
					History.store = {};
				}

				// Normalize
				History.normalizeStore();
			}
			else {
				// Default Load
				History.store = {};
				History.normalizeStore();
			}

			/**
			 * Clear Intervals on exit to prevent memory leaks
			 */
			History.Adapter.bind(window,"unload",History.clearAllIntervals);

			/**
			 * Create the initial State
			 */
			History.saveState(History.storeState(History.extractState(History.getLocationHref(),true)));

			/**
			 * Bind for Saving Store
			 */
			if ( sessionStorage ) {
				// When the page is closed
				History.onUnload = function(){
					// Prepare
					var	currentStore, item, currentStoreString;

					// Fetch
					try {
						currentStore = JSON.parse(sessionStorage.getItem('History.store'))||{};
					}
					catch ( err ) {
						currentStore = {};
					}

					// Ensure
					currentStore.idToState = currentStore.idToState || {};
					currentStore.urlToId = currentStore.urlToId || {};
					currentStore.stateToId = currentStore.stateToId || {};

					// Sync
					for ( item in History.idToState ) {
						if ( !History.idToState.hasOwnProperty(item) ) {
							continue;
						}
						currentStore.idToState[item] = History.idToState[item];
					}
					for ( item in History.urlToId ) {
						if ( !History.urlToId.hasOwnProperty(item) ) {
							continue;
						}
						currentStore.urlToId[item] = History.urlToId[item];
					}
					for ( item in History.stateToId ) {
						if ( !History.stateToId.hasOwnProperty(item) ) {
							continue;
						}
						currentStore.stateToId[item] = History.stateToId[item];
					}

					// Update
					History.store = currentStore;
					History.normalizeStore();

					// In Safari, going into Private Browsing mode causes the
					// Session Storage object to still exist but if you try and use
					// or set any property/function of it it throws the exception
					// "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made to
					// add something to storage that exceeded the quota." infinitely
					// every second.
					currentStoreString = JSON.stringify(currentStore);
					try {
						// Store
						sessionStorage.setItem('History.store', currentStoreString);
					}
					catch (e) {
						if (e.code === DOMException.QUOTA_EXCEEDED_ERR) {
							if (sessionStorage.length) {
								// Workaround for a bug seen on iPads. Sometimes the quota exceeded error comes up and simply
								// removing/resetting the storage can work.
								sessionStorage.removeItem('History.store');
								sessionStorage.setItem('History.store', currentStoreString);
							} else {
								// Otherwise, we're probably private browsing in Safari, so we'll ignore the exception.
							}
						} else {
							throw e;
						}
					}
				};

				// For Internet Explorer
				History.intervalList.push(setInterval(History.onUnload,History.options.storeInterval));

				// For Other Browsers
				History.Adapter.bind(window,'beforeunload',History.onUnload);
				History.Adapter.bind(window,'unload',History.onUnload);

				// Both are enabled for consistency
			}

			// Non-Native pushState Implementation
			if ( !History.emulated.pushState ) {
				// Be aware, the following is only for native pushState implementations
				// If you are wanting to include something for all browsers
				// Then include it above this if block

				/**
				 * Setup Safari Fix
				 */
				if ( History.bugs.safariPoll ) {
					History.intervalList.push(setInterval(History.safariStatePoll, History.options.safariPollInterval));
				}

				/**
				 * Ensure Cross Browser Compatibility
				 */
				if ( navigator.vendor === 'Apple Computer, Inc.' || (navigator.appCodeName||'') === 'Mozilla' ) {
					/**
					 * Fix Safari HashChange Issue
					 */

					// Setup Alias
					History.Adapter.bind(window,'hashchange',function(){
						History.Adapter.trigger(window,'popstate');
					});

					// Initialise Alias
					if ( History.getHash() ) {
						History.Adapter.onDomLoad(function(){
							History.Adapter.trigger(window,'hashchange');
						});
					}
				}

			} // !History.emulated.pushState


		}; // History.initCore

		// Try to Initialise History
		if (!History.options || !History.options.delayInit) {
			History.init();
		}

	})(window);


	/*** EXPORTS FROM exports-loader ***/
	module.exports = History;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__(13),
	    $ = __webpack_require__(1),

	    Module = __webpack_require__(14);

	console.log("require('content-service')");
	function ConfigLoader() {
	    Module.apply(this, arguments);
	    this._state = {
	        hasLoaded: false
	    };

	    this._defaults = utils.defaults({}, this.getDefaults());

	    // use defaults for now
	    this._data = this._defaults;

	    this.configURL = utils.getRootUrl() + '?wp_spa_config';
	    this.fetchConfig();
	}

	ConfigLoader.prototype = {

	    getMainSelector: function () {
	        return '.spa-content__page';
	    },

	    getDefaults: function () {
	        return {
	            animationInName: 'fadeIn',
	            animationOutName: 'fadeOut',
	            animationInDuration: 400,
	            animationOutDuration: 400,
	            useCache: 1,
	            reusePages: 0,
	            asyncAnimation: 1,
	            captureAll: false
	        };
	    },

	    /**
	     *
	     * @param {Function} [callback]
	     * @param {Object} [options]
	     * @param {Boolean} [options.forceUpdate]
	     */
	    fetchConfig: function (callback, options) {
	        var self = this,
	            opts = utils.defaults(options, {});
	        if (self._state.hasLoaded && !opts.forceUpdate) {
	            if (callback) callback(null, this._data);
	        } else {
	            $.ajax({
	                url: this.configURL,
	                dataType: 'json',
	                json: true,
	                success: function success(response) {
	                    self._data = JSON.parse(response);
	                    console.log('config response: %o', arguments);
	                    self._state.hasLoaded = true;
	                    // hotfix to check for valid config
	                    if (self._data.animationInName) {
	                        if (callback) callback(null, self._data);
	                    } else {
	                        if (callback) callback(null, self._defaults);
	                    }
	                },
	                error: function failure(response) {
	                    console.error('response: %o', response);
	                    if (callback) callback(new Error("Could not fetch config"), response);
	                }
	            });
	        }
	    }
	};

	utils.defaults(ConfigLoader.prototype, Module.prototype);

	module.exports = ConfigLoader;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var url = __webpack_require__(4),

	    $ = __webpack_require__(1),

	    DOMParser = DOMParser || function () {
	            return {
	                parseFromString: function (DOMString) {
	                    return $(DOMString);
	                }
	            }
	        },
	    siteURL = $('head base').attr('href'),
	    siteURLMeta = url.parse(siteURL),
	    domParser = new DOMParser();

	var utils = {
	    createCookie: function (name, value, days) {
	        if (days) {
	            var date = new Date();
	            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	            var expires = "; expires=" + date.toGMTString();
	        }
	        else var expires = "";
	        document.cookie = name + "=" + value + expires + "; path=/";
	    },
	    readCookie: function (name) {
	        var nameEQ = name + "=";
	        var ca = document.cookie.split(';');
	        for (var i = 0; i < ca.length; i++) {
	            var c = ca[i];
	            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
	            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	        }
	        return null;
	    },
	    eraseCookie: function (name) {
	        var value = '',
	            days = -1;
	        if (days) {
	            var date = new Date();
	            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	            var expires = "; expires=" + date.toGMTString();
	        }
	        else var expires = "";
	        document.cookie = name + "=" + value + expires + "; path=/";
	    },
	    /**
	     *
	     * @param $target {jQuery|Number}
	     * @param options {object} - {duration, callback, context}
	     */
	    scrollTo: function ($target, options) {
	        var animateOptions = {
	                duration: (options) ? ((options.duration) ? options.duration : options) : 600
	            }, callbackCount = 1,
	            scrollTop = $target.offset ? ($target.offset().top - $('header').height() + 2) : $target;
	        if (options && options.callback) {
	            animateOptions['complete'] = function () {
	                if (callbackCount--) options.callback.apply(options.context, options.arguments);
	            }
	        }
	        $('html, body').animate({
	            scrollTop: scrollTop// +2 for good measure
	        }, animateOptions);
	    },
	    /**
	     *
	     * @param $target
	     */
	    jumpTo: function ($target) {
	        var scrollTop = $target.offset ? ($target.offset().top - $('header').height() + 2) : $target;
	        $('html, body').scrollTop((scrollTop < 0) ? 0 : scrollTop); // +2 for good measure
	    },
	    /**
	     *
	     * @param html
	     * @param options
	     * @returns {*|jQuery|HTMLElement}
	     */
	    parseDOMString: function (html, options) {
	        var opts = utils.defaults({
	            safemode: true
	        }, options);
	        if (opts.safemode) {
	            try {
	                var DOM = domParser.parseFromString(html, 'text/html');
	                return $(DOM);
	            } catch (e) {
	                console.error(e);
	                return $(html);
	            }
	        } else {
	            return $(domParser.parseFromString(html, 'text/html'));
	        }
	    },
	    getCurrentPath: function () {
	        return location.pathname.substr(utils.getRootPath({trailingSlash: false}).length);
	    },
	    /**
	     * Returns the root path
	     * @param {Object} [options]
	     * @param {Boolean} [options.trailingSlash = true]
	     * @returns {String}
	     */
	    getRootPath: function (options) {
	        return siteURLMeta.pathname + ((options && options.trailingSlash === false) ? '' : '/');
	    },

	    getRootUrl: function () {
	        return siteURL;
	    },
	    /**
	     *
	     * @param {String} requestURL
	     * @returns {string}
	     */
	    getPathFromUrl: function (requestURL) {
	        var domainUrl = utils.getRootUrl({trailingSlash: false}),
	            pathStartIndex = requestURL.indexOf(domainUrl) + domainUrl.length;
	        return requestURL.substr(pathStartIndex);
	    },
	    /**
	     * Sanitizes a path/url aka adds trailing slash if need be to any path
	     * @param {string} requestURL
	     * @returns {string}
	     */
	    sanitizeUrl: function (requestURL) {
	        return (requestURL.match('/\/$/')) ? requestURL : requestURL + '/';
	    },
	    /**
	     *
	     * @param {string} requestURL
	     * @returns {*|jQuery|HTMLElement}
	     */
	    loadCss: function (requestURL) {
	        var $link = $(document.createElement('link'));
	        $link.attr({
	            rel: 'stylesheet',
	            type: 'text/css',
	            href: requestURL
	        });
	        $link.appendTo('head');
	        return $link;
	    },
	    /**
	     *
	     * @param {Number} min
	     * @param {Number} max
	     * @returns {Number}
	     */
	    getRand: function (min, max) {
	        return Math.floor(Math.random() * (max - min + 1)) + min;
	    },
	    clearConsole: function () {
	        if (typeof console._commandLineAPI !== 'undefined') {
	            console.API = console._commandLineAPI; //chrome
	        } else if (typeof console._inspectorCommandLineAPI !== 'undefined') {
	            console.API = console._inspectorCommandLineAPI; //Safari
	        } else if (typeof console.clear !== 'undefined') {
	            console.API = console;
	        }

	        // console.API.clear();
	    },
	    defaults: function(){
	        var idx = 0,
	            base = arguments[idx++] || {},
	            next,
	            key;
	        while (next = arguments[idx++]){
	            for (key in next){
	                if(next.hasOwnProperty(key) && !base[key]){
	                    base[key] = next[key]
	                }
	            }
	        }
	        return base;
	    }
	};

	module.exports = utils;

/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * @param {WPSPA} app
	 * @class Module
	 * @constructor
	 */
	function Module(app) {
	    this.app = app;
	    this.app.extendModule(this);

	    /**
	     * @var {directer.Router} router
	     * @var {jQuery} $window
	     * @var {Function} $timeout
	     * @var {ConfigLoader} $configLoader
	     * @var {ContentLoader} $contentLoader
	     */
	}

	Module.prototype = {
	    $on: function (event, callback) {
	        this.app.on.call(this.app, event, callback)
	    },
	    $broadcast: function () {
	        this.app.emit.apply(this.app, arguments)
	    },
	    $apply: function(callback){
	        this.$timeout(callback)
	    }
	};

	module.exports = Module;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(1),
	    url = __webpack_require__(4),
	    utils = __webpack_require__(13),
	    Module = __webpack_require__(14);

	console.log("require('content-service')");

	function ContentLoader() {
	    Module.apply(this, arguments);
	    this.data = {
	        pages: [],
	        posts: []
	    };
	    this._cache = [];
	    this.downloadSiteMap();
	};

	ContentLoader.prototype = {
	    get: function (path) {
	        return this.data[path];
	    },
	    set: function (path, value) {
	        return this.data[path] = value;
	    },
	    isReady: function () {
	        return this.get('isReady');
	    },

	    /**
	     *
	     * @param route
	     * @param {Object} [options]
	     * @param {Boolean} [options.useCache=false]
	     * @param {Boolean} [options.reusePages=false]
	     * @param {Function} [options.done]
	     */
	    getHTML: function (route, options) {
	        var self = this,
	            opts = utils.defaults(options, {});
	        if (opts.useCache && self._cache[route]) {
	            var $DOM = opts.reusePages ? self._cache[route] : self._cache[route].clone();
	            console.log('spaContent._cache[%s] = (%O)', route, $DOM);
	            opts.done.call(null, null, $DOM);
	        } else {
	            $.ajax({
	                url: /^http/.test(route) ? route : url.resolve(self.meta.baseHREF, route),
	                success: function (response) {
	                    console.log('spaContent.$http.get.success(%O)', response);
	                    var _DOM = document.createElement('html');
	                    _DOM.innerHTML = response;
	                    var $DOM = $(_DOM);
	                    if (opts.cache) self._cache[route] = $DOM;
	                    opts.done.call(null, null, opts.reusePages ? $DOM : $DOM.clone());
	                },
	                failure: function (response) {
	                    var err = new Error('spaContent.http.get("' + route + '") - Failed:' + response);
	                    opts.done.call(null, err);
	                }
	            });
	        }
	    },
	    /**
	     *
	     * @param {Object} [options]
	     * @param {Function} [options.done]
	     */
	    downloadSiteMap: function (options) {
	        var self = this,
	            _options = utils.defaults(options, {
	                context: self
	            }),
	            siteMapURL = utils.getRootUrl() + '?wp_spa_sitemap';

	        $.ajax({
	            url: siteMapURL,
	            dataType: 'json',
	            json: true,
	            success: function (response) {
	                var siteMap = response;
	                console.log('WordPress downloaded sitemap data: ', siteMap);
	                for(var postType in siteMap){
	                    if (siteMap.hasOwnProperty(postType)){
	                        switch (postType) {
	                            case 'page':
	                                self.set('pages', siteMap[postType]);
	                                break;
	                            default:
	                                self.set('posts', siteMap[postType]);
	                        }
	                    }
	                }
	                //console.log('WordPress processed sitemap data: ', self);
	                self.set('isReady', true);
	                self.$broadcast('wordpress:init');
	                if (_options.done) _options.done.call(_options.context);
	            },
	            failure: function (response) {
	                var siteMapFetchError = new Error("Could not fetch sitemap");
	                console.error(siteMapFetchError);
	                if (_options.done) _options.done.call(_options.context, siteMapFetchError, response);
	            }
	        });
	    },

	    /**
	     *
	     * @param {Object} [options]
	     * @param {Object} [options.context]
	     * @param {Function} [options.done]
	     * @returns {[String]}
	     */
	    getPages: function (options) {
	        var _options = utils.defaults(options, {});
	        if (this.isReady()) {
	            _options.done.call(_options.context, this.get('pages'))
	        } else {
	            this.$on('wordpress:init', function () {
	                _options.done.call(_options.context, this.get('pages'))
	            });
	        }
	    },

	    /**
	     *
	     * @param {Object} [options]
	     * @param {Function} [options.done]
	     * @returns {[String]}
	     */
	    getPosts: function (options) {
	        var _options = utils.defaults(options, {});
	        if (this.isReady()) {
	            _options.done.call(_options.context, this.get('pages'))
	        } else {
	            this.$on('wordpress:init', function () {
	                _options.done.call(_options.context, this.get('pages'))
	            });
	        }
	    },

	    /**
	     *
	     * @param url
	     * @param {Object} [options]
	     * @param {Function} [options.done]
	     */
	    hasPage: function (url, options) {
	        this.verify('pages', url, options);
	    },

	    /**
	     *
	     * @param requestedURL
	     * @returns {boolean}
	     */
	    hasPageSync: function (requestedURL) {
	        return this.get('pages').indexOf(requestedURL) >= 0;
	    },

	    /**
	     *
	     * @param url
	     * @param {Object} [options]
	     * @param {Function} [options.done]
	     */
	    hasPost: function (url, options) {
	        this.verify('posts', url, options);
	    },

	    /**
	     *
	     * @param requestedURL
	     * @returns {boolean}
	     */
	    hasPostSync: function (requestedURL) {
	        return this.get('posts').indexOf(requestedURL) >= 0;
	    },

	    verify: function (type, url, options) {
	        var self = this,
	            _options = utils.defaults(options, {}),
	            verificationMethod = this['get' + type[0].toUpperCase() + type.substr(1)];

	        verificationMethod.call(this, {
	            done: function (urls) {
	                var requestedUrl = utils.sanitizeUrl(url);
	                if (_options.done) _options.done.call(_options.context, urls.indexOf(requestedUrl) >= 0);
	            }
	        });
	    }
	};

	utils.defaults(ContentLoader.prototype, Module.prototype);

	module.exports = ContentLoader;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	console.log("require('modules/controllers/index')");

	module.exports = {
	    Main: __webpack_require__(17),
	    Animation: __webpack_require__(19)
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__(13),

	    Module = __webpack_require__(14),
	    ScriptRegister = __webpack_require__(18);

	console.log("require('main-controller')");

	/**
	 * @extends Module
	 * @class MainController
	 * @constructor
	 */
	function MainController() {
	    Module.apply(this, arguments);
	    var $scope = this,
	        self = this;

	    console.log('mainController(%O)', arguments);
	    this.config = this.configLoader.getDefaults();
	    this.scriptRegister = new ScriptRegister();

	    this.configLoader.fetchConfig(function (err, configData) {
	        self.config = configData || self.config;
	    });
	    $scope.$on('$locationChangeSuccess', function (event, to, from) {
	        if (to == from) return;
	        utils.clearConsole();
	        console.log('route: %o', arguments);
	        console.log('mainController.$locationChangeSuccess() - routing to %o', to);
	        $scope.contentLoader.getHTML(to, {
	            useCache: self.config.useCache,
	            reusePages: self.config.reusePages,
	            done: function (err, $DOM) {
	                if (err) {
	                    console.warn(err);
	                } else {
	                    var data = {
	                        $DOM: $DOM
	                    };
	                    console.log('mainController.$locationChangeSuccess() - update');
	                    $scope.$broadcast("view:update", data);
	                    $scope.$window.trigger('view:update', data);
	                }
	            }
	        });
	    });
	}

	MainController.prototype = {};

	utils.defaults(MainController.prototype, Module.prototype);

	module.exports = MainController;


/***/ },
/* 18 */
/***/ function(module, exports) {

	function NodeRegister() {
	    this.registry = [];
	}

	NodeRegister.prototype = {

	    /**
	     *
	     * @param {RegisterEntry} regEntry
	     */
	    contains: function (regEntry) {
	        var result = false,
	            regEntryId = regEntry.getId(),
	            idx = 0;
	        while(this.registry[idx] && !result){
	          if (this.registry[idx].getId() == regEntryId) {
	            result = true;
	          } else {
	            idx++;
	          }
	        }
	        return result;
	    },

	    /**
	     *
	     * @param {RegisterEntry} regEntry
	     */
	    add: function (regEntry) {
	        if (!this.contains(regEntry)) {
	            this.registry.push(regEntry);
	        }
	    }
	};

	module.exports = NodeRegister;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var url = __webpack_require__(4),

	    $ = __webpack_require__(1),

	    // local modules
	    utils = __webpack_require__(13),
	    Module = __webpack_require__(14);

	console.log("require('modules/directives/body')");

	/**
	 * @extends Module
	 * @class AnimationController
	 * @constructor
	 */
	function AnimationController() {
	    Module.apply(this, arguments);

	    var self = this,
	        $scope = this;
	    this.config = this.configLoader.getDefaults();
	    this.$body = $('body');
	    this.baseHrefRegex = new RegExp(url.parse(this.meta.baseHREF));

	    $scope.mainSelector = this.configLoader.getMainSelector();
	    $scope.$loadingView = $(__webpack_require__(20));
	    $scope.loadingClassName = 'wp-spa-loading-view--loading';

	    $scope.flags = {};

	    this.$interceptAction = this.interceptAction.bind(this);

	    this.configLoader.fetchConfig(function (err, configData) {
	        self.config = configData || self.config;

	        $scope.updateFlags();
	        $scope.setupCurrentView();
	        $scope.addLoadingView();

	        $scope.$on('head:update', function (event, data) {
	            $scope.destroyClickOverrides();
	            var $DOM = data.$DOM,
	                $body = $DOM.find('body'),
	                $newContent = $body.find($scope.mainSelector),
	                $activeContent = self.$body.find($scope.mainSelector);

	            console.log('body.view:update - new $spaContent: %o', $newContent);

	            $scope.showLoading();
	            if ($scope.flags.asyncAnimation) {
	                $scope.removePage($activeContent);
	                $scope.addPage($newContent, $body[0].attributes, function () {
	                    $scope.hideLoading();
	                });
	            } else {
	                $scope.removePage($activeContent, function () {
	                    $scope.addPage($newContent, $body[0].attributes, function () {
	                        $scope.hideLoading();
	                    });
	                });

	            }

	        });
	    });
	}

	AnimationController.prototype = {

	    interceptAction: function (evt) {
	        console.log('ngBody.interceptAction()');
	        var self = this,
	            targetHref = evt.currentTarget.href || location.href,
	            route = this.getRouteFromHREF(targetHref);

	        if (route) {
	            console.log('ngBody.interceptAction()  - routing to %s', utils.getPathFromUrl(targetHref));
	            evt.preventDefault();
	            self.router.path(route);
	        } else {
	            console.log('ngBody.interceptAction() - no-op')
	        }
	    },

	    getRouteFromHREF: function (href) {
	        var targetHrefMeta = url.parse(href);
	        if (/\/wp-admin\/?/.test(targetHrefMeta.path)) {
	            return false;
	        } else if (
	            this.config.captureAll

	            // animate for path changes. allow native hash otherwise
	            || targetHrefMeta.hash && url.parse(location.href).pathname != targetHrefMeta.pathname

	            || this.contentLoader.hasPageSync(href)
	            || this.contentLoader.hasPostSync(href)) {
	            return targetHrefMeta.pathname
	        } else {
	            return false
	        }
	    },

	    updateFlags: function () {
	        var $scope = this;
	        $scope.flags.asyncAnimation = parseInt(this.config.asyncAnimation) == 1;
	        $scope.flags.showLoadingScreen = parseInt(this.config.showLoadingScreen) == 1;
	    },

	    destroyClickOverrides: function () {
	        var $scope = this;
	        if ($scope.clickables) $scope.clickables.off('click', null, this.$interceptAction);
	        delete $scope.clickables;
	    },

	    createClickOverrides: function () {
	        var $scope = this;
	        $scope.clickables = this.$body.find('[href]').not('[data-spa-initialized]');
	        $scope.clickables.on('click', this.$interceptAction);
	        $scope.clickables.prop('data-spa-initialized', true);
	    },

	    sanitize: function () {
	        var $scope = this;
	        $scope.createClickOverrides();
	        $scope.clickables.each(function (index, el) {
	            this.setAttribute('ng-href', this.href);
	        });
	    },

	    setupCurrentView: function () {
	        var $scope = this;
	        $scope.sanitize();
	    },

	    showLoading: function () {
	        var $scope = this;
	        if ($scope.flags.showLoadingScreen) {
	            $scope.$loadingView.addClass($scope.loadingClassName);
	        }
	    },

	    hideLoading: function () {
	        var $scope = this;
	        if ($scope.flags.showLoadingScreen) {
	            $scope.$loadingView.removeClass($scope.loadingClassName);
	        }
	    },

	    addPage: function ($page, attrs, callback) {
	        var self = this,
	            $scope = this;

	        $page.one('animationend', function () {
	            self.$timeout(function () {
	                $page.removeClass('animate-page-in');
	                $page.css({
	                    'animation-duration': '',
	                    'animation-name': ''
	                });
	                if (callback) callback();

	                // init some events in case 3rd-party lib uses it for rendering
	                $scope.$window.resize();
	                $scope.$window.scroll();
	                $scope.setupCurrentView();
	            });
	        });

	        utils.jumpTo(0); // jump to top of screen

	        // update DOM.body
	        var attr,
	            attrIdx = 0;
	        while(attr = attrs[attrIdx++]){
	            self.$body.attr(attr.name, attr.value);
	        }
	        this.$timeout(function(){
	            $page.css({
	                'animation-name': self.config.animationInName,
	                'animation-duration': self.config.animationInDuration + 'ms'
	            });
	            self.$root.prepend($page);
	            $page.addClass('animate-page-in');
	        });
	    },

	    removePage: function ($page, callback) {
	        var self = this,
	            $view = $page.find('.spa-content__view');

	        // adjust for clipped view
	        $view.css({
	            'margin-top': this.$window.scrollTop() * -1
	        });

	        $page.css({
	            'min-height': '100vh',
	            'overflow': 'hidden',
	            'animation-duration': this.config.animationOutDuration + 'ms'
	        });

	        $page.one('animationend', function () {
	            self.$timeout(function () {
	                $page.remove();
	                if (callback) callback();
	            })
	        });

	        // allow overflow rendering first
	        this.$timeout(function () {
	            $page.css({
	                'animation-name': self.config.animationOutName
	            });
	            $page.addClass('animate-page-out');
	        });
	    },

	    addLoadingView: function () {
	        var $scope = this;
	        if ($scope.flags.showLoadingScreen) {
	            $scope.$body.append($scope.$loadingView);
	        }
	    }
	};

	utils.defaults(AnimationController.prototype, Module.prototype);

	module.exports = AnimationController;



/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = "<div class=\"wp-spa-loading-view\"><div class=\"wp-spa-loading-view__icon\"></div></div>"

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	console.log("require('modules/directives/index')");

	module.exports = {
	    Head: __webpack_require__(22),
	    Html: __webpack_require__(23)
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(1),

	    utils = __webpack_require__(13),
	    Module = __webpack_require__(14);

	console.log('head.controller(%O)', arguments);

	/**
	 * @class HeadDirective
	 * @constructor
	 */
	function HeadDirective(){
	    Module.apply(this, arguments);
	    var $scope = this,
	        $element = $('head');

	    this.$element = $element;

	    $scope.$on('html:update', function (event, data) {
	        var $DOM = data.$DOM;
	        console.log("head.link()$scope.$on('view:update')");
	        var $head = $DOM.find('head'),
	            $newStyles = data.new.$styles;

	        // $oldScripts.remove();

	        // add new styles to incoming head
	        $head.append($newStyles);

	        // update meta
	        $element.find('meta').remove();
	        $element.prepend($head.find('meta'));
	        $element.find('title').remove();
	        $element.prepend($head.find('title'));

	        $scope.$broadcast('head:update', data)
	    });
	}

	HeadDirective.prototype = {

	};

	utils.defaults(HeadDirective.prototype, Module.prototype);

	module.exports = HeadDirective;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(1),

	    utils = __webpack_require__(13),
	    Module = __webpack_require__(14),
	    DOMNodeRegister = __webpack_require__(18),
	    ScriptRegisterEntry = __webpack_require__(24),
	    StyleRegisterEntry = __webpack_require__(26);

	/**
	 * @extends Module
	 * @class HTMLDirective
	 * @constructor
	 */
	function HTMLDirective() {
	    Module.apply(this, arguments);
	    var $scope = this,
	        $element = $('html');

	    this.$element = $element;
	    $scope.selectors = {
	        script: 'script',
	        style: "link[rel='stylesheet'], style",
	        spaScript: '[src*="wp-spa-public"]'
	    };

	    $scope.scriptRegister = new DOMNodeRegister();
	    $scope.styleRegister = new DOMNodeRegister();

	    $scope.registerScripts($element.find('script'));
	    $scope.registerStyles($element.find($scope.selectors.style));

	    $scope.formatDOM($element, {ignore: $scope.selectors.spaScript});

	    $scope.$on('view:update', function (event, data) {
	        var $DOM = data.$DOM;

	        $scope.formatDOM($DOM, {remove: $scope.selectors.spaScript});

	        var $styles = $DOM.find($scope.selectors.style),
	            $scripts = $DOM.find($scope.selectors.script);

	        $scripts.each(function (index, el) {
	            var scriptRegEntry = new ScriptRegisterEntry(el);
	            if ($scope.scriptRegister.contains(scriptRegEntry)) {
	                scriptRegEntry.$el.attr('data-spa-loaded', true);
	                console.log('ng.html - excluding %o', el)
	            } else {
	                $scope.scriptRegister.add(scriptRegEntry);
	                console.warn('ng.html - adding %o', el)
	            }
	        });

	        $styles.each(function (index, el) {
	            var styleRegEntry = new StyleRegisterEntry(el);
	            if ($scope.styleRegister.contains(styleRegEntry)) {
	                styleRegEntry.$el.attr('data-spa-loaded', true);
	                console.log('ng.html - excluding %o', el)
	            } else {
	                $scope.styleRegister.add(styleRegEntry);
	                console.warn('ng.html - adding %o', el)
	            }
	        });

	        var eventData = utils.defaults({
	            $scripts: $scripts,
	            $styles: $styles,
	            old: {
	                $scripts: $scripts.not("[data-spa-loaded='true']"),
	                $styles: $styles.not("[data-spa-loaded='true']")
	            },
	            new: {
	                $scripts: $scripts.filter("[data-spa-loaded='true']"),
	                $styles: $styles.filter("[data-spa-loaded='true']")
	            }
	        }, data);
	        $scope.$broadcast('html:update', eventData)
	    });
	}

	HTMLDirective.prototype = {

	    registerScripts: function ($scripts) {
	        var $scope = this;
	        $scripts.each(function (index, el) {
	            $scope.scriptRegister.add(new ScriptRegisterEntry(el));
	            console.warn('ng.html - adding %o', el)
	        })
	    },

	    registerStyles: function ($styles) {
	        var $scope = this;
	        $styles.each(function (index, el) {
	            $scope.styleRegister.add(new StyleRegisterEntry(el));
	            console.warn('ng.html - adding %o', el)
	        })
	    },

	    /**
	     *
	     * @param $DOM
	     * @param [options]
	     * @param {String} [options.ignore]
	     * @param {String} [options.remove]
	     */
	    formatDOM: function ($DOM, options) {
	        var $scope = this,
	            _options = utils.defaults({}, options),
	            $scripts = $DOM.find('script');

	        if (_options.ignore) {
	            $scripts = $scripts.not(_options.ignore);
	        }
	        if (_options.remove) {
	            var $removedScripts = $scripts.filter(_options.remove).remove();
	            $scripts = $scripts.not($removedScripts);
	        }
	        $scripts.detach();
	        $DOM.find($scope.configLoader.getMainSelector()).append($scripts);
	    }

	};

	utils.defaults(HTMLDirective.prototype, Module.prototype);
	module.exports = HTMLDirective;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__(13),
	    RegisterEntry = __webpack_require__(25);

	/**
	 *
	 * @extends RegisterEntry
	 * @class ScriptRegisterEntry
	 * @param scriptDOMNode
	 * @constructor
	 */
	function ScriptRegisterEntry(scriptDOMNode) {
	    RegisterEntry.apply(this, arguments);
	}

	ScriptRegisterEntry.prototype = {

	    getId: function(){
	        return this.el.src || this.$el.html();
	    }
	};

	utils.defaults(ScriptRegisterEntry.prototype, RegisterEntry.prototype);

	module.exports = ScriptRegisterEntry;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(1);

	/**
	 * @class RegisterEntry
	 * @param scriptDOMNode
	 * @constructor
	 */
	function RegisterEntry(scriptDOMNode) {
	    this.meta = {};
	    this.el = scriptDOMNode;
	    this.$el = $(this.el);
	}

	module.exports = RegisterEntry;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__(13),
	    RegisterEntry = __webpack_require__(25);

	/**
	 *
	 * @extends RegisterEntry
	 * @class StyleRegisterEntry
	 * @param styleDOMNode
	 * @constructor
	 */
	function StyleRegisterEntry(styleDOMNode) {
	    RegisterEntry.apply(this, arguments);
	}

	StyleRegisterEntry.prototype = {

	    getId: function(){
	        return this.$el.attr('href') || this.$el.html();
	    }
	};

	utils.defaults(StyleRegisterEntry.prototype, RegisterEntry.prototype);

	module.exports = StyleRegisterEntry;


/***/ }
/******/ ]);