/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../../../../weblee/weblee-utils/node_modules/punycode/punycode.js":
/*!***************************************************************************!*\
  !*** /Users/kah8br/weblee/weblee-utils/node_modules/punycode/punycode.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports =  true && exports &&
		!exports.nodeType && exports;
	var freeModule =  true && module &&
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
		!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
			return punycode;
		}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}

}(this));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/module.js */ "../../../../../weblee/weblee-utils/node_modules/webpack/buildin/module.js")(module), __webpack_require__(/*! ./../webpack/buildin/global.js */ "../../../../../weblee/weblee-utils/node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../../../../weblee/weblee-utils/node_modules/querystring-es3/decode.js":
/*!********************************************************************************!*\
  !*** /Users/kah8br/weblee/weblee-utils/node_modules/querystring-es3/decode.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ "../../../../../weblee/weblee-utils/node_modules/querystring-es3/encode.js":
/*!********************************************************************************!*\
  !*** /Users/kah8br/weblee/weblee-utils/node_modules/querystring-es3/encode.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
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

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),

/***/ "../../../../../weblee/weblee-utils/node_modules/querystring-es3/index.js":
/*!*******************************************************************************!*\
  !*** /Users/kah8br/weblee/weblee-utils/node_modules/querystring-es3/index.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(/*! ./decode */ "../../../../../weblee/weblee-utils/node_modules/querystring-es3/decode.js");
exports.encode = exports.stringify = __webpack_require__(/*! ./encode */ "../../../../../weblee/weblee-utils/node_modules/querystring-es3/encode.js");


/***/ }),

/***/ "../../../../../weblee/weblee-utils/node_modules/url/url.js":
/*!*****************************************************************!*\
  !*** /Users/kah8br/weblee/weblee-utils/node_modules/url/url.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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



var punycode = __webpack_require__(/*! punycode */ "../../../../../weblee/weblee-utils/node_modules/punycode/punycode.js");
var util = __webpack_require__(/*! ./util */ "../../../../../weblee/weblee-utils/node_modules/url/util.js");

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
    querystring = __webpack_require__(/*! querystring */ "../../../../../weblee/weblee-utils/node_modules/querystring-es3/index.js");

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


/***/ }),

/***/ "../../../../../weblee/weblee-utils/node_modules/url/util.js":
/*!******************************************************************!*\
  !*** /Users/kah8br/weblee/weblee-utils/node_modules/url/util.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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


/***/ }),

/***/ "../../../../../weblee/weblee-utils/node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "../../../../../weblee/weblee-utils/node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "../../../node_modules/raw-loader/dist/cjs.js!./modules/views/html/loading-view.html":
/*!**************************************************************************************************************!*\
  !*** /Users/kah8br/nodejs/wp-spa/node_modules/raw-loader/dist/cjs.js!./modules/views/html/loading-view.html ***!
  \**************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"wp-spa-loading-view\"><div class=\"wp-spa-loading-view__wrap\"><div class=\"wp-spa-loading-view__icon\"></div><div class=\"wp-spa-loading-view__progress-bar\"><div class=\"wp-spa-loading-view__progress-bar-shadow\"></div></div></div></div>");

/***/ }),

/***/ "./app.ts":
/*!****************!*\
  !*** ./app.ts ***!
  \****************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var $ = __webpack_require__(/*! jquery */ "./vendors/jquery-wp.js");
var app_1 = __webpack_require__(/*! modules/app */ "./modules/app.ts");
$(function () {
    var app = new app_1.Application();
});


/***/ }),

/***/ "./modules/app.ts":
/*!************************!*\
  !*** ./modules/app.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = __webpack_require__(/*! modules/lib/router */ "./modules/lib/router.ts");
var resource_monitor_1 = __webpack_require__(/*! modules/services/resource-monitor */ "./modules/services/resource-monitor.ts");
var config_loader_1 = __webpack_require__(/*! modules/services/config-loader */ "./modules/services/config-loader.ts");
var content_loader_1 = __webpack_require__(/*! modules/services/content-loader */ "./modules/services/content-loader.ts");
var Controllers = __webpack_require__(/*! modules/controllers */ "./modules/controllers/index.ts");
var Views = __webpack_require__(/*! modules/views */ "./modules/views/index.ts");
var lib_1 = __webpack_require__(/*! modules/lib */ "./modules/lib/index.ts");
var Application = /** @class */ (function () {
    function Application(bootstrapSelector) {
        var _this = this;
        if (bootstrapSelector === void 0) { bootstrapSelector = '.spa-content'; }
        this.bootstrapSelector = bootstrapSelector;
        this.events = {};
        this.bootstrap($(this.bootstrapSelector));
        this.$window = $(window);
        this.meta = {
            baseHREF: $('head base').attr('href')
        };
        this.resourceMonitor = new resource_monitor_1.ResourceMonitor();
        this.configLoader = new config_loader_1.ConfigLoader(this);
        this.contentLoader = new content_loader_1.ContentLoader(this);
        this.router = new router_1.AppRouter(this, this.meta.baseHREF);
        this.router.on(/.*/, function (path) {
            _this.emit('$locationChangeSuccess', path, _this.previousPath);
            _this.previousPath = path;
        });
        this.mainController = new Controllers.MainController(this);
        this.uiController = new Controllers.UIController(this);
        this.htmlView = new Views.HTMLDirective(this);
        this.headView = new Views.HeadDirective(this);
        this.init();
    }
    Object.defineProperty(Application.prototype, "modules", {
        get: function () {
            var _this = this;
            return Object.keys(this).map(function (key) { return _this[key]; }).filter(function (item) { return item instanceof lib_1.Module; });
        },
        enumerable: true,
        configurable: true
    });
    Application.prototype.init = function () {
        this.modules.forEach(function (module) { return module.moduleInit && module.moduleInit(); });
    };
    Application.prototype.$timeout = function (callback, wait) {
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(callback);
        }
        else {
            callback();
        }
    };
    Application.prototype.on = function (event, callback) {
        this.events[event] = this.events[event] || [];
        this.events[event].push({
            callback: callback,
            context: this
        });
    };
    Application.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var listeners = this.events[event] || [];
        var listenerIdx = 0;
        var listener = listeners[listenerIdx];
        while (listener) {
            listener.callback.apply(listener.context, arguments);
            listenerIdx++;
            listener = listeners[listenerIdx];
        }
    };
    Application.prototype.bootstrap = function ($root) {
        var $contentPage = $root.find('.spa-content__page');
        this.$root = $root;
        $contentPage.css({ 'display': 'none' });
        $contentPage.removeClass('spa-content--no-js');
    };
    return Application;
}());
exports.Application = Application;
exports.default = Application;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./vendors/jquery-wp.js")))

/***/ }),

/***/ "./modules/controllers/index.ts":
/*!**************************************!*\
  !*** ./modules/controllers/index.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./main-controller */ "./modules/controllers/main-controller.ts"));
__export(__webpack_require__(/*! ./ui-controller */ "./modules/controllers/ui-controller.ts"));


/***/ }),

/***/ "./modules/controllers/main-controller.ts":
/*!************************************************!*\
  !*** ./modules/controllers/main-controller.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var module_1 = __webpack_require__(/*! ../lib/module */ "./modules/lib/module.ts");
var dom_node_register_1 = __webpack_require__(/*! modules/models/dom-node-register */ "./modules/models/dom-node-register.ts");
var MainController = /** @class */ (function (_super) {
    __extends(MainController, _super);
    function MainController(app) {
        var _this = _super.call(this, app) || this;
        _this.app = app;
        _this.scriptRegister = new dom_node_register_1.DOMNodeRegister();
        _this.config = _this.configLoader.getDefaults();
        return _this;
    }
    MainController.prototype.moduleInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.configLoader.fetchConfig(function (err, configData) {
                            _this.config = configData || _this.config;
                            _this.$on('$locationChangeSuccess', function (event, to, from) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            console.log('route: %o', event, to, from);
                                            if (to === from) {
                                                return [2 /*return*/];
                                            }
                                            console.log('mainController.$locationChangeSuccess() - routing to %o', to);
                                            return [4 /*yield*/, this.contentLoader.getHTML(to, {
                                                    useCache: this.config.useCache,
                                                    reusePages: this.config.reusePages,
                                                    done: function (err, $DOM) {
                                                        if (err) {
                                                            console.warn(err);
                                                            return;
                                                        }
                                                        var data = { $DOM: $DOM };
                                                        console.log('mainController.$locationChangeSuccess() - update');
                                                        _this.$broadcast('view:update', data);
                                                        _this.$window.trigger('view:update', data);
                                                    }
                                                })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return MainController;
}(module_1.Module));
exports.MainController = MainController;


/***/ }),

/***/ "./modules/controllers/ui-controller.ts":
/*!**********************************************!*\
  !*** ./modules/controllers/ui-controller.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var $ = __webpack_require__(/*! jquery */ "./vendors/jquery-wp.js");
// local modules
var utils = __webpack_require__(/*! modules/lib/utils */ "./modules/lib/utils.ts");
var module_1 = __webpack_require__(/*! modules/lib/module */ "./modules/lib/module.ts");
var loading_1 = __webpack_require__(/*! modules/views/loading */ "./modules/views/loading.ts");
// jquery plugins
__webpack_require__(/*! modules/views/jquery.one-strict */ "./modules/views/jquery.one-strict.ts");
__webpack_require__(/*! modules/views/jquery.prepended-css */ "./modules/views/jquery.prepended-css.ts");
var UIController = /** @class */ (function (_super) {
    __extends(UIController, _super);
    function UIController(app) {
        var _this = _super.call(this, app) || this;
        _this.app = app;
        _this.flags = {};
        _this.config = utils.defaults(_this.configLoader.getDefaults(), { timeout: 2000 });
        _this.$body = $('body');
        _this.mainSelector = _this.configLoader.getMainSelector();
        _this.loadingView = new loading_1.LoadingView({
            indicatorType: _this.$root.data('wp-spa-loader-type'),
            indicatorColor: _this.$root.data('wp-spa-loader-color')
        });
        return _this;
    }
    UIController.prototype.moduleInit = function () {
        var _this = this;
        this.updateConfiguration();
        if (this.flags.showLoadingScreen) {
            this.loadingView.appendTo(this.$body);
            // make use off css transition to smooth loading intro
            this.loadingView.show(0);
            this.$timeout(function () {
                _this.loadingView.show(50);
            });
        }
        this.exec(function () {
            // show animation on first render
            _this.addPage(_this.$body.find('.spa-content__page'), _this.$body[0].attributes, function () {
                _this.loadingView.hide();
                // start pre-caching
                _this.contentLoader.preCache();
            });
        }, 12 * 1000);
        this.configLoader.fetchConfig(function (err, configData) {
            _this.config = utils.defaults(configData, _this.config);
            _this.updateConfiguration();
            _this.hookIntoPage(_this.$body);
            _this.$on('head:update', function (event, data) {
                var $DOM = data.$DOM, $body = $DOM.find('body'), $newContent = $body.find(_this.mainSelector), $activeContent = _this.$body.find(_this.mainSelector);
                console.log('body.view:update - new $spaContent: %o', $newContent);
                _this.loadingView.show(0);
                _this.unHook();
                if (_this.flags.asyncAnimation) {
                    _this.removePage($activeContent);
                    _this.addPage($newContent, $body[0].attributes, function () {
                        _this.loadingView.hide();
                    });
                }
                else {
                    _this.removePage($activeContent, function () {
                        _this.loadingView.show(50);
                        _this.addPage($newContent, $body[0].attributes, function () {
                            _this.loadingView.hide();
                        });
                    });
                }
            });
        });
    };
    UIController.prototype.interceptAction = function (evt) {
        console.log('ngBody.interceptAction()');
        var targetHref = evt.currentTarget.href || location.href;
        var route = this.router.parseURL(targetHref);
        if (route) {
            console.log('ngBody.interceptAction()  - routing to %s', utils.getPathFromUrl(targetHref));
            if (route.path === '@' && route.query === '@' && route.hash === '@') {
                evt.preventDefault();
                // attempting route to current page
                this.shake();
            }
            else if (route.path !== '@') {
                evt.preventDefault();
                var routePath = route.path ? route.path : '/';
                this.router.path(routePath);
            }
            else {
                console.log('ngBody.interceptAction() - no-op');
            }
        }
        else {
            console.log('ngBody.interceptAction() - no-op');
        }
    };
    UIController.prototype.updateAnimationOptions = function () {
        this.flags.enforceSmooth = Number(this.config.enforceSmooth) === 1;
        this.flags.asyncAnimation = Number(this.config.asyncAnimation) === 1;
        this.flags.useScreenClip = Number(this.config.useScreenClip) === 1;
        this.flags.showLoadingScreen = !!this.$root.attr('data-wp-spa-loader-type');
    };
    UIController.prototype.updateExecutionMethod = function () {
        this.exec = this.flags.enforceSmooth ? this.execOnIdle : this.execImmediate;
    };
    UIController.prototype.updateConfiguration = function () {
        this.updateAnimationOptions();
        this.updateExecutionMethod();
    };
    UIController.prototype.destroyClickOverrides = function () {
        var _this = this;
        if (this.$clickables) {
            this.$clickables.off('click', null, function (evt) { return _this.interceptAction(evt); });
        }
        delete this.$clickables;
    };
    UIController.prototype.createClickOverrides = function ($page) {
        var _this = this;
        this.$clickables = $page.find('[href]').not('[data-spa-initialized]');
        this.$clickables.on('click', function (evt) { return _this.interceptAction(evt); });
        this.$clickables.attr('data-spa-initialized', 1);
    };
    UIController.prototype.shake = function () {
        var _this = this;
        this.$root.oneTimeout('animationend', function () {
            _this.$root.removeClass('spa-content--shake');
        }, 3000);
        this.$root.addClass('spa-content--shake');
    };
    UIController.prototype.hookIntoPage = function ($page) {
        this.createClickOverrides($page);
    };
    UIController.prototype.execOnIdleTimed = function (callback, duration) {
        var isCallbackClean = true;
        var timeoutId;
        var strictCallback = function () {
            clearTimeout(timeoutId);
            if (isCallbackClean) {
                callback();
            }
        };
        this.resourceMonitor.once(strictCallback);
        timeoutId = setTimeout(function () {
            isCallbackClean = false;
            callback();
        }, duration);
    };
    UIController.prototype.execOnIdle = function (callback) {
        return this.resourceMonitor.once(callback);
    };
    UIController.prototype.execImmediate = function (callback) {
        return this.$timeout(callback);
    };
    UIController.prototype.unHook = function () {
        this.destroyClickOverrides();
    };
    UIController.prototype.addPage = function ($page, attrs, callback) {
        var _this = this;
        var $view = $page.find('.spa-content__view');
        var attrIdx = 0;
        var bodyClasses;
        var attr;
        this.hookIntoPage($page);
        var startAnimationEndWatch = $page.oneDelayedTimeout('animationend', function () {
            _this.$timeout(function () {
                // restore classes to normal
                _this.$body.attr('class', bodyClasses);
                $view.removeClass(bodyClasses);
                $page.removeClass('animate-page-in')
                    .css({
                    'animation-duration': '',
                    'animation-name': ''
                });
                if (callback)
                    callback();
                // init some events in case 3rd-party lib uses it for rendering
                _this.$window.resize();
                _this.$window.scroll();
            });
        }, Number(this.config.animationInDuration) + this.config.timeout);
        while (attr = attrs[attrIdx++]) {
            switch (attr.name) {
                case 'class':
                    // copy body classNames to view element and clear body
                    // we'll add the classes to the body once the animation is complete
                    this.$body.attr(attr.name, '');
                    bodyClasses = attr.value;
                    $view.addClass(bodyClasses);
                    break;
                default:
                    this.$body.attr(attr.name, attr.value);
            }
        }
        // set page properties
        if (this.flags.useScreenClip) {
            $page.addClass('animate-page-in--clipped');
        }
        else {
            $page.removeClass('animate-page-in--clipped');
        }
        $page.css({ 'display': 'none' })
            .addClass('animate-page-in');
        // attach to dom if page isn't already
        if (!($.contains(document.documentElement, $page[0]))) {
            this.$root.prepend($page);
        }
        this.exec(function () {
            // jump to top of screen
            // helps keep transitions between pages seamless
            utils.jumpTo(0);
            // remove clipped view if needed
            $page.removeClass('animate-page-in--clipped');
            startAnimationEndWatch();
            // play animation
            $page.css({
                'display': '',
                'animation-name': _this.config.animationInName,
                'animation-duration': _this.config.animationInDuration + 'ms'
            });
        });
    };
    UIController.prototype.removePage = function ($page, callback) {
        var _this = this;
        var $view = $page.find('.spa-content__view');
        var bodyClassNames = this.$body.attr('class');
        // adjust for clipped view
        // possibly provides relief from flicker
        if (this.flags.useScreenClip) {
            this.$root.prependedCSS([
                {
                    selector: '.animate-page-out.animate-page-out--clipped .spa-content__view',
                    styles: {
                        'margin-top': this.$window.scrollTop() * -1 + 'px'
                    }
                },
                {
                    selector: '.animate-page-out.animate-page-out--clipped',
                    styles: {
                        'animation-name': 'none',
                        'min-height': '100vh',
                        'overflow': 'hidden'
                    }
                }
            ]);
            $page.addClass('animate-page-out--clipped');
            // jump to top of screen
            // helps keep transitions between pages seamless
            utils.jumpTo(0);
        }
        else {
            $page.removeClass('animate-page-out--clipped');
            this.$root.prependedCSS([
                {
                    selector: '.animate-page-out',
                    styles: {
                        'animation-name': 'none'
                    }
                }
            ]);
        }
        $page.addClass('animate-page-out');
        var startAnimationEndWatch = $page.oneDelayedTimeout('animationend', function () {
            $page.remove();
            if (callback)
                callback();
            if (_this.flags.useScreenClip) {
                _this.$root.prependedCSS('remove');
            }
        }, Number(this.config.animationOutDuration) + this.config.timeout);
        // duplicate body classNames to $page scope
        $view.addClass(bodyClassNames);
        // allow overflow rendering first
        this.exec(function () {
            startAnimationEndWatch();
            $page.css({
                'animation-name': _this.config.animationOutName,
                'animation-duration': _this.config.animationOutDuration + 'ms'
            });
        });
    };
    return UIController;
}(module_1.Module));
exports.UIController = UIController;


/***/ }),

/***/ "./modules/lib/dom-parser.ts":
/*!***********************************!*\
  !*** ./modules/lib/dom-parser.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var $ = __webpack_require__(/*! jquery */ "./vendors/jquery-wp.js");
var DOMParser = /** @class */ (function () {
    function DOMParser() {
    }
    DOMParser.prototype.parseFromString = function (DOMString) {
        return $(DOMString);
    };
    return DOMParser;
}());
exports.DOMParser = DOMParser;


/***/ }),

/***/ "./modules/lib/history.ts":
/*!********************************!*\
  !*** ./modules/lib/history.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var $ = __webpack_require__(/*! jquery */ "./vendors/jquery-wp.js");
var HISTORY_CHANGE_EVENT = 'statechange';
var AppHistory = /** @class */ (function () {
    function AppHistory(history) {
        var _this = this;
        if (history === void 0) { history = window.history; }
        this.history = history;
        this.$window = $(window);
        this.callbacks = [];
        this.$window.on(HISTORY_CHANGE_EVENT, function (event) { return _this.execCallbacks(event); });
    }
    AppHistory.prototype.execCallbacks = function (event) {
        this.callbacks.forEach(function (callback) { return callback && callback(event); });
    };
    AppHistory.prototype.getState = function () {
        return this.history.state;
    };
    AppHistory.prototype.pushState = function (data, title, url) {
        this.history.pushState(data, title, url);
        this.$window.trigger(new $.Event(HISTORY_CHANGE_EVENT, {
            data: __assign({ title: title,
                url: url }, data)
        }));
    };
    AppHistory.prototype.onChange = function (callback) {
        var _this = this;
        var count = this.callbacks.push(callback);
        var index = count - 1;
        return function () {
            _this.callbacks[index] = null;
        };
    };
    AppHistory.prototype.destroy = function () {
        this.$window.off(HISTORY_CHANGE_EVENT);
    };
    ;
    return AppHistory;
}());
exports.AppHistory = AppHistory;


/***/ }),

/***/ "./modules/lib/index.ts":
/*!******************************!*\
  !*** ./modules/lib/index.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./history */ "./modules/lib/history.ts"));
__export(__webpack_require__(/*! ./utils */ "./modules/lib/utils.ts"));
__export(__webpack_require__(/*! ./dom-parser */ "./modules/lib/dom-parser.ts"));
__export(__webpack_require__(/*! ./module */ "./modules/lib/module.ts"));
__export(__webpack_require__(/*! ./router */ "./modules/lib/router.ts"));


/***/ }),

/***/ "./modules/lib/module.ts":
/*!*******************************!*\
  !*** ./modules/lib/module.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var defaultExtendedProps = [
    '$timeout',
    '$window',
    '$root',
    'meta',
    'resourceMonitor',
    'configLoader',
    'contentLoader',
    'router'
];
var Module = /** @class */ (function () {
    function Module(app) {
        this.app = app;
        this.app = app;
        for (var _i = 0, defaultExtendedProps_1 = defaultExtendedProps; _i < defaultExtendedProps_1.length; _i++) {
            var propertyName = defaultExtendedProps_1[_i];
            this[propertyName] = this.app[propertyName];
        }
    }
    Module.prototype.$on = function (event, callback) {
        this.app.on(event, callback);
    };
    Module.prototype.$broadcast = function (event) {
        var _a;
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        (_a = this.app).emit.apply(_a, [event].concat(data));
    };
    return Module;
}());
exports.Module = Module;


/***/ }),

/***/ "./modules/lib/router.ts":
/*!*******************************!*\
  !*** ./modules/lib/router.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var url = __webpack_require__(/*! url */ "../../../../../weblee/weblee-utils/node_modules/url/url.js");
var qs = __webpack_require__(/*! querystring */ "../../../../../weblee/weblee-utils/node_modules/querystring-es3/index.js");
var history_1 = __webpack_require__(/*! modules/lib/history */ "./modules/lib/history.ts");
var module_1 = __webpack_require__(/*! modules/lib/module */ "./modules/lib/module.ts");
var AppRoute = /** @class */ (function () {
    function AppRoute(data) {
        if (data === void 0) { data = {}; }
        Object.assign(this, data);
    }
    return AppRoute;
}());
exports.AppRoute = AppRoute;
var AppRouter = /** @class */ (function (_super) {
    __extends(AppRouter, _super);
    function AppRouter(app, base) {
        if (base === void 0) { base = '/'; }
        var _this = _super.call(this, app) || this;
        _this.base = base;
        _this.history = new history_1.AppHistory();
        _this.routes = [];
        return _this;
    }
    AppRouter.prototype.moduleInit = function () {
        var _this = this;
        this.history.onChange(function (evt) {
            var state = _this.history.getState();
            var path = state.path;
            console.log('statechange:', state, evt);
            for (var _i = 0, _a = _this.routes; _i < _a.length; _i++) {
                var routeHandler = _a[_i];
                if (routeHandler.path.test(path)) {
                    routeHandler.callback(path);
                }
            }
        });
    };
    AppRouter.prototype.on = function (path, callback) {
        this.routes.push({
            path: path,
            callback: callback
        });
    };
    AppRouter.prototype.path = function (path) {
        var pathUrl = url.resolve(this.base, path);
        var data = { path: path, url: pathUrl };
        this.history.pushState(data, undefined, pathUrl);
    };
    AppRouter.prototype.parseURL = function (href, options) {
        if (options === void 0) { options = {}; }
        var route = new AppRoute();
        var locationHrefMeta = url.parse(location.href);
        var targetHrefMeta = url.parse(href);
        var isPathnameChange = locationHrefMeta.pathname !== targetHrefMeta.pathname;
        var isQueryChange = locationHrefMeta.query !== targetHrefMeta.query;
        var isHashChange = locationHrefMeta.hash !== targetHrefMeta.hash;
        var isAdminRoute = /\/wp\-(admin|login)\/?/.test(targetHrefMeta.path);
        var isCurrentRoute = location.href.match(new RegExp(targetHrefMeta.pathname + '\/?$'));
        // animate for path changes. allow native hash otherwise
        var isCapturedRoute = options.captureAll
            || isPathnameChange
            || this.contentLoader.hasPageSync(href)
            || this.contentLoader.hasPostSync(href);
        route.hash = isHashChange ? targetHrefMeta.hash : '@';
        route.query = isQueryChange ? targetHrefMeta.search : '@';
        if (isAdminRoute) {
            return route;
        }
        if (isCapturedRoute) {
            route.path = targetHrefMeta.pathname;
        }
        if (isCurrentRoute) {
            route.path = '@';
        }
        return route;
    };
    AppRouter.prototype.parseQueryParams = function (routeQuery) {
        return qs.parse(/^\?/.test(routeQuery) ? routeQuery : "?" + routeQuery);
    };
    return AppRouter;
}(module_1.Module));
exports.AppRouter = AppRouter;


/***/ }),

/***/ "./modules/lib/utils.ts":
/*!******************************!*\
  !*** ./modules/lib/utils.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var url = __webpack_require__(/*! url */ "../../../../../weblee/weblee-utils/node_modules/url/url.js");
var $ = __webpack_require__(/*! jquery */ "./vendors/jquery-wp.js");
var dom_parser_1 = __webpack_require__(/*! ./dom-parser */ "./modules/lib/dom-parser.ts");
var siteURL = $('head base').attr('href');
var siteURLMeta = url.parse(siteURL);
var domParser = new dom_parser_1.DOMParser();
function createCookie(name, value, days) {
    var expires = '';
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
}
exports.createCookie = createCookie;
function readCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
}
exports.readCookie = readCookie;
function eraseCookie(name) {
    var value = '';
    var expires = '';
    document.cookie = name + '=' + value + expires + '; path=/';
}
exports.eraseCookie = eraseCookie;
/**
 *
 * @param $target {jQuery|Number}
 * @param options {object} - {duration, callback, context}
 */
function scrollTo($target, options) {
    var animateOptions = {
        duration: options && options.duration ? options.duration : 600
    }, callbackCount = 1, scrollTop = $target.offset ? ($target.offset().top - $('header').height() + 2) : $target;
    if (options && options.callback) {
        animateOptions['complete'] = function () {
            if (callbackCount--) {
                options.callback.apply(options.context, options.arguments);
            }
        };
    }
    $('html, body').animate({
        scrollTop: scrollTop // +2 for good measure
    }, __assign({ duration: 600 }, animateOptions));
}
exports.scrollTo = scrollTo;
/**
 *
 * @param $target
 */
function jumpTo($target) {
    var scrollTop = $target.offset ? ($target.offset().top - $('header').height() + 2) : $target;
    $('html, body').scrollTop((scrollTop < 0) ? 0 : scrollTop); // +2 for good measure
}
exports.jumpTo = jumpTo;
/**
 *
 * @param html
 * @param options
 * @returns {*|jQuery|HTMLElement}
 */
function parseDOMString(html, options) {
    var opts = defaults({
        safemode: true
    }, options);
    if (opts.safemode) {
        try {
            var DOM = domParser.parseFromString(html);
            return $(DOM);
        }
        catch (e) {
            console.error(e);
            return $(html);
        }
    }
    else {
        return $(domParser.parseFromString(html));
    }
}
exports.parseDOMString = parseDOMString;
function getCurrentPath() {
    return location.pathname.substr(getRootPath({ trailingSlash: false }).length);
}
exports.getCurrentPath = getCurrentPath;
/**
 * Returns the root path
 * @param {Object} [options]
 * @param {Boolean} [options.trailingSlash = true]
 * @returns {String}
 */
function getRootPath(options) {
    if (options === void 0) { options = { trailingSlash: true }; }
    return siteURLMeta.pathname + ((options && options.trailingSlash === false) ? '' : '/');
}
exports.getRootPath = getRootPath;
function getRootUrl() {
    return siteURL;
}
exports.getRootUrl = getRootUrl;
/**
 *
 * @param {String} requestURL
 * @returns {string}
 */
function getPathFromUrl(requestURL) {
    var domainUrl = getRootUrl();
    var pathStartIndex = requestURL.indexOf(domainUrl) + domainUrl.length;
    return requestURL.substr(pathStartIndex);
}
exports.getPathFromUrl = getPathFromUrl;
/**
 * Sanitizes a path/url aka adds trailing slash if need be to any path
 * @param {string} requestURL
 * @returns {string}
 */
function sanitizeUrl(requestURL) {
    return /\/$/.test(requestURL) ? requestURL + "/" : requestURL;
}
exports.sanitizeUrl = sanitizeUrl;
/**
 *
 * @param {string} requestURL
 * @returns {*|jQuery|HTMLElement}
 */
function loadCss(requestURL) {
    var $link = $(document.createElement('link'));
    $link.attr({
        rel: 'stylesheet',
        type: 'text/css',
        href: requestURL
    });
    $link.appendTo('head');
    return $link;
}
exports.loadCss = loadCss;
/**
 *
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
function getRand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.getRand = getRand;
function defaults() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var idx = 0;
    var base = arguments[idx++] || {};
    var next;
    var key;
    do {
        next = args[idx++];
        for (key in next) {
            if (next.hasOwnProperty(key) && base[key] == undefined) {
                base[key] = next[key];
            }
        }
    } while (next);
    return base;
}
exports.defaults = defaults;
function capitalize(text) {
    return text[0].toUpperCase() + text.substr(1);
}
exports.capitalize = capitalize;


/***/ }),

/***/ "./modules/models/dom-node-register.ts":
/*!*********************************************!*\
  !*** ./modules/models/dom-node-register.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DOMNodeRegister = /** @class */ (function () {
    function DOMNodeRegister() {
        this.registry = [];
    }
    /**
     *
     * @param {RegisterEntry} regEntry
     */
    DOMNodeRegister.prototype.contains = function (regEntry) {
        var regEntryId = regEntry.getId();
        var result = false;
        var idx = 0;
        while (this.registry[idx] && !result) {
            if (this.registry[idx].getId() == regEntryId) {
                result = true;
            }
            else {
                idx++;
            }
        }
        return result;
    };
    /**
     *
     * @param {RegisterEntry} regEntry
     */
    DOMNodeRegister.prototype.add = function (regEntry) {
        if (!this.contains(regEntry)) {
            this.registry.push(regEntry);
        }
    };
    return DOMNodeRegister;
}());
exports.DOMNodeRegister = DOMNodeRegister;


/***/ }),

/***/ "./modules/models/register-entry.ts":
/*!******************************************!*\
  !*** ./modules/models/register-entry.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var $ = __webpack_require__(/*! jquery */ "./vendors/jquery-wp.js");
var RegisterEntry = /** @class */ (function () {
    function RegisterEntry(scriptDOMNode) {
        this.meta = {};
        this.el = scriptDOMNode;
        this.$el = $(scriptDOMNode);
    }
    return RegisterEntry;
}());
exports.RegisterEntry = RegisterEntry;


/***/ }),

/***/ "./modules/models/script-register-entry.ts":
/*!*************************************************!*\
  !*** ./modules/models/script-register-entry.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var register_entry_1 = __webpack_require__(/*! ./register-entry */ "./modules/models/register-entry.ts");
var ScriptRegisterEntry = /** @class */ (function (_super) {
    __extends(ScriptRegisterEntry, _super);
    function ScriptRegisterEntry() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ScriptRegisterEntry.prototype.getId = function () {
        return this.el.src || this.$el.html();
    };
    return ScriptRegisterEntry;
}(register_entry_1.RegisterEntry));
exports.ScriptRegisterEntry = ScriptRegisterEntry;


/***/ }),

/***/ "./modules/models/style-register-entry.ts":
/*!************************************************!*\
  !*** ./modules/models/style-register-entry.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var register_entry_1 = __webpack_require__(/*! ./register-entry */ "./modules/models/register-entry.ts");
var StyleRegisterEntry = /** @class */ (function (_super) {
    __extends(StyleRegisterEntry, _super);
    function StyleRegisterEntry() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StyleRegisterEntry.prototype.getId = function () {
        return this.$el.attr('href') || this.$el.html();
    };
    return StyleRegisterEntry;
}(register_entry_1.RegisterEntry));
exports.StyleRegisterEntry = StyleRegisterEntry;


/***/ }),

/***/ "./modules/services/config-loader.ts":
/*!*******************************************!*\
  !*** ./modules/services/config-loader.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var $ = __webpack_require__(/*! jquery */ "./vendors/jquery-wp.js");
var module_1 = __webpack_require__(/*! ../lib/module */ "./modules/lib/module.ts");
var utils = __webpack_require__(/*! modules/lib/utils */ "./modules/lib/utils.ts");
var ConfigLoader = /** @class */ (function (_super) {
    __extends(ConfigLoader, _super);
    function ConfigLoader(app) {
        var _this = _super.call(this, app) || this;
        _this._state = {
            flag: undefined
        };
        // use defaults for now
        _this._data = _this.getDefaults();
        _this.configURL = utils.getRootUrl() + '?wp_spa_config=' + Date.now();
        return _this;
    }
    ConfigLoader.prototype.getMainSelector = function () {
        return '.spa-content__page';
    };
    ConfigLoader.prototype.getDefaults = function () {
        return {
            loadingScreenType: 'Icon',
            animationInName: 'pageIn',
            animationOutName: 'pageOut',
            animationInDuration: 400,
            animationOutDuration: 400,
            reusePages: 0,
            useCache: 1,
            useScreenClip: 0,
            showLoadingScreen: 1,
            asyncAnimation: 0,
            captureAll: 1
        };
    };
    ConfigLoader.prototype._checkAnimationResource = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, $.ajax({
                            method: 'GET',
                            url: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.css',
                            complete: function (response) {
                                _this._state.flag = response.status >= 200 && response.status < 400 ? 'normal' : 'default-only';
                                if (callback) {
                                    callback.call(_this);
                                }
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * @param {Function} [callback]
     * @param {Object} [options]
     * @param {Boolean} [options.forceUpdate]
     */
    ConfigLoader.prototype.fetchConfig = function (callback, options) {
        return __awaiter(this, void 0, void 0, function () {
            var opts, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        opts = utils.defaults(options, {});
                        if (opts.forceUpdate)
                            this._state.flag = 'update-only';
                        if (!this._state.flag) {
                            return [2 /*return*/, this._checkAnimationResource(function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.fetchConfig(callback, options)];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        }
                        _a = this._state.flag;
                        switch (_a) {
                            case 'loaded': return [3 /*break*/, 1];
                            case 'default-only': return [3 /*break*/, 2];
                            case 'update-only': return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 3];
                    case 1:
                        if (callback)
                            callback(null, this._data);
                        return [3 /*break*/, 5];
                    case 2:
                        this._data = this.getDefaults();
                        if (callback)
                            callback(null, this.getDefaults());
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, $.ajax({
                            url: this.configURL,
                            dataType: 'json',
                            success: function (response) {
                                _this._data = $.extend(_this._data, JSON.parse(response));
                                if (!_this._state.flag) {
                                    _this._state.flag = 'loaded';
                                }
                                // hotfix to check for valid config
                                if (callback) {
                                    var callbackData = _this._data.animationInName ? _this._data : _this.getDefaults();
                                    callback(null, callbackData);
                                }
                            },
                            error: function (response) {
                                if (callback) {
                                    callback(new Error('Could not fetch config'), null);
                                }
                            }
                        })];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return ConfigLoader;
}(module_1.Module));
exports.ConfigLoader = ConfigLoader;


/***/ }),

/***/ "./modules/services/content-loader.ts":
/*!********************************************!*\
  !*** ./modules/services/content-loader.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var $ = __webpack_require__(/*! jquery */ "./vendors/jquery-wp.js");
var url = __webpack_require__(/*! url */ "../../../../../weblee/weblee-utils/node_modules/url/url.js");
var utils = __webpack_require__(/*! ../lib/utils */ "./modules/lib/utils.ts");
var module_1 = __webpack_require__(/*! ../lib/module */ "./modules/lib/module.ts");
var utils_1 = __webpack_require__(/*! ../lib/utils */ "./modules/lib/utils.ts");
var ContentLoader = /** @class */ (function (_super) {
    __extends(ContentLoader, _super);
    function ContentLoader(app) {
        var _this = _super.call(this, app) || this;
        _this.app = app;
        _this.data = {
            pages: [],
            posts: [],
            isReady: false
        };
        _this._cache = {};
        return _this;
    }
    ContentLoader.prototype.moduleInit = function () {
        this.downloadSiteMap();
    };
    ContentLoader.prototype.get = function (path) {
        return this.data[path];
    };
    ContentLoader.prototype.set = function (path, value) {
        return this.data[path] = value;
    };
    ContentLoader.prototype.isReady = function () {
        return this.get('isReady');
    };
    ContentLoader.prototype.preCache = function (idx) {
        if (idx === void 0) { idx = 0; }
        var posts = this.get('posts');
        var route = posts[idx];
        if (route) {
            this.getHTML(url.parse(route).pathname, { useCache: true });
        }
        return this.get('posts')[idx + 1] ? this.preCache(idx + 1) : null;
    };
    /**
     *
     * @param route
     * @param {Object} [options]
     * @param {Boolean} [options.useCache=false]
     * @param {Boolean} [options.reusePages=false]
     * @param {Function} [options.done]
     */
    ContentLoader.prototype.getHTML = function (route, options) {
        return __awaiter(this, void 0, void 0, function () {
            var opts, $DOM;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        opts = utils.defaults(options, {});
                        if (!(opts.useCache && this._cache[route])) return [3 /*break*/, 1];
                        $DOM = opts.reusePages ? this._cache[route] : this._cache[route].clone();
                        console.log('spaContent._cache[%s] = (%O)', route, $DOM);
                        if (opts.done)
                            opts.done.call(null, null, $DOM);
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, $.ajax({
                            url: /^http/.test(route) ? route : url.resolve(this.meta.baseHREF, route),
                            success: function (response) {
                                var _DOM = document.createElement('html');
                                _DOM.innerHTML = response;
                                var $DOM = $(_DOM);
                                if (opts.useCache) {
                                    _this._cache[route] = $DOM;
                                }
                                if (opts.done) {
                                    opts.done.call(null, null, opts.reusePages ? $DOM : $DOM.clone());
                                }
                            },
                            error: function (response) {
                                if (opts.done) {
                                    opts.done.call(null, new Error('spaContent.http.get("' + route + '") - Failed:' + response));
                                }
                            }
                        })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * @param {Object} [options]
     * @param {Function} [options.done]
     */
    ContentLoader.prototype.downloadSiteMap = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _options, siteMapURL;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _options = utils.defaults(options, {
                            context: this
                        }), siteMapURL = utils.getRootUrl() + '?wp_spa_sitemap';
                        return [4 /*yield*/, $.ajax({
                                url: siteMapURL,
                                dataType: 'json',
                                success: function (response) {
                                    var siteMap = response;
                                    console.log('WordPress downloaded sitemap data: ', siteMap);
                                    for (var postType in siteMap) {
                                        if (siteMap.hasOwnProperty(postType)) {
                                            switch (postType) {
                                                case 'page':
                                                    _this.set('pages', siteMap[postType]);
                                                    break;
                                                default:
                                                    _this.set('posts', siteMap[postType]);
                                            }
                                        }
                                    }
                                    //console.log('WordPress processed sitemap data: ', this);
                                    _this.set('isReady', true);
                                    _this.$broadcast('wordpress:init');
                                    if (_options.done)
                                        _options.done.call(_options.context);
                                },
                                error: function (response) {
                                    var siteMapFetchError = new Error('Could not fetch sitemap');
                                    console.error(siteMapFetchError);
                                    if (_options.done) {
                                        _options.done.call(_options.context, siteMapFetchError, response);
                                    }
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * @param {Object} [options]
     * @param {Object} [options.context]
     * @param {Function} [options.done]
     * @returns {[String]}
     */
    ContentLoader.prototype.getPages = function (options) {
        var _this = this;
        var _options = utils.defaults(options, {});
        if (this.isReady()) {
            _options.done.call(_options.context, this.get('pages'));
        }
        else {
            this.$on('wordpress:init', function () {
                _options.done.call(_options.context, _this.get('pages'));
            });
        }
    };
    /**
     *
     * @param {Object} [options]
     * @param {Function} [options.done]
     * @returns {[String]}
     */
    ContentLoader.prototype.getPosts = function (options) {
        var _this = this;
        var _options = utils.defaults(options, {});
        if (this.isReady()) {
            _options.done.call(_options.context, this.get('pages'));
        }
        else {
            this.$on('wordpress:init', function () {
                _options.done.call(_options.context, _this.get('pages'));
            });
        }
    };
    /**
     *
     * @param url
     * @param {Object} [options]
     * @param {Function} [options.done]
     */
    ContentLoader.prototype.hasPage = function (url, options) {
        this.verify('pages', url, options);
    };
    /**
     *
     * @param requestedURL
     * @returns {boolean}
     */
    ContentLoader.prototype.hasPageSync = function (requestedURL) {
        return this.get('pages').includes(requestedURL);
    };
    /**
     *
     * @param url
     * @param {Object} [options]
     * @param {Function} [options.done]
     */
    ContentLoader.prototype.hasPost = function (url, options) {
        this.verify('posts', url, options);
    };
    /**
     *
     * @param requestedURL
     * @returns {boolean}
     */
    ContentLoader.prototype.hasPostSync = function (requestedURL) {
        return this.get('posts').includes(requestedURL);
    };
    ContentLoader.prototype.verify = function (type, url, options) {
        var _options = utils.defaults(options, {});
        var verificationMethodName = 'get' + utils_1.capitalize(type);
        var verificationMethod = this[verificationMethodName];
        verificationMethod({
            done: function (urls) {
                var requestedUrl = utils.sanitizeUrl(url);
                if (_options.done) {
                    _options.done.call(_options.context, urls.indexOf(requestedUrl) >= 0);
                }
            }
        });
    };
    return ContentLoader;
}(module_1.Module));
exports.ContentLoader = ContentLoader;


/***/ }),

/***/ "./modules/services/resource-monitor.ts":
/*!**********************************************!*\
  !*** ./modules/services/resource-monitor.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ResourceMonitor = /** @class */ (function () {
    function ResourceMonitor(config) {
        if (config === void 0) { config = {}; }
        this.config = {
            bufferSize: config.bufferSize || 200,
            idleFrequency: config.idleFrequency || (1000 / 60) // 50 frames per millisecond
        };
        this.state = {
            isInitialized: false,
            isSleeping: true,
            gcPtr: 0,
            headPtr: this.config.bufferSize - 1,
            sum: 0,
            latest: 0,
            prev: 0,
            sleepTimeoutId: null
        };
        this.subscriptions = [];
        this.store = [0]; // for the most recent tick
        while (this.store.length <= this.config.bufferSize) {
            this.store.push(0);
        }
    }
    ResourceMonitor.prototype.tick = function () {
        var _this = this;
        window.requestAnimationFrame(function () { return _this.onAnimationFrame(); });
    };
    ResourceMonitor.prototype.sleep = function () {
        this.state.isSleeping = true;
        this.tick();
    };
    ResourceMonitor.prototype.start = function () {
        clearTimeout(this.state.sleepTimeoutId);
        this.state.isSleeping = false;
        this.tick();
    };
    ResourceMonitor.prototype.once = function (callback) {
        var _this = this;
        var subscriptionIdx = this.subscriptions.length ? this.subscriptions.length - 1 : 0;
        this.subscriptions.push(function () {
            callback();
            _this.subscriptions.splice(subscriptionIdx, 1);
        });
        this.start();
    };
    ResourceMonitor.prototype.onAnimationFrame = function () {
        var callbackIdx = 0;
        var callback;
        if (this.isSleeping()) {
            return this.reset();
        }
        else {
            // record timing of latest tick delay
            this.state.prev = this.state.latest;
            this.state.latest = Date.now();
            // calculate and save new delay
            this.store[this.state.headPtr] = this.state.latest - this.state.prev;
            // update store index references
            this.state.gcPtr = (this.state.gcPtr + 1) % this.config.bufferSize;
            this.state.headPtr = (this.state.headPtr + 1) % this.config.bufferSize;
        }
        if (this.isReady()) {
            if (!this.state.isInitialized) {
                this.state.isInitialized = true;
                return this.tick();
            }
            // add new diff to sum
            this.state.sum += this.store[this.state.headPtr];
            // subtract old diff from sum
            this.state.sum -= this.store[this.state.gcPtr];
            if (this.getSpeed() < this.config.idleFrequency) {
                do {
                    callback = this.subscriptions[callbackIdx++];
                    if (callback) {
                        callback();
                    }
                } while (callback);
            }
        }
        this.hasQueue() ? this.tick() : this.sleep();
    };
    ResourceMonitor.prototype.getSpeed = function () {
        return this.state.sum / this.config.bufferSize;
    };
    ResourceMonitor.prototype.isReady = function () {
        return this.store[this.state.headPtr] && this.store[this.state.gcPtr];
    };
    ResourceMonitor.prototype.isSleeping = function () {
        return this.state.isSleeping;
    };
    ResourceMonitor.prototype.hasQueue = function () {
        return this.subscriptions.length > 0;
    };
    ResourceMonitor.prototype.reset = function () {
        this.store = this.store.map(function () { return 0; });
        this.state.gcPtr = 0;
        this.state.headPtr = this.config.bufferSize - 1;
        this.state.sum = 0;
        this.state.prev = 0;
        this.state.latest = 0;
        this.state.isInitialized = false;
    };
    return ResourceMonitor;
}());
exports.ResourceMonitor = ResourceMonitor;


/***/ }),

/***/ "./modules/views/head.ts":
/*!*******************************!*\
  !*** ./modules/views/head.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var $ = __webpack_require__(/*! jquery */ "./vendors/jquery-wp.js");
var module_1 = __webpack_require__(/*! modules/lib/module */ "./modules/lib/module.ts");
var HeadDirective = /** @class */ (function (_super) {
    __extends(HeadDirective, _super);
    function HeadDirective(app) {
        var _this = _super.call(this, app) || this;
        _this.app = app;
        _this.$element = $('head');
        _this.$on('html:update', function (event, data) {
            var $DOM = data.$DOM;
            var $head = $DOM.find('head');
            var $newStyles = data.new.$styles;
            // $oldScripts.remove();
            // add new styles to incoming head
            $head.append($newStyles);
            // update meta
            _this.$element.find('meta').remove();
            _this.$element.prepend($head.find('meta'));
            _this.$element.find('title').remove();
            _this.$element.prepend($head.find('title'));
            _this.$broadcast('head:update', data);
        });
        return _this;
    }
    return HeadDirective;
}(module_1.Module));
exports.HeadDirective = HeadDirective;


/***/ }),

/***/ "./modules/views/html.ts":
/*!*******************************!*\
  !*** ./modules/views/html.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var $ = __webpack_require__(/*! jquery */ "./vendors/jquery-wp.js");
var utils = __webpack_require__(/*! modules/lib/utils */ "./modules/lib/utils.ts");
var module_1 = __webpack_require__(/*! modules/lib/module */ "./modules/lib/module.ts");
var dom_node_register_1 = __webpack_require__(/*! modules/models/dom-node-register */ "./modules/models/dom-node-register.ts");
var script_register_entry_1 = __webpack_require__(/*! modules/models/script-register-entry */ "./modules/models/script-register-entry.ts");
var style_register_entry_1 = __webpack_require__(/*! modules/models/style-register-entry */ "./modules/models/style-register-entry.ts");
/**
 * @extends Module
 * @class HTMLDirective
 * @constructor
 */
var HTMLDirective = /** @class */ (function (_super) {
    __extends(HTMLDirective, _super);
    function HTMLDirective(app) {
        var _this = _super.call(this, app) || this;
        _this.$element = $('html');
        _this.selectors = {
            script: 'script',
            style: "link[rel='stylesheet'], style",
            spaScript: '[src*="wp-spa-public"]'
        };
        _this.scriptRegister = new dom_node_register_1.DOMNodeRegister();
        _this.styleRegister = new dom_node_register_1.DOMNodeRegister();
        _this.registerScripts(_this.$element.find('script'));
        _this.registerStyles(_this.$element.find(_this.selectors.style));
        _this.formatDOM(_this.$element, { ignore: _this.selectors.spaScript });
        _this.$on('view:update', function (event, data) {
            var $DOM = data.$DOM;
            _this.formatDOM($DOM, { remove: _this.selectors.spaScript });
            var $styles = $DOM.find(_this.selectors.style);
            var $scripts = $DOM.find(_this.selectors.script);
            $scripts.each(function (index, el) {
                var scriptRegEntry = new script_register_entry_1.ScriptRegisterEntry(el);
                if (_this.scriptRegister.contains(scriptRegEntry)) {
                    scriptRegEntry.$el.attr('data-spa-loaded', 1);
                    console.log('ng.html - excluding %o', el);
                }
                else {
                    _this.scriptRegister.add(scriptRegEntry);
                    console.warn('ng.html - adding %o', el);
                }
            });
            $styles.each(function (index, el) {
                var styleRegEntry = new style_register_entry_1.StyleRegisterEntry(el);
                if (_this.styleRegister.contains(styleRegEntry)) {
                    styleRegEntry.$el.attr('data-spa-loaded', 1);
                    console.log('ng.html - excluding %o', el);
                }
                else {
                    _this.styleRegister.add(styleRegEntry);
                    console.warn('ng.html - adding %o', el);
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
            _this.$broadcast('html:update', eventData);
        });
        return _this;
    }
    HTMLDirective.prototype.registerScripts = function ($scripts) {
        var _this = this;
        $scripts.each(function (index, el) {
            _this.scriptRegister.add(new script_register_entry_1.ScriptRegisterEntry(el));
            console.warn('ng.html - adding %o', el);
        });
    };
    HTMLDirective.prototype.registerStyles = function ($styles) {
        var _this = this;
        $styles.each(function (index, el) {
            _this.styleRegister.add(new style_register_entry_1.StyleRegisterEntry(el));
            console.warn('ng.html - adding %o', el);
        });
    };
    /**
     *
     * @param $DOM
     * @param [options]
     * @param {String} [options.ignore]
     * @param {String} [options.remove]
     */
    HTMLDirective.prototype.formatDOM = function ($DOM, options) {
        var _options = utils.defaults({}, options);
        var $scripts = $DOM.find('script');
        if (_options.ignore) {
            $scripts = $scripts.not(_options.ignore);
        }
        if (_options.remove) {
            var $removedScripts = $scripts.filter(_options.remove).remove();
            $scripts = $scripts.not($removedScripts);
        }
        $scripts.detach();
        $DOM.find(this.configLoader.getMainSelector()).append($scripts);
    };
    return HTMLDirective;
}(module_1.Module));
exports.HTMLDirective = HTMLDirective;


/***/ }),

/***/ "./modules/views/index.ts":
/*!********************************!*\
  !*** ./modules/views/index.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./head */ "./modules/views/head.ts"));
__export(__webpack_require__(/*! ./html */ "./modules/views/html.ts"));


/***/ }),

/***/ "./modules/views/jquery.one-strict.ts":
/*!********************************************!*\
  !*** ./modules/views/jquery.one-strict.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var $ = __webpack_require__(/*! jquery */ "./vendors/jquery-wp.js");
$.fn.oneTimeout = function (event, callback, duration) {
    var $el = this, isCallbackClean = true, timeoutId, strictCallback = function () {
        clearTimeout(timeoutId);
        if (isCallbackClean)
            callback();
    };
    this.one(event, strictCallback);
    timeoutId = setTimeout(function () {
        isCallbackClean = false;
        $el.off(event, null, strictCallback);
        callback();
    }, duration);
};
$.fn.oneDelayedTimeout = function (event, callback, duration) {
    var $el = this, args = arguments;
    return function () {
        $.fn.oneTimeout.apply($el, args);
    };
};
module.exports = $;


/***/ }),

/***/ "./modules/views/jquery.prepended-css.ts":
/*!***********************************************!*\
  !*** ./modules/views/jquery.prepended-css.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var $ = __webpack_require__(/*! jquery */ "./vendors/jquery-wp.js");
$.fn.prependedCSS = function (op) {
    if (Array.isArray(op)) {
        var css_1 = '';
        op.forEach(function (cssStyle) {
            css_1 += cssStyle.selector + "{";
            for (var propName in cssStyle.styles) {
                if (cssStyle.styles.hasOwnProperty(propName)) {
                    css_1 += propName + ':' + cssStyle.styles[propName] + ';';
                }
            }
            css_1 += "}";
        });
        this.$styles = $("<style>" + css_1 + "</style>");
        this.prepend(this.$styles);
    }
    else {
        switch (op) {
            case 'remove':
                if (this.$styles)
                    this.$styles.remove();
                break;
            default:
                break;
        }
    }
};
module.exports = $;


/***/ }),

/***/ "./modules/views/loading.ts":
/*!**********************************!*\
  !*** ./modules/views/loading.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {
Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(/*! modules/lib/utils */ "./modules/lib/utils.ts");
var LoadingView = /** @class */ (function () {
    function LoadingView(options) {
        this.state = { hasLoaded: false, progress: 0 };
        this.config = utils.defaults(options, {
            loadingClassName: 'wp-spa-loading-view--loading',
            loadingHTMLContent: __webpack_require__(/*! raw-loader!./../views/html/loading-view.html */ "../../../node_modules/raw-loader/dist/cjs.js!./modules/views/html/loading-view.html").default,
            indicatorType: 'indeterminate',
            indicatorColor: ''
        });
        this.$loadingView = $(this.config.loadingHTMLContent);
        this.$loadingIcon = this.$loadingView.find('.wp-spa-loading-view__icon');
        this.$loadingBar = this.$loadingView.find('.wp-spa-loading-view__progress-bar');
        this.$loadingView.addClass('wp-spa-loading-view--' + this.config.indicatorType);
    }
    LoadingView.prototype.show = function (amount) {
        this.$loadingView.addClass(this.config.loadingClassName);
        if (this.config.indicatorType == 'progress' && (amount === 0 || amount > 0))
            this.setLoadingProgress(amount);
    };
    LoadingView.prototype.reset = function () {
        this.state.progress = 0;
        this.state.hasLoaded = false;
        this.$loadingView.removeClass(this.config.loadingClassName);
        this.$loadingBar.css({
            'opacity': ''
        });
    };
    LoadingView.prototype.setLoadingProgress = function (amount) {
        var _this = this;
        if (!this.state.progress) {
            this.state.progress = 0;
            this.$loadingBar.css({ 'transform': 'translate3d(0, 0, 0)' });
        }
        // use amount only if higher than current progress
        this.state.progress = amount && amount > this.state.progress ? amount : this.state.progress;
        switch (amount) {
            case 100:
                clearTimeout(this.state.autoIncrementTimeoutId);
                this.state.hasLoaded = true;
                this.$loadingBar.css({
                    'transform': 'translate3d(100%, 0, 0)',
                    'opacity': '0'
                });
                setTimeout(function () { return _this.reset(); }, 1000);
                break;
            case 0:
            default:
                this.$loadingBar.css({
                    'transform': 'translate3d(' + this.state.progress + '%, 0, 0)'
                });
                this.state.autoIncrementTimeoutId = window.setTimeout(function () {
                    if (_this.state.progress < 75 && !_this.state.hasLoaded)
                        _this.show(_this.state.progress + 2);
                }, 500);
                break;
        }
    };
    LoadingView.prototype.hide = function () {
        var _this = this;
        if (this.config.indicatorType == 'progress') {
            this.setLoadingProgress(100);
            return;
        }
        this.$loadingView.find('.wp-spa-loading-view__icon').css({ opacity: 0 });
        window.setTimeout(function () {
            // hide everything
            _this.$loadingView.find('.wp-spa-loading-view__icon').css({ opacity: '' });
            _this.$loadingView.removeClass(_this.config.loadingClassName);
        }, 650);
    };
    LoadingView.prototype.appendTo = function ($parent) {
        this.$indicator = this.config.indicatorType == 'progress' ? this.$loadingBar : this.$loadingIcon;
        this.$indicator.css({
            'background-color': this.config.indicatorColor
        });
        $parent.append(this.$loadingView);
    };
    return LoadingView;
}());
exports.LoadingView = LoadingView;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./vendors/jquery-wp.js")))

/***/ }),

/***/ "./vendors/jquery-wp.js":
/*!******************************!*\
  !*** ./vendors/jquery-wp.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

// loads from global wordpress instance
module.exports = window.jQuery.noConflict();

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rYWg4YnIvd2VibGVlL3dlYmxlZS11dGlscy9ub2RlX21vZHVsZXMvcHVueWNvZGUvcHVueWNvZGUuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rYWg4YnIvd2VibGVlL3dlYmxlZS11dGlscy9ub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2RlY29kZS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2thaDhici93ZWJsZWUvd2VibGVlLXV0aWxzL25vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvZW5jb2RlLmpzIiwid2VicGFjazovLy8vVXNlcnMva2FoOGJyL3dlYmxlZS93ZWJsZWUtdXRpbHMvbm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2thaDhici93ZWJsZWUvd2VibGVlLXV0aWxzL25vZGVfbW9kdWxlcy91cmwvdXJsLmpzIiwid2VicGFjazovLy8vVXNlcnMva2FoOGJyL3dlYmxlZS93ZWJsZWUtdXRpbHMvbm9kZV9tb2R1bGVzL3VybC91dGlsLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL21vZHVsZS5qcyIsIndlYnBhY2s6Ly8vLi9tb2R1bGVzL3ZpZXdzL2h0bWwvbG9hZGluZy12aWV3Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vYXBwLnRzIiwid2VicGFjazovLy8uL21vZHVsZXMvYXBwLnRzIiwid2VicGFjazovLy8uL21vZHVsZXMvY29udHJvbGxlcnMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy9jb250cm9sbGVycy9tYWluLWNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy9jb250cm9sbGVycy91aS1jb250cm9sbGVyLnRzIiwid2VicGFjazovLy8uL21vZHVsZXMvbGliL2RvbS1wYXJzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy9saWIvaGlzdG9yeS50cyIsIndlYnBhY2s6Ly8vLi9tb2R1bGVzL2xpYi9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9tb2R1bGVzL2xpYi9tb2R1bGUudHMiLCJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy9saWIvcm91dGVyLnRzIiwid2VicGFjazovLy8uL21vZHVsZXMvbGliL3V0aWxzLnRzIiwid2VicGFjazovLy8uL21vZHVsZXMvbW9kZWxzL2RvbS1ub2RlLXJlZ2lzdGVyLnRzIiwid2VicGFjazovLy8uL21vZHVsZXMvbW9kZWxzL3JlZ2lzdGVyLWVudHJ5LnRzIiwid2VicGFjazovLy8uL21vZHVsZXMvbW9kZWxzL3NjcmlwdC1yZWdpc3Rlci1lbnRyeS50cyIsIndlYnBhY2s6Ly8vLi9tb2R1bGVzL21vZGVscy9zdHlsZS1yZWdpc3Rlci1lbnRyeS50cyIsIndlYnBhY2s6Ly8vLi9tb2R1bGVzL3NlcnZpY2VzL2NvbmZpZy1sb2FkZXIudHMiLCJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy9zZXJ2aWNlcy9jb250ZW50LWxvYWRlci50cyIsIndlYnBhY2s6Ly8vLi9tb2R1bGVzL3NlcnZpY2VzL3Jlc291cmNlLW1vbml0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy92aWV3cy9oZWFkLnRzIiwid2VicGFjazovLy8uL21vZHVsZXMvdmlld3MvaHRtbC50cyIsIndlYnBhY2s6Ly8vLi9tb2R1bGVzL3ZpZXdzL2luZGV4LnRzIiwid2VicGFjazovLy8uL21vZHVsZXMvdmlld3MvanF1ZXJ5Lm9uZS1zdHJpY3QudHMiLCJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy92aWV3cy9qcXVlcnkucHJlcGVuZGVkLWNzcy50cyIsIndlYnBhY2s6Ly8vLi9tb2R1bGVzL3ZpZXdzL2xvYWRpbmcudHMiLCJ3ZWJwYWNrOi8vLy4vdmVuZG9ycy9qcXVlcnktd3AuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtB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QTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQix5QkFBeUI7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsT0FBTztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxPQUFPO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLE9BQU87QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBa0IsbUJBQW1CO0FBQ3JDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixtQkFBbUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixpQkFBaUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsUUFBUTtBQUN0QztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVSxNQUFNO0FBQ2hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUMzdEJhOztBQUViO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2ZBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FB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R0FBUixVQUFTLE9BQTRCO1FBQ25DLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQ2pHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDO1lBQ2xCLGtCQUFrQixFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYztTQUMvQyxDQUFDLENBQUM7UUFDSCxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBQ0gsa0JBQUM7QUFBRCxDQUFDO0FBNUZZLGtDQUFXOzs7Ozs7Ozs7Ozs7O0FDZnhCO0FBQ0EsNEMiLCJmaWxlIjoid3Atc3BhLXB1YmxpYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vYXBwLnRzXCIpO1xuIiwiLyohIGh0dHBzOi8vbXRocy5iZS9wdW55Y29kZSB2MS40LjEgYnkgQG1hdGhpYXMgKi9cbjsoZnVuY3Rpb24ocm9vdCkge1xuXG5cdC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZXMgKi9cblx0dmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJlxuXHRcdCFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cdHZhciBmcmVlTW9kdWxlID0gdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiZcblx0XHQhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblx0dmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbDtcblx0aWYgKFxuXHRcdGZyZWVHbG9iYWwuZ2xvYmFsID09PSBmcmVlR2xvYmFsIHx8XG5cdFx0ZnJlZUdsb2JhbC53aW5kb3cgPT09IGZyZWVHbG9iYWwgfHxcblx0XHRmcmVlR2xvYmFsLnNlbGYgPT09IGZyZWVHbG9iYWxcblx0KSB7XG5cdFx0cm9vdCA9IGZyZWVHbG9iYWw7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGBwdW55Y29kZWAgb2JqZWN0LlxuXHQgKiBAbmFtZSBwdW55Y29kZVxuXHQgKiBAdHlwZSBPYmplY3Rcblx0ICovXG5cdHZhciBwdW55Y29kZSxcblxuXHQvKiogSGlnaGVzdCBwb3NpdGl2ZSBzaWduZWQgMzItYml0IGZsb2F0IHZhbHVlICovXG5cdG1heEludCA9IDIxNDc0ODM2NDcsIC8vIGFrYS4gMHg3RkZGRkZGRiBvciAyXjMxLTFcblxuXHQvKiogQm9vdHN0cmluZyBwYXJhbWV0ZXJzICovXG5cdGJhc2UgPSAzNixcblx0dE1pbiA9IDEsXG5cdHRNYXggPSAyNixcblx0c2tldyA9IDM4LFxuXHRkYW1wID0gNzAwLFxuXHRpbml0aWFsQmlhcyA9IDcyLFxuXHRpbml0aWFsTiA9IDEyOCwgLy8gMHg4MFxuXHRkZWxpbWl0ZXIgPSAnLScsIC8vICdcXHgyRCdcblxuXHQvKiogUmVndWxhciBleHByZXNzaW9ucyAqL1xuXHRyZWdleFB1bnljb2RlID0gL154bi0tLyxcblx0cmVnZXhOb25BU0NJSSA9IC9bXlxceDIwLVxceDdFXS8sIC8vIHVucHJpbnRhYmxlIEFTQ0lJIGNoYXJzICsgbm9uLUFTQ0lJIGNoYXJzXG5cdHJlZ2V4U2VwYXJhdG9ycyA9IC9bXFx4MkVcXHUzMDAyXFx1RkYwRVxcdUZGNjFdL2csIC8vIFJGQyAzNDkwIHNlcGFyYXRvcnNcblxuXHQvKiogRXJyb3IgbWVzc2FnZXMgKi9cblx0ZXJyb3JzID0ge1xuXHRcdCdvdmVyZmxvdyc6ICdPdmVyZmxvdzogaW5wdXQgbmVlZHMgd2lkZXIgaW50ZWdlcnMgdG8gcHJvY2VzcycsXG5cdFx0J25vdC1iYXNpYyc6ICdJbGxlZ2FsIGlucHV0ID49IDB4ODAgKG5vdCBhIGJhc2ljIGNvZGUgcG9pbnQpJyxcblx0XHQnaW52YWxpZC1pbnB1dCc6ICdJbnZhbGlkIGlucHV0J1xuXHR9LFxuXG5cdC8qKiBDb252ZW5pZW5jZSBzaG9ydGN1dHMgKi9cblx0YmFzZU1pbnVzVE1pbiA9IGJhc2UgLSB0TWluLFxuXHRmbG9vciA9IE1hdGguZmxvb3IsXG5cdHN0cmluZ0Zyb21DaGFyQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGUsXG5cblx0LyoqIFRlbXBvcmFyeSB2YXJpYWJsZSAqL1xuXHRrZXk7XG5cblx0LyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblx0LyoqXG5cdCAqIEEgZ2VuZXJpYyBlcnJvciB1dGlsaXR5IGZ1bmN0aW9uLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBUaGUgZXJyb3IgdHlwZS5cblx0ICogQHJldHVybnMge0Vycm9yfSBUaHJvd3MgYSBgUmFuZ2VFcnJvcmAgd2l0aCB0aGUgYXBwbGljYWJsZSBlcnJvciBtZXNzYWdlLlxuXHQgKi9cblx0ZnVuY3Rpb24gZXJyb3IodHlwZSkge1xuXHRcdHRocm93IG5ldyBSYW5nZUVycm9yKGVycm9yc1t0eXBlXSk7XG5cdH1cblxuXHQvKipcblx0ICogQSBnZW5lcmljIGBBcnJheSNtYXBgIHV0aWxpdHkgZnVuY3Rpb24uXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiB0aGF0IGdldHMgY2FsbGVkIGZvciBldmVyeSBhcnJheVxuXHQgKiBpdGVtLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IEEgbmV3IGFycmF5IG9mIHZhbHVlcyByZXR1cm5lZCBieSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBtYXAoYXJyYXksIGZuKSB7XG5cdFx0dmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblx0XHR2YXIgcmVzdWx0ID0gW107XG5cdFx0d2hpbGUgKGxlbmd0aC0tKSB7XG5cdFx0XHRyZXN1bHRbbGVuZ3RoXSA9IGZuKGFycmF5W2xlbmd0aF0pO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0LyoqXG5cdCAqIEEgc2ltcGxlIGBBcnJheSNtYXBgLWxpa2Ugd3JhcHBlciB0byB3b3JrIHdpdGggZG9tYWluIG5hbWUgc3RyaW5ncyBvciBlbWFpbFxuXHQgKiBhZGRyZXNzZXMuXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBkb21haW4gVGhlIGRvbWFpbiBuYW1lIG9yIGVtYWlsIGFkZHJlc3MuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiB0aGF0IGdldHMgY2FsbGVkIGZvciBldmVyeVxuXHQgKiBjaGFyYWN0ZXIuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gQSBuZXcgc3RyaW5nIG9mIGNoYXJhY3RlcnMgcmV0dXJuZWQgYnkgdGhlIGNhbGxiYWNrXG5cdCAqIGZ1bmN0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gbWFwRG9tYWluKHN0cmluZywgZm4pIHtcblx0XHR2YXIgcGFydHMgPSBzdHJpbmcuc3BsaXQoJ0AnKTtcblx0XHR2YXIgcmVzdWx0ID0gJyc7XG5cdFx0aWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcblx0XHRcdC8vIEluIGVtYWlsIGFkZHJlc3Nlcywgb25seSB0aGUgZG9tYWluIG5hbWUgc2hvdWxkIGJlIHB1bnljb2RlZC4gTGVhdmVcblx0XHRcdC8vIHRoZSBsb2NhbCBwYXJ0IChpLmUuIGV2ZXJ5dGhpbmcgdXAgdG8gYEBgKSBpbnRhY3QuXG5cdFx0XHRyZXN1bHQgPSBwYXJ0c1swXSArICdAJztcblx0XHRcdHN0cmluZyA9IHBhcnRzWzFdO1xuXHRcdH1cblx0XHQvLyBBdm9pZCBgc3BsaXQocmVnZXgpYCBmb3IgSUU4IGNvbXBhdGliaWxpdHkuIFNlZSAjMTcuXG5cdFx0c3RyaW5nID0gc3RyaW5nLnJlcGxhY2UocmVnZXhTZXBhcmF0b3JzLCAnXFx4MkUnKTtcblx0XHR2YXIgbGFiZWxzID0gc3RyaW5nLnNwbGl0KCcuJyk7XG5cdFx0dmFyIGVuY29kZWQgPSBtYXAobGFiZWxzLCBmbikuam9pbignLicpO1xuXHRcdHJldHVybiByZXN1bHQgKyBlbmNvZGVkO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYW4gYXJyYXkgY29udGFpbmluZyB0aGUgbnVtZXJpYyBjb2RlIHBvaW50cyBvZiBlYWNoIFVuaWNvZGVcblx0ICogY2hhcmFjdGVyIGluIHRoZSBzdHJpbmcuIFdoaWxlIEphdmFTY3JpcHQgdXNlcyBVQ1MtMiBpbnRlcm5hbGx5LFxuXHQgKiB0aGlzIGZ1bmN0aW9uIHdpbGwgY29udmVydCBhIHBhaXIgb2Ygc3Vycm9nYXRlIGhhbHZlcyAoZWFjaCBvZiB3aGljaFxuXHQgKiBVQ1MtMiBleHBvc2VzIGFzIHNlcGFyYXRlIGNoYXJhY3RlcnMpIGludG8gYSBzaW5nbGUgY29kZSBwb2ludCxcblx0ICogbWF0Y2hpbmcgVVRGLTE2LlxuXHQgKiBAc2VlIGBwdW55Y29kZS51Y3MyLmVuY29kZWBcblx0ICogQHNlZSA8aHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmc+XG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZS51Y3MyXG5cdCAqIEBuYW1lIGRlY29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nIFRoZSBVbmljb2RlIGlucHV0IHN0cmluZyAoVUNTLTIpLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBuZXcgYXJyYXkgb2YgY29kZSBwb2ludHMuXG5cdCAqL1xuXHRmdW5jdGlvbiB1Y3MyZGVjb2RlKHN0cmluZykge1xuXHRcdHZhciBvdXRwdXQgPSBbXSxcblx0XHQgICAgY291bnRlciA9IDAsXG5cdFx0ICAgIGxlbmd0aCA9IHN0cmluZy5sZW5ndGgsXG5cdFx0ICAgIHZhbHVlLFxuXHRcdCAgICBleHRyYTtcblx0XHR3aGlsZSAoY291bnRlciA8IGxlbmd0aCkge1xuXHRcdFx0dmFsdWUgPSBzdHJpbmcuY2hhckNvZGVBdChjb3VudGVyKyspO1xuXHRcdFx0aWYgKHZhbHVlID49IDB4RDgwMCAmJiB2YWx1ZSA8PSAweERCRkYgJiYgY291bnRlciA8IGxlbmd0aCkge1xuXHRcdFx0XHQvLyBoaWdoIHN1cnJvZ2F0ZSwgYW5kIHRoZXJlIGlzIGEgbmV4dCBjaGFyYWN0ZXJcblx0XHRcdFx0ZXh0cmEgPSBzdHJpbmcuY2hhckNvZGVBdChjb3VudGVyKyspO1xuXHRcdFx0XHRpZiAoKGV4dHJhICYgMHhGQzAwKSA9PSAweERDMDApIHsgLy8gbG93IHN1cnJvZ2F0ZVxuXHRcdFx0XHRcdG91dHB1dC5wdXNoKCgodmFsdWUgJiAweDNGRikgPDwgMTApICsgKGV4dHJhICYgMHgzRkYpICsgMHgxMDAwMCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gdW5tYXRjaGVkIHN1cnJvZ2F0ZTsgb25seSBhcHBlbmQgdGhpcyBjb2RlIHVuaXQsIGluIGNhc2UgdGhlIG5leHRcblx0XHRcdFx0XHQvLyBjb2RlIHVuaXQgaXMgdGhlIGhpZ2ggc3Vycm9nYXRlIG9mIGEgc3Vycm9nYXRlIHBhaXJcblx0XHRcdFx0XHRvdXRwdXQucHVzaCh2YWx1ZSk7XG5cdFx0XHRcdFx0Y291bnRlci0tO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvdXRwdXQucHVzaCh2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBvdXRwdXQ7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIHN0cmluZyBiYXNlZCBvbiBhbiBhcnJheSBvZiBudW1lcmljIGNvZGUgcG9pbnRzLlxuXHQgKiBAc2VlIGBwdW55Y29kZS51Y3MyLmRlY29kZWBcblx0ICogQG1lbWJlck9mIHB1bnljb2RlLnVjczJcblx0ICogQG5hbWUgZW5jb2RlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGNvZGVQb2ludHMgVGhlIGFycmF5IG9mIG51bWVyaWMgY29kZSBwb2ludHMuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBuZXcgVW5pY29kZSBzdHJpbmcgKFVDUy0yKS5cblx0ICovXG5cdGZ1bmN0aW9uIHVjczJlbmNvZGUoYXJyYXkpIHtcblx0XHRyZXR1cm4gbWFwKGFycmF5LCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0dmFyIG91dHB1dCA9ICcnO1xuXHRcdFx0aWYgKHZhbHVlID4gMHhGRkZGKSB7XG5cdFx0XHRcdHZhbHVlIC09IDB4MTAwMDA7XG5cdFx0XHRcdG91dHB1dCArPSBzdHJpbmdGcm9tQ2hhckNvZGUodmFsdWUgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApO1xuXHRcdFx0XHR2YWx1ZSA9IDB4REMwMCB8IHZhbHVlICYgMHgzRkY7XG5cdFx0XHR9XG5cdFx0XHRvdXRwdXQgKz0gc3RyaW5nRnJvbUNoYXJDb2RlKHZhbHVlKTtcblx0XHRcdHJldHVybiBvdXRwdXQ7XG5cdFx0fSkuam9pbignJyk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBiYXNpYyBjb2RlIHBvaW50IGludG8gYSBkaWdpdC9pbnRlZ2VyLlxuXHQgKiBAc2VlIGBkaWdpdFRvQmFzaWMoKWBcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtOdW1iZXJ9IGNvZGVQb2ludCBUaGUgYmFzaWMgbnVtZXJpYyBjb2RlIHBvaW50IHZhbHVlLlxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfSBUaGUgbnVtZXJpYyB2YWx1ZSBvZiBhIGJhc2ljIGNvZGUgcG9pbnQgKGZvciB1c2UgaW5cblx0ICogcmVwcmVzZW50aW5nIGludGVnZXJzKSBpbiB0aGUgcmFuZ2UgYDBgIHRvIGBiYXNlIC0gMWAsIG9yIGBiYXNlYCBpZlxuXHQgKiB0aGUgY29kZSBwb2ludCBkb2VzIG5vdCByZXByZXNlbnQgYSB2YWx1ZS5cblx0ICovXG5cdGZ1bmN0aW9uIGJhc2ljVG9EaWdpdChjb2RlUG9pbnQpIHtcblx0XHRpZiAoY29kZVBvaW50IC0gNDggPCAxMCkge1xuXHRcdFx0cmV0dXJuIGNvZGVQb2ludCAtIDIyO1xuXHRcdH1cblx0XHRpZiAoY29kZVBvaW50IC0gNjUgPCAyNikge1xuXHRcdFx0cmV0dXJuIGNvZGVQb2ludCAtIDY1O1xuXHRcdH1cblx0XHRpZiAoY29kZVBvaW50IC0gOTcgPCAyNikge1xuXHRcdFx0cmV0dXJuIGNvZGVQb2ludCAtIDk3O1xuXHRcdH1cblx0XHRyZXR1cm4gYmFzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIGRpZ2l0L2ludGVnZXIgaW50byBhIGJhc2ljIGNvZGUgcG9pbnQuXG5cdCAqIEBzZWUgYGJhc2ljVG9EaWdpdCgpYFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge051bWJlcn0gZGlnaXQgVGhlIG51bWVyaWMgdmFsdWUgb2YgYSBiYXNpYyBjb2RlIHBvaW50LlxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfSBUaGUgYmFzaWMgY29kZSBwb2ludCB3aG9zZSB2YWx1ZSAod2hlbiB1c2VkIGZvclxuXHQgKiByZXByZXNlbnRpbmcgaW50ZWdlcnMpIGlzIGBkaWdpdGAsIHdoaWNoIG5lZWRzIHRvIGJlIGluIHRoZSByYW5nZVxuXHQgKiBgMGAgdG8gYGJhc2UgLSAxYC4gSWYgYGZsYWdgIGlzIG5vbi16ZXJvLCB0aGUgdXBwZXJjYXNlIGZvcm0gaXNcblx0ICogdXNlZDsgZWxzZSwgdGhlIGxvd2VyY2FzZSBmb3JtIGlzIHVzZWQuIFRoZSBiZWhhdmlvciBpcyB1bmRlZmluZWRcblx0ICogaWYgYGZsYWdgIGlzIG5vbi16ZXJvIGFuZCBgZGlnaXRgIGhhcyBubyB1cHBlcmNhc2UgZm9ybS5cblx0ICovXG5cdGZ1bmN0aW9uIGRpZ2l0VG9CYXNpYyhkaWdpdCwgZmxhZykge1xuXHRcdC8vICAwLi4yNSBtYXAgdG8gQVNDSUkgYS4ueiBvciBBLi5aXG5cdFx0Ly8gMjYuLjM1IG1hcCB0byBBU0NJSSAwLi45XG5cdFx0cmV0dXJuIGRpZ2l0ICsgMjIgKyA3NSAqIChkaWdpdCA8IDI2KSAtICgoZmxhZyAhPSAwKSA8PCA1KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBCaWFzIGFkYXB0YXRpb24gZnVuY3Rpb24gYXMgcGVyIHNlY3Rpb24gMy40IG9mIFJGQyAzNDkyLlxuXHQgKiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzQ5MiNzZWN0aW9uLTMuNFxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0ZnVuY3Rpb24gYWRhcHQoZGVsdGEsIG51bVBvaW50cywgZmlyc3RUaW1lKSB7XG5cdFx0dmFyIGsgPSAwO1xuXHRcdGRlbHRhID0gZmlyc3RUaW1lID8gZmxvb3IoZGVsdGEgLyBkYW1wKSA6IGRlbHRhID4+IDE7XG5cdFx0ZGVsdGEgKz0gZmxvb3IoZGVsdGEgLyBudW1Qb2ludHMpO1xuXHRcdGZvciAoLyogbm8gaW5pdGlhbGl6YXRpb24gKi87IGRlbHRhID4gYmFzZU1pbnVzVE1pbiAqIHRNYXggPj4gMTsgayArPSBiYXNlKSB7XG5cdFx0XHRkZWx0YSA9IGZsb29yKGRlbHRhIC8gYmFzZU1pbnVzVE1pbik7XG5cdFx0fVxuXHRcdHJldHVybiBmbG9vcihrICsgKGJhc2VNaW51c1RNaW4gKyAxKSAqIGRlbHRhIC8gKGRlbHRhICsgc2tldykpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scyB0byBhIHN0cmluZyBvZiBVbmljb2RlXG5cdCAqIHN5bWJvbHMuXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5IHN5bWJvbHMuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSByZXN1bHRpbmcgc3RyaW5nIG9mIFVuaWNvZGUgc3ltYm9scy5cblx0ICovXG5cdGZ1bmN0aW9uIGRlY29kZShpbnB1dCkge1xuXHRcdC8vIERvbid0IHVzZSBVQ1MtMlxuXHRcdHZhciBvdXRwdXQgPSBbXSxcblx0XHQgICAgaW5wdXRMZW5ndGggPSBpbnB1dC5sZW5ndGgsXG5cdFx0ICAgIG91dCxcblx0XHQgICAgaSA9IDAsXG5cdFx0ICAgIG4gPSBpbml0aWFsTixcblx0XHQgICAgYmlhcyA9IGluaXRpYWxCaWFzLFxuXHRcdCAgICBiYXNpYyxcblx0XHQgICAgaixcblx0XHQgICAgaW5kZXgsXG5cdFx0ICAgIG9sZGksXG5cdFx0ICAgIHcsXG5cdFx0ICAgIGssXG5cdFx0ICAgIGRpZ2l0LFxuXHRcdCAgICB0LFxuXHRcdCAgICAvKiogQ2FjaGVkIGNhbGN1bGF0aW9uIHJlc3VsdHMgKi9cblx0XHQgICAgYmFzZU1pbnVzVDtcblxuXHRcdC8vIEhhbmRsZSB0aGUgYmFzaWMgY29kZSBwb2ludHM6IGxldCBgYmFzaWNgIGJlIHRoZSBudW1iZXIgb2YgaW5wdXQgY29kZVxuXHRcdC8vIHBvaW50cyBiZWZvcmUgdGhlIGxhc3QgZGVsaW1pdGVyLCBvciBgMGAgaWYgdGhlcmUgaXMgbm9uZSwgdGhlbiBjb3B5XG5cdFx0Ly8gdGhlIGZpcnN0IGJhc2ljIGNvZGUgcG9pbnRzIHRvIHRoZSBvdXRwdXQuXG5cblx0XHRiYXNpYyA9IGlucHV0Lmxhc3RJbmRleE9mKGRlbGltaXRlcik7XG5cdFx0aWYgKGJhc2ljIDwgMCkge1xuXHRcdFx0YmFzaWMgPSAwO1xuXHRcdH1cblxuXHRcdGZvciAoaiA9IDA7IGogPCBiYXNpYzsgKytqKSB7XG5cdFx0XHQvLyBpZiBpdCdzIG5vdCBhIGJhc2ljIGNvZGUgcG9pbnRcblx0XHRcdGlmIChpbnB1dC5jaGFyQ29kZUF0KGopID49IDB4ODApIHtcblx0XHRcdFx0ZXJyb3IoJ25vdC1iYXNpYycpO1xuXHRcdFx0fVxuXHRcdFx0b3V0cHV0LnB1c2goaW5wdXQuY2hhckNvZGVBdChqKSk7XG5cdFx0fVxuXG5cdFx0Ly8gTWFpbiBkZWNvZGluZyBsb29wOiBzdGFydCBqdXN0IGFmdGVyIHRoZSBsYXN0IGRlbGltaXRlciBpZiBhbnkgYmFzaWMgY29kZVxuXHRcdC8vIHBvaW50cyB3ZXJlIGNvcGllZDsgc3RhcnQgYXQgdGhlIGJlZ2lubmluZyBvdGhlcndpc2UuXG5cblx0XHRmb3IgKGluZGV4ID0gYmFzaWMgPiAwID8gYmFzaWMgKyAxIDogMDsgaW5kZXggPCBpbnB1dExlbmd0aDsgLyogbm8gZmluYWwgZXhwcmVzc2lvbiAqLykge1xuXG5cdFx0XHQvLyBgaW5kZXhgIGlzIHRoZSBpbmRleCBvZiB0aGUgbmV4dCBjaGFyYWN0ZXIgdG8gYmUgY29uc3VtZWQuXG5cdFx0XHQvLyBEZWNvZGUgYSBnZW5lcmFsaXplZCB2YXJpYWJsZS1sZW5ndGggaW50ZWdlciBpbnRvIGBkZWx0YWAsXG5cdFx0XHQvLyB3aGljaCBnZXRzIGFkZGVkIHRvIGBpYC4gVGhlIG92ZXJmbG93IGNoZWNraW5nIGlzIGVhc2llclxuXHRcdFx0Ly8gaWYgd2UgaW5jcmVhc2UgYGlgIGFzIHdlIGdvLCB0aGVuIHN1YnRyYWN0IG9mZiBpdHMgc3RhcnRpbmdcblx0XHRcdC8vIHZhbHVlIGF0IHRoZSBlbmQgdG8gb2J0YWluIGBkZWx0YWAuXG5cdFx0XHRmb3IgKG9sZGkgPSBpLCB3ID0gMSwgayA9IGJhc2U7IC8qIG5vIGNvbmRpdGlvbiAqLzsgayArPSBiYXNlKSB7XG5cblx0XHRcdFx0aWYgKGluZGV4ID49IGlucHV0TGVuZ3RoKSB7XG5cdFx0XHRcdFx0ZXJyb3IoJ2ludmFsaWQtaW5wdXQnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGRpZ2l0ID0gYmFzaWNUb0RpZ2l0KGlucHV0LmNoYXJDb2RlQXQoaW5kZXgrKykpO1xuXG5cdFx0XHRcdGlmIChkaWdpdCA+PSBiYXNlIHx8IGRpZ2l0ID4gZmxvb3IoKG1heEludCAtIGkpIC8gdykpIHtcblx0XHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGkgKz0gZGlnaXQgKiB3O1xuXHRcdFx0XHR0ID0gayA8PSBiaWFzID8gdE1pbiA6IChrID49IGJpYXMgKyB0TWF4ID8gdE1heCA6IGsgLSBiaWFzKTtcblxuXHRcdFx0XHRpZiAoZGlnaXQgPCB0KSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRiYXNlTWludXNUID0gYmFzZSAtIHQ7XG5cdFx0XHRcdGlmICh3ID4gZmxvb3IobWF4SW50IC8gYmFzZU1pbnVzVCkpIHtcblx0XHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHcgKj0gYmFzZU1pbnVzVDtcblxuXHRcdFx0fVxuXG5cdFx0XHRvdXQgPSBvdXRwdXQubGVuZ3RoICsgMTtcblx0XHRcdGJpYXMgPSBhZGFwdChpIC0gb2xkaSwgb3V0LCBvbGRpID09IDApO1xuXG5cdFx0XHQvLyBgaWAgd2FzIHN1cHBvc2VkIHRvIHdyYXAgYXJvdW5kIGZyb20gYG91dGAgdG8gYDBgLFxuXHRcdFx0Ly8gaW5jcmVtZW50aW5nIGBuYCBlYWNoIHRpbWUsIHNvIHdlJ2xsIGZpeCB0aGF0IG5vdzpcblx0XHRcdGlmIChmbG9vcihpIC8gb3V0KSA+IG1heEludCAtIG4pIHtcblx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHR9XG5cblx0XHRcdG4gKz0gZmxvb3IoaSAvIG91dCk7XG5cdFx0XHRpICU9IG91dDtcblxuXHRcdFx0Ly8gSW5zZXJ0IGBuYCBhdCBwb3NpdGlvbiBgaWAgb2YgdGhlIG91dHB1dFxuXHRcdFx0b3V0cHV0LnNwbGljZShpKyssIDAsIG4pO1xuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHVjczJlbmNvZGUob3V0cHV0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIHN0cmluZyBvZiBVbmljb2RlIHN5bWJvbHMgKGUuZy4gYSBkb21haW4gbmFtZSBsYWJlbCkgdG8gYVxuXHQgKiBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seSBzeW1ib2xzLlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBzdHJpbmcgb2YgVW5pY29kZSBzeW1ib2xzLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgcmVzdWx0aW5nIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5IHN5bWJvbHMuXG5cdCAqL1xuXHRmdW5jdGlvbiBlbmNvZGUoaW5wdXQpIHtcblx0XHR2YXIgbixcblx0XHQgICAgZGVsdGEsXG5cdFx0ICAgIGhhbmRsZWRDUENvdW50LFxuXHRcdCAgICBiYXNpY0xlbmd0aCxcblx0XHQgICAgYmlhcyxcblx0XHQgICAgaixcblx0XHQgICAgbSxcblx0XHQgICAgcSxcblx0XHQgICAgayxcblx0XHQgICAgdCxcblx0XHQgICAgY3VycmVudFZhbHVlLFxuXHRcdCAgICBvdXRwdXQgPSBbXSxcblx0XHQgICAgLyoqIGBpbnB1dExlbmd0aGAgd2lsbCBob2xkIHRoZSBudW1iZXIgb2YgY29kZSBwb2ludHMgaW4gYGlucHV0YC4gKi9cblx0XHQgICAgaW5wdXRMZW5ndGgsXG5cdFx0ICAgIC8qKiBDYWNoZWQgY2FsY3VsYXRpb24gcmVzdWx0cyAqL1xuXHRcdCAgICBoYW5kbGVkQ1BDb3VudFBsdXNPbmUsXG5cdFx0ICAgIGJhc2VNaW51c1QsXG5cdFx0ICAgIHFNaW51c1Q7XG5cblx0XHQvLyBDb252ZXJ0IHRoZSBpbnB1dCBpbiBVQ1MtMiB0byBVbmljb2RlXG5cdFx0aW5wdXQgPSB1Y3MyZGVjb2RlKGlucHV0KTtcblxuXHRcdC8vIENhY2hlIHRoZSBsZW5ndGhcblx0XHRpbnB1dExlbmd0aCA9IGlucHV0Lmxlbmd0aDtcblxuXHRcdC8vIEluaXRpYWxpemUgdGhlIHN0YXRlXG5cdFx0biA9IGluaXRpYWxOO1xuXHRcdGRlbHRhID0gMDtcblx0XHRiaWFzID0gaW5pdGlhbEJpYXM7XG5cblx0XHQvLyBIYW5kbGUgdGhlIGJhc2ljIGNvZGUgcG9pbnRzXG5cdFx0Zm9yIChqID0gMDsgaiA8IGlucHV0TGVuZ3RoOyArK2opIHtcblx0XHRcdGN1cnJlbnRWYWx1ZSA9IGlucHV0W2pdO1xuXHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA8IDB4ODApIHtcblx0XHRcdFx0b3V0cHV0LnB1c2goc3RyaW5nRnJvbUNoYXJDb2RlKGN1cnJlbnRWYWx1ZSkpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGhhbmRsZWRDUENvdW50ID0gYmFzaWNMZW5ndGggPSBvdXRwdXQubGVuZ3RoO1xuXG5cdFx0Ly8gYGhhbmRsZWRDUENvdW50YCBpcyB0aGUgbnVtYmVyIG9mIGNvZGUgcG9pbnRzIHRoYXQgaGF2ZSBiZWVuIGhhbmRsZWQ7XG5cdFx0Ly8gYGJhc2ljTGVuZ3RoYCBpcyB0aGUgbnVtYmVyIG9mIGJhc2ljIGNvZGUgcG9pbnRzLlxuXG5cdFx0Ly8gRmluaXNoIHRoZSBiYXNpYyBzdHJpbmcgLSBpZiBpdCBpcyBub3QgZW1wdHkgLSB3aXRoIGEgZGVsaW1pdGVyXG5cdFx0aWYgKGJhc2ljTGVuZ3RoKSB7XG5cdFx0XHRvdXRwdXQucHVzaChkZWxpbWl0ZXIpO1xuXHRcdH1cblxuXHRcdC8vIE1haW4gZW5jb2RpbmcgbG9vcDpcblx0XHR3aGlsZSAoaGFuZGxlZENQQ291bnQgPCBpbnB1dExlbmd0aCkge1xuXG5cdFx0XHQvLyBBbGwgbm9uLWJhc2ljIGNvZGUgcG9pbnRzIDwgbiBoYXZlIGJlZW4gaGFuZGxlZCBhbHJlYWR5LiBGaW5kIHRoZSBuZXh0XG5cdFx0XHQvLyBsYXJnZXIgb25lOlxuXHRcdFx0Zm9yIChtID0gbWF4SW50LCBqID0gMDsgaiA8IGlucHV0TGVuZ3RoOyArK2opIHtcblx0XHRcdFx0Y3VycmVudFZhbHVlID0gaW5wdXRbal07XG5cdFx0XHRcdGlmIChjdXJyZW50VmFsdWUgPj0gbiAmJiBjdXJyZW50VmFsdWUgPCBtKSB7XG5cdFx0XHRcdFx0bSA9IGN1cnJlbnRWYWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBJbmNyZWFzZSBgZGVsdGFgIGVub3VnaCB0byBhZHZhbmNlIHRoZSBkZWNvZGVyJ3MgPG4saT4gc3RhdGUgdG8gPG0sMD4sXG5cdFx0XHQvLyBidXQgZ3VhcmQgYWdhaW5zdCBvdmVyZmxvd1xuXHRcdFx0aGFuZGxlZENQQ291bnRQbHVzT25lID0gaGFuZGxlZENQQ291bnQgKyAxO1xuXHRcdFx0aWYgKG0gLSBuID4gZmxvb3IoKG1heEludCAtIGRlbHRhKSAvIGhhbmRsZWRDUENvdW50UGx1c09uZSkpIHtcblx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHR9XG5cblx0XHRcdGRlbHRhICs9IChtIC0gbikgKiBoYW5kbGVkQ1BDb3VudFBsdXNPbmU7XG5cdFx0XHRuID0gbTtcblxuXHRcdFx0Zm9yIChqID0gMDsgaiA8IGlucHV0TGVuZ3RoOyArK2opIHtcblx0XHRcdFx0Y3VycmVudFZhbHVlID0gaW5wdXRbal07XG5cblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA8IG4gJiYgKytkZWx0YSA+IG1heEludCkge1xuXHRcdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA9PSBuKSB7XG5cdFx0XHRcdFx0Ly8gUmVwcmVzZW50IGRlbHRhIGFzIGEgZ2VuZXJhbGl6ZWQgdmFyaWFibGUtbGVuZ3RoIGludGVnZXJcblx0XHRcdFx0XHRmb3IgKHEgPSBkZWx0YSwgayA9IGJhc2U7IC8qIG5vIGNvbmRpdGlvbiAqLzsgayArPSBiYXNlKSB7XG5cdFx0XHRcdFx0XHR0ID0gayA8PSBiaWFzID8gdE1pbiA6IChrID49IGJpYXMgKyB0TWF4ID8gdE1heCA6IGsgLSBiaWFzKTtcblx0XHRcdFx0XHRcdGlmIChxIDwgdCkge1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHFNaW51c1QgPSBxIC0gdDtcblx0XHRcdFx0XHRcdGJhc2VNaW51c1QgPSBiYXNlIC0gdDtcblx0XHRcdFx0XHRcdG91dHB1dC5wdXNoKFxuXHRcdFx0XHRcdFx0XHRzdHJpbmdGcm9tQ2hhckNvZGUoZGlnaXRUb0Jhc2ljKHQgKyBxTWludXNUICUgYmFzZU1pbnVzVCwgMCkpXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0cSA9IGZsb29yKHFNaW51c1QgLyBiYXNlTWludXNUKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRvdXRwdXQucHVzaChzdHJpbmdGcm9tQ2hhckNvZGUoZGlnaXRUb0Jhc2ljKHEsIDApKSk7XG5cdFx0XHRcdFx0YmlhcyA9IGFkYXB0KGRlbHRhLCBoYW5kbGVkQ1BDb3VudFBsdXNPbmUsIGhhbmRsZWRDUENvdW50ID09IGJhc2ljTGVuZ3RoKTtcblx0XHRcdFx0XHRkZWx0YSA9IDA7XG5cdFx0XHRcdFx0KytoYW5kbGVkQ1BDb3VudDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQrK2RlbHRhO1xuXHRcdFx0KytuO1xuXG5cdFx0fVxuXHRcdHJldHVybiBvdXRwdXQuam9pbignJyk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBQdW55Y29kZSBzdHJpbmcgcmVwcmVzZW50aW5nIGEgZG9tYWluIG5hbWUgb3IgYW4gZW1haWwgYWRkcmVzc1xuXHQgKiB0byBVbmljb2RlLiBPbmx5IHRoZSBQdW55Y29kZWQgcGFydHMgb2YgdGhlIGlucHV0IHdpbGwgYmUgY29udmVydGVkLCBpLmUuXG5cdCAqIGl0IGRvZXNuJ3QgbWF0dGVyIGlmIHlvdSBjYWxsIGl0IG9uIGEgc3RyaW5nIHRoYXQgaGFzIGFscmVhZHkgYmVlblxuXHQgKiBjb252ZXJ0ZWQgdG8gVW5pY29kZS5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgUHVueWNvZGVkIGRvbWFpbiBuYW1lIG9yIGVtYWlsIGFkZHJlc3MgdG9cblx0ICogY29udmVydCB0byBVbmljb2RlLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgVW5pY29kZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2l2ZW4gUHVueWNvZGVcblx0ICogc3RyaW5nLlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9Vbmljb2RlKGlucHV0KSB7XG5cdFx0cmV0dXJuIG1hcERvbWFpbihpbnB1dCwgZnVuY3Rpb24oc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gcmVnZXhQdW55Y29kZS50ZXN0KHN0cmluZylcblx0XHRcdFx0PyBkZWNvZGUoc3RyaW5nLnNsaWNlKDQpLnRvTG93ZXJDYXNlKCkpXG5cdFx0XHRcdDogc3RyaW5nO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgVW5pY29kZSBzdHJpbmcgcmVwcmVzZW50aW5nIGEgZG9tYWluIG5hbWUgb3IgYW4gZW1haWwgYWRkcmVzcyB0b1xuXHQgKiBQdW55Y29kZS4gT25seSB0aGUgbm9uLUFTQ0lJIHBhcnRzIG9mIHRoZSBkb21haW4gbmFtZSB3aWxsIGJlIGNvbnZlcnRlZCxcblx0ICogaS5lLiBpdCBkb2Vzbid0IG1hdHRlciBpZiB5b3UgY2FsbCBpdCB3aXRoIGEgZG9tYWluIHRoYXQncyBhbHJlYWR5IGluXG5cdCAqIEFTQ0lJLlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBkb21haW4gbmFtZSBvciBlbWFpbCBhZGRyZXNzIHRvIGNvbnZlcnQsIGFzIGFcblx0ICogVW5pY29kZSBzdHJpbmcuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBQdW55Y29kZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2l2ZW4gZG9tYWluIG5hbWUgb3Jcblx0ICogZW1haWwgYWRkcmVzcy5cblx0ICovXG5cdGZ1bmN0aW9uIHRvQVNDSUkoaW5wdXQpIHtcblx0XHRyZXR1cm4gbWFwRG9tYWluKGlucHV0LCBmdW5jdGlvbihzdHJpbmcpIHtcblx0XHRcdHJldHVybiByZWdleE5vbkFTQ0lJLnRlc3Qoc3RyaW5nKVxuXHRcdFx0XHQ/ICd4bi0tJyArIGVuY29kZShzdHJpbmcpXG5cdFx0XHRcdDogc3RyaW5nO1xuXHRcdH0pO1xuXHR9XG5cblx0LyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblx0LyoqIERlZmluZSB0aGUgcHVibGljIEFQSSAqL1xuXHRwdW55Y29kZSA9IHtcblx0XHQvKipcblx0XHQgKiBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGN1cnJlbnQgUHVueWNvZGUuanMgdmVyc2lvbiBudW1iZXIuXG5cdFx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdFx0ICogQHR5cGUgU3RyaW5nXG5cdFx0ICovXG5cdFx0J3ZlcnNpb24nOiAnMS40LjEnLFxuXHRcdC8qKlxuXHRcdCAqIEFuIG9iamVjdCBvZiBtZXRob2RzIHRvIGNvbnZlcnQgZnJvbSBKYXZhU2NyaXB0J3MgaW50ZXJuYWwgY2hhcmFjdGVyXG5cdFx0ICogcmVwcmVzZW50YXRpb24gKFVDUy0yKSB0byBVbmljb2RlIGNvZGUgcG9pbnRzLCBhbmQgYmFjay5cblx0XHQgKiBAc2VlIDxodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZz5cblx0XHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0XHQgKiBAdHlwZSBPYmplY3Rcblx0XHQgKi9cblx0XHQndWNzMic6IHtcblx0XHRcdCdkZWNvZGUnOiB1Y3MyZGVjb2RlLFxuXHRcdFx0J2VuY29kZSc6IHVjczJlbmNvZGVcblx0XHR9LFxuXHRcdCdkZWNvZGUnOiBkZWNvZGUsXG5cdFx0J2VuY29kZSc6IGVuY29kZSxcblx0XHQndG9BU0NJSSc6IHRvQVNDSUksXG5cdFx0J3RvVW5pY29kZSc6IHRvVW5pY29kZVxuXHR9O1xuXG5cdC8qKiBFeHBvc2UgYHB1bnljb2RlYCAqL1xuXHQvLyBTb21lIEFNRCBidWlsZCBvcHRpbWl6ZXJzLCBsaWtlIHIuanMsIGNoZWNrIGZvciBzcGVjaWZpYyBjb25kaXRpb24gcGF0dGVybnNcblx0Ly8gbGlrZSB0aGUgZm9sbG93aW5nOlxuXHRpZiAoXG5cdFx0dHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmXG5cdFx0dHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcgJiZcblx0XHRkZWZpbmUuYW1kXG5cdCkge1xuXHRcdGRlZmluZSgncHVueWNvZGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBwdW55Y29kZTtcblx0XHR9KTtcblx0fSBlbHNlIGlmIChmcmVlRXhwb3J0cyAmJiBmcmVlTW9kdWxlKSB7XG5cdFx0aWYgKG1vZHVsZS5leHBvcnRzID09IGZyZWVFeHBvcnRzKSB7XG5cdFx0XHQvLyBpbiBOb2RlLmpzLCBpby5qcywgb3IgUmluZ29KUyB2MC44LjArXG5cdFx0XHRmcmVlTW9kdWxlLmV4cG9ydHMgPSBwdW55Y29kZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gaW4gTmFyd2hhbCBvciBSaW5nb0pTIHYwLjcuMC1cblx0XHRcdGZvciAoa2V5IGluIHB1bnljb2RlKSB7XG5cdFx0XHRcdHB1bnljb2RlLmhhc093blByb3BlcnR5KGtleSkgJiYgKGZyZWVFeHBvcnRzW2tleV0gPSBwdW55Y29kZVtrZXldKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Ly8gaW4gUmhpbm8gb3IgYSB3ZWIgYnJvd3NlclxuXHRcdHJvb3QucHVueWNvZGUgPSBwdW55Y29kZTtcblx0fVxuXG59KHRoaXMpKTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbi8vIElmIG9iai5oYXNPd25Qcm9wZXJ0eSBoYXMgYmVlbiBvdmVycmlkZGVuLCB0aGVuIGNhbGxpbmdcbi8vIG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSB3aWxsIGJyZWFrLlxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vam95ZW50L25vZGUvaXNzdWVzLzE3MDdcbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocXMsIHNlcCwgZXEsIG9wdGlvbnMpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIHZhciBvYmogPSB7fTtcblxuICBpZiAodHlwZW9mIHFzICE9PSAnc3RyaW5nJyB8fCBxcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgdmFyIHJlZ2V4cCA9IC9cXCsvZztcbiAgcXMgPSBxcy5zcGxpdChzZXApO1xuXG4gIHZhciBtYXhLZXlzID0gMTAwMDtcbiAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMubWF4S2V5cyA9PT0gJ251bWJlcicpIHtcbiAgICBtYXhLZXlzID0gb3B0aW9ucy5tYXhLZXlzO1xuICB9XG5cbiAgdmFyIGxlbiA9IHFzLmxlbmd0aDtcbiAgLy8gbWF4S2V5cyA8PSAwIG1lYW5zIHRoYXQgd2Ugc2hvdWxkIG5vdCBsaW1pdCBrZXlzIGNvdW50XG4gIGlmIChtYXhLZXlzID4gMCAmJiBsZW4gPiBtYXhLZXlzKSB7XG4gICAgbGVuID0gbWF4S2V5cztcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICB2YXIgeCA9IHFzW2ldLnJlcGxhY2UocmVnZXhwLCAnJTIwJyksXG4gICAgICAgIGlkeCA9IHguaW5kZXhPZihlcSksXG4gICAgICAgIGtzdHIsIHZzdHIsIGssIHY7XG5cbiAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgIGtzdHIgPSB4LnN1YnN0cigwLCBpZHgpO1xuICAgICAgdnN0ciA9IHguc3Vic3RyKGlkeCArIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrc3RyID0geDtcbiAgICAgIHZzdHIgPSAnJztcbiAgICB9XG5cbiAgICBrID0gZGVjb2RlVVJJQ29tcG9uZW50KGtzdHIpO1xuICAgIHYgPSBkZWNvZGVVUklDb21wb25lbnQodnN0cik7XG5cbiAgICBpZiAoIWhhc093blByb3BlcnR5KG9iaiwgaykpIHtcbiAgICAgIG9ialtrXSA9IHY7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgIG9ialtrXS5wdXNoKHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmpba10gPSBbb2JqW2tdLCB2XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RyaW5naWZ5UHJpbWl0aXZlID0gZnVuY3Rpb24odikge1xuICBzd2l0Y2ggKHR5cGVvZiB2KSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB2O1xuXG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdiA/ICd0cnVlJyA6ICdmYWxzZSc7XG5cbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIGlzRmluaXRlKHYpID8gdiA6ICcnO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnJztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmosIHNlcCwgZXEsIG5hbWUpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIGlmIChvYmogPT09IG51bGwpIHtcbiAgICBvYmogPSB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbWFwKG9iamVjdEtleXMob2JqKSwgZnVuY3Rpb24oaykge1xuICAgICAgdmFyIGtzID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShrKSkgKyBlcTtcbiAgICAgIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgICAgcmV0dXJuIG1hcChvYmpba10sIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKHYpKTtcbiAgICAgICAgfSkuam9pbihzZXApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGtzICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShvYmpba10pKTtcbiAgICAgIH1cbiAgICB9KS5qb2luKHNlcCk7XG5cbiAgfVxuXG4gIGlmICghbmFtZSkgcmV0dXJuICcnO1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShuYW1lKSkgKyBlcSArXG4gICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9iaikpO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbmZ1bmN0aW9uIG1hcCAoeHMsIGYpIHtcbiAgaWYgKHhzLm1hcCkgcmV0dXJuIHhzLm1hcChmKTtcbiAgdmFyIHJlcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgcmVzLnB1c2goZih4c1tpXSwgaSkpO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgcmVzLnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5kZWNvZGUgPSBleHBvcnRzLnBhcnNlID0gcmVxdWlyZSgnLi9kZWNvZGUnKTtcbmV4cG9ydHMuZW5jb2RlID0gZXhwb3J0cy5zdHJpbmdpZnkgPSByZXF1aXJlKCcuL2VuY29kZScpO1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHB1bnljb2RlID0gcmVxdWlyZSgncHVueWNvZGUnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbmV4cG9ydHMucGFyc2UgPSB1cmxQYXJzZTtcbmV4cG9ydHMucmVzb2x2ZSA9IHVybFJlc29sdmU7XG5leHBvcnRzLnJlc29sdmVPYmplY3QgPSB1cmxSZXNvbHZlT2JqZWN0O1xuZXhwb3J0cy5mb3JtYXQgPSB1cmxGb3JtYXQ7XG5cbmV4cG9ydHMuVXJsID0gVXJsO1xuXG5mdW5jdGlvbiBVcmwoKSB7XG4gIHRoaXMucHJvdG9jb2wgPSBudWxsO1xuICB0aGlzLnNsYXNoZXMgPSBudWxsO1xuICB0aGlzLmF1dGggPSBudWxsO1xuICB0aGlzLmhvc3QgPSBudWxsO1xuICB0aGlzLnBvcnQgPSBudWxsO1xuICB0aGlzLmhvc3RuYW1lID0gbnVsbDtcbiAgdGhpcy5oYXNoID0gbnVsbDtcbiAgdGhpcy5zZWFyY2ggPSBudWxsO1xuICB0aGlzLnF1ZXJ5ID0gbnVsbDtcbiAgdGhpcy5wYXRobmFtZSA9IG51bGw7XG4gIHRoaXMucGF0aCA9IG51bGw7XG4gIHRoaXMuaHJlZiA9IG51bGw7XG59XG5cbi8vIFJlZmVyZW5jZTogUkZDIDM5ODYsIFJGQyAxODA4LCBSRkMgMjM5NlxuXG4vLyBkZWZpbmUgdGhlc2UgaGVyZSBzbyBhdCBsZWFzdCB0aGV5IG9ubHkgaGF2ZSB0byBiZVxuLy8gY29tcGlsZWQgb25jZSBvbiB0aGUgZmlyc3QgbW9kdWxlIGxvYWQuXG52YXIgcHJvdG9jb2xQYXR0ZXJuID0gL14oW2EtejAtOS4rLV0rOikvaSxcbiAgICBwb3J0UGF0dGVybiA9IC86WzAtOV0qJC8sXG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIGEgc2ltcGxlIHBhdGggVVJMXG4gICAgc2ltcGxlUGF0aFBhdHRlcm4gPSAvXihcXC9cXC8/KD8hXFwvKVteXFw/XFxzXSopKFxcP1teXFxzXSopPyQvLFxuXG4gICAgLy8gUkZDIDIzOTY6IGNoYXJhY3RlcnMgcmVzZXJ2ZWQgZm9yIGRlbGltaXRpbmcgVVJMcy5cbiAgICAvLyBXZSBhY3R1YWxseSBqdXN0IGF1dG8tZXNjYXBlIHRoZXNlLlxuICAgIGRlbGltcyA9IFsnPCcsICc+JywgJ1wiJywgJ2AnLCAnICcsICdcXHInLCAnXFxuJywgJ1xcdCddLFxuXG4gICAgLy8gUkZDIDIzOTY6IGNoYXJhY3RlcnMgbm90IGFsbG93ZWQgZm9yIHZhcmlvdXMgcmVhc29ucy5cbiAgICB1bndpc2UgPSBbJ3snLCAnfScsICd8JywgJ1xcXFwnLCAnXicsICdgJ10uY29uY2F0KGRlbGltcyksXG5cbiAgICAvLyBBbGxvd2VkIGJ5IFJGQ3MsIGJ1dCBjYXVzZSBvZiBYU1MgYXR0YWNrcy4gIEFsd2F5cyBlc2NhcGUgdGhlc2UuXG4gICAgYXV0b0VzY2FwZSA9IFsnXFwnJ10uY29uY2F0KHVud2lzZSksXG4gICAgLy8gQ2hhcmFjdGVycyB0aGF0IGFyZSBuZXZlciBldmVyIGFsbG93ZWQgaW4gYSBob3N0bmFtZS5cbiAgICAvLyBOb3RlIHRoYXQgYW55IGludmFsaWQgY2hhcnMgYXJlIGFsc28gaGFuZGxlZCwgYnV0IHRoZXNlXG4gICAgLy8gYXJlIHRoZSBvbmVzIHRoYXQgYXJlICpleHBlY3RlZCogdG8gYmUgc2Vlbiwgc28gd2UgZmFzdC1wYXRoXG4gICAgLy8gdGhlbS5cbiAgICBub25Ib3N0Q2hhcnMgPSBbJyUnLCAnLycsICc/JywgJzsnLCAnIyddLmNvbmNhdChhdXRvRXNjYXBlKSxcbiAgICBob3N0RW5kaW5nQ2hhcnMgPSBbJy8nLCAnPycsICcjJ10sXG4gICAgaG9zdG5hbWVNYXhMZW4gPSAyNTUsXG4gICAgaG9zdG5hbWVQYXJ0UGF0dGVybiA9IC9eWythLXowLTlBLVpfLV17MCw2M30kLyxcbiAgICBob3N0bmFtZVBhcnRTdGFydCA9IC9eKFsrYS16MC05QS1aXy1dezAsNjN9KSguKikkLyxcbiAgICAvLyBwcm90b2NvbHMgdGhhdCBjYW4gYWxsb3cgXCJ1bnNhZmVcIiBhbmQgXCJ1bndpc2VcIiBjaGFycy5cbiAgICB1bnNhZmVQcm90b2NvbCA9IHtcbiAgICAgICdqYXZhc2NyaXB0JzogdHJ1ZSxcbiAgICAgICdqYXZhc2NyaXB0Oic6IHRydWVcbiAgICB9LFxuICAgIC8vIHByb3RvY29scyB0aGF0IG5ldmVyIGhhdmUgYSBob3N0bmFtZS5cbiAgICBob3N0bGVzc1Byb3RvY29sID0ge1xuICAgICAgJ2phdmFzY3JpcHQnOiB0cnVlLFxuICAgICAgJ2phdmFzY3JpcHQ6JzogdHJ1ZVxuICAgIH0sXG4gICAgLy8gcHJvdG9jb2xzIHRoYXQgYWx3YXlzIGNvbnRhaW4gYSAvLyBiaXQuXG4gICAgc2xhc2hlZFByb3RvY29sID0ge1xuICAgICAgJ2h0dHAnOiB0cnVlLFxuICAgICAgJ2h0dHBzJzogdHJ1ZSxcbiAgICAgICdmdHAnOiB0cnVlLFxuICAgICAgJ2dvcGhlcic6IHRydWUsXG4gICAgICAnZmlsZSc6IHRydWUsXG4gICAgICAnaHR0cDonOiB0cnVlLFxuICAgICAgJ2h0dHBzOic6IHRydWUsXG4gICAgICAnZnRwOic6IHRydWUsXG4gICAgICAnZ29waGVyOic6IHRydWUsXG4gICAgICAnZmlsZTonOiB0cnVlXG4gICAgfSxcbiAgICBxdWVyeXN0cmluZyA9IHJlcXVpcmUoJ3F1ZXJ5c3RyaW5nJyk7XG5cbmZ1bmN0aW9uIHVybFBhcnNlKHVybCwgcGFyc2VRdWVyeVN0cmluZywgc2xhc2hlc0Rlbm90ZUhvc3QpIHtcbiAgaWYgKHVybCAmJiB1dGlsLmlzT2JqZWN0KHVybCkgJiYgdXJsIGluc3RhbmNlb2YgVXJsKSByZXR1cm4gdXJsO1xuXG4gIHZhciB1ID0gbmV3IFVybDtcbiAgdS5wYXJzZSh1cmwsIHBhcnNlUXVlcnlTdHJpbmcsIHNsYXNoZXNEZW5vdGVIb3N0KTtcbiAgcmV0dXJuIHU7XG59XG5cblVybC5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbih1cmwsIHBhcnNlUXVlcnlTdHJpbmcsIHNsYXNoZXNEZW5vdGVIb3N0KSB7XG4gIGlmICghdXRpbC5pc1N0cmluZyh1cmwpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlBhcmFtZXRlciAndXJsJyBtdXN0IGJlIGEgc3RyaW5nLCBub3QgXCIgKyB0eXBlb2YgdXJsKTtcbiAgfVxuXG4gIC8vIENvcHkgY2hyb21lLCBJRSwgb3BlcmEgYmFja3NsYXNoLWhhbmRsaW5nIGJlaGF2aW9yLlxuICAvLyBCYWNrIHNsYXNoZXMgYmVmb3JlIHRoZSBxdWVyeSBzdHJpbmcgZ2V0IGNvbnZlcnRlZCB0byBmb3J3YXJkIHNsYXNoZXNcbiAgLy8gU2VlOiBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9MjU5MTZcbiAgdmFyIHF1ZXJ5SW5kZXggPSB1cmwuaW5kZXhPZignPycpLFxuICAgICAgc3BsaXR0ZXIgPVxuICAgICAgICAgIChxdWVyeUluZGV4ICE9PSAtMSAmJiBxdWVyeUluZGV4IDwgdXJsLmluZGV4T2YoJyMnKSkgPyAnPycgOiAnIycsXG4gICAgICB1U3BsaXQgPSB1cmwuc3BsaXQoc3BsaXR0ZXIpLFxuICAgICAgc2xhc2hSZWdleCA9IC9cXFxcL2c7XG4gIHVTcGxpdFswXSA9IHVTcGxpdFswXS5yZXBsYWNlKHNsYXNoUmVnZXgsICcvJyk7XG4gIHVybCA9IHVTcGxpdC5qb2luKHNwbGl0dGVyKTtcblxuICB2YXIgcmVzdCA9IHVybDtcblxuICAvLyB0cmltIGJlZm9yZSBwcm9jZWVkaW5nLlxuICAvLyBUaGlzIGlzIHRvIHN1cHBvcnQgcGFyc2Ugc3R1ZmYgbGlrZSBcIiAgaHR0cDovL2Zvby5jb20gIFxcblwiXG4gIHJlc3QgPSByZXN0LnRyaW0oKTtcblxuICBpZiAoIXNsYXNoZXNEZW5vdGVIb3N0ICYmIHVybC5zcGxpdCgnIycpLmxlbmd0aCA9PT0gMSkge1xuICAgIC8vIFRyeSBmYXN0IHBhdGggcmVnZXhwXG4gICAgdmFyIHNpbXBsZVBhdGggPSBzaW1wbGVQYXRoUGF0dGVybi5leGVjKHJlc3QpO1xuICAgIGlmIChzaW1wbGVQYXRoKSB7XG4gICAgICB0aGlzLnBhdGggPSByZXN0O1xuICAgICAgdGhpcy5ocmVmID0gcmVzdDtcbiAgICAgIHRoaXMucGF0aG5hbWUgPSBzaW1wbGVQYXRoWzFdO1xuICAgICAgaWYgKHNpbXBsZVBhdGhbMl0pIHtcbiAgICAgICAgdGhpcy5zZWFyY2ggPSBzaW1wbGVQYXRoWzJdO1xuICAgICAgICBpZiAocGFyc2VRdWVyeVN0cmluZykge1xuICAgICAgICAgIHRoaXMucXVlcnkgPSBxdWVyeXN0cmluZy5wYXJzZSh0aGlzLnNlYXJjaC5zdWJzdHIoMSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucXVlcnkgPSB0aGlzLnNlYXJjaC5zdWJzdHIoMSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocGFyc2VRdWVyeVN0cmluZykge1xuICAgICAgICB0aGlzLnNlYXJjaCA9ICcnO1xuICAgICAgICB0aGlzLnF1ZXJ5ID0ge307XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1cblxuICB2YXIgcHJvdG8gPSBwcm90b2NvbFBhdHRlcm4uZXhlYyhyZXN0KTtcbiAgaWYgKHByb3RvKSB7XG4gICAgcHJvdG8gPSBwcm90b1swXTtcbiAgICB2YXIgbG93ZXJQcm90byA9IHByb3RvLnRvTG93ZXJDYXNlKCk7XG4gICAgdGhpcy5wcm90b2NvbCA9IGxvd2VyUHJvdG87XG4gICAgcmVzdCA9IHJlc3Quc3Vic3RyKHByb3RvLmxlbmd0aCk7XG4gIH1cblxuICAvLyBmaWd1cmUgb3V0IGlmIGl0J3MgZ290IGEgaG9zdFxuICAvLyB1c2VyQHNlcnZlciBpcyAqYWx3YXlzKiBpbnRlcnByZXRlZCBhcyBhIGhvc3RuYW1lLCBhbmQgdXJsXG4gIC8vIHJlc29sdXRpb24gd2lsbCB0cmVhdCAvL2Zvby9iYXIgYXMgaG9zdD1mb28scGF0aD1iYXIgYmVjYXVzZSB0aGF0J3NcbiAgLy8gaG93IHRoZSBicm93c2VyIHJlc29sdmVzIHJlbGF0aXZlIFVSTHMuXG4gIGlmIChzbGFzaGVzRGVub3RlSG9zdCB8fCBwcm90byB8fCByZXN0Lm1hdGNoKC9eXFwvXFwvW15AXFwvXStAW15AXFwvXSsvKSkge1xuICAgIHZhciBzbGFzaGVzID0gcmVzdC5zdWJzdHIoMCwgMikgPT09ICcvLyc7XG4gICAgaWYgKHNsYXNoZXMgJiYgIShwcm90byAmJiBob3N0bGVzc1Byb3RvY29sW3Byb3RvXSkpIHtcbiAgICAgIHJlc3QgPSByZXN0LnN1YnN0cigyKTtcbiAgICAgIHRoaXMuc2xhc2hlcyA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFob3N0bGVzc1Byb3RvY29sW3Byb3RvXSAmJlxuICAgICAgKHNsYXNoZXMgfHwgKHByb3RvICYmICFzbGFzaGVkUHJvdG9jb2xbcHJvdG9dKSkpIHtcblxuICAgIC8vIHRoZXJlJ3MgYSBob3N0bmFtZS5cbiAgICAvLyB0aGUgZmlyc3QgaW5zdGFuY2Ugb2YgLywgPywgOywgb3IgIyBlbmRzIHRoZSBob3N0LlxuICAgIC8vXG4gICAgLy8gSWYgdGhlcmUgaXMgYW4gQCBpbiB0aGUgaG9zdG5hbWUsIHRoZW4gbm9uLWhvc3QgY2hhcnMgKmFyZSogYWxsb3dlZFxuICAgIC8vIHRvIHRoZSBsZWZ0IG9mIHRoZSBsYXN0IEAgc2lnbiwgdW5sZXNzIHNvbWUgaG9zdC1lbmRpbmcgY2hhcmFjdGVyXG4gICAgLy8gY29tZXMgKmJlZm9yZSogdGhlIEAtc2lnbi5cbiAgICAvLyBVUkxzIGFyZSBvYm5veGlvdXMuXG4gICAgLy9cbiAgICAvLyBleDpcbiAgICAvLyBodHRwOi8vYUBiQGMvID0+IHVzZXI6YUBiIGhvc3Q6Y1xuICAgIC8vIGh0dHA6Ly9hQGI/QGMgPT4gdXNlcjphIGhvc3Q6YyBwYXRoOi8/QGNcblxuICAgIC8vIHYwLjEyIFRPRE8oaXNhYWNzKTogVGhpcyBpcyBub3QgcXVpdGUgaG93IENocm9tZSBkb2VzIHRoaW5ncy5cbiAgICAvLyBSZXZpZXcgb3VyIHRlc3QgY2FzZSBhZ2FpbnN0IGJyb3dzZXJzIG1vcmUgY29tcHJlaGVuc2l2ZWx5LlxuXG4gICAgLy8gZmluZCB0aGUgZmlyc3QgaW5zdGFuY2Ugb2YgYW55IGhvc3RFbmRpbmdDaGFyc1xuICAgIHZhciBob3N0RW5kID0gLTE7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBob3N0RW5kaW5nQ2hhcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBoZWMgPSByZXN0LmluZGV4T2YoaG9zdEVuZGluZ0NoYXJzW2ldKTtcbiAgICAgIGlmIChoZWMgIT09IC0xICYmIChob3N0RW5kID09PSAtMSB8fCBoZWMgPCBob3N0RW5kKSlcbiAgICAgICAgaG9zdEVuZCA9IGhlYztcbiAgICB9XG5cbiAgICAvLyBhdCB0aGlzIHBvaW50LCBlaXRoZXIgd2UgaGF2ZSBhbiBleHBsaWNpdCBwb2ludCB3aGVyZSB0aGVcbiAgICAvLyBhdXRoIHBvcnRpb24gY2Fubm90IGdvIHBhc3QsIG9yIHRoZSBsYXN0IEAgY2hhciBpcyB0aGUgZGVjaWRlci5cbiAgICB2YXIgYXV0aCwgYXRTaWduO1xuICAgIGlmIChob3N0RW5kID09PSAtMSkge1xuICAgICAgLy8gYXRTaWduIGNhbiBiZSBhbnl3aGVyZS5cbiAgICAgIGF0U2lnbiA9IHJlc3QubGFzdEluZGV4T2YoJ0AnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gYXRTaWduIG11c3QgYmUgaW4gYXV0aCBwb3J0aW9uLlxuICAgICAgLy8gaHR0cDovL2FAYi9jQGQgPT4gaG9zdDpiIGF1dGg6YSBwYXRoOi9jQGRcbiAgICAgIGF0U2lnbiA9IHJlc3QubGFzdEluZGV4T2YoJ0AnLCBob3N0RW5kKTtcbiAgICB9XG5cbiAgICAvLyBOb3cgd2UgaGF2ZSBhIHBvcnRpb24gd2hpY2ggaXMgZGVmaW5pdGVseSB0aGUgYXV0aC5cbiAgICAvLyBQdWxsIHRoYXQgb2ZmLlxuICAgIGlmIChhdFNpZ24gIT09IC0xKSB7XG4gICAgICBhdXRoID0gcmVzdC5zbGljZSgwLCBhdFNpZ24pO1xuICAgICAgcmVzdCA9IHJlc3Quc2xpY2UoYXRTaWduICsgMSk7XG4gICAgICB0aGlzLmF1dGggPSBkZWNvZGVVUklDb21wb25lbnQoYXV0aCk7XG4gICAgfVxuXG4gICAgLy8gdGhlIGhvc3QgaXMgdGhlIHJlbWFpbmluZyB0byB0aGUgbGVmdCBvZiB0aGUgZmlyc3Qgbm9uLWhvc3QgY2hhclxuICAgIGhvc3RFbmQgPSAtMTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vbkhvc3RDaGFycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGhlYyA9IHJlc3QuaW5kZXhPZihub25Ib3N0Q2hhcnNbaV0pO1xuICAgICAgaWYgKGhlYyAhPT0gLTEgJiYgKGhvc3RFbmQgPT09IC0xIHx8IGhlYyA8IGhvc3RFbmQpKVxuICAgICAgICBob3N0RW5kID0gaGVjO1xuICAgIH1cbiAgICAvLyBpZiB3ZSBzdGlsbCBoYXZlIG5vdCBoaXQgaXQsIHRoZW4gdGhlIGVudGlyZSB0aGluZyBpcyBhIGhvc3QuXG4gICAgaWYgKGhvc3RFbmQgPT09IC0xKVxuICAgICAgaG9zdEVuZCA9IHJlc3QubGVuZ3RoO1xuXG4gICAgdGhpcy5ob3N0ID0gcmVzdC5zbGljZSgwLCBob3N0RW5kKTtcbiAgICByZXN0ID0gcmVzdC5zbGljZShob3N0RW5kKTtcblxuICAgIC8vIHB1bGwgb3V0IHBvcnQuXG4gICAgdGhpcy5wYXJzZUhvc3QoKTtcblxuICAgIC8vIHdlJ3ZlIGluZGljYXRlZCB0aGF0IHRoZXJlIGlzIGEgaG9zdG5hbWUsXG4gICAgLy8gc28gZXZlbiBpZiBpdCdzIGVtcHR5LCBpdCBoYXMgdG8gYmUgcHJlc2VudC5cbiAgICB0aGlzLmhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZSB8fCAnJztcblxuICAgIC8vIGlmIGhvc3RuYW1lIGJlZ2lucyB3aXRoIFsgYW5kIGVuZHMgd2l0aCBdXG4gICAgLy8gYXNzdW1lIHRoYXQgaXQncyBhbiBJUHY2IGFkZHJlc3MuXG4gICAgdmFyIGlwdjZIb3N0bmFtZSA9IHRoaXMuaG9zdG5hbWVbMF0gPT09ICdbJyAmJlxuICAgICAgICB0aGlzLmhvc3RuYW1lW3RoaXMuaG9zdG5hbWUubGVuZ3RoIC0gMV0gPT09ICddJztcblxuICAgIC8vIHZhbGlkYXRlIGEgbGl0dGxlLlxuICAgIGlmICghaXB2Nkhvc3RuYW1lKSB7XG4gICAgICB2YXIgaG9zdHBhcnRzID0gdGhpcy5ob3N0bmFtZS5zcGxpdCgvXFwuLyk7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGhvc3RwYXJ0cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFyIHBhcnQgPSBob3N0cGFydHNbaV07XG4gICAgICAgIGlmICghcGFydCkgY29udGludWU7XG4gICAgICAgIGlmICghcGFydC5tYXRjaChob3N0bmFtZVBhcnRQYXR0ZXJuKSkge1xuICAgICAgICAgIHZhciBuZXdwYXJ0ID0gJyc7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGsgPSBwYXJ0Lmxlbmd0aDsgaiA8IGs7IGorKykge1xuICAgICAgICAgICAgaWYgKHBhcnQuY2hhckNvZGVBdChqKSA+IDEyNykge1xuICAgICAgICAgICAgICAvLyB3ZSByZXBsYWNlIG5vbi1BU0NJSSBjaGFyIHdpdGggYSB0ZW1wb3JhcnkgcGxhY2Vob2xkZXJcbiAgICAgICAgICAgICAgLy8gd2UgbmVlZCB0aGlzIHRvIG1ha2Ugc3VyZSBzaXplIG9mIGhvc3RuYW1lIGlzIG5vdFxuICAgICAgICAgICAgICAvLyBicm9rZW4gYnkgcmVwbGFjaW5nIG5vbi1BU0NJSSBieSBub3RoaW5nXG4gICAgICAgICAgICAgIG5ld3BhcnQgKz0gJ3gnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbmV3cGFydCArPSBwYXJ0W2pdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyB3ZSB0ZXN0IGFnYWluIHdpdGggQVNDSUkgY2hhciBvbmx5XG4gICAgICAgICAgaWYgKCFuZXdwYXJ0Lm1hdGNoKGhvc3RuYW1lUGFydFBhdHRlcm4pKSB7XG4gICAgICAgICAgICB2YXIgdmFsaWRQYXJ0cyA9IGhvc3RwYXJ0cy5zbGljZSgwLCBpKTtcbiAgICAgICAgICAgIHZhciBub3RIb3N0ID0gaG9zdHBhcnRzLnNsaWNlKGkgKyAxKTtcbiAgICAgICAgICAgIHZhciBiaXQgPSBwYXJ0Lm1hdGNoKGhvc3RuYW1lUGFydFN0YXJ0KTtcbiAgICAgICAgICAgIGlmIChiaXQpIHtcbiAgICAgICAgICAgICAgdmFsaWRQYXJ0cy5wdXNoKGJpdFsxXSk7XG4gICAgICAgICAgICAgIG5vdEhvc3QudW5zaGlmdChiaXRbMl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vdEhvc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHJlc3QgPSAnLycgKyBub3RIb3N0LmpvaW4oJy4nKSArIHJlc3Q7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmhvc3RuYW1lID0gdmFsaWRQYXJ0cy5qb2luKCcuJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5ob3N0bmFtZS5sZW5ndGggPiBob3N0bmFtZU1heExlbikge1xuICAgICAgdGhpcy5ob3N0bmFtZSA9ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBob3N0bmFtZXMgYXJlIGFsd2F5cyBsb3dlciBjYXNlLlxuICAgICAgdGhpcy5ob3N0bmFtZSA9IHRoaXMuaG9zdG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICBpZiAoIWlwdjZIb3N0bmFtZSkge1xuICAgICAgLy8gSUROQSBTdXBwb3J0OiBSZXR1cm5zIGEgcHVueWNvZGVkIHJlcHJlc2VudGF0aW9uIG9mIFwiZG9tYWluXCIuXG4gICAgICAvLyBJdCBvbmx5IGNvbnZlcnRzIHBhcnRzIG9mIHRoZSBkb21haW4gbmFtZSB0aGF0XG4gICAgICAvLyBoYXZlIG5vbi1BU0NJSSBjaGFyYWN0ZXJzLCBpLmUuIGl0IGRvZXNuJ3QgbWF0dGVyIGlmXG4gICAgICAvLyB5b3UgY2FsbCBpdCB3aXRoIGEgZG9tYWluIHRoYXQgYWxyZWFkeSBpcyBBU0NJSS1vbmx5LlxuICAgICAgdGhpcy5ob3N0bmFtZSA9IHB1bnljb2RlLnRvQVNDSUkodGhpcy5ob3N0bmFtZSk7XG4gICAgfVxuXG4gICAgdmFyIHAgPSB0aGlzLnBvcnQgPyAnOicgKyB0aGlzLnBvcnQgOiAnJztcbiAgICB2YXIgaCA9IHRoaXMuaG9zdG5hbWUgfHwgJyc7XG4gICAgdGhpcy5ob3N0ID0gaCArIHA7XG4gICAgdGhpcy5ocmVmICs9IHRoaXMuaG9zdDtcblxuICAgIC8vIHN0cmlwIFsgYW5kIF0gZnJvbSB0aGUgaG9zdG5hbWVcbiAgICAvLyB0aGUgaG9zdCBmaWVsZCBzdGlsbCByZXRhaW5zIHRoZW0sIHRob3VnaFxuICAgIGlmIChpcHY2SG9zdG5hbWUpIHtcbiAgICAgIHRoaXMuaG9zdG5hbWUgPSB0aGlzLmhvc3RuYW1lLnN1YnN0cigxLCB0aGlzLmhvc3RuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgaWYgKHJlc3RbMF0gIT09ICcvJykge1xuICAgICAgICByZXN0ID0gJy8nICsgcmVzdDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBub3cgcmVzdCBpcyBzZXQgdG8gdGhlIHBvc3QtaG9zdCBzdHVmZi5cbiAgLy8gY2hvcCBvZmYgYW55IGRlbGltIGNoYXJzLlxuICBpZiAoIXVuc2FmZVByb3RvY29sW2xvd2VyUHJvdG9dKSB7XG5cbiAgICAvLyBGaXJzdCwgbWFrZSAxMDAlIHN1cmUgdGhhdCBhbnkgXCJhdXRvRXNjYXBlXCIgY2hhcnMgZ2V0XG4gICAgLy8gZXNjYXBlZCwgZXZlbiBpZiBlbmNvZGVVUklDb21wb25lbnQgZG9lc24ndCB0aGluayB0aGV5XG4gICAgLy8gbmVlZCB0byBiZS5cbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGF1dG9Fc2NhcGUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YXIgYWUgPSBhdXRvRXNjYXBlW2ldO1xuICAgICAgaWYgKHJlc3QuaW5kZXhPZihhZSkgPT09IC0xKVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIHZhciBlc2MgPSBlbmNvZGVVUklDb21wb25lbnQoYWUpO1xuICAgICAgaWYgKGVzYyA9PT0gYWUpIHtcbiAgICAgICAgZXNjID0gZXNjYXBlKGFlKTtcbiAgICAgIH1cbiAgICAgIHJlc3QgPSByZXN0LnNwbGl0KGFlKS5qb2luKGVzYyk7XG4gICAgfVxuICB9XG5cblxuICAvLyBjaG9wIG9mZiBmcm9tIHRoZSB0YWlsIGZpcnN0LlxuICB2YXIgaGFzaCA9IHJlc3QuaW5kZXhPZignIycpO1xuICBpZiAoaGFzaCAhPT0gLTEpIHtcbiAgICAvLyBnb3QgYSBmcmFnbWVudCBzdHJpbmcuXG4gICAgdGhpcy5oYXNoID0gcmVzdC5zdWJzdHIoaGFzaCk7XG4gICAgcmVzdCA9IHJlc3Quc2xpY2UoMCwgaGFzaCk7XG4gIH1cbiAgdmFyIHFtID0gcmVzdC5pbmRleE9mKCc/Jyk7XG4gIGlmIChxbSAhPT0gLTEpIHtcbiAgICB0aGlzLnNlYXJjaCA9IHJlc3Quc3Vic3RyKHFtKTtcbiAgICB0aGlzLnF1ZXJ5ID0gcmVzdC5zdWJzdHIocW0gKyAxKTtcbiAgICBpZiAocGFyc2VRdWVyeVN0cmluZykge1xuICAgICAgdGhpcy5xdWVyeSA9IHF1ZXJ5c3RyaW5nLnBhcnNlKHRoaXMucXVlcnkpO1xuICAgIH1cbiAgICByZXN0ID0gcmVzdC5zbGljZSgwLCBxbSk7XG4gIH0gZWxzZSBpZiAocGFyc2VRdWVyeVN0cmluZykge1xuICAgIC8vIG5vIHF1ZXJ5IHN0cmluZywgYnV0IHBhcnNlUXVlcnlTdHJpbmcgc3RpbGwgcmVxdWVzdGVkXG4gICAgdGhpcy5zZWFyY2ggPSAnJztcbiAgICB0aGlzLnF1ZXJ5ID0ge307XG4gIH1cbiAgaWYgKHJlc3QpIHRoaXMucGF0aG5hbWUgPSByZXN0O1xuICBpZiAoc2xhc2hlZFByb3RvY29sW2xvd2VyUHJvdG9dICYmXG4gICAgICB0aGlzLmhvc3RuYW1lICYmICF0aGlzLnBhdGhuYW1lKSB7XG4gICAgdGhpcy5wYXRobmFtZSA9ICcvJztcbiAgfVxuXG4gIC8vdG8gc3VwcG9ydCBodHRwLnJlcXVlc3RcbiAgaWYgKHRoaXMucGF0aG5hbWUgfHwgdGhpcy5zZWFyY2gpIHtcbiAgICB2YXIgcCA9IHRoaXMucGF0aG5hbWUgfHwgJyc7XG4gICAgdmFyIHMgPSB0aGlzLnNlYXJjaCB8fCAnJztcbiAgICB0aGlzLnBhdGggPSBwICsgcztcbiAgfVxuXG4gIC8vIGZpbmFsbHksIHJlY29uc3RydWN0IHRoZSBocmVmIGJhc2VkIG9uIHdoYXQgaGFzIGJlZW4gdmFsaWRhdGVkLlxuICB0aGlzLmhyZWYgPSB0aGlzLmZvcm1hdCgpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGZvcm1hdCBhIHBhcnNlZCBvYmplY3QgaW50byBhIHVybCBzdHJpbmdcbmZ1bmN0aW9uIHVybEZvcm1hdChvYmopIHtcbiAgLy8gZW5zdXJlIGl0J3MgYW4gb2JqZWN0LCBhbmQgbm90IGEgc3RyaW5nIHVybC5cbiAgLy8gSWYgaXQncyBhbiBvYmosIHRoaXMgaXMgYSBuby1vcC5cbiAgLy8gdGhpcyB3YXksIHlvdSBjYW4gY2FsbCB1cmxfZm9ybWF0KCkgb24gc3RyaW5nc1xuICAvLyB0byBjbGVhbiB1cCBwb3RlbnRpYWxseSB3b25reSB1cmxzLlxuICBpZiAodXRpbC5pc1N0cmluZyhvYmopKSBvYmogPSB1cmxQYXJzZShvYmopO1xuICBpZiAoIShvYmogaW5zdGFuY2VvZiBVcmwpKSByZXR1cm4gVXJsLnByb3RvdHlwZS5mb3JtYXQuY2FsbChvYmopO1xuICByZXR1cm4gb2JqLmZvcm1hdCgpO1xufVxuXG5VcmwucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYXV0aCA9IHRoaXMuYXV0aCB8fCAnJztcbiAgaWYgKGF1dGgpIHtcbiAgICBhdXRoID0gZW5jb2RlVVJJQ29tcG9uZW50KGF1dGgpO1xuICAgIGF1dGggPSBhdXRoLnJlcGxhY2UoLyUzQS9pLCAnOicpO1xuICAgIGF1dGggKz0gJ0AnO1xuICB9XG5cbiAgdmFyIHByb3RvY29sID0gdGhpcy5wcm90b2NvbCB8fCAnJyxcbiAgICAgIHBhdGhuYW1lID0gdGhpcy5wYXRobmFtZSB8fCAnJyxcbiAgICAgIGhhc2ggPSB0aGlzLmhhc2ggfHwgJycsXG4gICAgICBob3N0ID0gZmFsc2UsXG4gICAgICBxdWVyeSA9ICcnO1xuXG4gIGlmICh0aGlzLmhvc3QpIHtcbiAgICBob3N0ID0gYXV0aCArIHRoaXMuaG9zdDtcbiAgfSBlbHNlIGlmICh0aGlzLmhvc3RuYW1lKSB7XG4gICAgaG9zdCA9IGF1dGggKyAodGhpcy5ob3N0bmFtZS5pbmRleE9mKCc6JykgPT09IC0xID9cbiAgICAgICAgdGhpcy5ob3N0bmFtZSA6XG4gICAgICAgICdbJyArIHRoaXMuaG9zdG5hbWUgKyAnXScpO1xuICAgIGlmICh0aGlzLnBvcnQpIHtcbiAgICAgIGhvc3QgKz0gJzonICsgdGhpcy5wb3J0O1xuICAgIH1cbiAgfVxuXG4gIGlmICh0aGlzLnF1ZXJ5ICYmXG4gICAgICB1dGlsLmlzT2JqZWN0KHRoaXMucXVlcnkpICYmXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLnF1ZXJ5KS5sZW5ndGgpIHtcbiAgICBxdWVyeSA9IHF1ZXJ5c3RyaW5nLnN0cmluZ2lmeSh0aGlzLnF1ZXJ5KTtcbiAgfVxuXG4gIHZhciBzZWFyY2ggPSB0aGlzLnNlYXJjaCB8fCAocXVlcnkgJiYgKCc/JyArIHF1ZXJ5KSkgfHwgJyc7XG5cbiAgaWYgKHByb3RvY29sICYmIHByb3RvY29sLnN1YnN0cigtMSkgIT09ICc6JykgcHJvdG9jb2wgKz0gJzonO1xuXG4gIC8vIG9ubHkgdGhlIHNsYXNoZWRQcm90b2NvbHMgZ2V0IHRoZSAvLy4gIE5vdCBtYWlsdG86LCB4bXBwOiwgZXRjLlxuICAvLyB1bmxlc3MgdGhleSBoYWQgdGhlbSB0byBiZWdpbiB3aXRoLlxuICBpZiAodGhpcy5zbGFzaGVzIHx8XG4gICAgICAoIXByb3RvY29sIHx8IHNsYXNoZWRQcm90b2NvbFtwcm90b2NvbF0pICYmIGhvc3QgIT09IGZhbHNlKSB7XG4gICAgaG9zdCA9ICcvLycgKyAoaG9zdCB8fCAnJyk7XG4gICAgaWYgKHBhdGhuYW1lICYmIHBhdGhuYW1lLmNoYXJBdCgwKSAhPT0gJy8nKSBwYXRobmFtZSA9ICcvJyArIHBhdGhuYW1lO1xuICB9IGVsc2UgaWYgKCFob3N0KSB7XG4gICAgaG9zdCA9ICcnO1xuICB9XG5cbiAgaWYgKGhhc2ggJiYgaGFzaC5jaGFyQXQoMCkgIT09ICcjJykgaGFzaCA9ICcjJyArIGhhc2g7XG4gIGlmIChzZWFyY2ggJiYgc2VhcmNoLmNoYXJBdCgwKSAhPT0gJz8nKSBzZWFyY2ggPSAnPycgKyBzZWFyY2g7XG5cbiAgcGF0aG5hbWUgPSBwYXRobmFtZS5yZXBsYWNlKC9bPyNdL2csIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChtYXRjaCk7XG4gIH0pO1xuICBzZWFyY2ggPSBzZWFyY2gucmVwbGFjZSgnIycsICclMjMnKTtcblxuICByZXR1cm4gcHJvdG9jb2wgKyBob3N0ICsgcGF0aG5hbWUgKyBzZWFyY2ggKyBoYXNoO1xufTtcblxuZnVuY3Rpb24gdXJsUmVzb2x2ZShzb3VyY2UsIHJlbGF0aXZlKSB7XG4gIHJldHVybiB1cmxQYXJzZShzb3VyY2UsIGZhbHNlLCB0cnVlKS5yZXNvbHZlKHJlbGF0aXZlKTtcbn1cblxuVXJsLnByb3RvdHlwZS5yZXNvbHZlID0gZnVuY3Rpb24ocmVsYXRpdmUpIHtcbiAgcmV0dXJuIHRoaXMucmVzb2x2ZU9iamVjdCh1cmxQYXJzZShyZWxhdGl2ZSwgZmFsc2UsIHRydWUpKS5mb3JtYXQoKTtcbn07XG5cbmZ1bmN0aW9uIHVybFJlc29sdmVPYmplY3Qoc291cmNlLCByZWxhdGl2ZSkge1xuICBpZiAoIXNvdXJjZSkgcmV0dXJuIHJlbGF0aXZlO1xuICByZXR1cm4gdXJsUGFyc2Uoc291cmNlLCBmYWxzZSwgdHJ1ZSkucmVzb2x2ZU9iamVjdChyZWxhdGl2ZSk7XG59XG5cblVybC5wcm90b3R5cGUucmVzb2x2ZU9iamVjdCA9IGZ1bmN0aW9uKHJlbGF0aXZlKSB7XG4gIGlmICh1dGlsLmlzU3RyaW5nKHJlbGF0aXZlKSkge1xuICAgIHZhciByZWwgPSBuZXcgVXJsKCk7XG4gICAgcmVsLnBhcnNlKHJlbGF0aXZlLCBmYWxzZSwgdHJ1ZSk7XG4gICAgcmVsYXRpdmUgPSByZWw7XG4gIH1cblxuICB2YXIgcmVzdWx0ID0gbmV3IFVybCgpO1xuICB2YXIgdGtleXMgPSBPYmplY3Qua2V5cyh0aGlzKTtcbiAgZm9yICh2YXIgdGsgPSAwOyB0ayA8IHRrZXlzLmxlbmd0aDsgdGsrKykge1xuICAgIHZhciB0a2V5ID0gdGtleXNbdGtdO1xuICAgIHJlc3VsdFt0a2V5XSA9IHRoaXNbdGtleV07XG4gIH1cblxuICAvLyBoYXNoIGlzIGFsd2F5cyBvdmVycmlkZGVuLCBubyBtYXR0ZXIgd2hhdC5cbiAgLy8gZXZlbiBocmVmPVwiXCIgd2lsbCByZW1vdmUgaXQuXG4gIHJlc3VsdC5oYXNoID0gcmVsYXRpdmUuaGFzaDtcblxuICAvLyBpZiB0aGUgcmVsYXRpdmUgdXJsIGlzIGVtcHR5LCB0aGVuIHRoZXJlJ3Mgbm90aGluZyBsZWZ0IHRvIGRvIGhlcmUuXG4gIGlmIChyZWxhdGl2ZS5ocmVmID09PSAnJykge1xuICAgIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBocmVmcyBsaWtlIC8vZm9vL2JhciBhbHdheXMgY3V0IHRvIHRoZSBwcm90b2NvbC5cbiAgaWYgKHJlbGF0aXZlLnNsYXNoZXMgJiYgIXJlbGF0aXZlLnByb3RvY29sKSB7XG4gICAgLy8gdGFrZSBldmVyeXRoaW5nIGV4Y2VwdCB0aGUgcHJvdG9jb2wgZnJvbSByZWxhdGl2ZVxuICAgIHZhciBya2V5cyA9IE9iamVjdC5rZXlzKHJlbGF0aXZlKTtcbiAgICBmb3IgKHZhciByayA9IDA7IHJrIDwgcmtleXMubGVuZ3RoOyByaysrKSB7XG4gICAgICB2YXIgcmtleSA9IHJrZXlzW3JrXTtcbiAgICAgIGlmIChya2V5ICE9PSAncHJvdG9jb2wnKVxuICAgICAgICByZXN1bHRbcmtleV0gPSByZWxhdGl2ZVtya2V5XTtcbiAgICB9XG5cbiAgICAvL3VybFBhcnNlIGFwcGVuZHMgdHJhaWxpbmcgLyB0byB1cmxzIGxpa2UgaHR0cDovL3d3dy5leGFtcGxlLmNvbVxuICAgIGlmIChzbGFzaGVkUHJvdG9jb2xbcmVzdWx0LnByb3RvY29sXSAmJlxuICAgICAgICByZXN1bHQuaG9zdG5hbWUgJiYgIXJlc3VsdC5wYXRobmFtZSkge1xuICAgICAgcmVzdWx0LnBhdGggPSByZXN1bHQucGF0aG5hbWUgPSAnLyc7XG4gICAgfVxuXG4gICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGlmIChyZWxhdGl2ZS5wcm90b2NvbCAmJiByZWxhdGl2ZS5wcm90b2NvbCAhPT0gcmVzdWx0LnByb3RvY29sKSB7XG4gICAgLy8gaWYgaXQncyBhIGtub3duIHVybCBwcm90b2NvbCwgdGhlbiBjaGFuZ2luZ1xuICAgIC8vIHRoZSBwcm90b2NvbCBkb2VzIHdlaXJkIHRoaW5nc1xuICAgIC8vIGZpcnN0LCBpZiBpdCdzIG5vdCBmaWxlOiwgdGhlbiB3ZSBNVVNUIGhhdmUgYSBob3N0LFxuICAgIC8vIGFuZCBpZiB0aGVyZSB3YXMgYSBwYXRoXG4gICAgLy8gdG8gYmVnaW4gd2l0aCwgdGhlbiB3ZSBNVVNUIGhhdmUgYSBwYXRoLlxuICAgIC8vIGlmIGl0IGlzIGZpbGU6LCB0aGVuIHRoZSBob3N0IGlzIGRyb3BwZWQsXG4gICAgLy8gYmVjYXVzZSB0aGF0J3Mga25vd24gdG8gYmUgaG9zdGxlc3MuXG4gICAgLy8gYW55dGhpbmcgZWxzZSBpcyBhc3N1bWVkIHRvIGJlIGFic29sdXRlLlxuICAgIGlmICghc2xhc2hlZFByb3RvY29sW3JlbGF0aXZlLnByb3RvY29sXSkge1xuICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhyZWxhdGl2ZSk7XG4gICAgICBmb3IgKHZhciB2ID0gMDsgdiA8IGtleXMubGVuZ3RoOyB2KyspIHtcbiAgICAgICAgdmFyIGsgPSBrZXlzW3ZdO1xuICAgICAgICByZXN1bHRba10gPSByZWxhdGl2ZVtrXTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICByZXN1bHQucHJvdG9jb2wgPSByZWxhdGl2ZS5wcm90b2NvbDtcbiAgICBpZiAoIXJlbGF0aXZlLmhvc3QgJiYgIWhvc3RsZXNzUHJvdG9jb2xbcmVsYXRpdmUucHJvdG9jb2xdKSB7XG4gICAgICB2YXIgcmVsUGF0aCA9IChyZWxhdGl2ZS5wYXRobmFtZSB8fCAnJykuc3BsaXQoJy8nKTtcbiAgICAgIHdoaWxlIChyZWxQYXRoLmxlbmd0aCAmJiAhKHJlbGF0aXZlLmhvc3QgPSByZWxQYXRoLnNoaWZ0KCkpKTtcbiAgICAgIGlmICghcmVsYXRpdmUuaG9zdCkgcmVsYXRpdmUuaG9zdCA9ICcnO1xuICAgICAgaWYgKCFyZWxhdGl2ZS5ob3N0bmFtZSkgcmVsYXRpdmUuaG9zdG5hbWUgPSAnJztcbiAgICAgIGlmIChyZWxQYXRoWzBdICE9PSAnJykgcmVsUGF0aC51bnNoaWZ0KCcnKTtcbiAgICAgIGlmIChyZWxQYXRoLmxlbmd0aCA8IDIpIHJlbFBhdGgudW5zaGlmdCgnJyk7XG4gICAgICByZXN1bHQucGF0aG5hbWUgPSByZWxQYXRoLmpvaW4oJy8nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnBhdGhuYW1lID0gcmVsYXRpdmUucGF0aG5hbWU7XG4gICAgfVxuICAgIHJlc3VsdC5zZWFyY2ggPSByZWxhdGl2ZS5zZWFyY2g7XG4gICAgcmVzdWx0LnF1ZXJ5ID0gcmVsYXRpdmUucXVlcnk7XG4gICAgcmVzdWx0Lmhvc3QgPSByZWxhdGl2ZS5ob3N0IHx8ICcnO1xuICAgIHJlc3VsdC5hdXRoID0gcmVsYXRpdmUuYXV0aDtcbiAgICByZXN1bHQuaG9zdG5hbWUgPSByZWxhdGl2ZS5ob3N0bmFtZSB8fCByZWxhdGl2ZS5ob3N0O1xuICAgIHJlc3VsdC5wb3J0ID0gcmVsYXRpdmUucG9ydDtcbiAgICAvLyB0byBzdXBwb3J0IGh0dHAucmVxdWVzdFxuICAgIGlmIChyZXN1bHQucGF0aG5hbWUgfHwgcmVzdWx0LnNlYXJjaCkge1xuICAgICAgdmFyIHAgPSByZXN1bHQucGF0aG5hbWUgfHwgJyc7XG4gICAgICB2YXIgcyA9IHJlc3VsdC5zZWFyY2ggfHwgJyc7XG4gICAgICByZXN1bHQucGF0aCA9IHAgKyBzO1xuICAgIH1cbiAgICByZXN1bHQuc2xhc2hlcyA9IHJlc3VsdC5zbGFzaGVzIHx8IHJlbGF0aXZlLnNsYXNoZXM7XG4gICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHZhciBpc1NvdXJjZUFicyA9IChyZXN1bHQucGF0aG5hbWUgJiYgcmVzdWx0LnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nKSxcbiAgICAgIGlzUmVsQWJzID0gKFxuICAgICAgICAgIHJlbGF0aXZlLmhvc3QgfHxcbiAgICAgICAgICByZWxhdGl2ZS5wYXRobmFtZSAmJiByZWxhdGl2ZS5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJ1xuICAgICAgKSxcbiAgICAgIG11c3RFbmRBYnMgPSAoaXNSZWxBYnMgfHwgaXNTb3VyY2VBYnMgfHxcbiAgICAgICAgICAgICAgICAgICAgKHJlc3VsdC5ob3N0ICYmIHJlbGF0aXZlLnBhdGhuYW1lKSksXG4gICAgICByZW1vdmVBbGxEb3RzID0gbXVzdEVuZEFicyxcbiAgICAgIHNyY1BhdGggPSByZXN1bHQucGF0aG5hbWUgJiYgcmVzdWx0LnBhdGhuYW1lLnNwbGl0KCcvJykgfHwgW10sXG4gICAgICByZWxQYXRoID0gcmVsYXRpdmUucGF0aG5hbWUgJiYgcmVsYXRpdmUucGF0aG5hbWUuc3BsaXQoJy8nKSB8fCBbXSxcbiAgICAgIHBzeWNob3RpYyA9IHJlc3VsdC5wcm90b2NvbCAmJiAhc2xhc2hlZFByb3RvY29sW3Jlc3VsdC5wcm90b2NvbF07XG5cbiAgLy8gaWYgdGhlIHVybCBpcyBhIG5vbi1zbGFzaGVkIHVybCwgdGhlbiByZWxhdGl2ZVxuICAvLyBsaW5rcyBsaWtlIC4uLy4uIHNob3VsZCBiZSBhYmxlXG4gIC8vIHRvIGNyYXdsIHVwIHRvIHRoZSBob3N0bmFtZSwgYXMgd2VsbC4gIFRoaXMgaXMgc3RyYW5nZS5cbiAgLy8gcmVzdWx0LnByb3RvY29sIGhhcyBhbHJlYWR5IGJlZW4gc2V0IGJ5IG5vdy5cbiAgLy8gTGF0ZXIgb24sIHB1dCB0aGUgZmlyc3QgcGF0aCBwYXJ0IGludG8gdGhlIGhvc3QgZmllbGQuXG4gIGlmIChwc3ljaG90aWMpIHtcbiAgICByZXN1bHQuaG9zdG5hbWUgPSAnJztcbiAgICByZXN1bHQucG9ydCA9IG51bGw7XG4gICAgaWYgKHJlc3VsdC5ob3N0KSB7XG4gICAgICBpZiAoc3JjUGF0aFswXSA9PT0gJycpIHNyY1BhdGhbMF0gPSByZXN1bHQuaG9zdDtcbiAgICAgIGVsc2Ugc3JjUGF0aC51bnNoaWZ0KHJlc3VsdC5ob3N0KTtcbiAgICB9XG4gICAgcmVzdWx0Lmhvc3QgPSAnJztcbiAgICBpZiAocmVsYXRpdmUucHJvdG9jb2wpIHtcbiAgICAgIHJlbGF0aXZlLmhvc3RuYW1lID0gbnVsbDtcbiAgICAgIHJlbGF0aXZlLnBvcnQgPSBudWxsO1xuICAgICAgaWYgKHJlbGF0aXZlLmhvc3QpIHtcbiAgICAgICAgaWYgKHJlbFBhdGhbMF0gPT09ICcnKSByZWxQYXRoWzBdID0gcmVsYXRpdmUuaG9zdDtcbiAgICAgICAgZWxzZSByZWxQYXRoLnVuc2hpZnQocmVsYXRpdmUuaG9zdCk7XG4gICAgICB9XG4gICAgICByZWxhdGl2ZS5ob3N0ID0gbnVsbDtcbiAgICB9XG4gICAgbXVzdEVuZEFicyA9IG11c3RFbmRBYnMgJiYgKHJlbFBhdGhbMF0gPT09ICcnIHx8IHNyY1BhdGhbMF0gPT09ICcnKTtcbiAgfVxuXG4gIGlmIChpc1JlbEFicykge1xuICAgIC8vIGl0J3MgYWJzb2x1dGUuXG4gICAgcmVzdWx0Lmhvc3QgPSAocmVsYXRpdmUuaG9zdCB8fCByZWxhdGl2ZS5ob3N0ID09PSAnJykgP1xuICAgICAgICAgICAgICAgICAgcmVsYXRpdmUuaG9zdCA6IHJlc3VsdC5ob3N0O1xuICAgIHJlc3VsdC5ob3N0bmFtZSA9IChyZWxhdGl2ZS5ob3N0bmFtZSB8fCByZWxhdGl2ZS5ob3N0bmFtZSA9PT0gJycpID9cbiAgICAgICAgICAgICAgICAgICAgICByZWxhdGl2ZS5ob3N0bmFtZSA6IHJlc3VsdC5ob3N0bmFtZTtcbiAgICByZXN1bHQuc2VhcmNoID0gcmVsYXRpdmUuc2VhcmNoO1xuICAgIHJlc3VsdC5xdWVyeSA9IHJlbGF0aXZlLnF1ZXJ5O1xuICAgIHNyY1BhdGggPSByZWxQYXRoO1xuICAgIC8vIGZhbGwgdGhyb3VnaCB0byB0aGUgZG90LWhhbmRsaW5nIGJlbG93LlxuICB9IGVsc2UgaWYgKHJlbFBhdGgubGVuZ3RoKSB7XG4gICAgLy8gaXQncyByZWxhdGl2ZVxuICAgIC8vIHRocm93IGF3YXkgdGhlIGV4aXN0aW5nIGZpbGUsIGFuZCB0YWtlIHRoZSBuZXcgcGF0aCBpbnN0ZWFkLlxuICAgIGlmICghc3JjUGF0aCkgc3JjUGF0aCA9IFtdO1xuICAgIHNyY1BhdGgucG9wKCk7XG4gICAgc3JjUGF0aCA9IHNyY1BhdGguY29uY2F0KHJlbFBhdGgpO1xuICAgIHJlc3VsdC5zZWFyY2ggPSByZWxhdGl2ZS5zZWFyY2g7XG4gICAgcmVzdWx0LnF1ZXJ5ID0gcmVsYXRpdmUucXVlcnk7XG4gIH0gZWxzZSBpZiAoIXV0aWwuaXNOdWxsT3JVbmRlZmluZWQocmVsYXRpdmUuc2VhcmNoKSkge1xuICAgIC8vIGp1c3QgcHVsbCBvdXQgdGhlIHNlYXJjaC5cbiAgICAvLyBsaWtlIGhyZWY9Jz9mb28nLlxuICAgIC8vIFB1dCB0aGlzIGFmdGVyIHRoZSBvdGhlciB0d28gY2FzZXMgYmVjYXVzZSBpdCBzaW1wbGlmaWVzIHRoZSBib29sZWFuc1xuICAgIGlmIChwc3ljaG90aWMpIHtcbiAgICAgIHJlc3VsdC5ob3N0bmFtZSA9IHJlc3VsdC5ob3N0ID0gc3JjUGF0aC5zaGlmdCgpO1xuICAgICAgLy9vY2NhdGlvbmFseSB0aGUgYXV0aCBjYW4gZ2V0IHN0dWNrIG9ubHkgaW4gaG9zdFxuICAgICAgLy90aGlzIGVzcGVjaWFsbHkgaGFwcGVucyBpbiBjYXNlcyBsaWtlXG4gICAgICAvL3VybC5yZXNvbHZlT2JqZWN0KCdtYWlsdG86bG9jYWwxQGRvbWFpbjEnLCAnbG9jYWwyQGRvbWFpbjInKVxuICAgICAgdmFyIGF1dGhJbkhvc3QgPSByZXN1bHQuaG9zdCAmJiByZXN1bHQuaG9zdC5pbmRleE9mKCdAJykgPiAwID9cbiAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Lmhvc3Quc3BsaXQoJ0AnKSA6IGZhbHNlO1xuICAgICAgaWYgKGF1dGhJbkhvc3QpIHtcbiAgICAgICAgcmVzdWx0LmF1dGggPSBhdXRoSW5Ib3N0LnNoaWZ0KCk7XG4gICAgICAgIHJlc3VsdC5ob3N0ID0gcmVzdWx0Lmhvc3RuYW1lID0gYXV0aEluSG9zdC5zaGlmdCgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQuc2VhcmNoID0gcmVsYXRpdmUuc2VhcmNoO1xuICAgIHJlc3VsdC5xdWVyeSA9IHJlbGF0aXZlLnF1ZXJ5O1xuICAgIC8vdG8gc3VwcG9ydCBodHRwLnJlcXVlc3RcbiAgICBpZiAoIXV0aWwuaXNOdWxsKHJlc3VsdC5wYXRobmFtZSkgfHwgIXV0aWwuaXNOdWxsKHJlc3VsdC5zZWFyY2gpKSB7XG4gICAgICByZXN1bHQucGF0aCA9IChyZXN1bHQucGF0aG5hbWUgPyByZXN1bHQucGF0aG5hbWUgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgICAocmVzdWx0LnNlYXJjaCA/IHJlc3VsdC5zZWFyY2ggOiAnJyk7XG4gICAgfVxuICAgIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBpZiAoIXNyY1BhdGgubGVuZ3RoKSB7XG4gICAgLy8gbm8gcGF0aCBhdCBhbGwuICBlYXN5LlxuICAgIC8vIHdlJ3ZlIGFscmVhZHkgaGFuZGxlZCB0aGUgb3RoZXIgc3R1ZmYgYWJvdmUuXG4gICAgcmVzdWx0LnBhdGhuYW1lID0gbnVsbDtcbiAgICAvL3RvIHN1cHBvcnQgaHR0cC5yZXF1ZXN0XG4gICAgaWYgKHJlc3VsdC5zZWFyY2gpIHtcbiAgICAgIHJlc3VsdC5wYXRoID0gJy8nICsgcmVzdWx0LnNlYXJjaDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnBhdGggPSBudWxsO1xuICAgIH1cbiAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gaWYgYSB1cmwgRU5EcyBpbiAuIG9yIC4uLCB0aGVuIGl0IG11c3QgZ2V0IGEgdHJhaWxpbmcgc2xhc2guXG4gIC8vIGhvd2V2ZXIsIGlmIGl0IGVuZHMgaW4gYW55dGhpbmcgZWxzZSBub24tc2xhc2h5LFxuICAvLyB0aGVuIGl0IG11c3QgTk9UIGdldCBhIHRyYWlsaW5nIHNsYXNoLlxuICB2YXIgbGFzdCA9IHNyY1BhdGguc2xpY2UoLTEpWzBdO1xuICB2YXIgaGFzVHJhaWxpbmdTbGFzaCA9IChcbiAgICAgIChyZXN1bHQuaG9zdCB8fCByZWxhdGl2ZS5ob3N0IHx8IHNyY1BhdGgubGVuZ3RoID4gMSkgJiZcbiAgICAgIChsYXN0ID09PSAnLicgfHwgbGFzdCA9PT0gJy4uJykgfHwgbGFzdCA9PT0gJycpO1xuXG4gIC8vIHN0cmlwIHNpbmdsZSBkb3RzLCByZXNvbHZlIGRvdWJsZSBkb3RzIHRvIHBhcmVudCBkaXJcbiAgLy8gaWYgdGhlIHBhdGggdHJpZXMgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIGB1cGAgZW5kcyB1cCA+IDBcbiAgdmFyIHVwID0gMDtcbiAgZm9yICh2YXIgaSA9IHNyY1BhdGgubGVuZ3RoOyBpID49IDA7IGktLSkge1xuICAgIGxhc3QgPSBzcmNQYXRoW2ldO1xuICAgIGlmIChsYXN0ID09PSAnLicpIHtcbiAgICAgIHNyY1BhdGguc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgc3JjUGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXApIHtcbiAgICAgIHNyY1BhdGguc3BsaWNlKGksIDEpO1xuICAgICAgdXAtLTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0aGUgcGF0aCBpcyBhbGxvd2VkIHRvIGdvIGFib3ZlIHRoZSByb290LCByZXN0b3JlIGxlYWRpbmcgLi5zXG4gIGlmICghbXVzdEVuZEFicyAmJiAhcmVtb3ZlQWxsRG90cykge1xuICAgIGZvciAoOyB1cC0tOyB1cCkge1xuICAgICAgc3JjUGF0aC51bnNoaWZ0KCcuLicpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChtdXN0RW5kQWJzICYmIHNyY1BhdGhbMF0gIT09ICcnICYmXG4gICAgICAoIXNyY1BhdGhbMF0gfHwgc3JjUGF0aFswXS5jaGFyQXQoMCkgIT09ICcvJykpIHtcbiAgICBzcmNQYXRoLnVuc2hpZnQoJycpO1xuICB9XG5cbiAgaWYgKGhhc1RyYWlsaW5nU2xhc2ggJiYgKHNyY1BhdGguam9pbignLycpLnN1YnN0cigtMSkgIT09ICcvJykpIHtcbiAgICBzcmNQYXRoLnB1c2goJycpO1xuICB9XG5cbiAgdmFyIGlzQWJzb2x1dGUgPSBzcmNQYXRoWzBdID09PSAnJyB8fFxuICAgICAgKHNyY1BhdGhbMF0gJiYgc3JjUGF0aFswXS5jaGFyQXQoMCkgPT09ICcvJyk7XG5cbiAgLy8gcHV0IHRoZSBob3N0IGJhY2tcbiAgaWYgKHBzeWNob3RpYykge1xuICAgIHJlc3VsdC5ob3N0bmFtZSA9IHJlc3VsdC5ob3N0ID0gaXNBYnNvbHV0ZSA/ICcnIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyY1BhdGgubGVuZ3RoID8gc3JjUGF0aC5zaGlmdCgpIDogJyc7XG4gICAgLy9vY2NhdGlvbmFseSB0aGUgYXV0aCBjYW4gZ2V0IHN0dWNrIG9ubHkgaW4gaG9zdFxuICAgIC8vdGhpcyBlc3BlY2lhbGx5IGhhcHBlbnMgaW4gY2FzZXMgbGlrZVxuICAgIC8vdXJsLnJlc29sdmVPYmplY3QoJ21haWx0bzpsb2NhbDFAZG9tYWluMScsICdsb2NhbDJAZG9tYWluMicpXG4gICAgdmFyIGF1dGhJbkhvc3QgPSByZXN1bHQuaG9zdCAmJiByZXN1bHQuaG9zdC5pbmRleE9mKCdAJykgPiAwID9cbiAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5ob3N0LnNwbGl0KCdAJykgOiBmYWxzZTtcbiAgICBpZiAoYXV0aEluSG9zdCkge1xuICAgICAgcmVzdWx0LmF1dGggPSBhdXRoSW5Ib3N0LnNoaWZ0KCk7XG4gICAgICByZXN1bHQuaG9zdCA9IHJlc3VsdC5ob3N0bmFtZSA9IGF1dGhJbkhvc3Quc2hpZnQoKTtcbiAgICB9XG4gIH1cblxuICBtdXN0RW5kQWJzID0gbXVzdEVuZEFicyB8fCAocmVzdWx0Lmhvc3QgJiYgc3JjUGF0aC5sZW5ndGgpO1xuXG4gIGlmIChtdXN0RW5kQWJzICYmICFpc0Fic29sdXRlKSB7XG4gICAgc3JjUGF0aC51bnNoaWZ0KCcnKTtcbiAgfVxuXG4gIGlmICghc3JjUGF0aC5sZW5ndGgpIHtcbiAgICByZXN1bHQucGF0aG5hbWUgPSBudWxsO1xuICAgIHJlc3VsdC5wYXRoID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQucGF0aG5hbWUgPSBzcmNQYXRoLmpvaW4oJy8nKTtcbiAgfVxuXG4gIC8vdG8gc3VwcG9ydCByZXF1ZXN0Lmh0dHBcbiAgaWYgKCF1dGlsLmlzTnVsbChyZXN1bHQucGF0aG5hbWUpIHx8ICF1dGlsLmlzTnVsbChyZXN1bHQuc2VhcmNoKSkge1xuICAgIHJlc3VsdC5wYXRoID0gKHJlc3VsdC5wYXRobmFtZSA/IHJlc3VsdC5wYXRobmFtZSA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAocmVzdWx0LnNlYXJjaCA/IHJlc3VsdC5zZWFyY2ggOiAnJyk7XG4gIH1cbiAgcmVzdWx0LmF1dGggPSByZWxhdGl2ZS5hdXRoIHx8IHJlc3VsdC5hdXRoO1xuICByZXN1bHQuc2xhc2hlcyA9IHJlc3VsdC5zbGFzaGVzIHx8IHJlbGF0aXZlLnNsYXNoZXM7XG4gIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuVXJsLnByb3RvdHlwZS5wYXJzZUhvc3QgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGhvc3QgPSB0aGlzLmhvc3Q7XG4gIHZhciBwb3J0ID0gcG9ydFBhdHRlcm4uZXhlYyhob3N0KTtcbiAgaWYgKHBvcnQpIHtcbiAgICBwb3J0ID0gcG9ydFswXTtcbiAgICBpZiAocG9ydCAhPT0gJzonKSB7XG4gICAgICB0aGlzLnBvcnQgPSBwb3J0LnN1YnN0cigxKTtcbiAgICB9XG4gICAgaG9zdCA9IGhvc3Quc3Vic3RyKDAsIGhvc3QubGVuZ3RoIC0gcG9ydC5sZW5ndGgpO1xuICB9XG4gIGlmIChob3N0KSB0aGlzLmhvc3RuYW1lID0gaG9zdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc1N0cmluZzogZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHR5cGVvZihhcmcpID09PSAnc3RyaW5nJztcbiAgfSxcbiAgaXNPYmplY3Q6IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiB0eXBlb2YoYXJnKSA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xuICB9LFxuICBpc051bGw6IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBhcmcgPT09IG51bGw7XG4gIH0sXG4gIGlzTnVsbE9yVW5kZWZpbmVkOiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gYXJnID09IG51bGw7XG4gIH1cbn07XG4iLCJ2YXIgZztcblxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcbmcgPSAoZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzO1xufSkoKTtcblxudHJ5IHtcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXG5cdGcgPSBnIHx8IG5ldyBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XG59IGNhdGNoIChlKSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXG5cdGlmICh0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKSBnID0gd2luZG93O1xufVxuXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGc7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuXHRpZiAoIW1vZHVsZS53ZWJwYWNrUG9seWZpbGwpIHtcblx0XHRtb2R1bGUuZGVwcmVjYXRlID0gZnVuY3Rpb24oKSB7fTtcblx0XHRtb2R1bGUucGF0aHMgPSBbXTtcblx0XHQvLyBtb2R1bGUucGFyZW50ID0gdW5kZWZpbmVkIGJ5IGRlZmF1bHRcblx0XHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJsb2FkZWRcIiwge1xuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBtb2R1bGUubDtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImlkXCIsIHtcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0bW9kdWxlLndlYnBhY2tQb2x5ZmlsbCA9IDE7XG5cdH1cblx0cmV0dXJuIG1vZHVsZTtcbn07XG4iLCJleHBvcnQgZGVmYXVsdCBcIjxkaXYgY2xhc3M9XFxcIndwLXNwYS1sb2FkaW5nLXZpZXdcXFwiPjxkaXYgY2xhc3M9XFxcIndwLXNwYS1sb2FkaW5nLXZpZXdfX3dyYXBcXFwiPjxkaXYgY2xhc3M9XFxcIndwLXNwYS1sb2FkaW5nLXZpZXdfX2ljb25cXFwiPjwvZGl2PjxkaXYgY2xhc3M9XFxcIndwLXNwYS1sb2FkaW5nLXZpZXdfX3Byb2dyZXNzLWJhclxcXCI+PGRpdiBjbGFzcz1cXFwid3Atc3BhLWxvYWRpbmctdmlld19fcHJvZ3Jlc3MtYmFyLXNoYWRvd1xcXCI+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+XCIiLCJpbXBvcnQgKiBhcyAkIGZyb20gJ2pxdWVyeSc7XG5cbmltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAnbW9kdWxlcy9hcHAnO1xuXG4kKGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgYXBwID0gbmV3IEFwcGxpY2F0aW9uKCk7XG59KTtcbiIsImltcG9ydCB7IEFwcFJvdXRlciB9ICAgICAgIGZyb20gJ21vZHVsZXMvbGliL3JvdXRlcic7XG5pbXBvcnQgeyBSZXNvdXJjZU1vbml0b3IgfSBmcm9tICdtb2R1bGVzL3NlcnZpY2VzL3Jlc291cmNlLW1vbml0b3InO1xuaW1wb3J0IHsgQ29uZmlnTG9hZGVyIH0gICAgZnJvbSAnbW9kdWxlcy9zZXJ2aWNlcy9jb25maWctbG9hZGVyJztcbmltcG9ydCB7IENvbnRlbnRMb2FkZXIgfSAgIGZyb20gJ21vZHVsZXMvc2VydmljZXMvY29udGVudC1sb2FkZXInO1xuaW1wb3J0ICogYXMgQ29udHJvbGxlcnMgICAgZnJvbSAnbW9kdWxlcy9jb250cm9sbGVycyc7XG5pbXBvcnQgKiBhcyBWaWV3cyAgICAgICAgICBmcm9tICdtb2R1bGVzL3ZpZXdzJztcbmltcG9ydCB7IE1vZHVsZSB9ICAgICAgICAgIGZyb20gJ21vZHVsZXMvbGliJztcblxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uIGltcGxlbWVudHMgSUFwcGxpY2F0aW9uIHtcbiAgZXZlbnRzID0ge307XG4gICRyb290OiBKUXVlcnk7XG4gICR3aW5kb3c6IEpRdWVyeTxXaW5kb3c+O1xuICBtZXRhOiBJQXBwbGljYXRpb25NZXRhO1xuICBjb25maWdMb2FkZXI6IENvbmZpZ0xvYWRlcjtcbiAgY29udGVudExvYWRlcjogQ29udGVudExvYWRlcjtcbiAgcmVzb3VyY2VNb25pdG9yOiBSZXNvdXJjZU1vbml0b3I7XG4gIHJvdXRlcjogQXBwUm91dGVyO1xuICBwcmV2aW91c1BhdGg6IHN0cmluZztcblxuICB1aUNvbnRyb2xsZXI6IENvbnRyb2xsZXJzLlVJQ29udHJvbGxlcjtcbiAgbWFpbkNvbnRyb2xsZXI6IENvbnRyb2xsZXJzLk1haW5Db250cm9sbGVyO1xuICBodG1sVmlldzogVmlld3MuSFRNTERpcmVjdGl2ZTtcbiAgaGVhZFZpZXc6IFZpZXdzLkhlYWREaXJlY3RpdmU7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBib290c3RyYXBTZWxlY3Rvcjogc3RyaW5nID0gJy5zcGEtY29udGVudCcpIHtcblxuICAgIHRoaXMuYm9vdHN0cmFwKCQodGhpcy5ib290c3RyYXBTZWxlY3RvcikpO1xuICAgIHRoaXMuJHdpbmRvdyA9ICQod2luZG93KTtcbiAgICB0aGlzLm1ldGEgPSB7XG4gICAgICBiYXNlSFJFRjogJCgnaGVhZCBiYXNlJykuYXR0cignaHJlZicpXG4gICAgfTtcblxuICAgIHRoaXMucmVzb3VyY2VNb25pdG9yID0gbmV3IFJlc291cmNlTW9uaXRvcigpO1xuICAgIHRoaXMuY29uZmlnTG9hZGVyID0gbmV3IENvbmZpZ0xvYWRlcih0aGlzKTtcbiAgICB0aGlzLmNvbnRlbnRMb2FkZXIgPSBuZXcgQ29udGVudExvYWRlcih0aGlzKTtcbiAgICB0aGlzLnJvdXRlciA9IG5ldyBBcHBSb3V0ZXIodGhpcywgdGhpcy5tZXRhLmJhc2VIUkVGKTtcblxuICAgIHRoaXMucm91dGVyLm9uKC8uKi8sIChwYXRoKSA9PiB7XG4gICAgICB0aGlzLmVtaXQoJyRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3MnLCBwYXRoLCB0aGlzLnByZXZpb3VzUGF0aCk7XG4gICAgICB0aGlzLnByZXZpb3VzUGF0aCA9IHBhdGg7XG4gICAgfSk7XG5cbiAgICB0aGlzLm1haW5Db250cm9sbGVyID0gbmV3IENvbnRyb2xsZXJzLk1haW5Db250cm9sbGVyKHRoaXMpO1xuICAgIHRoaXMudWlDb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXJzLlVJQ29udHJvbGxlcih0aGlzKTtcbiAgICB0aGlzLmh0bWxWaWV3ID0gbmV3IFZpZXdzLkhUTUxEaXJlY3RpdmUodGhpcyk7XG4gICAgdGhpcy5oZWFkVmlldyA9IG5ldyBWaWV3cy5IZWFkRGlyZWN0aXZlKHRoaXMpO1xuXG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBnZXQgbW9kdWxlcygpOiBNb2R1bGVbXSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMpLm1hcChrZXkgPT4gdGhpc1trZXldKS5maWx0ZXIoaXRlbSA9PiBpdGVtIGluc3RhbmNlb2YgTW9kdWxlKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5tb2R1bGVzLmZvckVhY2gobW9kdWxlID0+IG1vZHVsZS5tb2R1bGVJbml0ICYmIG1vZHVsZS5tb2R1bGVJbml0KCkpXG4gIH1cblxuICAkdGltZW91dChjYWxsYmFjazogRnVuY3Rpb24sIHdhaXQ/OiBudW1iZXIpIHtcbiAgICBpZiAod2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShjYWxsYmFjayBhcyBGcmFtZVJlcXVlc3RDYWxsYmFjaylcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH1cblxuICBvbihldmVudCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLmV2ZW50c1tldmVudF0gPSB0aGlzLmV2ZW50c1tldmVudF0gfHwgW107XG4gICAgdGhpcy5ldmVudHNbZXZlbnRdLnB1c2goe1xuICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgICAgY29udGV4dDogdGhpc1xuICAgIH0pO1xuICB9XG5cbiAgZW1pdChldmVudDogc3RyaW5nLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5ldmVudHNbZXZlbnRdIHx8IFtdO1xuICAgIGxldCBsaXN0ZW5lcklkeCA9IDA7XG4gICAgbGV0IGxpc3RlbmVyID0gbGlzdGVuZXJzW2xpc3RlbmVySWR4XTtcblxuICAgIHdoaWxlIChsaXN0ZW5lcikge1xuICAgICAgbGlzdGVuZXIuY2FsbGJhY2suYXBwbHkobGlzdGVuZXIuY29udGV4dCwgYXJndW1lbnRzKTtcbiAgICAgIGxpc3RlbmVySWR4Kys7XG4gICAgICBsaXN0ZW5lciA9IGxpc3RlbmVyc1tsaXN0ZW5lcklkeF07XG4gICAgfVxuICB9XG5cbiAgYm9vdHN0cmFwKCRyb290OiBKUXVlcnkpIHtcbiAgICBjb25zdCAkY29udGVudFBhZ2UgPSAkcm9vdC5maW5kKCcuc3BhLWNvbnRlbnRfX3BhZ2UnKTtcblxuICAgIHRoaXMuJHJvb3QgPSAkcm9vdDtcbiAgICAkY29udGVudFBhZ2UuY3NzKHsgJ2Rpc3BsYXknOiAnbm9uZScgfSk7XG4gICAgJGNvbnRlbnRQYWdlLnJlbW92ZUNsYXNzKCdzcGEtY29udGVudC0tbm8tanMnKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHBsaWNhdGlvbjtcbiIsImV4cG9ydCAqIGZyb20gJy4vbWFpbi1jb250cm9sbGVyJztcbmV4cG9ydCAqIGZyb20gJy4vdWktY29udHJvbGxlciciLCJpbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ21vZHVsZXMvYXBwJztcblxuaW1wb3J0IHsgTW9kdWxlIH0gICAgICAgICAgZnJvbSAnLi4vbGliL21vZHVsZSc7XG5pbXBvcnQgeyBET01Ob2RlUmVnaXN0ZXIgfSBmcm9tICdtb2R1bGVzL21vZGVscy9kb20tbm9kZS1yZWdpc3Rlcic7XG5cblxuZXhwb3J0IGNsYXNzIE1haW5Db250cm9sbGVyIGV4dGVuZHMgTW9kdWxlIHtcbiAgY29uZmlnOiBJQ29uZmlnTG9hZGVyRGF0YTtcbiAgc2NyaXB0UmVnaXN0ZXI6IERPTU5vZGVSZWdpc3RlciA9IG5ldyBET01Ob2RlUmVnaXN0ZXIoKTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgYXBwOiBBcHBsaWNhdGlvbikge1xuICAgIHN1cGVyKGFwcCk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMuY29uZmlnTG9hZGVyLmdldERlZmF1bHRzKCk7XG4gIH1cblxuICBhc3luYyBtb2R1bGVJbml0KCk6IFByb21pc2U8dm9pZD4ge1xuXG4gICAgYXdhaXQgdGhpcy5jb25maWdMb2FkZXIuZmV0Y2hDb25maWcoKGVyciwgY29uZmlnRGF0YSkgPT4ge1xuICAgICAgdGhpcy5jb25maWcgPSBjb25maWdEYXRhIHx8IHRoaXMuY29uZmlnO1xuXG4gICAgICB0aGlzLiRvbignJGxvY2F0aW9uQ2hhbmdlU3VjY2VzcycsIGFzeW5jIChldmVudCwgdG8sIGZyb20pID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ3JvdXRlOiAlbycsIGV2ZW50LCB0bywgZnJvbSk7XG5cbiAgICAgICAgaWYgKHRvID09PSBmcm9tKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coJ21haW5Db250cm9sbGVyLiRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3MoKSAtIHJvdXRpbmcgdG8gJW8nLCB0byk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5jb250ZW50TG9hZGVyLmdldEhUTUwodG8sIHtcbiAgICAgICAgICB1c2VDYWNoZTogdGhpcy5jb25maWcudXNlQ2FjaGUsXG4gICAgICAgICAgcmV1c2VQYWdlczogdGhpcy5jb25maWcucmV1c2VQYWdlcyxcbiAgICAgICAgICBkb25lOiAoZXJyLCAkRE9NKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybihlcnIpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB7ICRET00gfTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJ21haW5Db250cm9sbGVyLiRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3MoKSAtIHVwZGF0ZScpO1xuXG4gICAgICAgICAgICB0aGlzLiRicm9hZGNhc3QoJ3ZpZXc6dXBkYXRlJywgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLiR3aW5kb3cudHJpZ2dlcigndmlldzp1cGRhdGUnLCBkYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIHVybCBmcm9tICd1cmwnO1xuXG5pbXBvcnQgKiBhcyAkIGZyb20gJ2pxdWVyeSc7XG5cbi8vIGxvY2FsIG1vZHVsZXNcbmltcG9ydCAqIGFzIHV0aWxzICAgICAgZnJvbSAnbW9kdWxlcy9saWIvdXRpbHMnO1xuaW1wb3J0IHsgTW9kdWxlIH0gICAgICBmcm9tICdtb2R1bGVzL2xpYi9tb2R1bGUnO1xuaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICdtb2R1bGVzL2FwcCc7XG5pbXBvcnQgeyBMb2FkaW5nVmlldyB9IGZyb20gJ21vZHVsZXMvdmlld3MvbG9hZGluZyc7XG5cbi8vIGpxdWVyeSBwbHVnaW5zXG5pbXBvcnQgJ21vZHVsZXMvdmlld3MvanF1ZXJ5Lm9uZS1zdHJpY3QnO1xuaW1wb3J0ICdtb2R1bGVzL3ZpZXdzL2pxdWVyeS5wcmVwZW5kZWQtY3NzJztcbmltcG9ydCB7IEFwcFJvdXRlIH0gICAgZnJvbSAnbW9kdWxlcy9saWInO1xuXG5pbnRlcmZhY2UgSVVJQ29udHJvbGxlckZsYWdzIHtcbiAgc2hvd0xvYWRpbmdTY3JlZW4/OiBib29sZWFuO1xuICBhc3luY0FuaW1hdGlvbj86IGJvb2xlYW47XG4gIGVuZm9yY2VTbW9vdGg/OiBib29sZWFuO1xuICB1c2VTY3JlZW5DbGlwPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIFVJQ29udHJvbGxlciBleHRlbmRzIE1vZHVsZSB7XG4gICRib2R5OiBKUXVlcnk8SFRNTEJvZHlFbGVtZW50PjtcbiAgJGNsaWNrYWJsZXM/OiBKUXVlcnk8SFRNTEJvZHlFbGVtZW50W10+O1xuXG4gIGNvbmZpZzogSUNvbmZpZ0xvYWRlckRhdGE7XG4gIGZsYWdzOiBJVUlDb250cm9sbGVyRmxhZ3MgPSB7fTtcbiAgbWFpblNlbGVjdG9yOiBzdHJpbmc7XG4gIGV4ZWM/OiAoY2FsbGJhY2s6IEZ1bmN0aW9uLCB0aW1lPzogbnVtYmVyKSA9PiB2b2lkO1xuICBsb2FkaW5nVmlldzogTG9hZGluZ1ZpZXc7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGFwcDogQXBwbGljYXRpb24pIHtcbiAgICBzdXBlcihhcHApO1xuICAgIHRoaXMuY29uZmlnID0gdXRpbHMuZGVmYXVsdHM8SUNvbmZpZ0xvYWRlckRhdGE+KHRoaXMuY29uZmlnTG9hZGVyLmdldERlZmF1bHRzKCksIHsgdGltZW91dDogMjAwMCB9KTtcbiAgICB0aGlzLiRib2R5ID0gJCgnYm9keScpO1xuXG4gICAgdGhpcy5tYWluU2VsZWN0b3IgPSB0aGlzLmNvbmZpZ0xvYWRlci5nZXRNYWluU2VsZWN0b3IoKTtcbiAgICB0aGlzLmxvYWRpbmdWaWV3ID0gbmV3IExvYWRpbmdWaWV3KHtcbiAgICAgIGluZGljYXRvclR5cGU6IHRoaXMuJHJvb3QuZGF0YSgnd3Atc3BhLWxvYWRlci10eXBlJyksXG4gICAgICBpbmRpY2F0b3JDb2xvcjogdGhpcy4kcm9vdC5kYXRhKCd3cC1zcGEtbG9hZGVyLWNvbG9yJylcbiAgICB9KTtcbiAgfVxuXG4gIG1vZHVsZUluaXQoKSB7XG4gICAgdGhpcy51cGRhdGVDb25maWd1cmF0aW9uKCk7XG5cbiAgICBpZiAodGhpcy5mbGFncy5zaG93TG9hZGluZ1NjcmVlbikge1xuICAgICAgdGhpcy5sb2FkaW5nVmlldy5hcHBlbmRUbyh0aGlzLiRib2R5KTtcblxuICAgICAgLy8gbWFrZSB1c2Ugb2ZmIGNzcyB0cmFuc2l0aW9uIHRvIHNtb290aCBsb2FkaW5nIGludHJvXG4gICAgICB0aGlzLmxvYWRpbmdWaWV3LnNob3coMCk7XG4gICAgICB0aGlzLiR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5sb2FkaW5nVmlldy5zaG93KDUwKTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy5leGVjKCgpID0+IHtcblxuICAgICAgLy8gc2hvdyBhbmltYXRpb24gb24gZmlyc3QgcmVuZGVyXG4gICAgICB0aGlzLmFkZFBhZ2UodGhpcy4kYm9keS5maW5kKCcuc3BhLWNvbnRlbnRfX3BhZ2UnKSwgdGhpcy4kYm9keVswXS5hdHRyaWJ1dGVzLCAoKSA9PiB7XG4gICAgICAgIHRoaXMubG9hZGluZ1ZpZXcuaGlkZSgpO1xuXG4gICAgICAgIC8vIHN0YXJ0IHByZS1jYWNoaW5nXG4gICAgICAgIHRoaXMuY29udGVudExvYWRlci5wcmVDYWNoZSgpO1xuICAgICAgfSk7XG4gICAgfSwgMTIgKiAxMDAwKTtcblxuICAgIHRoaXMuY29uZmlnTG9hZGVyLmZldGNoQ29uZmlnKChlcnIsIGNvbmZpZ0RhdGEpID0+IHtcbiAgICAgIHRoaXMuY29uZmlnID0gdXRpbHMuZGVmYXVsdHMoY29uZmlnRGF0YSwgdGhpcy5jb25maWcpO1xuXG4gICAgICB0aGlzLnVwZGF0ZUNvbmZpZ3VyYXRpb24oKTtcbiAgICAgIHRoaXMuaG9va0ludG9QYWdlKHRoaXMuJGJvZHkpO1xuXG4gICAgICB0aGlzLiRvbignaGVhZDp1cGRhdGUnLCAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAgICAgbGV0ICRET00gPSBkYXRhLiRET00sXG4gICAgICAgICAgJGJvZHkgPSAkRE9NLmZpbmQoJ2JvZHknKSxcbiAgICAgICAgICAkbmV3Q29udGVudCA9ICRib2R5LmZpbmQodGhpcy5tYWluU2VsZWN0b3IpLFxuICAgICAgICAgICRhY3RpdmVDb250ZW50ID0gdGhpcy4kYm9keS5maW5kKHRoaXMubWFpblNlbGVjdG9yKTtcblxuICAgICAgICBjb25zb2xlLmxvZygnYm9keS52aWV3OnVwZGF0ZSAtIG5ldyAkc3BhQ29udGVudDogJW8nLCAkbmV3Q29udGVudCk7XG5cbiAgICAgICAgdGhpcy5sb2FkaW5nVmlldy5zaG93KDApO1xuICAgICAgICB0aGlzLnVuSG9vaygpO1xuICAgICAgICBpZiAodGhpcy5mbGFncy5hc3luY0FuaW1hdGlvbikge1xuICAgICAgICAgIHRoaXMucmVtb3ZlUGFnZSgkYWN0aXZlQ29udGVudCk7XG4gICAgICAgICAgdGhpcy5hZGRQYWdlKCRuZXdDb250ZW50LCAkYm9keVswXS5hdHRyaWJ1dGVzLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvYWRpbmdWaWV3LmhpZGUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZVBhZ2UoJGFjdGl2ZUNvbnRlbnQsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubG9hZGluZ1ZpZXcuc2hvdyg1MCk7XG4gICAgICAgICAgICB0aGlzLmFkZFBhZ2UoJG5ld0NvbnRlbnQsICRib2R5WzBdLmF0dHJpYnV0ZXMsICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nVmlldy5oaWRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBpbnRlcmNlcHRBY3Rpb24oZXZ0KSB7XG4gICAgY29uc29sZS5sb2coJ25nQm9keS5pbnRlcmNlcHRBY3Rpb24oKScpO1xuICAgIGNvbnN0IHRhcmdldEhyZWYgPSBldnQuY3VycmVudFRhcmdldC5ocmVmIHx8IGxvY2F0aW9uLmhyZWY7XG4gICAgY29uc3Qgcm91dGU6IEFwcFJvdXRlID0gdGhpcy5yb3V0ZXIucGFyc2VVUkwodGFyZ2V0SHJlZik7XG5cbiAgICBpZiAocm91dGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCduZ0JvZHkuaW50ZXJjZXB0QWN0aW9uKCkgIC0gcm91dGluZyB0byAlcycsIHV0aWxzLmdldFBhdGhGcm9tVXJsKHRhcmdldEhyZWYpKTtcblxuICAgICAgaWYgKHJvdXRlLnBhdGggPT09ICdAJyAmJiByb3V0ZS5xdWVyeSA9PT0gJ0AnICYmIHJvdXRlLmhhc2ggPT09ICdAJykge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgLy8gYXR0ZW1wdGluZyByb3V0ZSB0byBjdXJyZW50IHBhZ2VcbiAgICAgICAgdGhpcy5zaGFrZSgpO1xuXG4gICAgICB9IGVsc2UgaWYgKHJvdXRlLnBhdGggIT09ICdAJykge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3Qgcm91dGVQYXRoID0gcm91dGUucGF0aCA/IHJvdXRlLnBhdGggYXMgc3RyaW5nIDogJy8nO1xuICAgICAgICB0aGlzLnJvdXRlci5wYXRoKHJvdXRlUGF0aCk7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCduZ0JvZHkuaW50ZXJjZXB0QWN0aW9uKCkgLSBuby1vcCcpO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCduZ0JvZHkuaW50ZXJjZXB0QWN0aW9uKCkgLSBuby1vcCcpO1xuICAgIH1cbiAgfVxuXG5cbiAgdXBkYXRlQW5pbWF0aW9uT3B0aW9ucygpIHtcbiAgICB0aGlzLmZsYWdzLmVuZm9yY2VTbW9vdGggPSBOdW1iZXIodGhpcy5jb25maWcuZW5mb3JjZVNtb290aCkgPT09IDE7XG4gICAgdGhpcy5mbGFncy5hc3luY0FuaW1hdGlvbiA9IE51bWJlcih0aGlzLmNvbmZpZy5hc3luY0FuaW1hdGlvbikgPT09IDE7XG4gICAgdGhpcy5mbGFncy51c2VTY3JlZW5DbGlwID0gTnVtYmVyKHRoaXMuY29uZmlnLnVzZVNjcmVlbkNsaXApID09PSAxO1xuICAgIHRoaXMuZmxhZ3Muc2hvd0xvYWRpbmdTY3JlZW4gPSAhIXRoaXMuJHJvb3QuYXR0cignZGF0YS13cC1zcGEtbG9hZGVyLXR5cGUnKTtcbiAgfVxuXG4gIHVwZGF0ZUV4ZWN1dGlvbk1ldGhvZCgpIHtcbiAgICB0aGlzLmV4ZWMgPSB0aGlzLmZsYWdzLmVuZm9yY2VTbW9vdGggPyB0aGlzLmV4ZWNPbklkbGUgOiB0aGlzLmV4ZWNJbW1lZGlhdGU7XG4gIH1cblxuICB1cGRhdGVDb25maWd1cmF0aW9uKCkge1xuICAgIHRoaXMudXBkYXRlQW5pbWF0aW9uT3B0aW9ucygpO1xuICAgIHRoaXMudXBkYXRlRXhlY3V0aW9uTWV0aG9kKCk7XG4gIH1cblxuICBkZXN0cm95Q2xpY2tPdmVycmlkZXMoKSB7XG4gICAgaWYgKHRoaXMuJGNsaWNrYWJsZXMpIHtcbiAgICAgIHRoaXMuJGNsaWNrYWJsZXMub2ZmKCdjbGljaycsIG51bGwsIGV2dCA9PiB0aGlzLmludGVyY2VwdEFjdGlvbihldnQpKTtcbiAgICB9XG4gICAgZGVsZXRlIHRoaXMuJGNsaWNrYWJsZXM7XG4gIH1cblxuICBjcmVhdGVDbGlja092ZXJyaWRlcygkcGFnZSkge1xuICAgIHRoaXMuJGNsaWNrYWJsZXMgPSAkcGFnZS5maW5kKCdbaHJlZl0nKS5ub3QoJ1tkYXRhLXNwYS1pbml0aWFsaXplZF0nKTtcbiAgICB0aGlzLiRjbGlja2FibGVzLm9uKCdjbGljaycsIGV2dCA9PiB0aGlzLmludGVyY2VwdEFjdGlvbihldnQpKTtcbiAgICB0aGlzLiRjbGlja2FibGVzLmF0dHIoJ2RhdGEtc3BhLWluaXRpYWxpemVkJywgMSk7XG4gIH1cblxuICBzaGFrZSgpIHtcbiAgICB0aGlzLiRyb290Lm9uZVRpbWVvdXQoJ2FuaW1hdGlvbmVuZCcsICgpID0+IHtcbiAgICAgIHRoaXMuJHJvb3QucmVtb3ZlQ2xhc3MoJ3NwYS1jb250ZW50LS1zaGFrZScpO1xuICAgIH0sIDMwMDApO1xuICAgIHRoaXMuJHJvb3QuYWRkQ2xhc3MoJ3NwYS1jb250ZW50LS1zaGFrZScpO1xuICB9XG5cbiAgaG9va0ludG9QYWdlKCRwYWdlKSB7XG4gICAgdGhpcy5jcmVhdGVDbGlja092ZXJyaWRlcygkcGFnZSk7XG4gIH1cblxuICBleGVjT25JZGxlVGltZWQoY2FsbGJhY2ssIGR1cmF0aW9uKSB7XG4gICAgbGV0IGlzQ2FsbGJhY2tDbGVhbiA9IHRydWU7XG4gICAgbGV0IHRpbWVvdXRJZDtcbiAgICBsZXQgc3RyaWN0Q2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICAgIGlmIChpc0NhbGxiYWNrQ2xlYW4pIHtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5yZXNvdXJjZU1vbml0b3Iub25jZShzdHJpY3RDYWxsYmFjayk7XG5cbiAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlzQ2FsbGJhY2tDbGVhbiA9IGZhbHNlO1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9LCBkdXJhdGlvbik7XG4gIH1cblxuICBleGVjT25JZGxlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMucmVzb3VyY2VNb25pdG9yLm9uY2UoY2FsbGJhY2spO1xuICB9XG5cbiAgZXhlY0ltbWVkaWF0ZShjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLiR0aW1lb3V0KGNhbGxiYWNrKTtcbiAgfVxuXG4gIHVuSG9vaygpIHtcbiAgICB0aGlzLmRlc3Ryb3lDbGlja092ZXJyaWRlcygpXG4gIH1cblxuICBhZGRQYWdlKCRwYWdlLCBhdHRycywgY2FsbGJhY2spIHtcbiAgICBsZXQgJHZpZXcgPSAkcGFnZS5maW5kKCcuc3BhLWNvbnRlbnRfX3ZpZXcnKTtcbiAgICBsZXQgYXR0cklkeCA9IDA7XG4gICAgbGV0IGJvZHlDbGFzc2VzO1xuICAgIGxldCBhdHRyO1xuXG4gICAgdGhpcy5ob29rSW50b1BhZ2UoJHBhZ2UpO1xuXG4gICAgbGV0IHN0YXJ0QW5pbWF0aW9uRW5kV2F0Y2ggPSAkcGFnZS5vbmVEZWxheWVkVGltZW91dCgnYW5pbWF0aW9uZW5kJywgKCkgPT4ge1xuICAgICAgdGhpcy4kdGltZW91dCgoKSA9PiB7XG4gICAgICAgIC8vIHJlc3RvcmUgY2xhc3NlcyB0byBub3JtYWxcbiAgICAgICAgdGhpcy4kYm9keS5hdHRyKCdjbGFzcycsIGJvZHlDbGFzc2VzKTtcbiAgICAgICAgJHZpZXcucmVtb3ZlQ2xhc3MoYm9keUNsYXNzZXMpO1xuICAgICAgICAkcGFnZS5yZW1vdmVDbGFzcygnYW5pbWF0ZS1wYWdlLWluJylcbiAgICAgICAgICAuY3NzKHtcblxuICAgICAgICAgICAgJ2FuaW1hdGlvbi1kdXJhdGlvbic6ICcnLFxuICAgICAgICAgICAgJ2FuaW1hdGlvbi1uYW1lJzogJydcbiAgICAgICAgICB9KTtcblxuICAgICAgICBpZiAoY2FsbGJhY2spIGNhbGxiYWNrKCk7XG5cbiAgICAgICAgLy8gaW5pdCBzb21lIGV2ZW50cyBpbiBjYXNlIDNyZC1wYXJ0eSBsaWIgdXNlcyBpdCBmb3IgcmVuZGVyaW5nXG4gICAgICAgIHRoaXMuJHdpbmRvdy5yZXNpemUoKTtcbiAgICAgICAgdGhpcy4kd2luZG93LnNjcm9sbCgpO1xuICAgICAgfSk7XG4gICAgfSwgTnVtYmVyKHRoaXMuY29uZmlnLmFuaW1hdGlvbkluRHVyYXRpb24pICsgdGhpcy5jb25maWcudGltZW91dCk7XG5cbiAgICB3aGlsZSAoYXR0ciA9IGF0dHJzW2F0dHJJZHgrK10pIHtcbiAgICAgIHN3aXRjaCAoYXR0ci5uYW1lKSB7XG4gICAgICAgIGNhc2UgJ2NsYXNzJzpcblxuICAgICAgICAgIC8vIGNvcHkgYm9keSBjbGFzc05hbWVzIHRvIHZpZXcgZWxlbWVudCBhbmQgY2xlYXIgYm9keVxuICAgICAgICAgIC8vIHdlJ2xsIGFkZCB0aGUgY2xhc3NlcyB0byB0aGUgYm9keSBvbmNlIHRoZSBhbmltYXRpb24gaXMgY29tcGxldGVcbiAgICAgICAgICB0aGlzLiRib2R5LmF0dHIoYXR0ci5uYW1lLCAnJyk7XG4gICAgICAgICAgYm9keUNsYXNzZXMgPSBhdHRyLnZhbHVlO1xuICAgICAgICAgICR2aWV3LmFkZENsYXNzKGJvZHlDbGFzc2VzKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRoaXMuJGJvZHkuYXR0cihhdHRyLm5hbWUsIGF0dHIudmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHNldCBwYWdlIHByb3BlcnRpZXNcbiAgICBpZiAodGhpcy5mbGFncy51c2VTY3JlZW5DbGlwKSB7XG4gICAgICAkcGFnZS5hZGRDbGFzcygnYW5pbWF0ZS1wYWdlLWluLS1jbGlwcGVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRwYWdlLnJlbW92ZUNsYXNzKCdhbmltYXRlLXBhZ2UtaW4tLWNsaXBwZWQnKTtcbiAgICB9XG5cbiAgICAkcGFnZS5jc3MoeyAnZGlzcGxheSc6ICdub25lJyB9KVxuICAgICAgLmFkZENsYXNzKCdhbmltYXRlLXBhZ2UtaW4nKTtcblxuICAgIC8vIGF0dGFjaCB0byBkb20gaWYgcGFnZSBpc24ndCBhbHJlYWR5XG4gICAgaWYgKCEoJC5jb250YWlucyhkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsICRwYWdlWzBdKSkpIHtcbiAgICAgIHRoaXMuJHJvb3QucHJlcGVuZCgkcGFnZSk7XG4gICAgfVxuXG4gICAgdGhpcy5leGVjKCgpID0+IHtcblxuICAgICAgLy8ganVtcCB0byB0b3Agb2Ygc2NyZWVuXG4gICAgICAvLyBoZWxwcyBrZWVwIHRyYW5zaXRpb25zIGJldHdlZW4gcGFnZXMgc2VhbWxlc3NcbiAgICAgIHV0aWxzLmp1bXBUbygwKTtcblxuICAgICAgLy8gcmVtb3ZlIGNsaXBwZWQgdmlldyBpZiBuZWVkZWRcbiAgICAgICRwYWdlLnJlbW92ZUNsYXNzKCdhbmltYXRlLXBhZ2UtaW4tLWNsaXBwZWQnKTtcblxuICAgICAgc3RhcnRBbmltYXRpb25FbmRXYXRjaCgpO1xuXG4gICAgICAvLyBwbGF5IGFuaW1hdGlvblxuICAgICAgJHBhZ2UuY3NzKHtcbiAgICAgICAgJ2Rpc3BsYXknOiAnJyxcbiAgICAgICAgJ2FuaW1hdGlvbi1uYW1lJzogdGhpcy5jb25maWcuYW5pbWF0aW9uSW5OYW1lLFxuICAgICAgICAnYW5pbWF0aW9uLWR1cmF0aW9uJzogdGhpcy5jb25maWcuYW5pbWF0aW9uSW5EdXJhdGlvbiArICdtcydcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcmVtb3ZlUGFnZSgkcGFnZSwgY2FsbGJhY2s/KSB7XG4gICAgbGV0ICR2aWV3ID0gJHBhZ2UuZmluZCgnLnNwYS1jb250ZW50X192aWV3Jyk7XG4gICAgbGV0IGJvZHlDbGFzc05hbWVzID0gdGhpcy4kYm9keS5hdHRyKCdjbGFzcycpO1xuXG4gICAgLy8gYWRqdXN0IGZvciBjbGlwcGVkIHZpZXdcbiAgICAvLyBwb3NzaWJseSBwcm92aWRlcyByZWxpZWYgZnJvbSBmbGlja2VyXG4gICAgaWYgKHRoaXMuZmxhZ3MudXNlU2NyZWVuQ2xpcCkge1xuICAgICAgdGhpcy4kcm9vdC5wcmVwZW5kZWRDU1MoW1xuICAgICAgICB7XG4gICAgICAgICAgc2VsZWN0b3I6ICcuYW5pbWF0ZS1wYWdlLW91dC5hbmltYXRlLXBhZ2Utb3V0LS1jbGlwcGVkIC5zcGEtY29udGVudF9fdmlldycsXG4gICAgICAgICAgc3R5bGVzOiB7XG4gICAgICAgICAgICAnbWFyZ2luLXRvcCc6IHRoaXMuJHdpbmRvdy5zY3JvbGxUb3AoKSAqIC0xICsgJ3B4J1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHNlbGVjdG9yOiAnLmFuaW1hdGUtcGFnZS1vdXQuYW5pbWF0ZS1wYWdlLW91dC0tY2xpcHBlZCcsXG4gICAgICAgICAgc3R5bGVzOiB7XG4gICAgICAgICAgICAnYW5pbWF0aW9uLW5hbWUnOiAnbm9uZScsXG4gICAgICAgICAgICAnbWluLWhlaWdodCc6ICcxMDB2aCcsXG4gICAgICAgICAgICAnb3ZlcmZsb3cnOiAnaGlkZGVuJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSk7XG4gICAgICAkcGFnZS5hZGRDbGFzcygnYW5pbWF0ZS1wYWdlLW91dC0tY2xpcHBlZCcpO1xuXG4gICAgICAvLyBqdW1wIHRvIHRvcCBvZiBzY3JlZW5cbiAgICAgIC8vIGhlbHBzIGtlZXAgdHJhbnNpdGlvbnMgYmV0d2VlbiBwYWdlcyBzZWFtbGVzc1xuICAgICAgdXRpbHMuanVtcFRvKDApO1xuICAgIH0gZWxzZSB7XG4gICAgICAkcGFnZS5yZW1vdmVDbGFzcygnYW5pbWF0ZS1wYWdlLW91dC0tY2xpcHBlZCcpO1xuICAgICAgdGhpcy4kcm9vdC5wcmVwZW5kZWRDU1MoW1xuICAgICAgICB7XG4gICAgICAgICAgc2VsZWN0b3I6ICcuYW5pbWF0ZS1wYWdlLW91dCcsXG4gICAgICAgICAgc3R5bGVzOiB7XG4gICAgICAgICAgICAnYW5pbWF0aW9uLW5hbWUnOiAnbm9uZSdcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgIH1cbiAgICAkcGFnZS5hZGRDbGFzcygnYW5pbWF0ZS1wYWdlLW91dCcpO1xuXG4gICAgbGV0IHN0YXJ0QW5pbWF0aW9uRW5kV2F0Y2ggPSAkcGFnZS5vbmVEZWxheWVkVGltZW91dCgnYW5pbWF0aW9uZW5kJywgKCkgPT4ge1xuXG4gICAgICAkcGFnZS5yZW1vdmUoKTtcbiAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soKTtcbiAgICAgIGlmICh0aGlzLmZsYWdzLnVzZVNjcmVlbkNsaXApIHtcbiAgICAgICAgdGhpcy4kcm9vdC5wcmVwZW5kZWRDU1MoJ3JlbW92ZScpO1xuICAgICAgfVxuXG4gICAgfSwgTnVtYmVyKHRoaXMuY29uZmlnLmFuaW1hdGlvbk91dER1cmF0aW9uKSArIHRoaXMuY29uZmlnLnRpbWVvdXQpO1xuXG4gICAgLy8gZHVwbGljYXRlIGJvZHkgY2xhc3NOYW1lcyB0byAkcGFnZSBzY29wZVxuICAgICR2aWV3LmFkZENsYXNzKGJvZHlDbGFzc05hbWVzKTtcblxuICAgIC8vIGFsbG93IG92ZXJmbG93IHJlbmRlcmluZyBmaXJzdFxuICAgIHRoaXMuZXhlYygoKSA9PiB7XG4gICAgICBzdGFydEFuaW1hdGlvbkVuZFdhdGNoKCk7XG4gICAgICAkcGFnZS5jc3Moe1xuICAgICAgICAnYW5pbWF0aW9uLW5hbWUnOiB0aGlzLmNvbmZpZy5hbmltYXRpb25PdXROYW1lLFxuICAgICAgICAnYW5pbWF0aW9uLWR1cmF0aW9uJzogdGhpcy5jb25maWcuYW5pbWF0aW9uT3V0RHVyYXRpb24gKyAnbXMnXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG4iLCJpbXBvcnQgKiBhcyAkIGZyb20gJ2pxdWVyeSc7XG5cbmV4cG9ydCBjbGFzcyBET01QYXJzZXIge1xuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgcGFyc2VGcm9tU3RyaW5nKERPTVN0cmluZzogc3RyaW5nKTogSlF1ZXJ5PEhUTUxFbGVtZW50PiB7XG4gICAgcmV0dXJuICQoRE9NU3RyaW5nKTtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IFRyaWdnZXJlZEV2ZW50ID0gSlF1ZXJ5LlRyaWdnZXJlZEV2ZW50O1xuXG50eXBlIElIaXN0b3J5RXZlbnQgPSBUcmlnZ2VyZWRFdmVudDxXaW5kb3csIFBvcFN0YXRlRXZlbnQ+O1xudHlwZSBJSGlzdG9yeUNoYW5nZUNhbGxiYWNrID0gKGV2dDogSUhpc3RvcnlFdmVudCkgPT4gdm9pZDtcblxuY29uc3QgSElTVE9SWV9DSEFOR0VfRVZFTlQgPSAnc3RhdGVjaGFuZ2UnO1xuXG5leHBvcnQgY2xhc3MgQXBwSGlzdG9yeSB7XG5cbiAgcHJpdmF0ZSAkd2luZG93ID0gJCh3aW5kb3cpO1xuICBwcml2YXRlIGNhbGxiYWNrczogSUhpc3RvcnlDaGFuZ2VDYWxsYmFja1tdID0gW107XG5cbiAgY29uc3RydWN0b3IocHVibGljIGhpc3Rvcnk6IEhpc3RvcnkgPSB3aW5kb3cuaGlzdG9yeSkge1xuICAgIHRoaXMuJHdpbmRvdy5vbihISVNUT1JZX0NIQU5HRV9FVkVOVCwgKGV2ZW50KSA9PiB0aGlzLmV4ZWNDYWxsYmFja3MoZXZlbnQpKTtcbiAgfVxuXG4gIHByaXZhdGUgZXhlY0NhbGxiYWNrcyhldmVudDogVHJpZ2dlcmVkRXZlbnQ8V2luZG93LCBQb3BTdGF0ZUV2ZW50Pikge1xuICAgIHRoaXMuY2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2sgJiYgY2FsbGJhY2soZXZlbnQpKTtcbiAgfVxuXG4gIGdldFN0YXRlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuaGlzdG9yeS5zdGF0ZTtcbiAgfVxuXG4gIHB1c2hTdGF0ZShkYXRhPzogYW55LCB0aXRsZT86IHN0cmluZywgdXJsPzogc3RyaW5nKSB7XG4gICAgdGhpcy5oaXN0b3J5LnB1c2hTdGF0ZShkYXRhLCB0aXRsZSwgdXJsKTtcbiAgICB0aGlzLiR3aW5kb3cudHJpZ2dlcihuZXcgJC5FdmVudChISVNUT1JZX0NIQU5HRV9FVkVOVCwge1xuICAgICAgZGF0YToge1xuICAgICAgICB0aXRsZSxcbiAgICAgICAgdXJsLFxuICAgICAgICAuLi5kYXRhXG4gICAgICB9XG4gICAgfSkpO1xuICB9XG5cbiAgb25DaGFuZ2UoY2FsbGJhY2s/OiBJSGlzdG9yeUNoYW5nZUNhbGxiYWNrKSB7XG4gICAgY29uc3QgY291bnQgPSB0aGlzLmNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICBjb25zdCBpbmRleCA9IGNvdW50IC0gMTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLmNhbGxiYWNrc1tpbmRleF0gPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy4kd2luZG93Lm9mZihISVNUT1JZX0NIQU5HRV9FVkVOVCk7XG4gIH07XG59IiwiZXhwb3J0ICogZnJvbSAnLi9oaXN0b3J5JztcbmV4cG9ydCAqIGZyb20gJy4vdXRpbHMnXG5leHBvcnQgKiBmcm9tICcuL2RvbS1wYXJzZXInXG5leHBvcnQgKiBmcm9tICcuL21vZHVsZSdcbmV4cG9ydCAqIGZyb20gJy4vcm91dGVyJ1xuIiwiaW1wb3J0IHsgQXBwbGljYXRpb24gfSAgICAgZnJvbSAnbW9kdWxlcy9hcHAnO1xuaW1wb3J0IHsgQXBwUm91dGVyIH0gICAgICAgZnJvbSAnbW9kdWxlcy9saWIvcm91dGVyJztcbmltcG9ydCB7IENvbmZpZ0xvYWRlciB9ICAgIGZyb20gJ21vZHVsZXMvc2VydmljZXMvY29uZmlnLWxvYWRlcic7XG5pbXBvcnQgeyBDb250ZW50TG9hZGVyIH0gICBmcm9tICdtb2R1bGVzL3NlcnZpY2VzL2NvbnRlbnQtbG9hZGVyJztcbmltcG9ydCB7IFJlc291cmNlTW9uaXRvciB9IGZyb20gJ21vZHVsZXMvc2VydmljZXMvcmVzb3VyY2UtbW9uaXRvcic7XG5cbmNvbnN0IGRlZmF1bHRFeHRlbmRlZFByb3BzID0gW1xuICAnJHRpbWVvdXQnLFxuICAnJHdpbmRvdycsXG4gICckcm9vdCcsXG4gICdtZXRhJyxcbiAgJ3Jlc291cmNlTW9uaXRvcicsXG4gICdjb25maWdMb2FkZXInLFxuICAnY29udGVudExvYWRlcicsXG4gICdyb3V0ZXInXG5dO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTW9kdWxlIHtcbiAgbWV0YTogSU1vZHVsZU1ldGE7XG4gICR3aW5kb3c6IEpRdWVyeTxJTW9kdWxlRWxlbWVudD47XG4gICRyb290OiBKUXVlcnk8SU1vZHVsZUVsZW1lbnQ+O1xuICByZXNvdXJjZU1vbml0b3I6IFJlc291cmNlTW9uaXRvcjtcbiAgY29uZmlnTG9hZGVyOiBDb25maWdMb2FkZXI7XG4gIGNvbnRlbnRMb2FkZXI6IENvbnRlbnRMb2FkZXI7XG4gIHJvdXRlcjogQXBwUm91dGVyO1xuXG4gIHByZXZpb3VzUGF0aDogc3RyaW5nO1xuICAkdGltZW91dDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgYXBwOiBBcHBsaWNhdGlvbikge1xuICAgIHRoaXMuYXBwID0gYXBwO1xuXG4gICAgZm9yIChsZXQgcHJvcGVydHlOYW1lIG9mIGRlZmF1bHRFeHRlbmRlZFByb3BzKSB7XG4gICAgICB0aGlzW3Byb3BlcnR5TmFtZV0gPSB0aGlzLmFwcFtwcm9wZXJ0eU5hbWVdO1xuICAgIH1cbiAgfVxuXG4gIG1vZHVsZUluaXQ/KCk6IGFueTtcblxuICAkb24oZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5hcHAub24oZXZlbnQsIGNhbGxiYWNrKVxuICB9XG5cbiAgJGJyb2FkY2FzdChldmVudDogc3RyaW5nLCAuLi5kYXRhOiBhbnlbXSkge1xuICAgIHRoaXMuYXBwLmVtaXQoZXZlbnQsIC4uLmRhdGEpXG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIHVybCBmcm9tICd1cmwnO1xuaW1wb3J0ICogYXMgcXMgIGZyb20gJ3F1ZXJ5c3RyaW5nJztcblxuaW1wb3J0IHsgQXBwSGlzdG9yeSB9IGZyb20gJ21vZHVsZXMvbGliL2hpc3RvcnknO1xuaW1wb3J0IEFwcGxpY2F0aW9uICAgIGZyb20gJ21vZHVsZXMvYXBwJztcbmltcG9ydCB7IE1vZHVsZSB9ICAgICBmcm9tICdtb2R1bGVzL2xpYi9tb2R1bGUnO1xuXG5cbmludGVyZmFjZSBJQXBwUm91dGUge1xuICBwYXRoOiBzdHJpbmcgfCAnQCc7XG4gIHF1ZXJ5OiBzdHJpbmcgfCAnQCc7XG4gIGhhc2g6IHN0cmluZyB8ICdAJztcbn1cblxuZXhwb3J0IGNsYXNzIEFwcFJvdXRlIGltcGxlbWVudHMgSUFwcFJvdXRlIHtcbiAgcGF0aDogc3RyaW5nO1xuICBxdWVyeTogc3RyaW5nO1xuICBoYXNoOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoZGF0YTogUGFydGlhbDxBcHBSb3V0ZT4gPSB7fSkge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcywgZGF0YSk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFwcFJvdXRlciBleHRlbmRzIE1vZHVsZSBpbXBsZW1lbnRzIElSb3V0ZXIge1xuICBoaXN0b3J5OiBBcHBIaXN0b3J5ID0gbmV3IEFwcEhpc3RvcnkoKTtcbiAgcm91dGVzOiBJUm91dGVySGFuZGxlcltdID0gW107XG5cbiAgY29uc3RydWN0b3IoYXBwOiBBcHBsaWNhdGlvbiwgcHVibGljIGJhc2U6IHN0cmluZyA9ICcvJykge1xuICAgIHN1cGVyKGFwcCk7XG5cbiAgfVxuXG4gIG1vZHVsZUluaXQoKSB7XG4gICAgdGhpcy5oaXN0b3J5Lm9uQ2hhbmdlKChldnQpID0+IHtcbiAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5oaXN0b3J5LmdldFN0YXRlKCk7XG4gICAgICBjb25zdCBwYXRoID0gc3RhdGUucGF0aDtcblxuICAgICAgY29uc29sZS5sb2coJ3N0YXRlY2hhbmdlOicsIHN0YXRlLCBldnQpO1xuXG4gICAgICBmb3IgKGxldCByb3V0ZUhhbmRsZXIgb2YgdGhpcy5yb3V0ZXMpIHtcbiAgICAgICAgaWYgKHJvdXRlSGFuZGxlci5wYXRoLnRlc3QocGF0aCkpIHtcbiAgICAgICAgICByb3V0ZUhhbmRsZXIuY2FsbGJhY2socGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG9uKHBhdGgsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5yb3V0ZXMucHVzaCh7XG4gICAgICBwYXRoOiBwYXRoLFxuICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgfSlcbiAgfVxuXG4gIHBhdGgocGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgcGF0aFVybCA9IHVybC5yZXNvbHZlKHRoaXMuYmFzZSwgcGF0aCk7XG4gICAgY29uc3QgZGF0YSA9IHsgcGF0aCwgdXJsOiBwYXRoVXJsIH07XG5cbiAgICB0aGlzLmhpc3RvcnkucHVzaFN0YXRlKGRhdGEsIHVuZGVmaW5lZCwgcGF0aFVybCk7XG4gIH1cblxuICBwYXJzZVVSTChocmVmOiBzdHJpbmcsIG9wdGlvbnM6IHsgY2FwdHVyZUFsbD86IGJvb2xlYW4gfSA9IHt9KTogQXBwUm91dGUge1xuICAgIGNvbnN0IHJvdXRlID0gbmV3IEFwcFJvdXRlKCk7XG4gICAgY29uc3QgbG9jYXRpb25IcmVmTWV0YSA9IHVybC5wYXJzZShsb2NhdGlvbi5ocmVmKTtcbiAgICBjb25zdCB0YXJnZXRIcmVmTWV0YTogdXJsLlVybCA9IHVybC5wYXJzZShocmVmKTtcbiAgICBjb25zdCBpc1BhdGhuYW1lQ2hhbmdlID0gbG9jYXRpb25IcmVmTWV0YS5wYXRobmFtZSAhPT0gdGFyZ2V0SHJlZk1ldGEucGF0aG5hbWU7XG4gICAgY29uc3QgaXNRdWVyeUNoYW5nZSA9IGxvY2F0aW9uSHJlZk1ldGEucXVlcnkgIT09IHRhcmdldEhyZWZNZXRhLnF1ZXJ5O1xuICAgIGNvbnN0IGlzSGFzaENoYW5nZSA9IGxvY2F0aW9uSHJlZk1ldGEuaGFzaCAhPT0gdGFyZ2V0SHJlZk1ldGEuaGFzaDtcbiAgICBjb25zdCBpc0FkbWluUm91dGUgPSAvXFwvd3BcXC0oYWRtaW58bG9naW4pXFwvPy8udGVzdCh0YXJnZXRIcmVmTWV0YS5wYXRoKTtcbiAgICBjb25zdCBpc0N1cnJlbnRSb3V0ZSA9IGxvY2F0aW9uLmhyZWYubWF0Y2gobmV3IFJlZ0V4cCh0YXJnZXRIcmVmTWV0YS5wYXRobmFtZSArICdcXC8/JCcpKTtcbiAgICAvLyBhbmltYXRlIGZvciBwYXRoIGNoYW5nZXMuIGFsbG93IG5hdGl2ZSBoYXNoIG90aGVyd2lzZVxuICAgIGNvbnN0IGlzQ2FwdHVyZWRSb3V0ZSA9IG9wdGlvbnMuY2FwdHVyZUFsbFxuICAgICAgfHwgaXNQYXRobmFtZUNoYW5nZVxuICAgICAgfHwgdGhpcy5jb250ZW50TG9hZGVyLmhhc1BhZ2VTeW5jKGhyZWYpXG4gICAgICB8fCB0aGlzLmNvbnRlbnRMb2FkZXIuaGFzUG9zdFN5bmMoaHJlZik7XG5cblxuICAgIHJvdXRlLmhhc2ggPSBpc0hhc2hDaGFuZ2UgPyB0YXJnZXRIcmVmTWV0YS5oYXNoIDogJ0AnO1xuICAgIHJvdXRlLnF1ZXJ5ID0gaXNRdWVyeUNoYW5nZSA/IHRhcmdldEhyZWZNZXRhLnNlYXJjaCA6ICdAJztcblxuICAgIGlmIChpc0FkbWluUm91dGUpIHtcbiAgICAgIHJldHVybiByb3V0ZTtcbiAgICB9XG5cbiAgICBpZiAoaXNDYXB0dXJlZFJvdXRlKSB7XG4gICAgICByb3V0ZS5wYXRoID0gdGFyZ2V0SHJlZk1ldGEucGF0aG5hbWU7XG4gICAgfVxuXG4gICAgaWYgKGlzQ3VycmVudFJvdXRlKSB7XG4gICAgICByb3V0ZS5wYXRoID0gJ0AnO1xuICAgIH1cblxuICAgIHJldHVybiByb3V0ZTtcbiAgfVxuXG4gIHBhcnNlUXVlcnlQYXJhbXMocm91dGVRdWVyeTogc3RyaW5nKTogcXMuUGFyc2VkVXJsUXVlcnkge1xuICAgIHJldHVybiBxcy5wYXJzZSgvXlxcPy8udGVzdChyb3V0ZVF1ZXJ5KSA/IHJvdXRlUXVlcnkgOiBgPyR7cm91dGVRdWVyeX1gKTtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgdXJsICAgICBmcm9tICd1cmwnO1xuaW1wb3J0ICogYXMgJCAgICAgICAgICAgIGZyb20gJ2pxdWVyeSc7XG5cbmltcG9ydCB7IERPTVBhcnNlciB9IGZyb20gJy4vZG9tLXBhcnNlcic7XG5cbmNvbnN0IHNpdGVVUkwgPSAkKCdoZWFkIGJhc2UnKS5hdHRyKCdocmVmJyk7XG5jb25zdCBzaXRlVVJMTWV0YSA9IHVybC5wYXJzZShzaXRlVVJMKTtcbmNvbnN0IGRvbVBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvb2tpZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIGRheXM6IG51bWJlcikge1xuICBsZXQgZXhwaXJlczogc3RyaW5nID0gJyc7XG5cbiAgaWYgKGRheXMpIHtcbiAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgZGF0ZS5zZXRUaW1lKGRhdGUuZ2V0VGltZSgpICsgKGRheXMgKiAyNCAqIDYwICogNjAgKiAxMDAwKSk7XG4gICAgZXhwaXJlcyA9ICc7IGV4cGlyZXM9JyArIGRhdGUudG9VVENTdHJpbmcoKTtcbiAgfVxuXG4gIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyAnPScgKyB2YWx1ZSArIGV4cGlyZXMgKyAnOyBwYXRoPS8nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVhZENvb2tpZShuYW1lOiBzdHJpbmcpIHtcbiAgbGV0IG5hbWVFUSA9IG5hbWUgKyAnPSc7XG4gIGxldCBjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgYyA9IGNhW2ldO1xuICAgIHdoaWxlIChjLmNoYXJBdCgwKSA9PSAnICcpIGMgPSBjLnN1YnN0cmluZygxLCBjLmxlbmd0aCk7XG4gICAgaWYgKGMuaW5kZXhPZihuYW1lRVEpID09IDApIHJldHVybiBjLnN1YnN0cmluZyhuYW1lRVEubGVuZ3RoLCBjLmxlbmd0aCk7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVyYXNlQ29va2llKG5hbWUpIHtcbiAgbGV0IHZhbHVlID0gJyc7XG4gIGxldCBleHBpcmVzOiBzdHJpbmcgPSAnJztcblxuICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgJz0nICsgdmFsdWUgKyBleHBpcmVzICsgJzsgcGF0aD0vJztcbn1cblxuaW50ZXJmYWNlIElTY3JvbGxPcHRpb25zIGV4dGVuZHMgSlF1ZXJ5LkVmZmVjdHNPcHRpb25zPEhUTUxFbGVtZW50PiB7XG4gIGR1cmF0aW9uPzogbnVtYmVyO1xuICBjYWxsYmFjaz86IEZ1bmN0aW9uO1xuICBjb250ZXh0PzogYW55O1xuICBhcmd1bWVudHM/OiBBcnJheTxhbnk+O1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0gJHRhcmdldCB7alF1ZXJ5fE51bWJlcn1cbiAqIEBwYXJhbSBvcHRpb25zIHtvYmplY3R9IC0ge2R1cmF0aW9uLCBjYWxsYmFjaywgY29udGV4dH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjcm9sbFRvKCR0YXJnZXQsIG9wdGlvbnM6IElTY3JvbGxPcHRpb25zKSB7XG4gIGxldCBhbmltYXRlT3B0aW9ucyA9IHtcbiAgICAgIGR1cmF0aW9uOiBvcHRpb25zICYmIG9wdGlvbnMuZHVyYXRpb24gPyBvcHRpb25zLmR1cmF0aW9uIDogNjAwXG4gICAgfSwgY2FsbGJhY2tDb3VudCA9IDEsXG4gICAgc2Nyb2xsVG9wID0gJHRhcmdldC5vZmZzZXQgPyAoJHRhcmdldC5vZmZzZXQoKS50b3AgLSAkKCdoZWFkZXInKS5oZWlnaHQoKSArIDIpIDogJHRhcmdldDtcbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5jYWxsYmFjaykge1xuICAgIGFuaW1hdGVPcHRpb25zWydjb21wbGV0ZSddID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGNhbGxiYWNrQ291bnQtLSkge1xuICAgICAgICBvcHRpb25zLmNhbGxiYWNrLmFwcGx5KG9wdGlvbnMuY29udGV4dCwgb3B0aW9ucy5hcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG4gICAgc2Nyb2xsVG9wOiBzY3JvbGxUb3AvLyArMiBmb3IgZ29vZCBtZWFzdXJlXG4gIH0sIHsgZHVyYXRpb246IDYwMCwgLi4uYW5pbWF0ZU9wdGlvbnMgfSk7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSAkdGFyZ2V0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBqdW1wVG8oJHRhcmdldCkge1xuICBsZXQgc2Nyb2xsVG9wID0gJHRhcmdldC5vZmZzZXQgPyAoJHRhcmdldC5vZmZzZXQoKS50b3AgLSAkKCdoZWFkZXInKS5oZWlnaHQoKSArIDIpIDogJHRhcmdldDtcbiAgJCgnaHRtbCwgYm9keScpLnNjcm9sbFRvcCgoc2Nyb2xsVG9wIDwgMCkgPyAwIDogc2Nyb2xsVG9wKTsgLy8gKzIgZm9yIGdvb2QgbWVhc3VyZVxufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0gaHRtbFxuICogQHBhcmFtIG9wdGlvbnNcbiAqIEByZXR1cm5zIHsqfGpRdWVyeXxIVE1MRWxlbWVudH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRE9NU3RyaW5nKGh0bWwsIG9wdGlvbnMpIHtcbiAgbGV0IG9wdHMgPSBkZWZhdWx0cyh7XG4gICAgc2FmZW1vZGU6IHRydWVcbiAgfSwgb3B0aW9ucyk7XG4gIGlmIChvcHRzLnNhZmVtb2RlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGxldCBET00gPSBkb21QYXJzZXIucGFyc2VGcm9tU3RyaW5nKGh0bWwpO1xuICAgICAgcmV0dXJuICQoRE9NKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgcmV0dXJuICQoaHRtbCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiAkKGRvbVBhcnNlci5wYXJzZUZyb21TdHJpbmcoaHRtbCkpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDdXJyZW50UGF0aCgpIHtcbiAgcmV0dXJuIGxvY2F0aW9uLnBhdGhuYW1lLnN1YnN0cihnZXRSb290UGF0aCh7IHRyYWlsaW5nU2xhc2g6IGZhbHNlIH0pLmxlbmd0aCk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgcm9vdCBwYXRoXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nU2xhc2ggPSB0cnVlXVxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJvb3RQYXRoKG9wdGlvbnM6IHsgdHJhaWxpbmdTbGFzaDogYm9vbGVhbiB9ID0geyB0cmFpbGluZ1NsYXNoOiB0cnVlIH0pIHtcbiAgcmV0dXJuIHNpdGVVUkxNZXRhLnBhdGhuYW1lICsgKChvcHRpb25zICYmIG9wdGlvbnMudHJhaWxpbmdTbGFzaCA9PT0gZmFsc2UpID8gJycgOiAnLycpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Um9vdFVybCgpIHtcbiAgcmV0dXJuIHNpdGVVUkw7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSByZXF1ZXN0VVJMXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGF0aEZyb21VcmwocmVxdWVzdFVSTCkge1xuICBjb25zdCBkb21haW5VcmwgPSBnZXRSb290VXJsKCk7XG4gIGNvbnN0IHBhdGhTdGFydEluZGV4ID0gcmVxdWVzdFVSTC5pbmRleE9mKGRvbWFpblVybCkgKyBkb21haW5VcmwubGVuZ3RoO1xuXG4gIHJldHVybiByZXF1ZXN0VVJMLnN1YnN0cihwYXRoU3RhcnRJbmRleCk7XG59XG5cbi8qKlxuICogU2FuaXRpemVzIGEgcGF0aC91cmwgYWthIGFkZHMgdHJhaWxpbmcgc2xhc2ggaWYgbmVlZCBiZSB0byBhbnkgcGF0aFxuICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3RVUkxcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZVVybChyZXF1ZXN0VVJMOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gL1xcLyQvLnRlc3QocmVxdWVzdFVSTCkgPyBgJHtyZXF1ZXN0VVJMfS9gIDogcmVxdWVzdFVSTDtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3RVUkxcbiAqIEByZXR1cm5zIHsqfGpRdWVyeXxIVE1MRWxlbWVudH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvYWRDc3MocmVxdWVzdFVSTCkge1xuICBsZXQgJGxpbmsgPSAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKSk7XG4gICRsaW5rLmF0dHIoe1xuICAgIHJlbDogJ3N0eWxlc2hlZXQnLFxuICAgIHR5cGU6ICd0ZXh0L2NzcycsXG4gICAgaHJlZjogcmVxdWVzdFVSTFxuICB9KTtcbiAgJGxpbmsuYXBwZW5kVG8oJ2hlYWQnKTtcbiAgcmV0dXJuICRsaW5rO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbWluXG4gKiBAcGFyYW0ge051bWJlcn0gbWF4XG4gKiBAcmV0dXJucyB7TnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmFuZChtaW4sIG1heCkge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRzPFQgPSBhbnk+KC4uLmFyZ3M6IEFycmF5PFBhcnRpYWw8VD4+KTogVCB7XG4gIGxldCBpZHggPSAwO1xuICBsZXQgYmFzZSA9IGFyZ3VtZW50c1tpZHgrK10gfHwge307XG4gIGxldCBuZXh0O1xuICBsZXQga2V5O1xuXG4gIGRvIHtcbiAgICBuZXh0ID0gYXJnc1tpZHgrK107XG4gICAgZm9yIChrZXkgaW4gbmV4dCkge1xuICAgICAgaWYgKG5leHQuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBiYXNlW2tleV0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGJhc2Vba2V5XSA9IG5leHRba2V5XVxuICAgICAgfVxuICAgIH1cbiAgfSB3aGlsZSAobmV4dCk7XG4gIHJldHVybiBiYXNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FwaXRhbGl6ZSh0ZXh0OiBzdHJpbmcpIHtcbiAgcmV0dXJuIHRleHRbMF0udG9VcHBlckNhc2UoKSArIHRleHQuc3Vic3RyKDEpO1xufVxuIiwiZXhwb3J0IGNsYXNzIERPTU5vZGVSZWdpc3RlciB7XG4gICAgcmVnaXN0cnk6IElSZWdpc3RlckVudHJ5W107XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5yZWdpc3RyeSA9IFtdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtSZWdpc3RlckVudHJ5fSByZWdFbnRyeVxuICAgICAqL1xuICAgIGNvbnRhaW5zKHJlZ0VudHJ5OiBJUmVnaXN0ZXJFbnRyeSkge1xuICAgICAgICBjb25zdCByZWdFbnRyeUlkID0gcmVnRW50cnkuZ2V0SWQoKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICBsZXQgaWR4ID0gMDtcblxuICAgICAgICB3aGlsZSAodGhpcy5yZWdpc3RyeVtpZHhdICYmICFyZXN1bHQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnJlZ2lzdHJ5W2lkeF0uZ2V0SWQoKSA9PSByZWdFbnRyeUlkKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWR4Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVnaXN0ZXJFbnRyeX0gcmVnRW50cnlcbiAgICAgKi9cbiAgICBhZGQocmVnRW50cnk6IElSZWdpc3RlckVudHJ5KSB7XG4gICAgICAgIGlmICghdGhpcy5jb250YWlucyhyZWdFbnRyeSkpIHtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0cnkucHVzaChyZWdFbnRyeSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgKiBhcyAkIGZyb20gJ2pxdWVyeSc7XG5cbmV4cG9ydCBjbGFzcyBSZWdpc3RlckVudHJ5IGltcGxlbWVudHMgSVJlZ2lzdGVyRW50cnkge1xuICAgIG1ldGE6IGFueTtcbiAgICBlbDogSFRNTFNjcmlwdEVsZW1lbnQ7XG4gICAgJGVsOiBKUXVlcnk8SFRNTFNjcmlwdEVsZW1lbnQ+O1xuXG4gICAgY29uc3RydWN0b3Ioc2NyaXB0RE9NTm9kZTogSFRNTFNjcmlwdEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5tZXRhID0ge307XG4gICAgICAgIHRoaXMuZWwgPSBzY3JpcHRET01Ob2RlO1xuICAgICAgICB0aGlzLiRlbCA9ICQoc2NyaXB0RE9NTm9kZSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgUmVnaXN0ZXJFbnRyeSB9IGZyb20gJy4vcmVnaXN0ZXItZW50cnknO1xuXG5leHBvcnQgY2xhc3MgU2NyaXB0UmVnaXN0ZXJFbnRyeSBleHRlbmRzIFJlZ2lzdGVyRW50cnkgaW1wbGVtZW50cyBJUmVnaXN0ZXJFbnRyeSB7XG5cbiAgICBnZXRJZCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5lbC5zcmMgfHwgdGhpcy4kZWwuaHRtbCgpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFJlZ2lzdGVyRW50cnkgfSBmcm9tICcuL3JlZ2lzdGVyLWVudHJ5JztcblxuZXhwb3J0IGNsYXNzIFN0eWxlUmVnaXN0ZXJFbnRyeSBleHRlbmRzIFJlZ2lzdGVyRW50cnkgaW1wbGVtZW50cyBJUmVnaXN0ZXJFbnRyeSB7XG5cbiAgICBnZXRJZCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy4kZWwuYXR0cignaHJlZicpIHx8IHRoaXMuJGVsLmh0bWwoKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgKiBhcyAkIGZyb20gJ2pxdWVyeSc7XG5cbmltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAnbW9kdWxlcy9hcHAnO1xuaW1wb3J0IHsgTW9kdWxlIH0gICAgICBmcm9tICcuLi9saWIvbW9kdWxlJztcbmltcG9ydCAqIGFzIHV0aWxzICAgICAgZnJvbSAnbW9kdWxlcy9saWIvdXRpbHMnO1xuXG5leHBvcnQgdHlwZSBDb25maWdMb2FkZXJDYWxsYmFjayA9IChlcnJvcjogRXJyb3IgfCBudWxsLCBkYXRhPzogSUNvbmZpZ0xvYWRlckRhdGEpID0+IGFueTtcblxuZXhwb3J0IGNsYXNzIENvbmZpZ0xvYWRlciBleHRlbmRzIE1vZHVsZSB7XG4gIHByaXZhdGUgX3N0YXRlOiBJQ29uZmlnTG9hZGVyU3RhdGU7XG4gIHByaXZhdGUgX2RhdGE6IElDb25maWdMb2FkZXJEYXRhO1xuICBjb25maWdVUkw6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcGxpY2F0aW9uKSB7XG4gICAgc3VwZXIoYXBwKTtcbiAgICB0aGlzLl9zdGF0ZSA9IHtcbiAgICAgIGZsYWc6IHVuZGVmaW5lZFxuICAgIH07XG5cbiAgICAvLyB1c2UgZGVmYXVsdHMgZm9yIG5vd1xuICAgIHRoaXMuX2RhdGEgPSB0aGlzLmdldERlZmF1bHRzKCk7XG5cbiAgICB0aGlzLmNvbmZpZ1VSTCA9IHV0aWxzLmdldFJvb3RVcmwoKSArICc/d3Bfc3BhX2NvbmZpZz0nICsgRGF0ZS5ub3coKTtcbiAgfVxuXG4gIGdldE1haW5TZWxlY3RvcigpOiBzdHJpbmcge1xuICAgIHJldHVybiAnLnNwYS1jb250ZW50X19wYWdlJztcbiAgfVxuXG4gIGdldERlZmF1bHRzKCk6IElDb25maWdMb2FkZXJEYXRhIHtcbiAgICByZXR1cm4ge1xuICAgICAgbG9hZGluZ1NjcmVlblR5cGU6ICdJY29uJyxcbiAgICAgIGFuaW1hdGlvbkluTmFtZTogJ3BhZ2VJbicsXG4gICAgICBhbmltYXRpb25PdXROYW1lOiAncGFnZU91dCcsXG4gICAgICBhbmltYXRpb25JbkR1cmF0aW9uOiA0MDAsXG4gICAgICBhbmltYXRpb25PdXREdXJhdGlvbjogNDAwLFxuICAgICAgcmV1c2VQYWdlczogMCxcbiAgICAgIHVzZUNhY2hlOiAxLFxuICAgICAgdXNlU2NyZWVuQ2xpcDogMCxcbiAgICAgIHNob3dMb2FkaW5nU2NyZWVuOiAxLFxuICAgICAgYXN5bmNBbmltYXRpb246IDAsXG4gICAgICBjYXB0dXJlQWxsOiAxXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgX2NoZWNrQW5pbWF0aW9uUmVzb3VyY2UoY2FsbGJhY2s6IENvbmZpZ0xvYWRlckNhbGxiYWNrKSB7XG4gICAgYXdhaXQgJC5hamF4KHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICdodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9hbmltYXRlLmNzcy8zLjUuMi9hbmltYXRlLmNzcycsXG4gICAgICBjb21wbGV0ZTogKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIHRoaXMuX3N0YXRlLmZsYWcgPSByZXNwb25zZS5zdGF0dXMgPj0gMjAwICYmIHJlc3BvbnNlLnN0YXR1cyA8IDQwMCA/ICdub3JtYWwnIDogJ2RlZmF1bHQtb25seSc7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja11cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmZvcmNlVXBkYXRlXVxuICAgKi9cbiAgYXN5bmMgZmV0Y2hDb25maWcoY2FsbGJhY2s6IENvbmZpZ0xvYWRlckNhbGxiYWNrLCBvcHRpb25zPzogeyBmb3JjZVVwZGF0ZT86IGJvb2xlYW4gfSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IG9wdHMgPSB1dGlscy5kZWZhdWx0cyhvcHRpb25zLCB7fSk7XG5cbiAgICBpZiAob3B0cy5mb3JjZVVwZGF0ZSkgdGhpcy5fc3RhdGUuZmxhZyA9ICd1cGRhdGUtb25seSc7XG4gICAgaWYgKCF0aGlzLl9zdGF0ZS5mbGFnKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY2hlY2tBbmltYXRpb25SZXNvdXJjZShhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHRoaXMuZmV0Y2hDb25maWcoY2FsbGJhY2ssIG9wdGlvbnMpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKHRoaXMuX3N0YXRlLmZsYWcpIHtcbiAgICAgIGNhc2UgJ2xvYWRlZCc6XG4gICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2sobnVsbCwgdGhpcy5fZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGVmYXVsdC1vbmx5JzpcbiAgICAgICAgdGhpcy5fZGF0YSA9IHRoaXMuZ2V0RGVmYXVsdHMoKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjayhudWxsLCB0aGlzLmdldERlZmF1bHRzKCkpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3VwZGF0ZS1vbmx5JzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGF3YWl0ICQuYWpheCh7XG4gICAgICAgICAgdXJsOiB0aGlzLmNvbmZpZ1VSTCxcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgIHN1Y2Nlc3M6IChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fZGF0YSA9ICQuZXh0ZW5kKHRoaXMuX2RhdGEsIEpTT04ucGFyc2UocmVzcG9uc2UpKTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLl9zdGF0ZS5mbGFnKSB7XG4gICAgICAgICAgICAgIHRoaXMuX3N0YXRlLmZsYWcgPSAnbG9hZGVkJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaG90Zml4IHRvIGNoZWNrIGZvciB2YWxpZCBjb25maWdcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICBjb25zdCBjYWxsYmFja0RhdGEgPSB0aGlzLl9kYXRhLmFuaW1hdGlvbkluTmFtZSA/IHRoaXMuX2RhdGEgOiB0aGlzLmdldERlZmF1bHRzKCk7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGNhbGxiYWNrRGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBlcnJvcjogKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCdDb3VsZCBub3QgZmV0Y2ggY29uZmlnJyksIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbiIsImltcG9ydCAqIGFzICQgICBmcm9tICdqcXVlcnknO1xuaW1wb3J0ICogYXMgdXJsIGZyb20gJ3VybCc7XG5cbmltcG9ydCAqIGFzIHV0aWxzICAgICAgZnJvbSAnLi4vbGliL3V0aWxzJztcbmltcG9ydCB7IE1vZHVsZSB9ICAgICAgZnJvbSAnLi4vbGliL21vZHVsZSc7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ21vZHVsZXMvYXBwJztcbmltcG9ydCB7IGNhcGl0YWxpemUgfSAgZnJvbSAnLi4vbGliL3V0aWxzJztcblxuaW50ZXJmYWNlIElDYWxsYmFja09wdGlvbnMge1xuICBkb25lPzogRnVuY3Rpb247XG4gIGNvbnRleHQ/OiBhbnk7XG59XG5cbmV4cG9ydCBjbGFzcyBDb250ZW50TG9hZGVyIGV4dGVuZHMgTW9kdWxlIHtcbiAgZGF0YTogSUNvbnRlbnRMb2FkZXJEYXRhUmVnaXN0cnkgPSB7XG4gICAgcGFnZXM6IFtdLFxuICAgIHBvc3RzOiBbXSxcbiAgICBpc1JlYWR5OiBmYWxzZVxuICB9O1xuICBwcml2YXRlIF9jYWNoZTogSUNvbnRlbnRMb2FkZXJDYWNoZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgYXBwOiBBcHBsaWNhdGlvbikge1xuICAgIHN1cGVyKGFwcCk7XG4gICAgdGhpcy5fY2FjaGUgPSB7fTtcbiAgfVxuXG4gIG1vZHVsZUluaXQoKSB7XG4gICAgdGhpcy5kb3dubG9hZFNpdGVNYXAoKTtcbiAgfVxuXG4gIGdldDxUIGV4dGVuZHMga2V5b2YgSUNvbnRlbnRMb2FkZXJEYXRhUmVnaXN0cnkgPSBrZXlvZiBJQ29udGVudExvYWRlckRhdGFSZWdpc3RyeT4ocGF0aDogVCk6IElDb250ZW50TG9hZGVyRGF0YVJlZ2lzdHJ5W1RdIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhW3BhdGhdO1xuICB9XG5cbiAgc2V0KHBhdGgsIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVtwYXRoXSA9IHZhbHVlO1xuICB9XG5cbiAgaXNSZWFkeSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoJ2lzUmVhZHknKTtcbiAgfVxuXG4gIHByZUNhY2hlKGlkeDogbnVtYmVyID0gMCkge1xuICAgIGNvbnN0IHBvc3RzID0gdGhpcy5nZXQoJ3Bvc3RzJyk7XG4gICAgY29uc3Qgcm91dGUgPSBwb3N0c1tpZHhdO1xuXG4gICAgaWYgKHJvdXRlKSB7XG4gICAgICB0aGlzLmdldEhUTUwodXJsLnBhcnNlKHJvdXRlKS5wYXRobmFtZSwgeyB1c2VDYWNoZTogdHJ1ZSB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5nZXQoJ3Bvc3RzJylbaWR4ICsgMV0gPyB0aGlzLnByZUNhY2hlKGlkeCArIDEpIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gcm91dGVcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnVzZUNhY2hlPWZhbHNlXVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnJldXNlUGFnZXM9ZmFsc2VdXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmRvbmVdXG4gICAqL1xuICBhc3luYyBnZXRIVE1MKHJvdXRlLCBvcHRpb25zKSB7XG4gICAgY29uc3Qgb3B0cyA9IHV0aWxzLmRlZmF1bHRzKG9wdGlvbnMsIHt9KTtcblxuICAgIGlmIChvcHRzLnVzZUNhY2hlICYmIHRoaXMuX2NhY2hlW3JvdXRlXSkge1xuICAgICAgdmFyICRET00gPSBvcHRzLnJldXNlUGFnZXMgPyB0aGlzLl9jYWNoZVtyb3V0ZV0gOiB0aGlzLl9jYWNoZVtyb3V0ZV0uY2xvbmUoKTtcbiAgICAgIGNvbnNvbGUubG9nKCdzcGFDb250ZW50Ll9jYWNoZVslc10gPSAoJU8pJywgcm91dGUsICRET00pO1xuICAgICAgaWYgKG9wdHMuZG9uZSkgb3B0cy5kb25lLmNhbGwobnVsbCwgbnVsbCwgJERPTSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3YWl0ICQuYWpheCh7XG4gICAgICAgIHVybDogL15odHRwLy50ZXN0KHJvdXRlKSA/IHJvdXRlIDogdXJsLnJlc29sdmUodGhpcy5tZXRhLmJhc2VIUkVGLCByb3V0ZSksXG4gICAgICAgIHN1Y2Nlc3M6IChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IF9ET00gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdodG1sJyk7XG4gICAgICAgICAgX0RPTS5pbm5lckhUTUwgPSByZXNwb25zZTtcbiAgICAgICAgICBjb25zdCAkRE9NID0gJChfRE9NKTtcbiAgICAgICAgICBpZiAob3B0cy51c2VDYWNoZSkge1xuICAgICAgICAgICAgdGhpcy5fY2FjaGVbcm91dGVdID0gJERPTTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG9wdHMuZG9uZSkge1xuICAgICAgICAgICAgb3B0cy5kb25lLmNhbGwobnVsbCwgbnVsbCwgb3B0cy5yZXVzZVBhZ2VzID8gJERPTSA6ICRET00uY2xvbmUoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgaWYgKG9wdHMuZG9uZSkge1xuICAgICAgICAgICAgb3B0cy5kb25lLmNhbGwobnVsbCwgbmV3IEVycm9yKCdzcGFDb250ZW50Lmh0dHAuZ2V0KFwiJyArIHJvdXRlICsgJ1wiKSAtIEZhaWxlZDonICsgcmVzcG9uc2UpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmRvbmVdXG4gICAqL1xuICBhc3luYyBkb3dubG9hZFNpdGVNYXAob3B0aW9ucz86IElDYWxsYmFja09wdGlvbnMpIHtcbiAgICB2YXIgX29wdGlvbnMgPSB1dGlscy5kZWZhdWx0cyhvcHRpb25zLCB7XG4gICAgICAgIGNvbnRleHQ6IHRoaXNcbiAgICAgIH0pLFxuICAgICAgc2l0ZU1hcFVSTCA9IHV0aWxzLmdldFJvb3RVcmwoKSArICc/d3Bfc3BhX3NpdGVtYXAnO1xuXG4gICAgYXdhaXQgJC5hamF4KHtcbiAgICAgIHVybDogc2l0ZU1hcFVSTCxcbiAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICBzdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgdmFyIHNpdGVNYXAgPSByZXNwb25zZTtcbiAgICAgICAgY29uc29sZS5sb2coJ1dvcmRQcmVzcyBkb3dubG9hZGVkIHNpdGVtYXAgZGF0YTogJywgc2l0ZU1hcCk7XG4gICAgICAgIGZvciAodmFyIHBvc3RUeXBlIGluIHNpdGVNYXApIHtcbiAgICAgICAgICBpZiAoc2l0ZU1hcC5oYXNPd25Qcm9wZXJ0eShwb3N0VHlwZSkpIHtcbiAgICAgICAgICAgIHN3aXRjaCAocG9zdFR5cGUpIHtcbiAgICAgICAgICAgICAgY2FzZSAncGFnZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5zZXQoJ3BhZ2VzJywgc2l0ZU1hcFtwb3N0VHlwZV0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdwb3N0cycsIHNpdGVNYXBbcG9zdFR5cGVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy9jb25zb2xlLmxvZygnV29yZFByZXNzIHByb2Nlc3NlZCBzaXRlbWFwIGRhdGE6ICcsIHRoaXMpO1xuICAgICAgICB0aGlzLnNldCgnaXNSZWFkeScsIHRydWUpO1xuICAgICAgICB0aGlzLiRicm9hZGNhc3QoJ3dvcmRwcmVzczppbml0Jyk7XG4gICAgICAgIGlmIChfb3B0aW9ucy5kb25lKSBfb3B0aW9ucy5kb25lLmNhbGwoX29wdGlvbnMuY29udGV4dCk7XG4gICAgICB9LFxuICAgICAgZXJyb3I6IChyZXNwb25zZSkgPT4ge1xuICAgICAgICB2YXIgc2l0ZU1hcEZldGNoRXJyb3IgPSBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBmZXRjaCBzaXRlbWFwJyk7XG5cbiAgICAgICAgY29uc29sZS5lcnJvcihzaXRlTWFwRmV0Y2hFcnJvcik7XG5cbiAgICAgICAgaWYgKF9vcHRpb25zLmRvbmUpIHtcbiAgICAgICAgICBfb3B0aW9ucy5kb25lLmNhbGwoX29wdGlvbnMuY29udGV4dCwgc2l0ZU1hcEZldGNoRXJyb3IsIHJlc3BvbnNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLmNvbnRleHRdXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmRvbmVdXG4gICAqIEByZXR1cm5zIHtbU3RyaW5nXX1cbiAgICovXG4gIGdldFBhZ2VzKG9wdGlvbnM/OiBJQ2FsbGJhY2tPcHRpb25zKSB7XG4gICAgdmFyIF9vcHRpb25zID0gdXRpbHMuZGVmYXVsdHMob3B0aW9ucywge30pO1xuICAgIGlmICh0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgX29wdGlvbnMuZG9uZS5jYWxsKF9vcHRpb25zLmNvbnRleHQsIHRoaXMuZ2V0KCdwYWdlcycpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiRvbignd29yZHByZXNzOmluaXQnLCAoKSA9PiB7XG4gICAgICAgIF9vcHRpb25zLmRvbmUuY2FsbChfb3B0aW9ucy5jb250ZXh0LCB0aGlzLmdldCgncGFnZXMnKSlcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmRvbmVdXG4gICAqIEByZXR1cm5zIHtbU3RyaW5nXX1cbiAgICovXG4gIGdldFBvc3RzKG9wdGlvbnM/OiBJQ2FsbGJhY2tPcHRpb25zKSB7XG4gICAgdmFyIF9vcHRpb25zID0gdXRpbHMuZGVmYXVsdHMob3B0aW9ucywge30pO1xuICAgIGlmICh0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgX29wdGlvbnMuZG9uZS5jYWxsKF9vcHRpb25zLmNvbnRleHQsIHRoaXMuZ2V0KCdwYWdlcycpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiRvbignd29yZHByZXNzOmluaXQnLCAoKSA9PiB7XG4gICAgICAgIF9vcHRpb25zLmRvbmUuY2FsbChfb3B0aW9ucy5jb250ZXh0LCB0aGlzLmdldCgncGFnZXMnKSlcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gdXJsXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMuZG9uZV1cbiAgICovXG4gIGhhc1BhZ2UodXJsOiBzdHJpbmcsIG9wdGlvbnM/OiBJQ2FsbGJhY2tPcHRpb25zKSB7XG4gICAgdGhpcy52ZXJpZnkoJ3BhZ2VzJywgdXJsLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gcmVxdWVzdGVkVVJMXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaGFzUGFnZVN5bmMocmVxdWVzdGVkVVJMOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoJ3BhZ2VzJykuaW5jbHVkZXMocmVxdWVzdGVkVVJMKTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gdXJsXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMuZG9uZV1cbiAgICovXG4gIGhhc1Bvc3QodXJsOiBzdHJpbmcsIG9wdGlvbnM/OiBJQ2FsbGJhY2tPcHRpb25zKSB7XG4gICAgdGhpcy52ZXJpZnkoJ3Bvc3RzJywgdXJsLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gcmVxdWVzdGVkVVJMXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaGFzUG9zdFN5bmMocmVxdWVzdGVkVVJMOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoJ3Bvc3RzJykuaW5jbHVkZXMocmVxdWVzdGVkVVJMKTtcbiAgfVxuXG4gIHZlcmlmeSh0eXBlOiBzdHJpbmcsIHVybDogc3RyaW5nLCBvcHRpb25zPzogSUNhbGxiYWNrT3B0aW9ucykge1xuICAgIGNvbnN0IF9vcHRpb25zID0gdXRpbHMuZGVmYXVsdHMob3B0aW9ucywge30pO1xuICAgIGNvbnN0IHZlcmlmaWNhdGlvbk1ldGhvZE5hbWUgPSAnZ2V0JyArIGNhcGl0YWxpemUodHlwZSk7XG4gICAgY29uc3QgdmVyaWZpY2F0aW9uTWV0aG9kID0gdGhpc1t2ZXJpZmljYXRpb25NZXRob2ROYW1lXTtcblxuICAgIHZlcmlmaWNhdGlvbk1ldGhvZCh7XG4gICAgICBkb25lOiAodXJscykgPT4ge1xuICAgICAgICBjb25zdCByZXF1ZXN0ZWRVcmwgPSB1dGlscy5zYW5pdGl6ZVVybCh1cmwpO1xuICAgICAgICBpZiAoX29wdGlvbnMuZG9uZSkge1xuICAgICAgICAgIF9vcHRpb25zLmRvbmUuY2FsbChfb3B0aW9ucy5jb250ZXh0LCB1cmxzLmluZGV4T2YocmVxdWVzdGVkVXJsKSA+PSAwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgUmVzb3VyY2VNb25pdG9yIGltcGxlbWVudHMgSVJlc291cmNlTW9uaXRvciB7XG4gIHN0YXRlOiBJUmVzb3VyY2VNb25pdG9yU3RhdGU7XG4gIGNvbmZpZzogSVJlc291cmNlTW9uaXRvckNvbmZpZztcbiAgc3Vic2NyaXB0aW9uczogRnVuY3Rpb25bXTtcbiAgc3RvcmU6IG51bWJlcltdO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogSVJlc291cmNlTW9uaXRvckNvbmZpZyA9IHt9KSB7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICBidWZmZXJTaXplOiBjb25maWcuYnVmZmVyU2l6ZSB8fCAyMDAsXG4gICAgICBpZGxlRnJlcXVlbmN5OiBjb25maWcuaWRsZUZyZXF1ZW5jeSB8fCAoMTAwMCAvIDYwKSAvLyA1MCBmcmFtZXMgcGVyIG1pbGxpc2Vjb25kXG4gICAgfTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaXNJbml0aWFsaXplZDogZmFsc2UsXG4gICAgICBpc1NsZWVwaW5nOiB0cnVlLFxuICAgICAgZ2NQdHI6IDAsXG4gICAgICBoZWFkUHRyOiB0aGlzLmNvbmZpZy5idWZmZXJTaXplIC0gMSxcbiAgICAgIHN1bTogMCxcbiAgICAgIGxhdGVzdDogMCxcbiAgICAgIHByZXY6IDAsXG4gICAgICBzbGVlcFRpbWVvdXRJZDogbnVsbFxuICAgIH07XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gW107XG4gICAgdGhpcy5zdG9yZSA9IFswXTsgLy8gZm9yIHRoZSBtb3N0IHJlY2VudCB0aWNrXG5cbiAgICB3aGlsZSAodGhpcy5zdG9yZS5sZW5ndGggPD0gdGhpcy5jb25maWcuYnVmZmVyU2l6ZSkge1xuICAgICAgdGhpcy5zdG9yZS5wdXNoKDApXG4gICAgfVxuICB9XG5cbiAgdGljaygpIHtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMub25BbmltYXRpb25GcmFtZSgpKTtcbiAgfVxuXG4gIHNsZWVwKCkge1xuICAgIHRoaXMuc3RhdGUuaXNTbGVlcGluZyA9IHRydWU7XG4gICAgdGhpcy50aWNrKCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5zdGF0ZS5zbGVlcFRpbWVvdXRJZCk7XG4gICAgdGhpcy5zdGF0ZS5pc1NsZWVwaW5nID0gZmFsc2U7XG4gICAgdGhpcy50aWNrKCk7XG4gIH1cblxuICBvbmNlKGNhbGxiYWNrKSB7XG4gICAgdmFyIHN1YnNjcmlwdGlvbklkeCA9IHRoaXMuc3Vic2NyaXB0aW9ucy5sZW5ndGggPyB0aGlzLnN1YnNjcmlwdGlvbnMubGVuZ3RoIC0gMSA6IDA7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goKCkgPT4ge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5zcGxpY2Uoc3Vic2NyaXB0aW9uSWR4LCAxKTtcbiAgICB9KTtcbiAgICB0aGlzLnN0YXJ0KCk7XG4gIH1cblxuICBvbkFuaW1hdGlvbkZyYW1lKCkge1xuICAgIGxldCBjYWxsYmFja0lkeCA9IDA7XG4gICAgbGV0IGNhbGxiYWNrO1xuXG4gICAgaWYgKHRoaXMuaXNTbGVlcGluZygpKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXNldCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyByZWNvcmQgdGltaW5nIG9mIGxhdGVzdCB0aWNrIGRlbGF5XG4gICAgICB0aGlzLnN0YXRlLnByZXYgPSB0aGlzLnN0YXRlLmxhdGVzdDtcbiAgICAgIHRoaXMuc3RhdGUubGF0ZXN0ID0gRGF0ZS5ub3coKTtcblxuICAgICAgLy8gY2FsY3VsYXRlIGFuZCBzYXZlIG5ldyBkZWxheVxuICAgICAgdGhpcy5zdG9yZVt0aGlzLnN0YXRlLmhlYWRQdHJdID0gdGhpcy5zdGF0ZS5sYXRlc3QgLSB0aGlzLnN0YXRlLnByZXY7XG5cblxuICAgICAgLy8gdXBkYXRlIHN0b3JlIGluZGV4IHJlZmVyZW5jZXNcbiAgICAgIHRoaXMuc3RhdGUuZ2NQdHIgPSAodGhpcy5zdGF0ZS5nY1B0ciArIDEpICUgdGhpcy5jb25maWcuYnVmZmVyU2l6ZTtcbiAgICAgIHRoaXMuc3RhdGUuaGVhZFB0ciA9ICh0aGlzLnN0YXRlLmhlYWRQdHIgKyAxKSAlIHRoaXMuY29uZmlnLmJ1ZmZlclNpemU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNSZWFkeSgpKSB7XG5cbiAgICAgIGlmICghdGhpcy5zdGF0ZS5pc0luaXRpYWxpemVkKSB7XG4gICAgICAgIHRoaXMuc3RhdGUuaXNJbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzLnRpY2soKVxuICAgICAgfVxuXG4gICAgICAvLyBhZGQgbmV3IGRpZmYgdG8gc3VtXG4gICAgICB0aGlzLnN0YXRlLnN1bSArPSB0aGlzLnN0b3JlW3RoaXMuc3RhdGUuaGVhZFB0cl07XG5cbiAgICAgIC8vIHN1YnRyYWN0IG9sZCBkaWZmIGZyb20gc3VtXG4gICAgICB0aGlzLnN0YXRlLnN1bSAtPSB0aGlzLnN0b3JlW3RoaXMuc3RhdGUuZ2NQdHJdO1xuXG4gICAgICBpZiAodGhpcy5nZXRTcGVlZCgpIDwgdGhpcy5jb25maWcuaWRsZUZyZXF1ZW5jeSkge1xuICAgICAgICBkbyB7XG4gICAgICAgICAgY2FsbGJhY2sgPSB0aGlzLnN1YnNjcmlwdGlvbnNbY2FsbGJhY2tJZHgrK107XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSB3aGlsZSAoY2FsbGJhY2spXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5oYXNRdWV1ZSgpID8gdGhpcy50aWNrKCkgOiB0aGlzLnNsZWVwKCk7XG4gIH1cblxuICBnZXRTcGVlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5zdW0gLyB0aGlzLmNvbmZpZy5idWZmZXJTaXplXG4gIH1cblxuICBpc1JlYWR5KCkge1xuICAgIHJldHVybiB0aGlzLnN0b3JlW3RoaXMuc3RhdGUuaGVhZFB0cl0gJiYgdGhpcy5zdG9yZVt0aGlzLnN0YXRlLmdjUHRyXTtcbiAgfVxuXG4gIGlzU2xlZXBpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuaXNTbGVlcGluZztcbiAgfVxuXG4gIGhhc1F1ZXVlKCkge1xuICAgIHJldHVybiB0aGlzLnN1YnNjcmlwdGlvbnMubGVuZ3RoID4gMFxuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5zdG9yZSA9IHRoaXMuc3RvcmUubWFwKCgpID0+IDApO1xuICAgIHRoaXMuc3RhdGUuZ2NQdHIgPSAwO1xuICAgIHRoaXMuc3RhdGUuaGVhZFB0ciA9IHRoaXMuY29uZmlnLmJ1ZmZlclNpemUgLSAxO1xuICAgIHRoaXMuc3RhdGUuc3VtID0gMDtcbiAgICB0aGlzLnN0YXRlLnByZXYgPSAwO1xuICAgIHRoaXMuc3RhdGUubGF0ZXN0ID0gMDtcbiAgICB0aGlzLnN0YXRlLmlzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgJCBmcm9tICdqcXVlcnknO1xuXG5cbmltcG9ydCB7IE1vZHVsZSB9ICAgICAgZnJvbSAnbW9kdWxlcy9saWIvbW9kdWxlJztcbmltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAnbW9kdWxlcy9hcHAnO1xuXG5leHBvcnQgY2xhc3MgSGVhZERpcmVjdGl2ZSBleHRlbmRzIE1vZHVsZSB7XG4gICRlbGVtZW50OiBKUXVlcnk8SFRNTEVsZW1lbnQ+O1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBhcHA6IEFwcGxpY2F0aW9uKSB7XG4gICAgc3VwZXIoYXBwKTtcblxuICAgIHRoaXMuJGVsZW1lbnQgPSAkKCdoZWFkJyk7XG5cbiAgICB0aGlzLiRvbignaHRtbDp1cGRhdGUnLCAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAgIGNvbnN0ICRET00gPSBkYXRhLiRET007XG4gICAgICBjb25zdCAkaGVhZCA9ICRET00uZmluZCgnaGVhZCcpO1xuICAgICAgY29uc3QgJG5ld1N0eWxlcyA9IGRhdGEubmV3LiRzdHlsZXM7XG5cbiAgICAgIC8vICRvbGRTY3JpcHRzLnJlbW92ZSgpO1xuXG4gICAgICAvLyBhZGQgbmV3IHN0eWxlcyB0byBpbmNvbWluZyBoZWFkXG4gICAgICAkaGVhZC5hcHBlbmQoJG5ld1N0eWxlcyk7XG5cbiAgICAgIC8vIHVwZGF0ZSBtZXRhXG4gICAgICB0aGlzLiRlbGVtZW50LmZpbmQoJ21ldGEnKS5yZW1vdmUoKTtcbiAgICAgIHRoaXMuJGVsZW1lbnQucHJlcGVuZCgkaGVhZC5maW5kKCdtZXRhJykpO1xuICAgICAgdGhpcy4kZWxlbWVudC5maW5kKCd0aXRsZScpLnJlbW92ZSgpO1xuICAgICAgdGhpcy4kZWxlbWVudC5wcmVwZW5kKCRoZWFkLmZpbmQoJ3RpdGxlJykpO1xuXG4gICAgICB0aGlzLiRicm9hZGNhc3QoJ2hlYWQ6dXBkYXRlJywgZGF0YSlcbiAgICB9KTtcbiAgfVxuXG5cbn1cbiIsImltcG9ydCAqIGFzICQgZnJvbSAnanF1ZXJ5JztcblxuaW1wb3J0IHsgQXBwbGljYXRpb24gfSAgICAgICAgIGZyb20gJ21vZHVsZXMvYXBwJztcbmltcG9ydCAqIGFzIHV0aWxzICAgICAgICAgICAgICBmcm9tICdtb2R1bGVzL2xpYi91dGlscyc7XG5pbXBvcnQgeyBNb2R1bGUgfSAgICAgICAgICAgICAgZnJvbSAnbW9kdWxlcy9saWIvbW9kdWxlJztcbmltcG9ydCB7IERPTU5vZGVSZWdpc3RlciB9ICAgICBmcm9tICdtb2R1bGVzL21vZGVscy9kb20tbm9kZS1yZWdpc3Rlcic7XG5pbXBvcnQgeyBTY3JpcHRSZWdpc3RlckVudHJ5IH0gZnJvbSAnbW9kdWxlcy9tb2RlbHMvc2NyaXB0LXJlZ2lzdGVyLWVudHJ5JztcbmltcG9ydCB7IFN0eWxlUmVnaXN0ZXJFbnRyeSB9ICBmcm9tICdtb2R1bGVzL21vZGVscy9zdHlsZS1yZWdpc3Rlci1lbnRyeSc7XG5cblxuLyoqXG4gKiBAZXh0ZW5kcyBNb2R1bGVcbiAqIEBjbGFzcyBIVE1MRGlyZWN0aXZlXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIEhUTUxEaXJlY3RpdmUgZXh0ZW5kcyBNb2R1bGUge1xuICAgIHNlbGVjdG9yczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcbiAgICBzY3JpcHRSZWdpc3RlcjogRE9NTm9kZVJlZ2lzdGVyO1xuICAgIHN0eWxlUmVnaXN0ZXI6IERPTU5vZGVSZWdpc3RlcjtcbiAgICAkZWxlbWVudDogSlF1ZXJ5PEhUTUxIdG1sRWxlbWVudD47XG5cbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcGxpY2F0aW9uKSB7XG4gICAgICAgIHN1cGVyKGFwcCk7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQgPSAkKCdodG1sJykgYXMgSlF1ZXJ5PEhUTUxIdG1sRWxlbWVudD47XG4gICAgICAgIHRoaXMuc2VsZWN0b3JzID0ge1xuICAgICAgICAgICAgc2NyaXB0OiAnc2NyaXB0JyxcbiAgICAgICAgICAgIHN0eWxlOiBcImxpbmtbcmVsPSdzdHlsZXNoZWV0J10sIHN0eWxlXCIsXG4gICAgICAgICAgICBzcGFTY3JpcHQ6ICdbc3JjKj1cIndwLXNwYS1wdWJsaWNcIl0nXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zY3JpcHRSZWdpc3RlciA9IG5ldyBET01Ob2RlUmVnaXN0ZXIoKTtcbiAgICAgICAgdGhpcy5zdHlsZVJlZ2lzdGVyID0gbmV3IERPTU5vZGVSZWdpc3RlcigpO1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTY3JpcHRzKHRoaXMuJGVsZW1lbnQuZmluZCgnc2NyaXB0JykpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyU3R5bGVzKHRoaXMuJGVsZW1lbnQuZmluZCh0aGlzLnNlbGVjdG9ycy5zdHlsZSkpO1xuXG4gICAgICAgIHRoaXMuZm9ybWF0RE9NKHRoaXMuJGVsZW1lbnQsIHtpZ25vcmU6IHRoaXMuc2VsZWN0b3JzLnNwYVNjcmlwdH0pO1xuXG4gICAgICAgIHRoaXMuJG9uKCd2aWV3OnVwZGF0ZScsIChldmVudCwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgJERPTSA9IGRhdGEuJERPTTtcblxuICAgICAgICAgICAgdGhpcy5mb3JtYXRET00oJERPTSwgeyByZW1vdmU6IHRoaXMuc2VsZWN0b3JzLnNwYVNjcmlwdCB9KTtcblxuICAgICAgICAgICAgY29uc3QgJHN0eWxlcyA9ICRET00uZmluZCh0aGlzLnNlbGVjdG9ycy5zdHlsZSk7XG4gICAgICAgICAgICBjb25zdCAkc2NyaXB0cyA9ICRET00uZmluZCh0aGlzLnNlbGVjdG9ycy5zY3JpcHQpO1xuXG4gICAgICAgICAgICAkc2NyaXB0cy5lYWNoKChpbmRleCwgZWwpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgc2NyaXB0UmVnRW50cnkgPSBuZXcgU2NyaXB0UmVnaXN0ZXJFbnRyeShlbCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2NyaXB0UmVnaXN0ZXIuY29udGFpbnMoc2NyaXB0UmVnRW50cnkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcmlwdFJlZ0VudHJ5LiRlbC5hdHRyKCdkYXRhLXNwYS1sb2FkZWQnLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ25nLmh0bWwgLSBleGNsdWRpbmcgJW8nLCBlbClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcmlwdFJlZ2lzdGVyLmFkZChzY3JpcHRSZWdFbnRyeSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignbmcuaHRtbCAtIGFkZGluZyAlbycsIGVsKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkc3R5bGVzLmVhY2goKGluZGV4LCBlbCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBzdHlsZVJlZ0VudHJ5ID0gbmV3IFN0eWxlUmVnaXN0ZXJFbnRyeShlbCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3R5bGVSZWdpc3Rlci5jb250YWlucyhzdHlsZVJlZ0VudHJ5KSkge1xuICAgICAgICAgICAgICAgICAgICBzdHlsZVJlZ0VudHJ5LiRlbC5hdHRyKCdkYXRhLXNwYS1sb2FkZWQnLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ25nLmh0bWwgLSBleGNsdWRpbmcgJW8nLCBlbClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlUmVnaXN0ZXIuYWRkKHN0eWxlUmVnRW50cnkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ25nLmh0bWwgLSBhZGRpbmcgJW8nLCBlbClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGV2ZW50RGF0YSA9IHV0aWxzLmRlZmF1bHRzKHtcbiAgICAgICAgICAgICAgICAkc2NyaXB0czogJHNjcmlwdHMsXG4gICAgICAgICAgICAgICAgJHN0eWxlczogJHN0eWxlcyxcbiAgICAgICAgICAgICAgICBvbGQ6IHtcbiAgICAgICAgICAgICAgICAgICAgJHNjcmlwdHM6ICRzY3JpcHRzLm5vdChcIltkYXRhLXNwYS1sb2FkZWQ9J3RydWUnXVwiKSxcbiAgICAgICAgICAgICAgICAgICAgJHN0eWxlczogJHN0eWxlcy5ub3QoXCJbZGF0YS1zcGEtbG9hZGVkPSd0cnVlJ11cIilcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG5ldzoge1xuICAgICAgICAgICAgICAgICAgICAkc2NyaXB0czogJHNjcmlwdHMuZmlsdGVyKFwiW2RhdGEtc3BhLWxvYWRlZD0ndHJ1ZSddXCIpLFxuICAgICAgICAgICAgICAgICAgICAkc3R5bGVzOiAkc3R5bGVzLmZpbHRlcihcIltkYXRhLXNwYS1sb2FkZWQ9J3RydWUnXVwiKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy4kYnJvYWRjYXN0KCdodG1sOnVwZGF0ZScsIGV2ZW50RGF0YSlcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJTY3JpcHRzKCRzY3JpcHRzKSB7XG4gICAgICAgICRzY3JpcHRzLmVhY2goKGluZGV4LCBlbCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zY3JpcHRSZWdpc3Rlci5hZGQobmV3IFNjcmlwdFJlZ2lzdGVyRW50cnkoZWwpKTtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignbmcuaHRtbCAtIGFkZGluZyAlbycsIGVsKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHJlZ2lzdGVyU3R5bGVzKCRzdHlsZXMpIHtcbiAgICAgICAgJHN0eWxlcy5lYWNoKChpbmRleCwgZWwpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGVSZWdpc3Rlci5hZGQobmV3IFN0eWxlUmVnaXN0ZXJFbnRyeShlbCkpO1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCduZy5odG1sIC0gYWRkaW5nICVvJywgZWwpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJERPTVxuICAgICAqIEBwYXJhbSBbb3B0aW9uc11cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuaWdub3JlXVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5yZW1vdmVdXG4gICAgICovXG4gICAgZm9ybWF0RE9NKCRET00sIG9wdGlvbnM/OiB7IHJlbW92ZT86IHN0cmluZyB8IEpRdWVyeSwgaWdub3JlPzogc3RyaW5nIHwgSlF1ZXJ5IH0pIHtcbiAgICAgICAgY29uc3QgX29wdGlvbnMgPSB1dGlscy5kZWZhdWx0cyh7fSwgb3B0aW9ucyk7XG4gICAgICAgIGxldCAkc2NyaXB0cyA9ICRET00uZmluZCgnc2NyaXB0Jyk7XG5cbiAgICAgICAgaWYgKF9vcHRpb25zLmlnbm9yZSkge1xuICAgICAgICAgICAgJHNjcmlwdHMgPSAkc2NyaXB0cy5ub3QoX29wdGlvbnMuaWdub3JlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoX29wdGlvbnMucmVtb3ZlKSB7XG4gICAgICAgICAgICB2YXIgJHJlbW92ZWRTY3JpcHRzID0gJHNjcmlwdHMuZmlsdGVyKF9vcHRpb25zLnJlbW92ZSkucmVtb3ZlKCk7XG4gICAgICAgICAgICAkc2NyaXB0cyA9ICRzY3JpcHRzLm5vdCgkcmVtb3ZlZFNjcmlwdHMpO1xuICAgICAgICB9XG4gICAgICAgICRzY3JpcHRzLmRldGFjaCgpO1xuICAgICAgICAkRE9NLmZpbmQodGhpcy5jb25maWdMb2FkZXIuZ2V0TWFpblNlbGVjdG9yKCkpLmFwcGVuZCgkc2NyaXB0cyk7XG4gICAgfVxufVxuIiwiZXhwb3J0ICogZnJvbSBcIi4vaGVhZFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vaHRtbFwiO1xuIiwiaW1wb3J0ICogYXMgJCBmcm9tICdqcXVlcnknO1xuXG4kLmZuLm9uZVRpbWVvdXQgPSBmdW5jdGlvbiAoZXZlbnQsIGNhbGxiYWNrLCBkdXJhdGlvbikge1xuICAgIHZhciAkZWwgPSB0aGlzLFxuICAgICAgICBpc0NhbGxiYWNrQ2xlYW4gPSB0cnVlLFxuICAgICAgICB0aW1lb3V0SWQsXG4gICAgICAgIHN0cmljdENhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgICAgICBpZiAoaXNDYWxsYmFja0NsZWFuKSBjYWxsYmFjaygpO1xuICAgICAgICB9O1xuXG4gICAgdGhpcy5vbmUoZXZlbnQsIHN0cmljdENhbGxiYWNrKTtcblxuICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBpc0NhbGxiYWNrQ2xlYW4gPSBmYWxzZTtcbiAgICAgICAgJGVsLm9mZihldmVudCwgbnVsbCwgc3RyaWN0Q2FsbGJhY2spO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgIH0sIGR1cmF0aW9uKTtcbn07XG5cbiQuZm4ub25lRGVsYXllZFRpbWVvdXQgPSBmdW5jdGlvbiAoZXZlbnQsIGNhbGxiYWNrLCBkdXJhdGlvbikge1xuICAgIHZhciAkZWwgPSB0aGlzLFxuICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgIHJldHVybiBmdW5jdGlvbigpe1xuICAgICAgICAkLmZuLm9uZVRpbWVvdXQuYXBwbHkoJGVsLCBhcmdzKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9ICQ7XG4iLCJpbXBvcnQgKiBhcyAkIGZyb20gJ2pxdWVyeSc7XG5cbiQuZm4ucHJlcGVuZGVkQ1NTID0gZnVuY3Rpb24gKG9wOiBJUHJlcGVuZENTU0FyZ3MpOiB2b2lkIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvcCkpe1xuICAgICAgICBsZXQgY3NzICA9ICcnO1xuXG4gICAgICAgIG9wLmZvckVhY2goZnVuY3Rpb24oY3NzU3R5bGUpe1xuICAgICAgICAgICAgY3NzICs9IGNzc1N0eWxlLnNlbGVjdG9yICsgXCJ7XCI7XG4gICAgICAgICAgICBmb3IgKGxldCBwcm9wTmFtZSBpbiBjc3NTdHlsZS5zdHlsZXMpe1xuICAgICAgICAgICAgICAgIGlmIChjc3NTdHlsZS5zdHlsZXMuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKXtcbiAgICAgICAgICAgICAgICAgICAgY3NzICs9IHByb3BOYW1lICsgJzonICsgY3NzU3R5bGUuc3R5bGVzW3Byb3BOYW1lXSArICc7JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjc3MgKz0gXCJ9XCI7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJHN0eWxlcyA9ICQoXCI8c3R5bGU+XCIgKyBjc3MgKyBcIjwvc3R5bGU+XCIpO1xuICAgICAgICB0aGlzLnByZXBlbmQodGhpcy4kc3R5bGVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzd2l0Y2gob3ApIHtcbiAgICAgICAgICAgIGNhc2UgJ3JlbW92ZSc6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuJHN0eWxlcykgdGhpcy4kc3R5bGVzLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSAkOyIsImltcG9ydCAqIGFzIHV0aWxzIGZyb20gJ21vZHVsZXMvbGliL3V0aWxzJztcblxuaW50ZXJmYWNlIElMb2FkaW5nVmlld0NvbmZpZyB7XG4gIGxvYWRpbmdDbGFzc05hbWU6IHN0cmluZztcbiAgbG9hZGluZ0hUTUxDb250ZW50OiBzdHJpbmc7XG4gIGluZGljYXRvclR5cGU6ICdpbmRldGVybWluYXRlJyB8ICdwcm9ncmVzcycgfCBzdHJpbmc7XG4gIGluZGljYXRvckNvbG9yOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBJTG9hZGluZ1ZpZXdTdGF0ZSB7XG4gIGhhc0xvYWRlZDogYm9vbGVhbjtcbiAgcHJvZ3Jlc3M6IG51bWJlcjtcbiAgYXV0b0luY3JlbWVudFRpbWVvdXRJZD86IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIExvYWRpbmdWaWV3IHtcbiAgJGxvYWRpbmdWaWV3OiBKUXVlcnk8SFRNTEVsZW1lbnQ+O1xuICAkbG9hZGluZ0ljb246IEpRdWVyeTxIVE1MRWxlbWVudD47XG4gICRsb2FkaW5nQmFyOiBKUXVlcnk8SFRNTEVsZW1lbnQ+O1xuICAkaW5kaWNhdG9yOiBKUXVlcnk8SFRNTEVsZW1lbnQ+O1xuXG4gIGNvbmZpZzogSUxvYWRpbmdWaWV3Q29uZmlnO1xuICBzdGF0ZTogSUxvYWRpbmdWaWV3U3RhdGUgPSB7IGhhc0xvYWRlZDogZmFsc2UsIHByb2dyZXNzOiAwIH07XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucz86IFBhcnRpYWw8SUxvYWRpbmdWaWV3Q29uZmlnPikge1xuICAgIHRoaXMuY29uZmlnID0gdXRpbHMuZGVmYXVsdHMob3B0aW9ucywge1xuICAgICAgbG9hZGluZ0NsYXNzTmFtZTogJ3dwLXNwYS1sb2FkaW5nLXZpZXctLWxvYWRpbmcnLFxuICAgICAgbG9hZGluZ0hUTUxDb250ZW50OiByZXF1aXJlKCdyYXctbG9hZGVyIS4vLi4vdmlld3MvaHRtbC9sb2FkaW5nLXZpZXcuaHRtbCcpLmRlZmF1bHQsXG4gICAgICBpbmRpY2F0b3JUeXBlOiAnaW5kZXRlcm1pbmF0ZScsXG4gICAgICBpbmRpY2F0b3JDb2xvcjogJydcbiAgICB9KTtcblxuICAgIHRoaXMuJGxvYWRpbmdWaWV3ID0gJCh0aGlzLmNvbmZpZy5sb2FkaW5nSFRNTENvbnRlbnQpO1xuICAgIHRoaXMuJGxvYWRpbmdJY29uID0gdGhpcy4kbG9hZGluZ1ZpZXcuZmluZCgnLndwLXNwYS1sb2FkaW5nLXZpZXdfX2ljb24nKTtcbiAgICB0aGlzLiRsb2FkaW5nQmFyID0gdGhpcy4kbG9hZGluZ1ZpZXcuZmluZCgnLndwLXNwYS1sb2FkaW5nLXZpZXdfX3Byb2dyZXNzLWJhcicpO1xuICAgIHRoaXMuJGxvYWRpbmdWaWV3LmFkZENsYXNzKCd3cC1zcGEtbG9hZGluZy12aWV3LS0nICsgdGhpcy5jb25maWcuaW5kaWNhdG9yVHlwZSk7XG4gIH1cblxuXG4gIHNob3coYW1vdW50OiBudW1iZXIpIHtcbiAgICB0aGlzLiRsb2FkaW5nVmlldy5hZGRDbGFzcyh0aGlzLmNvbmZpZy5sb2FkaW5nQ2xhc3NOYW1lKTtcbiAgICBpZiAodGhpcy5jb25maWcuaW5kaWNhdG9yVHlwZSA9PSAncHJvZ3Jlc3MnICYmIChhbW91bnQgPT09IDAgfHwgYW1vdW50ID4gMCkpIHRoaXMuc2V0TG9hZGluZ1Byb2dyZXNzKGFtb3VudCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnN0YXRlLnByb2dyZXNzID0gMDtcbiAgICB0aGlzLnN0YXRlLmhhc0xvYWRlZCA9IGZhbHNlO1xuICAgIHRoaXMuJGxvYWRpbmdWaWV3LnJlbW92ZUNsYXNzKHRoaXMuY29uZmlnLmxvYWRpbmdDbGFzc05hbWUpO1xuICAgIHRoaXMuJGxvYWRpbmdCYXIuY3NzKHtcbiAgICAgICdvcGFjaXR5JzogJydcbiAgICB9KTtcbiAgfVxuXG4gIHNldExvYWRpbmdQcm9ncmVzcyhhbW91bnQ6IG51bWJlcikge1xuICAgIGlmICghdGhpcy5zdGF0ZS5wcm9ncmVzcykge1xuICAgICAgdGhpcy5zdGF0ZS5wcm9ncmVzcyA9IDA7XG4gICAgICB0aGlzLiRsb2FkaW5nQmFyLmNzcyh7ICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoMCwgMCwgMCknIH0pO1xuICAgIH1cblxuICAgIC8vIHVzZSBhbW91bnQgb25seSBpZiBoaWdoZXIgdGhhbiBjdXJyZW50IHByb2dyZXNzXG4gICAgdGhpcy5zdGF0ZS5wcm9ncmVzcyA9IGFtb3VudCAmJiBhbW91bnQgPiB0aGlzLnN0YXRlLnByb2dyZXNzID8gYW1vdW50IDogdGhpcy5zdGF0ZS5wcm9ncmVzcztcbiAgICBzd2l0Y2ggKGFtb3VudCkge1xuICAgICAgY2FzZSAxMDA6XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnN0YXRlLmF1dG9JbmNyZW1lbnRUaW1lb3V0SWQpO1xuICAgICAgICB0aGlzLnN0YXRlLmhhc0xvYWRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuJGxvYWRpbmdCYXIuY3NzKHtcbiAgICAgICAgICAndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZTNkKDEwMCUsIDAsIDApJyxcbiAgICAgICAgICAnb3BhY2l0eSc6ICcwJ1xuICAgICAgICB9KTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnJlc2V0KCksIDEwMDApO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAwOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy4kbG9hZGluZ0Jhci5jc3Moe1xuICAgICAgICAgICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoJyArIHRoaXMuc3RhdGUucHJvZ3Jlc3MgKyAnJSwgMCwgMCknXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnN0YXRlLmF1dG9JbmNyZW1lbnRUaW1lb3V0SWQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuc3RhdGUucHJvZ3Jlc3MgPCA3NSAmJiAhdGhpcy5zdGF0ZS5oYXNMb2FkZWQpIHRoaXMuc2hvdyh0aGlzLnN0YXRlLnByb2dyZXNzICsgMilcbiAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gIH1cblxuICBoaWRlKCkge1xuICAgIGlmICh0aGlzLmNvbmZpZy5pbmRpY2F0b3JUeXBlID09ICdwcm9ncmVzcycpIHtcbiAgICAgIHRoaXMuc2V0TG9hZGluZ1Byb2dyZXNzKDEwMCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy4kbG9hZGluZ1ZpZXcuZmluZCgnLndwLXNwYS1sb2FkaW5nLXZpZXdfX2ljb24nKS5jc3MoeyBvcGFjaXR5OiAwIH0pO1xuXG4gICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gaGlkZSBldmVyeXRoaW5nXG4gICAgICB0aGlzLiRsb2FkaW5nVmlldy5maW5kKCcud3Atc3BhLWxvYWRpbmctdmlld19faWNvbicpLmNzcyh7IG9wYWNpdHk6ICcnIH0pO1xuICAgICAgdGhpcy4kbG9hZGluZ1ZpZXcucmVtb3ZlQ2xhc3ModGhpcy5jb25maWcubG9hZGluZ0NsYXNzTmFtZSk7XG4gICAgfSwgNjUwKTtcbiAgfVxuXG4gIGFwcGVuZFRvKCRwYXJlbnQ6IEpRdWVyeTxIVE1MRWxlbWVudD4pIHtcbiAgICB0aGlzLiRpbmRpY2F0b3IgPSB0aGlzLmNvbmZpZy5pbmRpY2F0b3JUeXBlID09ICdwcm9ncmVzcycgPyB0aGlzLiRsb2FkaW5nQmFyIDogdGhpcy4kbG9hZGluZ0ljb247XG4gICAgdGhpcy4kaW5kaWNhdG9yLmNzcyh7XG4gICAgICAnYmFja2dyb3VuZC1jb2xvcic6IHRoaXMuY29uZmlnLmluZGljYXRvckNvbG9yXG4gICAgfSk7XG4gICAgJHBhcmVudC5hcHBlbmQodGhpcy4kbG9hZGluZ1ZpZXcpO1xuICB9XG59XG4iLCIvLyBsb2FkcyBmcm9tIGdsb2JhbCB3b3JkcHJlc3MgaW5zdGFuY2Vcbm1vZHVsZS5leHBvcnRzID0gd2luZG93LmpRdWVyeS5ub0NvbmZsaWN0KCk7Il0sInNvdXJjZVJvb3QiOiIifQ==