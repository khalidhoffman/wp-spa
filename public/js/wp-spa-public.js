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
        this.router = new router_1.AppRouter(this.meta.baseHREF);
        this.router.on(/.*/, function (path) {
            _this.emit('$locationChangeSuccess', path, _this.previousPath);
            _this.previousPath = path;
        });
        this.mainController = new Controllers.MainController(this);
        this.uiController = new Controllers.UIController(this);
        this.htmlView = new Views.HTMLDirective(this);
        this.headView = new Views.HeadDirective(this);
    }
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
        _this.init();
        return _this;
    }
    MainController.prototype.init = function () {
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
var url = __webpack_require__(/*! url */ "../../../../../weblee/weblee-utils/node_modules/url/url.js");
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
        _this.updateConfiguration();
        _this.loadingView = new loading_1.LoadingView({
            indicatorType: _this.$root.data('wp-spa-loader-type'),
            indicatorColor: _this.$root.data('wp-spa-loader-color')
        });
        if (_this.flags.showLoadingScreen) {
            _this.loadingView.appendTo(_this.$body);
            // make use off css transition to smooth loading intro
            _this.loadingView.show(0);
            _this.$timeout(function () {
                _this.loadingView.show(50);
            });
        }
        _this.exec(function () {
            // show animation on first render
            _this.addPage(_this.$body.find('.spa-content__page'), _this.$body[0].attributes, function () {
                _this.loadingView.hide();
                // start pre-caching
                _this.contentLoader.preCache();
            });
        }, 12 * 1000);
        _this.configLoader.fetchConfig(function (err, configData) {
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
        return _this;
    }
    UIController.prototype.interceptAction = function (evt) {
        console.log('ngBody.interceptAction()');
        var targetHref = evt.currentTarget.href || location.href;
        var route = this.getRouteFromHREF(targetHref);
        if (route) {
            console.log('ngBody.interceptAction()  - routing to %s', utils.getPathFromUrl(targetHref));
            evt.preventDefault();
            if (route == '@') {
                // attempting route to current page
                this.shake();
            }
            else {
                this.router.path(route);
            }
        }
        else {
            console.log('ngBody.interceptAction() - no-op');
        }
    };
    UIController.prototype.getRouteFromHREF = function (href) {
        var targetHrefMeta = url.parse(href);
        if (/\/wp\-(admin|login)\/?/.test(targetHrefMeta.path)) {
            return false;
        }
        else if (location.href.match(new RegExp(targetHrefMeta.pathname + '\/?$'))) {
            return '@';
        }
        else if (this.config.captureAll
            // animate for path changes. allow native hash otherwise
            || targetHrefMeta.hash && url.parse(location.href).pathname != targetHrefMeta.pathname
            || this.contentLoader.hasPageSync(href)
            || this.contentLoader.hasPostSync(href)) {
            return targetHrefMeta.pathname;
        }
        else {
            return false;
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

Object.defineProperty(exports, "__esModule", { value: true });
var url = __webpack_require__(/*! url */ "../../../../../weblee/weblee-utils/node_modules/url/url.js");
var history_1 = __webpack_require__(/*! modules/lib/history */ "./modules/lib/history.ts");
var AppRouter = /** @class */ (function () {
    function AppRouter(base) {
        var _this = this;
        if (base === void 0) { base = '/'; }
        this.base = base;
        this.history = new history_1.AppHistory();
        this.routes = [];
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
    }
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
    return AppRouter;
}());
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
        _this.downloadSiteMap();
        return _this;
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rYWg4YnIvd2VibGVlL3dlYmxlZS11dGlscy9ub2RlX21vZHVsZXMvcHVueWNvZGUvcHVueWNvZGUuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9rYWg4YnIvd2VibGVlL3dlYmxlZS11dGlscy9ub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2RlY29kZS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2thaDhici93ZWJsZWUvd2VibGVlLXV0aWxzL25vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvZW5jb2RlLmpzIiwid2VicGFjazovLy8vVXNlcnMva2FoOGJyL3dlYmxlZS93ZWJsZWUtdXRpbHMvbm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL2thaDhici93ZWJsZWUvd2VibGVlLXV0aWxzL25vZGVfbW9kdWxlcy91cmwvdXJsLmpzIiwid2VicGFjazovLy8vVXNlcnMva2FoOGJyL3dlYmxlZS93ZWJsZWUtdXRpbHMvbm9kZV9tb2R1bGVzL3VybC91dGlsLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL21vZHVsZS5qcyIsIndlYnBhY2s6Ly8vLi9tb2R1bGVzL3ZpZXdzL2h0bWwvbG9hZGluZy12aWV3Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vYXBwLnRzIiwid2VicGFjazovLy8uL21vZHVsZXMvYXBwLnRzIiwid2VicGFjazovLy8uL21vZHVsZXMvY29udHJvbGxlcnMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy9jb250cm9sbGVycy9tYWluLWNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy9jb250cm9sbGVycy91aS1jb250cm9sbGVyLnRzIiwid2VicGFjazovLy8uL21vZHVsZXMvbGliL2RvbS1wYXJzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy9saWIvaGlzdG9yeS50cyIsIndlYnBhY2s6Ly8vLi9tb2R1bGVzL2xpYi9tb2R1bGUudHMiLCJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy9saWIvcm91dGVyLnRzIiwid2VicGFjazovLy8uL21vZHVsZXMvbGliL3V0aWxzLnRzIiwid2VicGFjazovLy8uL21vZHVsZXMvbW9kZWxzL2RvbS1ub2RlLXJlZ2lzdGVyLnRzIiwid2VicGFjazovLy8uL21vZHVsZXMvbW9kZWxzL3JlZ2lzdGVyLWVudHJ5LnRzIiwid2VicGFjazovLy8uL21vZHVsZXMvbW9kZWxzL3NjcmlwdC1yZWdpc3Rlci1lbnRyeS50cyIsIndlYnBhY2s6Ly8vLi9tb2R1bGVzL21vZGVscy9zdHlsZS1yZWdpc3Rlci1lbnRyeS50cyIsIndlYnBhY2s6Ly8vLi9tb2R1bGVzL3NlcnZpY2VzL2NvbmZpZy1sb2FkZXIudHMiLCJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy9zZXJ2aWNlcy9jb250ZW50LWxvYWRlci50cyIsIndlYnBhY2s6Ly8vLi9tb2R1bGVzL3NlcnZpY2VzL3Jlc291cmNlLW1vbml0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy92aWV3cy9oZWFkLnRzIiwid2VicGFjazovLy8uL21vZHVsZXMvdmlld3MvaHRtbC50cyIsIndlYnBhY2s6Ly8vLi9tb2R1bGVzL3ZpZXdzL2luZGV4LnRzIiwid2VicGFjazovLy8uL21vZHVsZXMvdmlld3MvanF1ZXJ5Lm9uZS1zdHJpY3QudHMiLCJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy92aWV3cy9qcXVlcnkucHJlcGVuZGVkLWNzcy50cyIsIndlYnBhY2s6Ly8vLi9tb2R1bGVzL3ZpZXdzL2xvYWRpbmcudHMiLCJ3ZWJwYWNrOi8vLy4vdmVuZG9ycy9qcXVlcnktd3AuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QkFBeUI7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsT0FBTztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxPQUFPO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLE9BQU87QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBa0IsbUJBQW1CO0FBQ3JDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixtQkFBbUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixpQkFBaUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsUUFBUTtBQUN0QztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVSxNQUFNO0FBQ2hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUMzdEJhOztBQUViO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2ZBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFD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QUNWLENBQUM7SUFFRCw4QkFBUSxHQUFSLFVBQVMsT0FBNEI7UUFDbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDakcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUM7WUFDbEIsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjO1NBQy9DLENBQUMsQ0FBQztRQUNILE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFDSCxrQkFBQztBQUFELENBQUM7QUE1Rlksa0NBQVc7Ozs7Ozs7Ozs7Ozs7QUNmeEI7QUFDQSw0QyIsImZpbGUiOiJ3cC1zcGEtcHVibGljLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9hcHAudHNcIik7XG4iLCIvKiEgaHR0cHM6Ly9tdGhzLmJlL3B1bnljb2RlIHYxLjQuMSBieSBAbWF0aGlhcyAqL1xuOyhmdW5jdGlvbihyb290KSB7XG5cblx0LyoqIERldGVjdCBmcmVlIHZhcmlhYmxlcyAqL1xuXHR2YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmXG5cdFx0IWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblx0dmFyIGZyZWVNb2R1bGUgPSB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJlxuXHRcdCFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXHR2YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsO1xuXHRpZiAoXG5cdFx0ZnJlZUdsb2JhbC5nbG9iYWwgPT09IGZyZWVHbG9iYWwgfHxcblx0XHRmcmVlR2xvYmFsLndpbmRvdyA9PT0gZnJlZUdsb2JhbCB8fFxuXHRcdGZyZWVHbG9iYWwuc2VsZiA9PT0gZnJlZUdsb2JhbFxuXHQpIHtcblx0XHRyb290ID0gZnJlZUdsb2JhbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYHB1bnljb2RlYCBvYmplY3QuXG5cdCAqIEBuYW1lIHB1bnljb2RlXG5cdCAqIEB0eXBlIE9iamVjdFxuXHQgKi9cblx0dmFyIHB1bnljb2RlLFxuXG5cdC8qKiBIaWdoZXN0IHBvc2l0aXZlIHNpZ25lZCAzMi1iaXQgZmxvYXQgdmFsdWUgKi9cblx0bWF4SW50ID0gMjE0NzQ4MzY0NywgLy8gYWthLiAweDdGRkZGRkZGIG9yIDJeMzEtMVxuXG5cdC8qKiBCb290c3RyaW5nIHBhcmFtZXRlcnMgKi9cblx0YmFzZSA9IDM2LFxuXHR0TWluID0gMSxcblx0dE1heCA9IDI2LFxuXHRza2V3ID0gMzgsXG5cdGRhbXAgPSA3MDAsXG5cdGluaXRpYWxCaWFzID0gNzIsXG5cdGluaXRpYWxOID0gMTI4LCAvLyAweDgwXG5cdGRlbGltaXRlciA9ICctJywgLy8gJ1xceDJEJ1xuXG5cdC8qKiBSZWd1bGFyIGV4cHJlc3Npb25zICovXG5cdHJlZ2V4UHVueWNvZGUgPSAvXnhuLS0vLFxuXHRyZWdleE5vbkFTQ0lJID0gL1teXFx4MjAtXFx4N0VdLywgLy8gdW5wcmludGFibGUgQVNDSUkgY2hhcnMgKyBub24tQVNDSUkgY2hhcnNcblx0cmVnZXhTZXBhcmF0b3JzID0gL1tcXHgyRVxcdTMwMDJcXHVGRjBFXFx1RkY2MV0vZywgLy8gUkZDIDM0OTAgc2VwYXJhdG9yc1xuXG5cdC8qKiBFcnJvciBtZXNzYWdlcyAqL1xuXHRlcnJvcnMgPSB7XG5cdFx0J292ZXJmbG93JzogJ092ZXJmbG93OiBpbnB1dCBuZWVkcyB3aWRlciBpbnRlZ2VycyB0byBwcm9jZXNzJyxcblx0XHQnbm90LWJhc2ljJzogJ0lsbGVnYWwgaW5wdXQgPj0gMHg4MCAobm90IGEgYmFzaWMgY29kZSBwb2ludCknLFxuXHRcdCdpbnZhbGlkLWlucHV0JzogJ0ludmFsaWQgaW5wdXQnXG5cdH0sXG5cblx0LyoqIENvbnZlbmllbmNlIHNob3J0Y3V0cyAqL1xuXHRiYXNlTWludXNUTWluID0gYmFzZSAtIHRNaW4sXG5cdGZsb29yID0gTWF0aC5mbG9vcixcblx0c3RyaW5nRnJvbUNoYXJDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZSxcblxuXHQvKiogVGVtcG9yYXJ5IHZhcmlhYmxlICovXG5cdGtleTtcblxuXHQvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXHQvKipcblx0ICogQSBnZW5lcmljIGVycm9yIHV0aWxpdHkgZnVuY3Rpb24uXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFRoZSBlcnJvciB0eXBlLlxuXHQgKiBAcmV0dXJucyB7RXJyb3J9IFRocm93cyBhIGBSYW5nZUVycm9yYCB3aXRoIHRoZSBhcHBsaWNhYmxlIGVycm9yIG1lc3NhZ2UuXG5cdCAqL1xuXHRmdW5jdGlvbiBlcnJvcih0eXBlKSB7XG5cdFx0dGhyb3cgbmV3IFJhbmdlRXJyb3IoZXJyb3JzW3R5cGVdKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBIGdlbmVyaWMgYEFycmF5I21hcGAgdXRpbGl0eSBmdW5jdGlvbi5cblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgZm9yIGV2ZXJ5IGFycmF5XG5cdCAqIGl0ZW0uXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gQSBuZXcgYXJyYXkgb2YgdmFsdWVzIHJldHVybmVkIGJ5IHRoZSBjYWxsYmFjayBmdW5jdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIG1hcChhcnJheSwgZm4pIHtcblx0XHR2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXHRcdHZhciByZXN1bHQgPSBbXTtcblx0XHR3aGlsZSAobGVuZ3RoLS0pIHtcblx0XHRcdHJlc3VsdFtsZW5ndGhdID0gZm4oYXJyYXlbbGVuZ3RoXSk7XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHQvKipcblx0ICogQSBzaW1wbGUgYEFycmF5I21hcGAtbGlrZSB3cmFwcGVyIHRvIHdvcmsgd2l0aCBkb21haW4gbmFtZSBzdHJpbmdzIG9yIGVtYWlsXG5cdCAqIGFkZHJlc3Nlcy5cblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGRvbWFpbiBUaGUgZG9tYWluIG5hbWUgb3IgZW1haWwgYWRkcmVzcy5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgZm9yIGV2ZXJ5XG5cdCAqIGNoYXJhY3Rlci5cblx0ICogQHJldHVybnMge0FycmF5fSBBIG5ldyBzdHJpbmcgb2YgY2hhcmFjdGVycyByZXR1cm5lZCBieSB0aGUgY2FsbGJhY2tcblx0ICogZnVuY3Rpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBtYXBEb21haW4oc3RyaW5nLCBmbikge1xuXHRcdHZhciBwYXJ0cyA9IHN0cmluZy5zcGxpdCgnQCcpO1xuXHRcdHZhciByZXN1bHQgPSAnJztcblx0XHRpZiAocGFydHMubGVuZ3RoID4gMSkge1xuXHRcdFx0Ly8gSW4gZW1haWwgYWRkcmVzc2VzLCBvbmx5IHRoZSBkb21haW4gbmFtZSBzaG91bGQgYmUgcHVueWNvZGVkLiBMZWF2ZVxuXHRcdFx0Ly8gdGhlIGxvY2FsIHBhcnQgKGkuZS4gZXZlcnl0aGluZyB1cCB0byBgQGApIGludGFjdC5cblx0XHRcdHJlc3VsdCA9IHBhcnRzWzBdICsgJ0AnO1xuXHRcdFx0c3RyaW5nID0gcGFydHNbMV07XG5cdFx0fVxuXHRcdC8vIEF2b2lkIGBzcGxpdChyZWdleClgIGZvciBJRTggY29tcGF0aWJpbGl0eS4gU2VlICMxNy5cblx0XHRzdHJpbmcgPSBzdHJpbmcucmVwbGFjZShyZWdleFNlcGFyYXRvcnMsICdcXHgyRScpO1xuXHRcdHZhciBsYWJlbHMgPSBzdHJpbmcuc3BsaXQoJy4nKTtcblx0XHR2YXIgZW5jb2RlZCA9IG1hcChsYWJlbHMsIGZuKS5qb2luKCcuJyk7XG5cdFx0cmV0dXJuIHJlc3VsdCArIGVuY29kZWQ7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhbiBhcnJheSBjb250YWluaW5nIHRoZSBudW1lcmljIGNvZGUgcG9pbnRzIG9mIGVhY2ggVW5pY29kZVxuXHQgKiBjaGFyYWN0ZXIgaW4gdGhlIHN0cmluZy4gV2hpbGUgSmF2YVNjcmlwdCB1c2VzIFVDUy0yIGludGVybmFsbHksXG5cdCAqIHRoaXMgZnVuY3Rpb24gd2lsbCBjb252ZXJ0IGEgcGFpciBvZiBzdXJyb2dhdGUgaGFsdmVzIChlYWNoIG9mIHdoaWNoXG5cdCAqIFVDUy0yIGV4cG9zZXMgYXMgc2VwYXJhdGUgY2hhcmFjdGVycykgaW50byBhIHNpbmdsZSBjb2RlIHBvaW50LFxuXHQgKiBtYXRjaGluZyBVVEYtMTYuXG5cdCAqIEBzZWUgYHB1bnljb2RlLnVjczIuZW5jb2RlYFxuXHQgKiBAc2VlIDxodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZz5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlLnVjczJcblx0ICogQG5hbWUgZGVjb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmcgVGhlIFVuaWNvZGUgaW5wdXQgc3RyaW5nIChVQ1MtMikuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gVGhlIG5ldyBhcnJheSBvZiBjb2RlIHBvaW50cy5cblx0ICovXG5cdGZ1bmN0aW9uIHVjczJkZWNvZGUoc3RyaW5nKSB7XG5cdFx0dmFyIG91dHB1dCA9IFtdLFxuXHRcdCAgICBjb3VudGVyID0gMCxcblx0XHQgICAgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aCxcblx0XHQgICAgdmFsdWUsXG5cdFx0ICAgIGV4dHJhO1xuXHRcdHdoaWxlIChjb3VudGVyIDwgbGVuZ3RoKSB7XG5cdFx0XHR2YWx1ZSA9IHN0cmluZy5jaGFyQ29kZUF0KGNvdW50ZXIrKyk7XG5cdFx0XHRpZiAodmFsdWUgPj0gMHhEODAwICYmIHZhbHVlIDw9IDB4REJGRiAmJiBjb3VudGVyIDwgbGVuZ3RoKSB7XG5cdFx0XHRcdC8vIGhpZ2ggc3Vycm9nYXRlLCBhbmQgdGhlcmUgaXMgYSBuZXh0IGNoYXJhY3RlclxuXHRcdFx0XHRleHRyYSA9IHN0cmluZy5jaGFyQ29kZUF0KGNvdW50ZXIrKyk7XG5cdFx0XHRcdGlmICgoZXh0cmEgJiAweEZDMDApID09IDB4REMwMCkgeyAvLyBsb3cgc3Vycm9nYXRlXG5cdFx0XHRcdFx0b3V0cHV0LnB1c2goKCh2YWx1ZSAmIDB4M0ZGKSA8PCAxMCkgKyAoZXh0cmEgJiAweDNGRikgKyAweDEwMDAwKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyB1bm1hdGNoZWQgc3Vycm9nYXRlOyBvbmx5IGFwcGVuZCB0aGlzIGNvZGUgdW5pdCwgaW4gY2FzZSB0aGUgbmV4dFxuXHRcdFx0XHRcdC8vIGNvZGUgdW5pdCBpcyB0aGUgaGlnaCBzdXJyb2dhdGUgb2YgYSBzdXJyb2dhdGUgcGFpclxuXHRcdFx0XHRcdG91dHB1dC5wdXNoKHZhbHVlKTtcblx0XHRcdFx0XHRjb3VudGVyLS07XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG91dHB1dC5wdXNoKHZhbHVlKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG91dHB1dDtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgc3RyaW5nIGJhc2VkIG9uIGFuIGFycmF5IG9mIG51bWVyaWMgY29kZSBwb2ludHMuXG5cdCAqIEBzZWUgYHB1bnljb2RlLnVjczIuZGVjb2RlYFxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGUudWNzMlxuXHQgKiBAbmFtZSBlbmNvZGVcblx0ICogQHBhcmFtIHtBcnJheX0gY29kZVBvaW50cyBUaGUgYXJyYXkgb2YgbnVtZXJpYyBjb2RlIHBvaW50cy5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIG5ldyBVbmljb2RlIHN0cmluZyAoVUNTLTIpLlxuXHQgKi9cblx0ZnVuY3Rpb24gdWNzMmVuY29kZShhcnJheSkge1xuXHRcdHJldHVybiBtYXAoYXJyYXksIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHR2YXIgb3V0cHV0ID0gJyc7XG5cdFx0XHRpZiAodmFsdWUgPiAweEZGRkYpIHtcblx0XHRcdFx0dmFsdWUgLT0gMHgxMDAwMDtcblx0XHRcdFx0b3V0cHV0ICs9IHN0cmluZ0Zyb21DaGFyQ29kZSh2YWx1ZSA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMCk7XG5cdFx0XHRcdHZhbHVlID0gMHhEQzAwIHwgdmFsdWUgJiAweDNGRjtcblx0XHRcdH1cblx0XHRcdG91dHB1dCArPSBzdHJpbmdGcm9tQ2hhckNvZGUodmFsdWUpO1xuXHRcdFx0cmV0dXJuIG91dHB1dDtcblx0XHR9KS5qb2luKCcnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIGJhc2ljIGNvZGUgcG9pbnQgaW50byBhIGRpZ2l0L2ludGVnZXIuXG5cdCAqIEBzZWUgYGRpZ2l0VG9CYXNpYygpYFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge051bWJlcn0gY29kZVBvaW50IFRoZSBiYXNpYyBudW1lcmljIGNvZGUgcG9pbnQgdmFsdWUuXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBudW1lcmljIHZhbHVlIG9mIGEgYmFzaWMgY29kZSBwb2ludCAoZm9yIHVzZSBpblxuXHQgKiByZXByZXNlbnRpbmcgaW50ZWdlcnMpIGluIHRoZSByYW5nZSBgMGAgdG8gYGJhc2UgLSAxYCwgb3IgYGJhc2VgIGlmXG5cdCAqIHRoZSBjb2RlIHBvaW50IGRvZXMgbm90IHJlcHJlc2VudCBhIHZhbHVlLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzaWNUb0RpZ2l0KGNvZGVQb2ludCkge1xuXHRcdGlmIChjb2RlUG9pbnQgLSA0OCA8IDEwKSB7XG5cdFx0XHRyZXR1cm4gY29kZVBvaW50IC0gMjI7XG5cdFx0fVxuXHRcdGlmIChjb2RlUG9pbnQgLSA2NSA8IDI2KSB7XG5cdFx0XHRyZXR1cm4gY29kZVBvaW50IC0gNjU7XG5cdFx0fVxuXHRcdGlmIChjb2RlUG9pbnQgLSA5NyA8IDI2KSB7XG5cdFx0XHRyZXR1cm4gY29kZVBvaW50IC0gOTc7XG5cdFx0fVxuXHRcdHJldHVybiBiYXNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgZGlnaXQvaW50ZWdlciBpbnRvIGEgYmFzaWMgY29kZSBwb2ludC5cblx0ICogQHNlZSBgYmFzaWNUb0RpZ2l0KClgXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBkaWdpdCBUaGUgbnVtZXJpYyB2YWx1ZSBvZiBhIGJhc2ljIGNvZGUgcG9pbnQuXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBiYXNpYyBjb2RlIHBvaW50IHdob3NlIHZhbHVlICh3aGVuIHVzZWQgZm9yXG5cdCAqIHJlcHJlc2VudGluZyBpbnRlZ2VycykgaXMgYGRpZ2l0YCwgd2hpY2ggbmVlZHMgdG8gYmUgaW4gdGhlIHJhbmdlXG5cdCAqIGAwYCB0byBgYmFzZSAtIDFgLiBJZiBgZmxhZ2AgaXMgbm9uLXplcm8sIHRoZSB1cHBlcmNhc2UgZm9ybSBpc1xuXHQgKiB1c2VkOyBlbHNlLCB0aGUgbG93ZXJjYXNlIGZvcm0gaXMgdXNlZC4gVGhlIGJlaGF2aW9yIGlzIHVuZGVmaW5lZFxuXHQgKiBpZiBgZmxhZ2AgaXMgbm9uLXplcm8gYW5kIGBkaWdpdGAgaGFzIG5vIHVwcGVyY2FzZSBmb3JtLlxuXHQgKi9cblx0ZnVuY3Rpb24gZGlnaXRUb0Jhc2ljKGRpZ2l0LCBmbGFnKSB7XG5cdFx0Ly8gIDAuLjI1IG1hcCB0byBBU0NJSSBhLi56IG9yIEEuLlpcblx0XHQvLyAyNi4uMzUgbWFwIHRvIEFTQ0lJIDAuLjlcblx0XHRyZXR1cm4gZGlnaXQgKyAyMiArIDc1ICogKGRpZ2l0IDwgMjYpIC0gKChmbGFnICE9IDApIDw8IDUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEJpYXMgYWRhcHRhdGlvbiBmdW5jdGlvbiBhcyBwZXIgc2VjdGlvbiAzLjQgb2YgUkZDIDM0OTIuXG5cdCAqIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzNDkyI3NlY3Rpb24tMy40XG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRmdW5jdGlvbiBhZGFwdChkZWx0YSwgbnVtUG9pbnRzLCBmaXJzdFRpbWUpIHtcblx0XHR2YXIgayA9IDA7XG5cdFx0ZGVsdGEgPSBmaXJzdFRpbWUgPyBmbG9vcihkZWx0YSAvIGRhbXApIDogZGVsdGEgPj4gMTtcblx0XHRkZWx0YSArPSBmbG9vcihkZWx0YSAvIG51bVBvaW50cyk7XG5cdFx0Zm9yICgvKiBubyBpbml0aWFsaXphdGlvbiAqLzsgZGVsdGEgPiBiYXNlTWludXNUTWluICogdE1heCA+PiAxOyBrICs9IGJhc2UpIHtcblx0XHRcdGRlbHRhID0gZmxvb3IoZGVsdGEgLyBiYXNlTWludXNUTWluKTtcblx0XHR9XG5cdFx0cmV0dXJuIGZsb29yKGsgKyAoYmFzZU1pbnVzVE1pbiArIDEpICogZGVsdGEgLyAoZGVsdGEgKyBza2V3KSk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seSBzeW1ib2xzIHRvIGEgc3RyaW5nIG9mIFVuaWNvZGVcblx0ICogc3ltYm9scy5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scy5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIHJlc3VsdGluZyBzdHJpbmcgb2YgVW5pY29kZSBzeW1ib2xzLlxuXHQgKi9cblx0ZnVuY3Rpb24gZGVjb2RlKGlucHV0KSB7XG5cdFx0Ly8gRG9uJ3QgdXNlIFVDUy0yXG5cdFx0dmFyIG91dHB1dCA9IFtdLFxuXHRcdCAgICBpbnB1dExlbmd0aCA9IGlucHV0Lmxlbmd0aCxcblx0XHQgICAgb3V0LFxuXHRcdCAgICBpID0gMCxcblx0XHQgICAgbiA9IGluaXRpYWxOLFxuXHRcdCAgICBiaWFzID0gaW5pdGlhbEJpYXMsXG5cdFx0ICAgIGJhc2ljLFxuXHRcdCAgICBqLFxuXHRcdCAgICBpbmRleCxcblx0XHQgICAgb2xkaSxcblx0XHQgICAgdyxcblx0XHQgICAgayxcblx0XHQgICAgZGlnaXQsXG5cdFx0ICAgIHQsXG5cdFx0ICAgIC8qKiBDYWNoZWQgY2FsY3VsYXRpb24gcmVzdWx0cyAqL1xuXHRcdCAgICBiYXNlTWludXNUO1xuXG5cdFx0Ly8gSGFuZGxlIHRoZSBiYXNpYyBjb2RlIHBvaW50czogbGV0IGBiYXNpY2AgYmUgdGhlIG51bWJlciBvZiBpbnB1dCBjb2RlXG5cdFx0Ly8gcG9pbnRzIGJlZm9yZSB0aGUgbGFzdCBkZWxpbWl0ZXIsIG9yIGAwYCBpZiB0aGVyZSBpcyBub25lLCB0aGVuIGNvcHlcblx0XHQvLyB0aGUgZmlyc3QgYmFzaWMgY29kZSBwb2ludHMgdG8gdGhlIG91dHB1dC5cblxuXHRcdGJhc2ljID0gaW5wdXQubGFzdEluZGV4T2YoZGVsaW1pdGVyKTtcblx0XHRpZiAoYmFzaWMgPCAwKSB7XG5cdFx0XHRiYXNpYyA9IDA7XG5cdFx0fVxuXG5cdFx0Zm9yIChqID0gMDsgaiA8IGJhc2ljOyArK2opIHtcblx0XHRcdC8vIGlmIGl0J3Mgbm90IGEgYmFzaWMgY29kZSBwb2ludFxuXHRcdFx0aWYgKGlucHV0LmNoYXJDb2RlQXQoaikgPj0gMHg4MCkge1xuXHRcdFx0XHRlcnJvcignbm90LWJhc2ljJyk7XG5cdFx0XHR9XG5cdFx0XHRvdXRwdXQucHVzaChpbnB1dC5jaGFyQ29kZUF0KGopKTtcblx0XHR9XG5cblx0XHQvLyBNYWluIGRlY29kaW5nIGxvb3A6IHN0YXJ0IGp1c3QgYWZ0ZXIgdGhlIGxhc3QgZGVsaW1pdGVyIGlmIGFueSBiYXNpYyBjb2RlXG5cdFx0Ly8gcG9pbnRzIHdlcmUgY29waWVkOyBzdGFydCBhdCB0aGUgYmVnaW5uaW5nIG90aGVyd2lzZS5cblxuXHRcdGZvciAoaW5kZXggPSBiYXNpYyA+IDAgPyBiYXNpYyArIDEgOiAwOyBpbmRleCA8IGlucHV0TGVuZ3RoOyAvKiBubyBmaW5hbCBleHByZXNzaW9uICovKSB7XG5cblx0XHRcdC8vIGBpbmRleGAgaXMgdGhlIGluZGV4IG9mIHRoZSBuZXh0IGNoYXJhY3RlciB0byBiZSBjb25zdW1lZC5cblx0XHRcdC8vIERlY29kZSBhIGdlbmVyYWxpemVkIHZhcmlhYmxlLWxlbmd0aCBpbnRlZ2VyIGludG8gYGRlbHRhYCxcblx0XHRcdC8vIHdoaWNoIGdldHMgYWRkZWQgdG8gYGlgLiBUaGUgb3ZlcmZsb3cgY2hlY2tpbmcgaXMgZWFzaWVyXG5cdFx0XHQvLyBpZiB3ZSBpbmNyZWFzZSBgaWAgYXMgd2UgZ28sIHRoZW4gc3VidHJhY3Qgb2ZmIGl0cyBzdGFydGluZ1xuXHRcdFx0Ly8gdmFsdWUgYXQgdGhlIGVuZCB0byBvYnRhaW4gYGRlbHRhYC5cblx0XHRcdGZvciAob2xkaSA9IGksIHcgPSAxLCBrID0gYmFzZTsgLyogbm8gY29uZGl0aW9uICovOyBrICs9IGJhc2UpIHtcblxuXHRcdFx0XHRpZiAoaW5kZXggPj0gaW5wdXRMZW5ndGgpIHtcblx0XHRcdFx0XHRlcnJvcignaW52YWxpZC1pbnB1dCcpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZGlnaXQgPSBiYXNpY1RvRGlnaXQoaW5wdXQuY2hhckNvZGVBdChpbmRleCsrKSk7XG5cblx0XHRcdFx0aWYgKGRpZ2l0ID49IGJhc2UgfHwgZGlnaXQgPiBmbG9vcigobWF4SW50IC0gaSkgLyB3KSkge1xuXHRcdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aSArPSBkaWdpdCAqIHc7XG5cdFx0XHRcdHQgPSBrIDw9IGJpYXMgPyB0TWluIDogKGsgPj0gYmlhcyArIHRNYXggPyB0TWF4IDogayAtIGJpYXMpO1xuXG5cdFx0XHRcdGlmIChkaWdpdCA8IHQpIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGJhc2VNaW51c1QgPSBiYXNlIC0gdDtcblx0XHRcdFx0aWYgKHcgPiBmbG9vcihtYXhJbnQgLyBiYXNlTWludXNUKSkge1xuXHRcdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dyAqPSBiYXNlTWludXNUO1xuXG5cdFx0XHR9XG5cblx0XHRcdG91dCA9IG91dHB1dC5sZW5ndGggKyAxO1xuXHRcdFx0YmlhcyA9IGFkYXB0KGkgLSBvbGRpLCBvdXQsIG9sZGkgPT0gMCk7XG5cblx0XHRcdC8vIGBpYCB3YXMgc3VwcG9zZWQgdG8gd3JhcCBhcm91bmQgZnJvbSBgb3V0YCB0byBgMGAsXG5cdFx0XHQvLyBpbmNyZW1lbnRpbmcgYG5gIGVhY2ggdGltZSwgc28gd2UnbGwgZml4IHRoYXQgbm93OlxuXHRcdFx0aWYgKGZsb29yKGkgLyBvdXQpID4gbWF4SW50IC0gbikge1xuXHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdH1cblxuXHRcdFx0biArPSBmbG9vcihpIC8gb3V0KTtcblx0XHRcdGkgJT0gb3V0O1xuXG5cdFx0XHQvLyBJbnNlcnQgYG5gIGF0IHBvc2l0aW9uIGBpYCBvZiB0aGUgb3V0cHV0XG5cdFx0XHRvdXRwdXQuc3BsaWNlKGkrKywgMCwgbik7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gdWNzMmVuY29kZShvdXRwdXQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgc3RyaW5nIG9mIFVuaWNvZGUgc3ltYm9scyAoZS5nLiBhIGRvbWFpbiBuYW1lIGxhYmVsKSB0byBhXG5cdCAqIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5IHN5bWJvbHMuXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIHN0cmluZyBvZiBVbmljb2RlIHN5bWJvbHMuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSByZXN1bHRpbmcgUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scy5cblx0ICovXG5cdGZ1bmN0aW9uIGVuY29kZShpbnB1dCkge1xuXHRcdHZhciBuLFxuXHRcdCAgICBkZWx0YSxcblx0XHQgICAgaGFuZGxlZENQQ291bnQsXG5cdFx0ICAgIGJhc2ljTGVuZ3RoLFxuXHRcdCAgICBiaWFzLFxuXHRcdCAgICBqLFxuXHRcdCAgICBtLFxuXHRcdCAgICBxLFxuXHRcdCAgICBrLFxuXHRcdCAgICB0LFxuXHRcdCAgICBjdXJyZW50VmFsdWUsXG5cdFx0ICAgIG91dHB1dCA9IFtdLFxuXHRcdCAgICAvKiogYGlucHV0TGVuZ3RoYCB3aWxsIGhvbGQgdGhlIG51bWJlciBvZiBjb2RlIHBvaW50cyBpbiBgaW5wdXRgLiAqL1xuXHRcdCAgICBpbnB1dExlbmd0aCxcblx0XHQgICAgLyoqIENhY2hlZCBjYWxjdWxhdGlvbiByZXN1bHRzICovXG5cdFx0ICAgIGhhbmRsZWRDUENvdW50UGx1c09uZSxcblx0XHQgICAgYmFzZU1pbnVzVCxcblx0XHQgICAgcU1pbnVzVDtcblxuXHRcdC8vIENvbnZlcnQgdGhlIGlucHV0IGluIFVDUy0yIHRvIFVuaWNvZGVcblx0XHRpbnB1dCA9IHVjczJkZWNvZGUoaW5wdXQpO1xuXG5cdFx0Ly8gQ2FjaGUgdGhlIGxlbmd0aFxuXHRcdGlucHV0TGVuZ3RoID0gaW5wdXQubGVuZ3RoO1xuXG5cdFx0Ly8gSW5pdGlhbGl6ZSB0aGUgc3RhdGVcblx0XHRuID0gaW5pdGlhbE47XG5cdFx0ZGVsdGEgPSAwO1xuXHRcdGJpYXMgPSBpbml0aWFsQmlhcztcblxuXHRcdC8vIEhhbmRsZSB0aGUgYmFzaWMgY29kZSBwb2ludHNcblx0XHRmb3IgKGogPSAwOyBqIDwgaW5wdXRMZW5ndGg7ICsraikge1xuXHRcdFx0Y3VycmVudFZhbHVlID0gaW5wdXRbal07XG5cdFx0XHRpZiAoY3VycmVudFZhbHVlIDwgMHg4MCkge1xuXHRcdFx0XHRvdXRwdXQucHVzaChzdHJpbmdGcm9tQ2hhckNvZGUoY3VycmVudFZhbHVlKSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aGFuZGxlZENQQ291bnQgPSBiYXNpY0xlbmd0aCA9IG91dHB1dC5sZW5ndGg7XG5cblx0XHQvLyBgaGFuZGxlZENQQ291bnRgIGlzIHRoZSBudW1iZXIgb2YgY29kZSBwb2ludHMgdGhhdCBoYXZlIGJlZW4gaGFuZGxlZDtcblx0XHQvLyBgYmFzaWNMZW5ndGhgIGlzIHRoZSBudW1iZXIgb2YgYmFzaWMgY29kZSBwb2ludHMuXG5cblx0XHQvLyBGaW5pc2ggdGhlIGJhc2ljIHN0cmluZyAtIGlmIGl0IGlzIG5vdCBlbXB0eSAtIHdpdGggYSBkZWxpbWl0ZXJcblx0XHRpZiAoYmFzaWNMZW5ndGgpIHtcblx0XHRcdG91dHB1dC5wdXNoKGRlbGltaXRlcik7XG5cdFx0fVxuXG5cdFx0Ly8gTWFpbiBlbmNvZGluZyBsb29wOlxuXHRcdHdoaWxlIChoYW5kbGVkQ1BDb3VudCA8IGlucHV0TGVuZ3RoKSB7XG5cblx0XHRcdC8vIEFsbCBub24tYmFzaWMgY29kZSBwb2ludHMgPCBuIGhhdmUgYmVlbiBoYW5kbGVkIGFscmVhZHkuIEZpbmQgdGhlIG5leHRcblx0XHRcdC8vIGxhcmdlciBvbmU6XG5cdFx0XHRmb3IgKG0gPSBtYXhJbnQsIGogPSAwOyBqIDwgaW5wdXRMZW5ndGg7ICsraikge1xuXHRcdFx0XHRjdXJyZW50VmFsdWUgPSBpbnB1dFtqXTtcblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA+PSBuICYmIGN1cnJlbnRWYWx1ZSA8IG0pIHtcblx0XHRcdFx0XHRtID0gY3VycmVudFZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEluY3JlYXNlIGBkZWx0YWAgZW5vdWdoIHRvIGFkdmFuY2UgdGhlIGRlY29kZXIncyA8bixpPiBzdGF0ZSB0byA8bSwwPixcblx0XHRcdC8vIGJ1dCBndWFyZCBhZ2FpbnN0IG92ZXJmbG93XG5cdFx0XHRoYW5kbGVkQ1BDb3VudFBsdXNPbmUgPSBoYW5kbGVkQ1BDb3VudCArIDE7XG5cdFx0XHRpZiAobSAtIG4gPiBmbG9vcigobWF4SW50IC0gZGVsdGEpIC8gaGFuZGxlZENQQ291bnRQbHVzT25lKSkge1xuXHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdH1cblxuXHRcdFx0ZGVsdGEgKz0gKG0gLSBuKSAqIGhhbmRsZWRDUENvdW50UGx1c09uZTtcblx0XHRcdG4gPSBtO1xuXG5cdFx0XHRmb3IgKGogPSAwOyBqIDwgaW5wdXRMZW5ndGg7ICsraikge1xuXHRcdFx0XHRjdXJyZW50VmFsdWUgPSBpbnB1dFtqXTtcblxuXHRcdFx0XHRpZiAoY3VycmVudFZhbHVlIDwgbiAmJiArK2RlbHRhID4gbWF4SW50KSB7XG5cdFx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoY3VycmVudFZhbHVlID09IG4pIHtcblx0XHRcdFx0XHQvLyBSZXByZXNlbnQgZGVsdGEgYXMgYSBnZW5lcmFsaXplZCB2YXJpYWJsZS1sZW5ndGggaW50ZWdlclxuXHRcdFx0XHRcdGZvciAocSA9IGRlbHRhLCBrID0gYmFzZTsgLyogbm8gY29uZGl0aW9uICovOyBrICs9IGJhc2UpIHtcblx0XHRcdFx0XHRcdHQgPSBrIDw9IGJpYXMgPyB0TWluIDogKGsgPj0gYmlhcyArIHRNYXggPyB0TWF4IDogayAtIGJpYXMpO1xuXHRcdFx0XHRcdFx0aWYgKHEgPCB0KSB7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cU1pbnVzVCA9IHEgLSB0O1xuXHRcdFx0XHRcdFx0YmFzZU1pbnVzVCA9IGJhc2UgLSB0O1xuXHRcdFx0XHRcdFx0b3V0cHV0LnB1c2goXG5cdFx0XHRcdFx0XHRcdHN0cmluZ0Zyb21DaGFyQ29kZShkaWdpdFRvQmFzaWModCArIHFNaW51c1QgJSBiYXNlTWludXNULCAwKSlcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRxID0gZmxvb3IocU1pbnVzVCAvIGJhc2VNaW51c1QpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdG91dHB1dC5wdXNoKHN0cmluZ0Zyb21DaGFyQ29kZShkaWdpdFRvQmFzaWMocSwgMCkpKTtcblx0XHRcdFx0XHRiaWFzID0gYWRhcHQoZGVsdGEsIGhhbmRsZWRDUENvdW50UGx1c09uZSwgaGFuZGxlZENQQ291bnQgPT0gYmFzaWNMZW5ndGgpO1xuXHRcdFx0XHRcdGRlbHRhID0gMDtcblx0XHRcdFx0XHQrK2hhbmRsZWRDUENvdW50O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdCsrZGVsdGE7XG5cdFx0XHQrK247XG5cblx0XHR9XG5cdFx0cmV0dXJuIG91dHB1dC5qb2luKCcnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIFB1bnljb2RlIHN0cmluZyByZXByZXNlbnRpbmcgYSBkb21haW4gbmFtZSBvciBhbiBlbWFpbCBhZGRyZXNzXG5cdCAqIHRvIFVuaWNvZGUuIE9ubHkgdGhlIFB1bnljb2RlZCBwYXJ0cyBvZiB0aGUgaW5wdXQgd2lsbCBiZSBjb252ZXJ0ZWQsIGkuZS5cblx0ICogaXQgZG9lc24ndCBtYXR0ZXIgaWYgeW91IGNhbGwgaXQgb24gYSBzdHJpbmcgdGhhdCBoYXMgYWxyZWFkeSBiZWVuXG5cdCAqIGNvbnZlcnRlZCB0byBVbmljb2RlLlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBQdW55Y29kZWQgZG9tYWluIG5hbWUgb3IgZW1haWwgYWRkcmVzcyB0b1xuXHQgKiBjb252ZXJ0IHRvIFVuaWNvZGUuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBVbmljb2RlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnaXZlbiBQdW55Y29kZVxuXHQgKiBzdHJpbmcuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b1VuaWNvZGUoaW5wdXQpIHtcblx0XHRyZXR1cm4gbWFwRG9tYWluKGlucHV0LCBmdW5jdGlvbihzdHJpbmcpIHtcblx0XHRcdHJldHVybiByZWdleFB1bnljb2RlLnRlc3Qoc3RyaW5nKVxuXHRcdFx0XHQ/IGRlY29kZShzdHJpbmcuc2xpY2UoNCkudG9Mb3dlckNhc2UoKSlcblx0XHRcdFx0OiBzdHJpbmc7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBVbmljb2RlIHN0cmluZyByZXByZXNlbnRpbmcgYSBkb21haW4gbmFtZSBvciBhbiBlbWFpbCBhZGRyZXNzIHRvXG5cdCAqIFB1bnljb2RlLiBPbmx5IHRoZSBub24tQVNDSUkgcGFydHMgb2YgdGhlIGRvbWFpbiBuYW1lIHdpbGwgYmUgY29udmVydGVkLFxuXHQgKiBpLmUuIGl0IGRvZXNuJ3QgbWF0dGVyIGlmIHlvdSBjYWxsIGl0IHdpdGggYSBkb21haW4gdGhhdCdzIGFscmVhZHkgaW5cblx0ICogQVNDSUkuXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIGRvbWFpbiBuYW1lIG9yIGVtYWlsIGFkZHJlc3MgdG8gY29udmVydCwgYXMgYVxuXHQgKiBVbmljb2RlIHN0cmluZy5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIFB1bnljb2RlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnaXZlbiBkb21haW4gbmFtZSBvclxuXHQgKiBlbWFpbCBhZGRyZXNzLlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9BU0NJSShpbnB1dCkge1xuXHRcdHJldHVybiBtYXBEb21haW4oaW5wdXQsIGZ1bmN0aW9uKHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHJlZ2V4Tm9uQVNDSUkudGVzdChzdHJpbmcpXG5cdFx0XHRcdD8gJ3huLS0nICsgZW5jb2RlKHN0cmluZylcblx0XHRcdFx0OiBzdHJpbmc7XG5cdFx0fSk7XG5cdH1cblxuXHQvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXHQvKiogRGVmaW5lIHRoZSBwdWJsaWMgQVBJICovXG5cdHB1bnljb2RlID0ge1xuXHRcdC8qKlxuXHRcdCAqIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgY3VycmVudCBQdW55Y29kZS5qcyB2ZXJzaW9uIG51bWJlci5cblx0XHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0XHQgKiBAdHlwZSBTdHJpbmdcblx0XHQgKi9cblx0XHQndmVyc2lvbic6ICcxLjQuMScsXG5cdFx0LyoqXG5cdFx0ICogQW4gb2JqZWN0IG9mIG1ldGhvZHMgdG8gY29udmVydCBmcm9tIEphdmFTY3JpcHQncyBpbnRlcm5hbCBjaGFyYWN0ZXJcblx0XHQgKiByZXByZXNlbnRhdGlvbiAoVUNTLTIpIHRvIFVuaWNvZGUgY29kZSBwb2ludHMsIGFuZCBiYWNrLlxuXHRcdCAqIEBzZWUgPGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nPlxuXHRcdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHRcdCAqIEB0eXBlIE9iamVjdFxuXHRcdCAqL1xuXHRcdCd1Y3MyJzoge1xuXHRcdFx0J2RlY29kZSc6IHVjczJkZWNvZGUsXG5cdFx0XHQnZW5jb2RlJzogdWNzMmVuY29kZVxuXHRcdH0sXG5cdFx0J2RlY29kZSc6IGRlY29kZSxcblx0XHQnZW5jb2RlJzogZW5jb2RlLFxuXHRcdCd0b0FTQ0lJJzogdG9BU0NJSSxcblx0XHQndG9Vbmljb2RlJzogdG9Vbmljb2RlXG5cdH07XG5cblx0LyoqIEV4cG9zZSBgcHVueWNvZGVgICovXG5cdC8vIFNvbWUgQU1EIGJ1aWxkIG9wdGltaXplcnMsIGxpa2Ugci5qcywgY2hlY2sgZm9yIHNwZWNpZmljIGNvbmRpdGlvbiBwYXR0ZXJuc1xuXHQvLyBsaWtlIHRoZSBmb2xsb3dpbmc6XG5cdGlmIChcblx0XHR0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiZcblx0XHR0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JyAmJlxuXHRcdGRlZmluZS5hbWRcblx0KSB7XG5cdFx0ZGVmaW5lKCdwdW55Y29kZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHB1bnljb2RlO1xuXHRcdH0pO1xuXHR9IGVsc2UgaWYgKGZyZWVFeHBvcnRzICYmIGZyZWVNb2R1bGUpIHtcblx0XHRpZiAobW9kdWxlLmV4cG9ydHMgPT0gZnJlZUV4cG9ydHMpIHtcblx0XHRcdC8vIGluIE5vZGUuanMsIGlvLmpzLCBvciBSaW5nb0pTIHYwLjguMCtcblx0XHRcdGZyZWVNb2R1bGUuZXhwb3J0cyA9IHB1bnljb2RlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBpbiBOYXJ3aGFsIG9yIFJpbmdvSlMgdjAuNy4wLVxuXHRcdFx0Zm9yIChrZXkgaW4gcHVueWNvZGUpIHtcblx0XHRcdFx0cHVueWNvZGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAoZnJlZUV4cG9ydHNba2V5XSA9IHB1bnljb2RlW2tleV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHQvLyBpbiBSaGlubyBvciBhIHdlYiBicm93c2VyXG5cdFx0cm9vdC5wdW55Y29kZSA9IHB1bnljb2RlO1xuXHR9XG5cbn0odGhpcykpO1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxuLy8gSWYgb2JqLmhhc093blByb3BlcnR5IGhhcyBiZWVuIG92ZXJyaWRkZW4sIHRoZW4gY2FsbGluZ1xuLy8gb2JqLmhhc093blByb3BlcnR5KHByb3ApIHdpbGwgYnJlYWsuXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qb3llbnQvbm9kZS9pc3N1ZXMvMTcwN1xuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihxcywgc2VwLCBlcSwgb3B0aW9ucykge1xuICBzZXAgPSBzZXAgfHwgJyYnO1xuICBlcSA9IGVxIHx8ICc9JztcbiAgdmFyIG9iaiA9IHt9O1xuXG4gIGlmICh0eXBlb2YgcXMgIT09ICdzdHJpbmcnIHx8IHFzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICB2YXIgcmVnZXhwID0gL1xcKy9nO1xuICBxcyA9IHFzLnNwbGl0KHNlcCk7XG5cbiAgdmFyIG1heEtleXMgPSAxMDAwO1xuICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5tYXhLZXlzID09PSAnbnVtYmVyJykge1xuICAgIG1heEtleXMgPSBvcHRpb25zLm1heEtleXM7XG4gIH1cblxuICB2YXIgbGVuID0gcXMubGVuZ3RoO1xuICAvLyBtYXhLZXlzIDw9IDAgbWVhbnMgdGhhdCB3ZSBzaG91bGQgbm90IGxpbWl0IGtleXMgY291bnRcbiAgaWYgKG1heEtleXMgPiAwICYmIGxlbiA+IG1heEtleXMpIHtcbiAgICBsZW4gPSBtYXhLZXlzO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIHZhciB4ID0gcXNbaV0ucmVwbGFjZShyZWdleHAsICclMjAnKSxcbiAgICAgICAgaWR4ID0geC5pbmRleE9mKGVxKSxcbiAgICAgICAga3N0ciwgdnN0ciwgaywgdjtcblxuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAga3N0ciA9IHguc3Vic3RyKDAsIGlkeCk7XG4gICAgICB2c3RyID0geC5zdWJzdHIoaWR4ICsgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtzdHIgPSB4O1xuICAgICAgdnN0ciA9ICcnO1xuICAgIH1cblxuICAgIGsgPSBkZWNvZGVVUklDb21wb25lbnQoa3N0cik7XG4gICAgdiA9IGRlY29kZVVSSUNvbXBvbmVudCh2c3RyKTtcblxuICAgIGlmICghaGFzT3duUHJvcGVydHkob2JqLCBrKSkge1xuICAgICAgb2JqW2tdID0gdjtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkob2JqW2tdKSkge1xuICAgICAgb2JqW2tdLnB1c2godik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9ialtrXSA9IFtvYmpba10sIHZdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHhzKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBzdHJpbmdpZnlQcmltaXRpdmUgPSBmdW5jdGlvbih2KSB7XG4gIHN3aXRjaCAodHlwZW9mIHYpIHtcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgcmV0dXJuIHY7XG5cbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIHJldHVybiB2ID8gJ3RydWUnIDogJ2ZhbHNlJztcblxuICAgIGNhc2UgJ251bWJlcic6XG4gICAgICByZXR1cm4gaXNGaW5pdGUodikgPyB2IDogJyc7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaiwgc2VwLCBlcSwgbmFtZSkge1xuICBzZXAgPSBzZXAgfHwgJyYnO1xuICBlcSA9IGVxIHx8ICc9JztcbiAgaWYgKG9iaiA9PT0gbnVsbCkge1xuICAgIG9iaiA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBtYXAob2JqZWN0S2V5cyhvYmopLCBmdW5jdGlvbihrKSB7XG4gICAgICB2YXIga3MgPSBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKGspKSArIGVxO1xuICAgICAgaWYgKGlzQXJyYXkob2JqW2tdKSkge1xuICAgICAgICByZXR1cm4gbWFwKG9ialtrXSwgZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBrcyArIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUodikpO1xuICAgICAgICB9KS5qb2luKHNlcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9ialtrXSkpO1xuICAgICAgfVxuICAgIH0pLmpvaW4oc2VwKTtcblxuICB9XG5cbiAgaWYgKCFuYW1lKSByZXR1cm4gJyc7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG5hbWUpKSArIGVxICtcbiAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUob2JqKSk7XG59O1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHhzKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuZnVuY3Rpb24gbWFwICh4cywgZikge1xuICBpZiAoeHMubWFwKSByZXR1cm4geHMubWFwKGYpO1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICByZXMucHVzaChmKHhzW2ldLCBpKSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxudmFyIG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciByZXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSByZXMucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLmRlY29kZSA9IGV4cG9ydHMucGFyc2UgPSByZXF1aXJlKCcuL2RlY29kZScpO1xuZXhwb3J0cy5lbmNvZGUgPSBleHBvcnRzLnN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vZW5jb2RlJyk7XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHVueWNvZGUgPSByZXF1aXJlKCdwdW55Y29kZScpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuZXhwb3J0cy5wYXJzZSA9IHVybFBhcnNlO1xuZXhwb3J0cy5yZXNvbHZlID0gdXJsUmVzb2x2ZTtcbmV4cG9ydHMucmVzb2x2ZU9iamVjdCA9IHVybFJlc29sdmVPYmplY3Q7XG5leHBvcnRzLmZvcm1hdCA9IHVybEZvcm1hdDtcblxuZXhwb3J0cy5VcmwgPSBVcmw7XG5cbmZ1bmN0aW9uIFVybCgpIHtcbiAgdGhpcy5wcm90b2NvbCA9IG51bGw7XG4gIHRoaXMuc2xhc2hlcyA9IG51bGw7XG4gIHRoaXMuYXV0aCA9IG51bGw7XG4gIHRoaXMuaG9zdCA9IG51bGw7XG4gIHRoaXMucG9ydCA9IG51bGw7XG4gIHRoaXMuaG9zdG5hbWUgPSBudWxsO1xuICB0aGlzLmhhc2ggPSBudWxsO1xuICB0aGlzLnNlYXJjaCA9IG51bGw7XG4gIHRoaXMucXVlcnkgPSBudWxsO1xuICB0aGlzLnBhdGhuYW1lID0gbnVsbDtcbiAgdGhpcy5wYXRoID0gbnVsbDtcbiAgdGhpcy5ocmVmID0gbnVsbDtcbn1cblxuLy8gUmVmZXJlbmNlOiBSRkMgMzk4NiwgUkZDIDE4MDgsIFJGQyAyMzk2XG5cbi8vIGRlZmluZSB0aGVzZSBoZXJlIHNvIGF0IGxlYXN0IHRoZXkgb25seSBoYXZlIHRvIGJlXG4vLyBjb21waWxlZCBvbmNlIG9uIHRoZSBmaXJzdCBtb2R1bGUgbG9hZC5cbnZhciBwcm90b2NvbFBhdHRlcm4gPSAvXihbYS16MC05ListXSs6KS9pLFxuICAgIHBvcnRQYXR0ZXJuID0gLzpbMC05XSokLyxcblxuICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgYSBzaW1wbGUgcGF0aCBVUkxcbiAgICBzaW1wbGVQYXRoUGF0dGVybiA9IC9eKFxcL1xcLz8oPyFcXC8pW15cXD9cXHNdKikoXFw/W15cXHNdKik/JC8sXG5cbiAgICAvLyBSRkMgMjM5NjogY2hhcmFjdGVycyByZXNlcnZlZCBmb3IgZGVsaW1pdGluZyBVUkxzLlxuICAgIC8vIFdlIGFjdHVhbGx5IGp1c3QgYXV0by1lc2NhcGUgdGhlc2UuXG4gICAgZGVsaW1zID0gWyc8JywgJz4nLCAnXCInLCAnYCcsICcgJywgJ1xccicsICdcXG4nLCAnXFx0J10sXG5cbiAgICAvLyBSRkMgMjM5NjogY2hhcmFjdGVycyBub3QgYWxsb3dlZCBmb3IgdmFyaW91cyByZWFzb25zLlxuICAgIHVud2lzZSA9IFsneycsICd9JywgJ3wnLCAnXFxcXCcsICdeJywgJ2AnXS5jb25jYXQoZGVsaW1zKSxcblxuICAgIC8vIEFsbG93ZWQgYnkgUkZDcywgYnV0IGNhdXNlIG9mIFhTUyBhdHRhY2tzLiAgQWx3YXlzIGVzY2FwZSB0aGVzZS5cbiAgICBhdXRvRXNjYXBlID0gWydcXCcnXS5jb25jYXQodW53aXNlKSxcbiAgICAvLyBDaGFyYWN0ZXJzIHRoYXQgYXJlIG5ldmVyIGV2ZXIgYWxsb3dlZCBpbiBhIGhvc3RuYW1lLlxuICAgIC8vIE5vdGUgdGhhdCBhbnkgaW52YWxpZCBjaGFycyBhcmUgYWxzbyBoYW5kbGVkLCBidXQgdGhlc2VcbiAgICAvLyBhcmUgdGhlIG9uZXMgdGhhdCBhcmUgKmV4cGVjdGVkKiB0byBiZSBzZWVuLCBzbyB3ZSBmYXN0LXBhdGhcbiAgICAvLyB0aGVtLlxuICAgIG5vbkhvc3RDaGFycyA9IFsnJScsICcvJywgJz8nLCAnOycsICcjJ10uY29uY2F0KGF1dG9Fc2NhcGUpLFxuICAgIGhvc3RFbmRpbmdDaGFycyA9IFsnLycsICc/JywgJyMnXSxcbiAgICBob3N0bmFtZU1heExlbiA9IDI1NSxcbiAgICBob3N0bmFtZVBhcnRQYXR0ZXJuID0gL15bK2EtejAtOUEtWl8tXXswLDYzfSQvLFxuICAgIGhvc3RuYW1lUGFydFN0YXJ0ID0gL14oWythLXowLTlBLVpfLV17MCw2M30pKC4qKSQvLFxuICAgIC8vIHByb3RvY29scyB0aGF0IGNhbiBhbGxvdyBcInVuc2FmZVwiIGFuZCBcInVud2lzZVwiIGNoYXJzLlxuICAgIHVuc2FmZVByb3RvY29sID0ge1xuICAgICAgJ2phdmFzY3JpcHQnOiB0cnVlLFxuICAgICAgJ2phdmFzY3JpcHQ6JzogdHJ1ZVxuICAgIH0sXG4gICAgLy8gcHJvdG9jb2xzIHRoYXQgbmV2ZXIgaGF2ZSBhIGhvc3RuYW1lLlxuICAgIGhvc3RsZXNzUHJvdG9jb2wgPSB7XG4gICAgICAnamF2YXNjcmlwdCc6IHRydWUsXG4gICAgICAnamF2YXNjcmlwdDonOiB0cnVlXG4gICAgfSxcbiAgICAvLyBwcm90b2NvbHMgdGhhdCBhbHdheXMgY29udGFpbiBhIC8vIGJpdC5cbiAgICBzbGFzaGVkUHJvdG9jb2wgPSB7XG4gICAgICAnaHR0cCc6IHRydWUsXG4gICAgICAnaHR0cHMnOiB0cnVlLFxuICAgICAgJ2Z0cCc6IHRydWUsXG4gICAgICAnZ29waGVyJzogdHJ1ZSxcbiAgICAgICdmaWxlJzogdHJ1ZSxcbiAgICAgICdodHRwOic6IHRydWUsXG4gICAgICAnaHR0cHM6JzogdHJ1ZSxcbiAgICAgICdmdHA6JzogdHJ1ZSxcbiAgICAgICdnb3BoZXI6JzogdHJ1ZSxcbiAgICAgICdmaWxlOic6IHRydWVcbiAgICB9LFxuICAgIHF1ZXJ5c3RyaW5nID0gcmVxdWlyZSgncXVlcnlzdHJpbmcnKTtcblxuZnVuY3Rpb24gdXJsUGFyc2UodXJsLCBwYXJzZVF1ZXJ5U3RyaW5nLCBzbGFzaGVzRGVub3RlSG9zdCkge1xuICBpZiAodXJsICYmIHV0aWwuaXNPYmplY3QodXJsKSAmJiB1cmwgaW5zdGFuY2VvZiBVcmwpIHJldHVybiB1cmw7XG5cbiAgdmFyIHUgPSBuZXcgVXJsO1xuICB1LnBhcnNlKHVybCwgcGFyc2VRdWVyeVN0cmluZywgc2xhc2hlc0Rlbm90ZUhvc3QpO1xuICByZXR1cm4gdTtcbn1cblxuVXJsLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKHVybCwgcGFyc2VRdWVyeVN0cmluZywgc2xhc2hlc0Rlbm90ZUhvc3QpIHtcbiAgaWYgKCF1dGlsLmlzU3RyaW5nKHVybCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUGFyYW1ldGVyICd1cmwnIG11c3QgYmUgYSBzdHJpbmcsIG5vdCBcIiArIHR5cGVvZiB1cmwpO1xuICB9XG5cbiAgLy8gQ29weSBjaHJvbWUsIElFLCBvcGVyYSBiYWNrc2xhc2gtaGFuZGxpbmcgYmVoYXZpb3IuXG4gIC8vIEJhY2sgc2xhc2hlcyBiZWZvcmUgdGhlIHF1ZXJ5IHN0cmluZyBnZXQgY29udmVydGVkIHRvIGZvcndhcmQgc2xhc2hlc1xuICAvLyBTZWU6IGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0yNTkxNlxuICB2YXIgcXVlcnlJbmRleCA9IHVybC5pbmRleE9mKCc/JyksXG4gICAgICBzcGxpdHRlciA9XG4gICAgICAgICAgKHF1ZXJ5SW5kZXggIT09IC0xICYmIHF1ZXJ5SW5kZXggPCB1cmwuaW5kZXhPZignIycpKSA/ICc/JyA6ICcjJyxcbiAgICAgIHVTcGxpdCA9IHVybC5zcGxpdChzcGxpdHRlciksXG4gICAgICBzbGFzaFJlZ2V4ID0gL1xcXFwvZztcbiAgdVNwbGl0WzBdID0gdVNwbGl0WzBdLnJlcGxhY2Uoc2xhc2hSZWdleCwgJy8nKTtcbiAgdXJsID0gdVNwbGl0LmpvaW4oc3BsaXR0ZXIpO1xuXG4gIHZhciByZXN0ID0gdXJsO1xuXG4gIC8vIHRyaW0gYmVmb3JlIHByb2NlZWRpbmcuXG4gIC8vIFRoaXMgaXMgdG8gc3VwcG9ydCBwYXJzZSBzdHVmZiBsaWtlIFwiICBodHRwOi8vZm9vLmNvbSAgXFxuXCJcbiAgcmVzdCA9IHJlc3QudHJpbSgpO1xuXG4gIGlmICghc2xhc2hlc0Rlbm90ZUhvc3QgJiYgdXJsLnNwbGl0KCcjJykubGVuZ3RoID09PSAxKSB7XG4gICAgLy8gVHJ5IGZhc3QgcGF0aCByZWdleHBcbiAgICB2YXIgc2ltcGxlUGF0aCA9IHNpbXBsZVBhdGhQYXR0ZXJuLmV4ZWMocmVzdCk7XG4gICAgaWYgKHNpbXBsZVBhdGgpIHtcbiAgICAgIHRoaXMucGF0aCA9IHJlc3Q7XG4gICAgICB0aGlzLmhyZWYgPSByZXN0O1xuICAgICAgdGhpcy5wYXRobmFtZSA9IHNpbXBsZVBhdGhbMV07XG4gICAgICBpZiAoc2ltcGxlUGF0aFsyXSkge1xuICAgICAgICB0aGlzLnNlYXJjaCA9IHNpbXBsZVBhdGhbMl07XG4gICAgICAgIGlmIChwYXJzZVF1ZXJ5U3RyaW5nKSB7XG4gICAgICAgICAgdGhpcy5xdWVyeSA9IHF1ZXJ5c3RyaW5nLnBhcnNlKHRoaXMuc2VhcmNoLnN1YnN0cigxKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5xdWVyeSA9IHRoaXMuc2VhcmNoLnN1YnN0cigxKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChwYXJzZVF1ZXJ5U3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoID0gJyc7XG4gICAgICAgIHRoaXMucXVlcnkgPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfVxuXG4gIHZhciBwcm90byA9IHByb3RvY29sUGF0dGVybi5leGVjKHJlc3QpO1xuICBpZiAocHJvdG8pIHtcbiAgICBwcm90byA9IHByb3RvWzBdO1xuICAgIHZhciBsb3dlclByb3RvID0gcHJvdG8udG9Mb3dlckNhc2UoKTtcbiAgICB0aGlzLnByb3RvY29sID0gbG93ZXJQcm90bztcbiAgICByZXN0ID0gcmVzdC5zdWJzdHIocHJvdG8ubGVuZ3RoKTtcbiAgfVxuXG4gIC8vIGZpZ3VyZSBvdXQgaWYgaXQncyBnb3QgYSBob3N0XG4gIC8vIHVzZXJAc2VydmVyIGlzICphbHdheXMqIGludGVycHJldGVkIGFzIGEgaG9zdG5hbWUsIGFuZCB1cmxcbiAgLy8gcmVzb2x1dGlvbiB3aWxsIHRyZWF0IC8vZm9vL2JhciBhcyBob3N0PWZvbyxwYXRoPWJhciBiZWNhdXNlIHRoYXQnc1xuICAvLyBob3cgdGhlIGJyb3dzZXIgcmVzb2x2ZXMgcmVsYXRpdmUgVVJMcy5cbiAgaWYgKHNsYXNoZXNEZW5vdGVIb3N0IHx8IHByb3RvIHx8IHJlc3QubWF0Y2goL15cXC9cXC9bXkBcXC9dK0BbXkBcXC9dKy8pKSB7XG4gICAgdmFyIHNsYXNoZXMgPSByZXN0LnN1YnN0cigwLCAyKSA9PT0gJy8vJztcbiAgICBpZiAoc2xhc2hlcyAmJiAhKHByb3RvICYmIGhvc3RsZXNzUHJvdG9jb2xbcHJvdG9dKSkge1xuICAgICAgcmVzdCA9IHJlc3Quc3Vic3RyKDIpO1xuICAgICAgdGhpcy5zbGFzaGVzID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWhvc3RsZXNzUHJvdG9jb2xbcHJvdG9dICYmXG4gICAgICAoc2xhc2hlcyB8fCAocHJvdG8gJiYgIXNsYXNoZWRQcm90b2NvbFtwcm90b10pKSkge1xuXG4gICAgLy8gdGhlcmUncyBhIGhvc3RuYW1lLlxuICAgIC8vIHRoZSBmaXJzdCBpbnN0YW5jZSBvZiAvLCA/LCA7LCBvciAjIGVuZHMgdGhlIGhvc3QuXG4gICAgLy9cbiAgICAvLyBJZiB0aGVyZSBpcyBhbiBAIGluIHRoZSBob3N0bmFtZSwgdGhlbiBub24taG9zdCBjaGFycyAqYXJlKiBhbGxvd2VkXG4gICAgLy8gdG8gdGhlIGxlZnQgb2YgdGhlIGxhc3QgQCBzaWduLCB1bmxlc3Mgc29tZSBob3N0LWVuZGluZyBjaGFyYWN0ZXJcbiAgICAvLyBjb21lcyAqYmVmb3JlKiB0aGUgQC1zaWduLlxuICAgIC8vIFVSTHMgYXJlIG9ibm94aW91cy5cbiAgICAvL1xuICAgIC8vIGV4OlxuICAgIC8vIGh0dHA6Ly9hQGJAYy8gPT4gdXNlcjphQGIgaG9zdDpjXG4gICAgLy8gaHR0cDovL2FAYj9AYyA9PiB1c2VyOmEgaG9zdDpjIHBhdGg6Lz9AY1xuXG4gICAgLy8gdjAuMTIgVE9ETyhpc2FhY3MpOiBUaGlzIGlzIG5vdCBxdWl0ZSBob3cgQ2hyb21lIGRvZXMgdGhpbmdzLlxuICAgIC8vIFJldmlldyBvdXIgdGVzdCBjYXNlIGFnYWluc3QgYnJvd3NlcnMgbW9yZSBjb21wcmVoZW5zaXZlbHkuXG5cbiAgICAvLyBmaW5kIHRoZSBmaXJzdCBpbnN0YW5jZSBvZiBhbnkgaG9zdEVuZGluZ0NoYXJzXG4gICAgdmFyIGhvc3RFbmQgPSAtMTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhvc3RFbmRpbmdDaGFycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGhlYyA9IHJlc3QuaW5kZXhPZihob3N0RW5kaW5nQ2hhcnNbaV0pO1xuICAgICAgaWYgKGhlYyAhPT0gLTEgJiYgKGhvc3RFbmQgPT09IC0xIHx8IGhlYyA8IGhvc3RFbmQpKVxuICAgICAgICBob3N0RW5kID0gaGVjO1xuICAgIH1cblxuICAgIC8vIGF0IHRoaXMgcG9pbnQsIGVpdGhlciB3ZSBoYXZlIGFuIGV4cGxpY2l0IHBvaW50IHdoZXJlIHRoZVxuICAgIC8vIGF1dGggcG9ydGlvbiBjYW5ub3QgZ28gcGFzdCwgb3IgdGhlIGxhc3QgQCBjaGFyIGlzIHRoZSBkZWNpZGVyLlxuICAgIHZhciBhdXRoLCBhdFNpZ247XG4gICAgaWYgKGhvc3RFbmQgPT09IC0xKSB7XG4gICAgICAvLyBhdFNpZ24gY2FuIGJlIGFueXdoZXJlLlxuICAgICAgYXRTaWduID0gcmVzdC5sYXN0SW5kZXhPZignQCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBhdFNpZ24gbXVzdCBiZSBpbiBhdXRoIHBvcnRpb24uXG4gICAgICAvLyBodHRwOi8vYUBiL2NAZCA9PiBob3N0OmIgYXV0aDphIHBhdGg6L2NAZFxuICAgICAgYXRTaWduID0gcmVzdC5sYXN0SW5kZXhPZignQCcsIGhvc3RFbmQpO1xuICAgIH1cblxuICAgIC8vIE5vdyB3ZSBoYXZlIGEgcG9ydGlvbiB3aGljaCBpcyBkZWZpbml0ZWx5IHRoZSBhdXRoLlxuICAgIC8vIFB1bGwgdGhhdCBvZmYuXG4gICAgaWYgKGF0U2lnbiAhPT0gLTEpIHtcbiAgICAgIGF1dGggPSByZXN0LnNsaWNlKDAsIGF0U2lnbik7XG4gICAgICByZXN0ID0gcmVzdC5zbGljZShhdFNpZ24gKyAxKTtcbiAgICAgIHRoaXMuYXV0aCA9IGRlY29kZVVSSUNvbXBvbmVudChhdXRoKTtcbiAgICB9XG5cbiAgICAvLyB0aGUgaG9zdCBpcyB0aGUgcmVtYWluaW5nIHRvIHRoZSBsZWZ0IG9mIHRoZSBmaXJzdCBub24taG9zdCBjaGFyXG4gICAgaG9zdEVuZCA9IC0xO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9uSG9zdENoYXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaGVjID0gcmVzdC5pbmRleE9mKG5vbkhvc3RDaGFyc1tpXSk7XG4gICAgICBpZiAoaGVjICE9PSAtMSAmJiAoaG9zdEVuZCA9PT0gLTEgfHwgaGVjIDwgaG9zdEVuZCkpXG4gICAgICAgIGhvc3RFbmQgPSBoZWM7XG4gICAgfVxuICAgIC8vIGlmIHdlIHN0aWxsIGhhdmUgbm90IGhpdCBpdCwgdGhlbiB0aGUgZW50aXJlIHRoaW5nIGlzIGEgaG9zdC5cbiAgICBpZiAoaG9zdEVuZCA9PT0gLTEpXG4gICAgICBob3N0RW5kID0gcmVzdC5sZW5ndGg7XG5cbiAgICB0aGlzLmhvc3QgPSByZXN0LnNsaWNlKDAsIGhvc3RFbmQpO1xuICAgIHJlc3QgPSByZXN0LnNsaWNlKGhvc3RFbmQpO1xuXG4gICAgLy8gcHVsbCBvdXQgcG9ydC5cbiAgICB0aGlzLnBhcnNlSG9zdCgpO1xuXG4gICAgLy8gd2UndmUgaW5kaWNhdGVkIHRoYXQgdGhlcmUgaXMgYSBob3N0bmFtZSxcbiAgICAvLyBzbyBldmVuIGlmIGl0J3MgZW1wdHksIGl0IGhhcyB0byBiZSBwcmVzZW50LlxuICAgIHRoaXMuaG9zdG5hbWUgPSB0aGlzLmhvc3RuYW1lIHx8ICcnO1xuXG4gICAgLy8gaWYgaG9zdG5hbWUgYmVnaW5zIHdpdGggWyBhbmQgZW5kcyB3aXRoIF1cbiAgICAvLyBhc3N1bWUgdGhhdCBpdCdzIGFuIElQdjYgYWRkcmVzcy5cbiAgICB2YXIgaXB2Nkhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZVswXSA9PT0gJ1snICYmXG4gICAgICAgIHRoaXMuaG9zdG5hbWVbdGhpcy5ob3N0bmFtZS5sZW5ndGggLSAxXSA9PT0gJ10nO1xuXG4gICAgLy8gdmFsaWRhdGUgYSBsaXR0bGUuXG4gICAgaWYgKCFpcHY2SG9zdG5hbWUpIHtcbiAgICAgIHZhciBob3N0cGFydHMgPSB0aGlzLmhvc3RuYW1lLnNwbGl0KC9cXC4vKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gaG9zdHBhcnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB2YXIgcGFydCA9IGhvc3RwYXJ0c1tpXTtcbiAgICAgICAgaWYgKCFwYXJ0KSBjb250aW51ZTtcbiAgICAgICAgaWYgKCFwYXJ0Lm1hdGNoKGhvc3RuYW1lUGFydFBhdHRlcm4pKSB7XG4gICAgICAgICAgdmFyIG5ld3BhcnQgPSAnJztcbiAgICAgICAgICBmb3IgKHZhciBqID0gMCwgayA9IHBhcnQubGVuZ3RoOyBqIDwgazsgaisrKSB7XG4gICAgICAgICAgICBpZiAocGFydC5jaGFyQ29kZUF0KGopID4gMTI3KSB7XG4gICAgICAgICAgICAgIC8vIHdlIHJlcGxhY2Ugbm9uLUFTQ0lJIGNoYXIgd2l0aCBhIHRlbXBvcmFyeSBwbGFjZWhvbGRlclxuICAgICAgICAgICAgICAvLyB3ZSBuZWVkIHRoaXMgdG8gbWFrZSBzdXJlIHNpemUgb2YgaG9zdG5hbWUgaXMgbm90XG4gICAgICAgICAgICAgIC8vIGJyb2tlbiBieSByZXBsYWNpbmcgbm9uLUFTQ0lJIGJ5IG5vdGhpbmdcbiAgICAgICAgICAgICAgbmV3cGFydCArPSAneCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBuZXdwYXJ0ICs9IHBhcnRbal07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIHdlIHRlc3QgYWdhaW4gd2l0aCBBU0NJSSBjaGFyIG9ubHlcbiAgICAgICAgICBpZiAoIW5ld3BhcnQubWF0Y2goaG9zdG5hbWVQYXJ0UGF0dGVybikpIHtcbiAgICAgICAgICAgIHZhciB2YWxpZFBhcnRzID0gaG9zdHBhcnRzLnNsaWNlKDAsIGkpO1xuICAgICAgICAgICAgdmFyIG5vdEhvc3QgPSBob3N0cGFydHMuc2xpY2UoaSArIDEpO1xuICAgICAgICAgICAgdmFyIGJpdCA9IHBhcnQubWF0Y2goaG9zdG5hbWVQYXJ0U3RhcnQpO1xuICAgICAgICAgICAgaWYgKGJpdCkge1xuICAgICAgICAgICAgICB2YWxpZFBhcnRzLnB1c2goYml0WzFdKTtcbiAgICAgICAgICAgICAgbm90SG9zdC51bnNoaWZ0KGJpdFsyXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm90SG9zdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgcmVzdCA9ICcvJyArIG5vdEhvc3Quam9pbignLicpICsgcmVzdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaG9zdG5hbWUgPSB2YWxpZFBhcnRzLmpvaW4oJy4nKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmhvc3RuYW1lLmxlbmd0aCA+IGhvc3RuYW1lTWF4TGVuKSB7XG4gICAgICB0aGlzLmhvc3RuYW1lID0gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGhvc3RuYW1lcyBhcmUgYWx3YXlzIGxvd2VyIGNhc2UuXG4gICAgICB0aGlzLmhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIGlmICghaXB2Nkhvc3RuYW1lKSB7XG4gICAgICAvLyBJRE5BIFN1cHBvcnQ6IFJldHVybnMgYSBwdW55Y29kZWQgcmVwcmVzZW50YXRpb24gb2YgXCJkb21haW5cIi5cbiAgICAgIC8vIEl0IG9ubHkgY29udmVydHMgcGFydHMgb2YgdGhlIGRvbWFpbiBuYW1lIHRoYXRcbiAgICAgIC8vIGhhdmUgbm9uLUFTQ0lJIGNoYXJhY3RlcnMsIGkuZS4gaXQgZG9lc24ndCBtYXR0ZXIgaWZcbiAgICAgIC8vIHlvdSBjYWxsIGl0IHdpdGggYSBkb21haW4gdGhhdCBhbHJlYWR5IGlzIEFTQ0lJLW9ubHkuXG4gICAgICB0aGlzLmhvc3RuYW1lID0gcHVueWNvZGUudG9BU0NJSSh0aGlzLmhvc3RuYW1lKTtcbiAgICB9XG5cbiAgICB2YXIgcCA9IHRoaXMucG9ydCA/ICc6JyArIHRoaXMucG9ydCA6ICcnO1xuICAgIHZhciBoID0gdGhpcy5ob3N0bmFtZSB8fCAnJztcbiAgICB0aGlzLmhvc3QgPSBoICsgcDtcbiAgICB0aGlzLmhyZWYgKz0gdGhpcy5ob3N0O1xuXG4gICAgLy8gc3RyaXAgWyBhbmQgXSBmcm9tIHRoZSBob3N0bmFtZVxuICAgIC8vIHRoZSBob3N0IGZpZWxkIHN0aWxsIHJldGFpbnMgdGhlbSwgdGhvdWdoXG4gICAgaWYgKGlwdjZIb3N0bmFtZSkge1xuICAgICAgdGhpcy5ob3N0bmFtZSA9IHRoaXMuaG9zdG5hbWUuc3Vic3RyKDEsIHRoaXMuaG9zdG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBpZiAocmVzdFswXSAhPT0gJy8nKSB7XG4gICAgICAgIHJlc3QgPSAnLycgKyByZXN0O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIG5vdyByZXN0IGlzIHNldCB0byB0aGUgcG9zdC1ob3N0IHN0dWZmLlxuICAvLyBjaG9wIG9mZiBhbnkgZGVsaW0gY2hhcnMuXG4gIGlmICghdW5zYWZlUHJvdG9jb2xbbG93ZXJQcm90b10pIHtcblxuICAgIC8vIEZpcnN0LCBtYWtlIDEwMCUgc3VyZSB0aGF0IGFueSBcImF1dG9Fc2NhcGVcIiBjaGFycyBnZXRcbiAgICAvLyBlc2NhcGVkLCBldmVuIGlmIGVuY29kZVVSSUNvbXBvbmVudCBkb2Vzbid0IHRoaW5rIHRoZXlcbiAgICAvLyBuZWVkIHRvIGJlLlxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gYXV0b0VzY2FwZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHZhciBhZSA9IGF1dG9Fc2NhcGVbaV07XG4gICAgICBpZiAocmVzdC5pbmRleE9mKGFlKSA9PT0gLTEpXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgdmFyIGVzYyA9IGVuY29kZVVSSUNvbXBvbmVudChhZSk7XG4gICAgICBpZiAoZXNjID09PSBhZSkge1xuICAgICAgICBlc2MgPSBlc2NhcGUoYWUpO1xuICAgICAgfVxuICAgICAgcmVzdCA9IHJlc3Quc3BsaXQoYWUpLmpvaW4oZXNjKTtcbiAgICB9XG4gIH1cblxuXG4gIC8vIGNob3Agb2ZmIGZyb20gdGhlIHRhaWwgZmlyc3QuXG4gIHZhciBoYXNoID0gcmVzdC5pbmRleE9mKCcjJyk7XG4gIGlmIChoYXNoICE9PSAtMSkge1xuICAgIC8vIGdvdCBhIGZyYWdtZW50IHN0cmluZy5cbiAgICB0aGlzLmhhc2ggPSByZXN0LnN1YnN0cihoYXNoKTtcbiAgICByZXN0ID0gcmVzdC5zbGljZSgwLCBoYXNoKTtcbiAgfVxuICB2YXIgcW0gPSByZXN0LmluZGV4T2YoJz8nKTtcbiAgaWYgKHFtICE9PSAtMSkge1xuICAgIHRoaXMuc2VhcmNoID0gcmVzdC5zdWJzdHIocW0pO1xuICAgIHRoaXMucXVlcnkgPSByZXN0LnN1YnN0cihxbSArIDEpO1xuICAgIGlmIChwYXJzZVF1ZXJ5U3RyaW5nKSB7XG4gICAgICB0aGlzLnF1ZXJ5ID0gcXVlcnlzdHJpbmcucGFyc2UodGhpcy5xdWVyeSk7XG4gICAgfVxuICAgIHJlc3QgPSByZXN0LnNsaWNlKDAsIHFtKTtcbiAgfSBlbHNlIGlmIChwYXJzZVF1ZXJ5U3RyaW5nKSB7XG4gICAgLy8gbm8gcXVlcnkgc3RyaW5nLCBidXQgcGFyc2VRdWVyeVN0cmluZyBzdGlsbCByZXF1ZXN0ZWRcbiAgICB0aGlzLnNlYXJjaCA9ICcnO1xuICAgIHRoaXMucXVlcnkgPSB7fTtcbiAgfVxuICBpZiAocmVzdCkgdGhpcy5wYXRobmFtZSA9IHJlc3Q7XG4gIGlmIChzbGFzaGVkUHJvdG9jb2xbbG93ZXJQcm90b10gJiZcbiAgICAgIHRoaXMuaG9zdG5hbWUgJiYgIXRoaXMucGF0aG5hbWUpIHtcbiAgICB0aGlzLnBhdGhuYW1lID0gJy8nO1xuICB9XG5cbiAgLy90byBzdXBwb3J0IGh0dHAucmVxdWVzdFxuICBpZiAodGhpcy5wYXRobmFtZSB8fCB0aGlzLnNlYXJjaCkge1xuICAgIHZhciBwID0gdGhpcy5wYXRobmFtZSB8fCAnJztcbiAgICB2YXIgcyA9IHRoaXMuc2VhcmNoIHx8ICcnO1xuICAgIHRoaXMucGF0aCA9IHAgKyBzO1xuICB9XG5cbiAgLy8gZmluYWxseSwgcmVjb25zdHJ1Y3QgdGhlIGhyZWYgYmFzZWQgb24gd2hhdCBoYXMgYmVlbiB2YWxpZGF0ZWQuXG4gIHRoaXMuaHJlZiA9IHRoaXMuZm9ybWF0KCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZm9ybWF0IGEgcGFyc2VkIG9iamVjdCBpbnRvIGEgdXJsIHN0cmluZ1xuZnVuY3Rpb24gdXJsRm9ybWF0KG9iaikge1xuICAvLyBlbnN1cmUgaXQncyBhbiBvYmplY3QsIGFuZCBub3QgYSBzdHJpbmcgdXJsLlxuICAvLyBJZiBpdCdzIGFuIG9iaiwgdGhpcyBpcyBhIG5vLW9wLlxuICAvLyB0aGlzIHdheSwgeW91IGNhbiBjYWxsIHVybF9mb3JtYXQoKSBvbiBzdHJpbmdzXG4gIC8vIHRvIGNsZWFuIHVwIHBvdGVudGlhbGx5IHdvbmt5IHVybHMuXG4gIGlmICh1dGlsLmlzU3RyaW5nKG9iaikpIG9iaiA9IHVybFBhcnNlKG9iaik7XG4gIGlmICghKG9iaiBpbnN0YW5jZW9mIFVybCkpIHJldHVybiBVcmwucHJvdG90eXBlLmZvcm1hdC5jYWxsKG9iaik7XG4gIHJldHVybiBvYmouZm9ybWF0KCk7XG59XG5cblVybC5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBhdXRoID0gdGhpcy5hdXRoIHx8ICcnO1xuICBpZiAoYXV0aCkge1xuICAgIGF1dGggPSBlbmNvZGVVUklDb21wb25lbnQoYXV0aCk7XG4gICAgYXV0aCA9IGF1dGgucmVwbGFjZSgvJTNBL2ksICc6Jyk7XG4gICAgYXV0aCArPSAnQCc7XG4gIH1cblxuICB2YXIgcHJvdG9jb2wgPSB0aGlzLnByb3RvY29sIHx8ICcnLFxuICAgICAgcGF0aG5hbWUgPSB0aGlzLnBhdGhuYW1lIHx8ICcnLFxuICAgICAgaGFzaCA9IHRoaXMuaGFzaCB8fCAnJyxcbiAgICAgIGhvc3QgPSBmYWxzZSxcbiAgICAgIHF1ZXJ5ID0gJyc7XG5cbiAgaWYgKHRoaXMuaG9zdCkge1xuICAgIGhvc3QgPSBhdXRoICsgdGhpcy5ob3N0O1xuICB9IGVsc2UgaWYgKHRoaXMuaG9zdG5hbWUpIHtcbiAgICBob3N0ID0gYXV0aCArICh0aGlzLmhvc3RuYW1lLmluZGV4T2YoJzonKSA9PT0gLTEgP1xuICAgICAgICB0aGlzLmhvc3RuYW1lIDpcbiAgICAgICAgJ1snICsgdGhpcy5ob3N0bmFtZSArICddJyk7XG4gICAgaWYgKHRoaXMucG9ydCkge1xuICAgICAgaG9zdCArPSAnOicgKyB0aGlzLnBvcnQ7XG4gICAgfVxuICB9XG5cbiAgaWYgKHRoaXMucXVlcnkgJiZcbiAgICAgIHV0aWwuaXNPYmplY3QodGhpcy5xdWVyeSkgJiZcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMucXVlcnkpLmxlbmd0aCkge1xuICAgIHF1ZXJ5ID0gcXVlcnlzdHJpbmcuc3RyaW5naWZ5KHRoaXMucXVlcnkpO1xuICB9XG5cbiAgdmFyIHNlYXJjaCA9IHRoaXMuc2VhcmNoIHx8IChxdWVyeSAmJiAoJz8nICsgcXVlcnkpKSB8fCAnJztcblxuICBpZiAocHJvdG9jb2wgJiYgcHJvdG9jb2wuc3Vic3RyKC0xKSAhPT0gJzonKSBwcm90b2NvbCArPSAnOic7XG5cbiAgLy8gb25seSB0aGUgc2xhc2hlZFByb3RvY29scyBnZXQgdGhlIC8vLiAgTm90IG1haWx0bzosIHhtcHA6LCBldGMuXG4gIC8vIHVubGVzcyB0aGV5IGhhZCB0aGVtIHRvIGJlZ2luIHdpdGguXG4gIGlmICh0aGlzLnNsYXNoZXMgfHxcbiAgICAgICghcHJvdG9jb2wgfHwgc2xhc2hlZFByb3RvY29sW3Byb3RvY29sXSkgJiYgaG9zdCAhPT0gZmFsc2UpIHtcbiAgICBob3N0ID0gJy8vJyArIChob3N0IHx8ICcnKTtcbiAgICBpZiAocGF0aG5hbWUgJiYgcGF0aG5hbWUuY2hhckF0KDApICE9PSAnLycpIHBhdGhuYW1lID0gJy8nICsgcGF0aG5hbWU7XG4gIH0gZWxzZSBpZiAoIWhvc3QpIHtcbiAgICBob3N0ID0gJyc7XG4gIH1cblxuICBpZiAoaGFzaCAmJiBoYXNoLmNoYXJBdCgwKSAhPT0gJyMnKSBoYXNoID0gJyMnICsgaGFzaDtcbiAgaWYgKHNlYXJjaCAmJiBzZWFyY2guY2hhckF0KDApICE9PSAnPycpIHNlYXJjaCA9ICc/JyArIHNlYXJjaDtcblxuICBwYXRobmFtZSA9IHBhdGhuYW1lLnJlcGxhY2UoL1s/I10vZywgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KG1hdGNoKTtcbiAgfSk7XG4gIHNlYXJjaCA9IHNlYXJjaC5yZXBsYWNlKCcjJywgJyUyMycpO1xuXG4gIHJldHVybiBwcm90b2NvbCArIGhvc3QgKyBwYXRobmFtZSArIHNlYXJjaCArIGhhc2g7XG59O1xuXG5mdW5jdGlvbiB1cmxSZXNvbHZlKHNvdXJjZSwgcmVsYXRpdmUpIHtcbiAgcmV0dXJuIHVybFBhcnNlKHNvdXJjZSwgZmFsc2UsIHRydWUpLnJlc29sdmUocmVsYXRpdmUpO1xufVxuXG5VcmwucHJvdG90eXBlLnJlc29sdmUgPSBmdW5jdGlvbihyZWxhdGl2ZSkge1xuICByZXR1cm4gdGhpcy5yZXNvbHZlT2JqZWN0KHVybFBhcnNlKHJlbGF0aXZlLCBmYWxzZSwgdHJ1ZSkpLmZvcm1hdCgpO1xufTtcblxuZnVuY3Rpb24gdXJsUmVzb2x2ZU9iamVjdChzb3VyY2UsIHJlbGF0aXZlKSB7XG4gIGlmICghc291cmNlKSByZXR1cm4gcmVsYXRpdmU7XG4gIHJldHVybiB1cmxQYXJzZShzb3VyY2UsIGZhbHNlLCB0cnVlKS5yZXNvbHZlT2JqZWN0KHJlbGF0aXZlKTtcbn1cblxuVXJsLnByb3RvdHlwZS5yZXNvbHZlT2JqZWN0ID0gZnVuY3Rpb24ocmVsYXRpdmUpIHtcbiAgaWYgKHV0aWwuaXNTdHJpbmcocmVsYXRpdmUpKSB7XG4gICAgdmFyIHJlbCA9IG5ldyBVcmwoKTtcbiAgICByZWwucGFyc2UocmVsYXRpdmUsIGZhbHNlLCB0cnVlKTtcbiAgICByZWxhdGl2ZSA9IHJlbDtcbiAgfVxuXG4gIHZhciByZXN1bHQgPSBuZXcgVXJsKCk7XG4gIHZhciB0a2V5cyA9IE9iamVjdC5rZXlzKHRoaXMpO1xuICBmb3IgKHZhciB0ayA9IDA7IHRrIDwgdGtleXMubGVuZ3RoOyB0aysrKSB7XG4gICAgdmFyIHRrZXkgPSB0a2V5c1t0a107XG4gICAgcmVzdWx0W3RrZXldID0gdGhpc1t0a2V5XTtcbiAgfVxuXG4gIC8vIGhhc2ggaXMgYWx3YXlzIG92ZXJyaWRkZW4sIG5vIG1hdHRlciB3aGF0LlxuICAvLyBldmVuIGhyZWY9XCJcIiB3aWxsIHJlbW92ZSBpdC5cbiAgcmVzdWx0Lmhhc2ggPSByZWxhdGl2ZS5oYXNoO1xuXG4gIC8vIGlmIHRoZSByZWxhdGl2ZSB1cmwgaXMgZW1wdHksIHRoZW4gdGhlcmUncyBub3RoaW5nIGxlZnQgdG8gZG8gaGVyZS5cbiAgaWYgKHJlbGF0aXZlLmhyZWYgPT09ICcnKSB7XG4gICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIGhyZWZzIGxpa2UgLy9mb28vYmFyIGFsd2F5cyBjdXQgdG8gdGhlIHByb3RvY29sLlxuICBpZiAocmVsYXRpdmUuc2xhc2hlcyAmJiAhcmVsYXRpdmUucHJvdG9jb2wpIHtcbiAgICAvLyB0YWtlIGV2ZXJ5dGhpbmcgZXhjZXB0IHRoZSBwcm90b2NvbCBmcm9tIHJlbGF0aXZlXG4gICAgdmFyIHJrZXlzID0gT2JqZWN0LmtleXMocmVsYXRpdmUpO1xuICAgIGZvciAodmFyIHJrID0gMDsgcmsgPCBya2V5cy5sZW5ndGg7IHJrKyspIHtcbiAgICAgIHZhciBya2V5ID0gcmtleXNbcmtdO1xuICAgICAgaWYgKHJrZXkgIT09ICdwcm90b2NvbCcpXG4gICAgICAgIHJlc3VsdFtya2V5XSA9IHJlbGF0aXZlW3JrZXldO1xuICAgIH1cblxuICAgIC8vdXJsUGFyc2UgYXBwZW5kcyB0cmFpbGluZyAvIHRvIHVybHMgbGlrZSBodHRwOi8vd3d3LmV4YW1wbGUuY29tXG4gICAgaWYgKHNsYXNoZWRQcm90b2NvbFtyZXN1bHQucHJvdG9jb2xdICYmXG4gICAgICAgIHJlc3VsdC5ob3N0bmFtZSAmJiAhcmVzdWx0LnBhdGhuYW1lKSB7XG4gICAgICByZXN1bHQucGF0aCA9IHJlc3VsdC5wYXRobmFtZSA9ICcvJztcbiAgICB9XG5cbiAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaWYgKHJlbGF0aXZlLnByb3RvY29sICYmIHJlbGF0aXZlLnByb3RvY29sICE9PSByZXN1bHQucHJvdG9jb2wpIHtcbiAgICAvLyBpZiBpdCdzIGEga25vd24gdXJsIHByb3RvY29sLCB0aGVuIGNoYW5naW5nXG4gICAgLy8gdGhlIHByb3RvY29sIGRvZXMgd2VpcmQgdGhpbmdzXG4gICAgLy8gZmlyc3QsIGlmIGl0J3Mgbm90IGZpbGU6LCB0aGVuIHdlIE1VU1QgaGF2ZSBhIGhvc3QsXG4gICAgLy8gYW5kIGlmIHRoZXJlIHdhcyBhIHBhdGhcbiAgICAvLyB0byBiZWdpbiB3aXRoLCB0aGVuIHdlIE1VU1QgaGF2ZSBhIHBhdGguXG4gICAgLy8gaWYgaXQgaXMgZmlsZTosIHRoZW4gdGhlIGhvc3QgaXMgZHJvcHBlZCxcbiAgICAvLyBiZWNhdXNlIHRoYXQncyBrbm93biB0byBiZSBob3N0bGVzcy5cbiAgICAvLyBhbnl0aGluZyBlbHNlIGlzIGFzc3VtZWQgdG8gYmUgYWJzb2x1dGUuXG4gICAgaWYgKCFzbGFzaGVkUHJvdG9jb2xbcmVsYXRpdmUucHJvdG9jb2xdKSB7XG4gICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHJlbGF0aXZlKTtcbiAgICAgIGZvciAodmFyIHYgPSAwOyB2IDwga2V5cy5sZW5ndGg7IHYrKykge1xuICAgICAgICB2YXIgayA9IGtleXNbdl07XG4gICAgICAgIHJlc3VsdFtrXSA9IHJlbGF0aXZlW2tdO1xuICAgICAgfVxuICAgICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHJlc3VsdC5wcm90b2NvbCA9IHJlbGF0aXZlLnByb3RvY29sO1xuICAgIGlmICghcmVsYXRpdmUuaG9zdCAmJiAhaG9zdGxlc3NQcm90b2NvbFtyZWxhdGl2ZS5wcm90b2NvbF0pIHtcbiAgICAgIHZhciByZWxQYXRoID0gKHJlbGF0aXZlLnBhdGhuYW1lIHx8ICcnKS5zcGxpdCgnLycpO1xuICAgICAgd2hpbGUgKHJlbFBhdGgubGVuZ3RoICYmICEocmVsYXRpdmUuaG9zdCA9IHJlbFBhdGguc2hpZnQoKSkpO1xuICAgICAgaWYgKCFyZWxhdGl2ZS5ob3N0KSByZWxhdGl2ZS5ob3N0ID0gJyc7XG4gICAgICBpZiAoIXJlbGF0aXZlLmhvc3RuYW1lKSByZWxhdGl2ZS5ob3N0bmFtZSA9ICcnO1xuICAgICAgaWYgKHJlbFBhdGhbMF0gIT09ICcnKSByZWxQYXRoLnVuc2hpZnQoJycpO1xuICAgICAgaWYgKHJlbFBhdGgubGVuZ3RoIDwgMikgcmVsUGF0aC51bnNoaWZ0KCcnKTtcbiAgICAgIHJlc3VsdC5wYXRobmFtZSA9IHJlbFBhdGguam9pbignLycpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQucGF0aG5hbWUgPSByZWxhdGl2ZS5wYXRobmFtZTtcbiAgICB9XG4gICAgcmVzdWx0LnNlYXJjaCA9IHJlbGF0aXZlLnNlYXJjaDtcbiAgICByZXN1bHQucXVlcnkgPSByZWxhdGl2ZS5xdWVyeTtcbiAgICByZXN1bHQuaG9zdCA9IHJlbGF0aXZlLmhvc3QgfHwgJyc7XG4gICAgcmVzdWx0LmF1dGggPSByZWxhdGl2ZS5hdXRoO1xuICAgIHJlc3VsdC5ob3N0bmFtZSA9IHJlbGF0aXZlLmhvc3RuYW1lIHx8IHJlbGF0aXZlLmhvc3Q7XG4gICAgcmVzdWx0LnBvcnQgPSByZWxhdGl2ZS5wb3J0O1xuICAgIC8vIHRvIHN1cHBvcnQgaHR0cC5yZXF1ZXN0XG4gICAgaWYgKHJlc3VsdC5wYXRobmFtZSB8fCByZXN1bHQuc2VhcmNoKSB7XG4gICAgICB2YXIgcCA9IHJlc3VsdC5wYXRobmFtZSB8fCAnJztcbiAgICAgIHZhciBzID0gcmVzdWx0LnNlYXJjaCB8fCAnJztcbiAgICAgIHJlc3VsdC5wYXRoID0gcCArIHM7XG4gICAgfVxuICAgIHJlc3VsdC5zbGFzaGVzID0gcmVzdWx0LnNsYXNoZXMgfHwgcmVsYXRpdmUuc2xhc2hlcztcbiAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgdmFyIGlzU291cmNlQWJzID0gKHJlc3VsdC5wYXRobmFtZSAmJiByZXN1bHQucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpLFxuICAgICAgaXNSZWxBYnMgPSAoXG4gICAgICAgICAgcmVsYXRpdmUuaG9zdCB8fFxuICAgICAgICAgIHJlbGF0aXZlLnBhdGhuYW1lICYmIHJlbGF0aXZlLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nXG4gICAgICApLFxuICAgICAgbXVzdEVuZEFicyA9IChpc1JlbEFicyB8fCBpc1NvdXJjZUFicyB8fFxuICAgICAgICAgICAgICAgICAgICAocmVzdWx0Lmhvc3QgJiYgcmVsYXRpdmUucGF0aG5hbWUpKSxcbiAgICAgIHJlbW92ZUFsbERvdHMgPSBtdXN0RW5kQWJzLFxuICAgICAgc3JjUGF0aCA9IHJlc3VsdC5wYXRobmFtZSAmJiByZXN1bHQucGF0aG5hbWUuc3BsaXQoJy8nKSB8fCBbXSxcbiAgICAgIHJlbFBhdGggPSByZWxhdGl2ZS5wYXRobmFtZSAmJiByZWxhdGl2ZS5wYXRobmFtZS5zcGxpdCgnLycpIHx8IFtdLFxuICAgICAgcHN5Y2hvdGljID0gcmVzdWx0LnByb3RvY29sICYmICFzbGFzaGVkUHJvdG9jb2xbcmVzdWx0LnByb3RvY29sXTtcblxuICAvLyBpZiB0aGUgdXJsIGlzIGEgbm9uLXNsYXNoZWQgdXJsLCB0aGVuIHJlbGF0aXZlXG4gIC8vIGxpbmtzIGxpa2UgLi4vLi4gc2hvdWxkIGJlIGFibGVcbiAgLy8gdG8gY3Jhd2wgdXAgdG8gdGhlIGhvc3RuYW1lLCBhcyB3ZWxsLiAgVGhpcyBpcyBzdHJhbmdlLlxuICAvLyByZXN1bHQucHJvdG9jb2wgaGFzIGFscmVhZHkgYmVlbiBzZXQgYnkgbm93LlxuICAvLyBMYXRlciBvbiwgcHV0IHRoZSBmaXJzdCBwYXRoIHBhcnQgaW50byB0aGUgaG9zdCBmaWVsZC5cbiAgaWYgKHBzeWNob3RpYykge1xuICAgIHJlc3VsdC5ob3N0bmFtZSA9ICcnO1xuICAgIHJlc3VsdC5wb3J0ID0gbnVsbDtcbiAgICBpZiAocmVzdWx0Lmhvc3QpIHtcbiAgICAgIGlmIChzcmNQYXRoWzBdID09PSAnJykgc3JjUGF0aFswXSA9IHJlc3VsdC5ob3N0O1xuICAgICAgZWxzZSBzcmNQYXRoLnVuc2hpZnQocmVzdWx0Lmhvc3QpO1xuICAgIH1cbiAgICByZXN1bHQuaG9zdCA9ICcnO1xuICAgIGlmIChyZWxhdGl2ZS5wcm90b2NvbCkge1xuICAgICAgcmVsYXRpdmUuaG9zdG5hbWUgPSBudWxsO1xuICAgICAgcmVsYXRpdmUucG9ydCA9IG51bGw7XG4gICAgICBpZiAocmVsYXRpdmUuaG9zdCkge1xuICAgICAgICBpZiAocmVsUGF0aFswXSA9PT0gJycpIHJlbFBhdGhbMF0gPSByZWxhdGl2ZS5ob3N0O1xuICAgICAgICBlbHNlIHJlbFBhdGgudW5zaGlmdChyZWxhdGl2ZS5ob3N0KTtcbiAgICAgIH1cbiAgICAgIHJlbGF0aXZlLmhvc3QgPSBudWxsO1xuICAgIH1cbiAgICBtdXN0RW5kQWJzID0gbXVzdEVuZEFicyAmJiAocmVsUGF0aFswXSA9PT0gJycgfHwgc3JjUGF0aFswXSA9PT0gJycpO1xuICB9XG5cbiAgaWYgKGlzUmVsQWJzKSB7XG4gICAgLy8gaXQncyBhYnNvbHV0ZS5cbiAgICByZXN1bHQuaG9zdCA9IChyZWxhdGl2ZS5ob3N0IHx8IHJlbGF0aXZlLmhvc3QgPT09ICcnKSA/XG4gICAgICAgICAgICAgICAgICByZWxhdGl2ZS5ob3N0IDogcmVzdWx0Lmhvc3Q7XG4gICAgcmVzdWx0Lmhvc3RuYW1lID0gKHJlbGF0aXZlLmhvc3RuYW1lIHx8IHJlbGF0aXZlLmhvc3RuYW1lID09PSAnJykgP1xuICAgICAgICAgICAgICAgICAgICAgIHJlbGF0aXZlLmhvc3RuYW1lIDogcmVzdWx0Lmhvc3RuYW1lO1xuICAgIHJlc3VsdC5zZWFyY2ggPSByZWxhdGl2ZS5zZWFyY2g7XG4gICAgcmVzdWx0LnF1ZXJ5ID0gcmVsYXRpdmUucXVlcnk7XG4gICAgc3JjUGF0aCA9IHJlbFBhdGg7XG4gICAgLy8gZmFsbCB0aHJvdWdoIHRvIHRoZSBkb3QtaGFuZGxpbmcgYmVsb3cuXG4gIH0gZWxzZSBpZiAocmVsUGF0aC5sZW5ndGgpIHtcbiAgICAvLyBpdCdzIHJlbGF0aXZlXG4gICAgLy8gdGhyb3cgYXdheSB0aGUgZXhpc3RpbmcgZmlsZSwgYW5kIHRha2UgdGhlIG5ldyBwYXRoIGluc3RlYWQuXG4gICAgaWYgKCFzcmNQYXRoKSBzcmNQYXRoID0gW107XG4gICAgc3JjUGF0aC5wb3AoKTtcbiAgICBzcmNQYXRoID0gc3JjUGF0aC5jb25jYXQocmVsUGF0aCk7XG4gICAgcmVzdWx0LnNlYXJjaCA9IHJlbGF0aXZlLnNlYXJjaDtcbiAgICByZXN1bHQucXVlcnkgPSByZWxhdGl2ZS5xdWVyeTtcbiAgfSBlbHNlIGlmICghdXRpbC5pc051bGxPclVuZGVmaW5lZChyZWxhdGl2ZS5zZWFyY2gpKSB7XG4gICAgLy8ganVzdCBwdWxsIG91dCB0aGUgc2VhcmNoLlxuICAgIC8vIGxpa2UgaHJlZj0nP2ZvbycuXG4gICAgLy8gUHV0IHRoaXMgYWZ0ZXIgdGhlIG90aGVyIHR3byBjYXNlcyBiZWNhdXNlIGl0IHNpbXBsaWZpZXMgdGhlIGJvb2xlYW5zXG4gICAgaWYgKHBzeWNob3RpYykge1xuICAgICAgcmVzdWx0Lmhvc3RuYW1lID0gcmVzdWx0Lmhvc3QgPSBzcmNQYXRoLnNoaWZ0KCk7XG4gICAgICAvL29jY2F0aW9uYWx5IHRoZSBhdXRoIGNhbiBnZXQgc3R1Y2sgb25seSBpbiBob3N0XG4gICAgICAvL3RoaXMgZXNwZWNpYWxseSBoYXBwZW5zIGluIGNhc2VzIGxpa2VcbiAgICAgIC8vdXJsLnJlc29sdmVPYmplY3QoJ21haWx0bzpsb2NhbDFAZG9tYWluMScsICdsb2NhbDJAZG9tYWluMicpXG4gICAgICB2YXIgYXV0aEluSG9zdCA9IHJlc3VsdC5ob3N0ICYmIHJlc3VsdC5ob3N0LmluZGV4T2YoJ0AnKSA+IDAgP1xuICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuaG9zdC5zcGxpdCgnQCcpIDogZmFsc2U7XG4gICAgICBpZiAoYXV0aEluSG9zdCkge1xuICAgICAgICByZXN1bHQuYXV0aCA9IGF1dGhJbkhvc3Quc2hpZnQoKTtcbiAgICAgICAgcmVzdWx0Lmhvc3QgPSByZXN1bHQuaG9zdG5hbWUgPSBhdXRoSW5Ib3N0LnNoaWZ0KCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5zZWFyY2ggPSByZWxhdGl2ZS5zZWFyY2g7XG4gICAgcmVzdWx0LnF1ZXJ5ID0gcmVsYXRpdmUucXVlcnk7XG4gICAgLy90byBzdXBwb3J0IGh0dHAucmVxdWVzdFxuICAgIGlmICghdXRpbC5pc051bGwocmVzdWx0LnBhdGhuYW1lKSB8fCAhdXRpbC5pc051bGwocmVzdWx0LnNlYXJjaCkpIHtcbiAgICAgIHJlc3VsdC5wYXRoID0gKHJlc3VsdC5wYXRobmFtZSA/IHJlc3VsdC5wYXRobmFtZSA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAgIChyZXN1bHQuc2VhcmNoID8gcmVzdWx0LnNlYXJjaCA6ICcnKTtcbiAgICB9XG4gICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGlmICghc3JjUGF0aC5sZW5ndGgpIHtcbiAgICAvLyBubyBwYXRoIGF0IGFsbC4gIGVhc3kuXG4gICAgLy8gd2UndmUgYWxyZWFkeSBoYW5kbGVkIHRoZSBvdGhlciBzdHVmZiBhYm92ZS5cbiAgICByZXN1bHQucGF0aG5hbWUgPSBudWxsO1xuICAgIC8vdG8gc3VwcG9ydCBodHRwLnJlcXVlc3RcbiAgICBpZiAocmVzdWx0LnNlYXJjaCkge1xuICAgICAgcmVzdWx0LnBhdGggPSAnLycgKyByZXN1bHQuc2VhcmNoO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQucGF0aCA9IG51bGw7XG4gICAgfVxuICAgIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBpZiBhIHVybCBFTkRzIGluIC4gb3IgLi4sIHRoZW4gaXQgbXVzdCBnZXQgYSB0cmFpbGluZyBzbGFzaC5cbiAgLy8gaG93ZXZlciwgaWYgaXQgZW5kcyBpbiBhbnl0aGluZyBlbHNlIG5vbi1zbGFzaHksXG4gIC8vIHRoZW4gaXQgbXVzdCBOT1QgZ2V0IGEgdHJhaWxpbmcgc2xhc2guXG4gIHZhciBsYXN0ID0gc3JjUGF0aC5zbGljZSgtMSlbMF07XG4gIHZhciBoYXNUcmFpbGluZ1NsYXNoID0gKFxuICAgICAgKHJlc3VsdC5ob3N0IHx8IHJlbGF0aXZlLmhvc3QgfHwgc3JjUGF0aC5sZW5ndGggPiAxKSAmJlxuICAgICAgKGxhc3QgPT09ICcuJyB8fCBsYXN0ID09PSAnLi4nKSB8fCBsYXN0ID09PSAnJyk7XG5cbiAgLy8gc3RyaXAgc2luZ2xlIGRvdHMsIHJlc29sdmUgZG91YmxlIGRvdHMgdG8gcGFyZW50IGRpclxuICAvLyBpZiB0aGUgcGF0aCB0cmllcyB0byBnbyBhYm92ZSB0aGUgcm9vdCwgYHVwYCBlbmRzIHVwID4gMFxuICB2YXIgdXAgPSAwO1xuICBmb3IgKHZhciBpID0gc3JjUGF0aC5sZW5ndGg7IGkgPj0gMDsgaS0tKSB7XG4gICAgbGFzdCA9IHNyY1BhdGhbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgc3JjUGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChsYXN0ID09PSAnLi4nKSB7XG4gICAgICBzcmNQYXRoLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgc3JjUGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKCFtdXN0RW5kQWJzICYmICFyZW1vdmVBbGxEb3RzKSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBzcmNQYXRoLnVuc2hpZnQoJy4uJyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKG11c3RFbmRBYnMgJiYgc3JjUGF0aFswXSAhPT0gJycgJiZcbiAgICAgICghc3JjUGF0aFswXSB8fCBzcmNQYXRoWzBdLmNoYXJBdCgwKSAhPT0gJy8nKSkge1xuICAgIHNyY1BhdGgudW5zaGlmdCgnJyk7XG4gIH1cblxuICBpZiAoaGFzVHJhaWxpbmdTbGFzaCAmJiAoc3JjUGF0aC5qb2luKCcvJykuc3Vic3RyKC0xKSAhPT0gJy8nKSkge1xuICAgIHNyY1BhdGgucHVzaCgnJyk7XG4gIH1cblxuICB2YXIgaXNBYnNvbHV0ZSA9IHNyY1BhdGhbMF0gPT09ICcnIHx8XG4gICAgICAoc3JjUGF0aFswXSAmJiBzcmNQYXRoWzBdLmNoYXJBdCgwKSA9PT0gJy8nKTtcblxuICAvLyBwdXQgdGhlIGhvc3QgYmFja1xuICBpZiAocHN5Y2hvdGljKSB7XG4gICAgcmVzdWx0Lmhvc3RuYW1lID0gcmVzdWx0Lmhvc3QgPSBpc0Fic29sdXRlID8gJycgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjUGF0aC5sZW5ndGggPyBzcmNQYXRoLnNoaWZ0KCkgOiAnJztcbiAgICAvL29jY2F0aW9uYWx5IHRoZSBhdXRoIGNhbiBnZXQgc3R1Y2sgb25seSBpbiBob3N0XG4gICAgLy90aGlzIGVzcGVjaWFsbHkgaGFwcGVucyBpbiBjYXNlcyBsaWtlXG4gICAgLy91cmwucmVzb2x2ZU9iamVjdCgnbWFpbHRvOmxvY2FsMUBkb21haW4xJywgJ2xvY2FsMkBkb21haW4yJylcbiAgICB2YXIgYXV0aEluSG9zdCA9IHJlc3VsdC5ob3N0ICYmIHJlc3VsdC5ob3N0LmluZGV4T2YoJ0AnKSA+IDAgP1xuICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Lmhvc3Quc3BsaXQoJ0AnKSA6IGZhbHNlO1xuICAgIGlmIChhdXRoSW5Ib3N0KSB7XG4gICAgICByZXN1bHQuYXV0aCA9IGF1dGhJbkhvc3Quc2hpZnQoKTtcbiAgICAgIHJlc3VsdC5ob3N0ID0gcmVzdWx0Lmhvc3RuYW1lID0gYXV0aEluSG9zdC5zaGlmdCgpO1xuICAgIH1cbiAgfVxuXG4gIG11c3RFbmRBYnMgPSBtdXN0RW5kQWJzIHx8IChyZXN1bHQuaG9zdCAmJiBzcmNQYXRoLmxlbmd0aCk7XG5cbiAgaWYgKG11c3RFbmRBYnMgJiYgIWlzQWJzb2x1dGUpIHtcbiAgICBzcmNQYXRoLnVuc2hpZnQoJycpO1xuICB9XG5cbiAgaWYgKCFzcmNQYXRoLmxlbmd0aCkge1xuICAgIHJlc3VsdC5wYXRobmFtZSA9IG51bGw7XG4gICAgcmVzdWx0LnBhdGggPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdC5wYXRobmFtZSA9IHNyY1BhdGguam9pbignLycpO1xuICB9XG5cbiAgLy90byBzdXBwb3J0IHJlcXVlc3QuaHR0cFxuICBpZiAoIXV0aWwuaXNOdWxsKHJlc3VsdC5wYXRobmFtZSkgfHwgIXV0aWwuaXNOdWxsKHJlc3VsdC5zZWFyY2gpKSB7XG4gICAgcmVzdWx0LnBhdGggPSAocmVzdWx0LnBhdGhuYW1lID8gcmVzdWx0LnBhdGhuYW1lIDogJycpICtcbiAgICAgICAgICAgICAgICAgIChyZXN1bHQuc2VhcmNoID8gcmVzdWx0LnNlYXJjaCA6ICcnKTtcbiAgfVxuICByZXN1bHQuYXV0aCA9IHJlbGF0aXZlLmF1dGggfHwgcmVzdWx0LmF1dGg7XG4gIHJlc3VsdC5zbGFzaGVzID0gcmVzdWx0LnNsYXNoZXMgfHwgcmVsYXRpdmUuc2xhc2hlcztcbiAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5VcmwucHJvdG90eXBlLnBhcnNlSG9zdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaG9zdCA9IHRoaXMuaG9zdDtcbiAgdmFyIHBvcnQgPSBwb3J0UGF0dGVybi5leGVjKGhvc3QpO1xuICBpZiAocG9ydCkge1xuICAgIHBvcnQgPSBwb3J0WzBdO1xuICAgIGlmIChwb3J0ICE9PSAnOicpIHtcbiAgICAgIHRoaXMucG9ydCA9IHBvcnQuc3Vic3RyKDEpO1xuICAgIH1cbiAgICBob3N0ID0gaG9zdC5zdWJzdHIoMCwgaG9zdC5sZW5ndGggLSBwb3J0Lmxlbmd0aCk7XG4gIH1cbiAgaWYgKGhvc3QpIHRoaXMuaG9zdG5hbWUgPSBob3N0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzU3RyaW5nOiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gdHlwZW9mKGFyZykgPT09ICdzdHJpbmcnO1xuICB9LFxuICBpc09iamVjdDogZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHR5cGVvZihhcmcpID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG4gIH0sXG4gIGlzTnVsbDogZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbiAgfSxcbiAgaXNOdWxsT3JVbmRlZmluZWQ6IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBhcmcgPT0gbnVsbDtcbiAgfVxufTtcbiIsInZhciBnO1xuXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxuZyA9IChmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXM7XG59KSgpO1xuXG50cnkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcblx0ZyA9IGcgfHwgbmV3IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKTtcbn0gY2F0Y2ggKGUpIHtcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcblx0aWYgKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpIGcgPSB3aW5kb3c7XG59XG5cbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XG5cbm1vZHVsZS5leHBvcnRzID0gZztcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kdWxlKSB7XG5cdGlmICghbW9kdWxlLndlYnBhY2tQb2x5ZmlsbCkge1xuXHRcdG1vZHVsZS5kZXByZWNhdGUgPSBmdW5jdGlvbigpIHt9O1xuXHRcdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRcdC8vIG1vZHVsZS5wYXJlbnQgPSB1bmRlZmluZWQgYnkgZGVmYXVsdFxuXHRcdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImxvYWRlZFwiLCB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5sO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwiaWRcIiwge1xuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBtb2R1bGUuaTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRtb2R1bGUud2VicGFja1BvbHlmaWxsID0gMTtcblx0fVxuXHRyZXR1cm4gbW9kdWxlO1xufTtcbiIsImV4cG9ydCBkZWZhdWx0IFwiPGRpdiBjbGFzcz1cXFwid3Atc3BhLWxvYWRpbmctdmlld1xcXCI+PGRpdiBjbGFzcz1cXFwid3Atc3BhLWxvYWRpbmctdmlld19fd3JhcFxcXCI+PGRpdiBjbGFzcz1cXFwid3Atc3BhLWxvYWRpbmctdmlld19faWNvblxcXCI+PC9kaXY+PGRpdiBjbGFzcz1cXFwid3Atc3BhLWxvYWRpbmctdmlld19fcHJvZ3Jlc3MtYmFyXFxcIj48ZGl2IGNsYXNzPVxcXCJ3cC1zcGEtbG9hZGluZy12aWV3X19wcm9ncmVzcy1iYXItc2hhZG93XFxcIj48L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj5cIiIsImltcG9ydCAqIGFzICQgZnJvbSAnanF1ZXJ5JztcblxuaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICdtb2R1bGVzL2FwcCc7XG5cbiQoZnVuY3Rpb24gKCkge1xuICBjb25zdCBhcHAgPSBuZXcgQXBwbGljYXRpb24oKTtcbn0pO1xuIiwiaW1wb3J0IHsgQXBwUm91dGVyIH0gICAgICAgZnJvbSAnbW9kdWxlcy9saWIvcm91dGVyJztcbmltcG9ydCB7IFJlc291cmNlTW9uaXRvciB9IGZyb20gJ21vZHVsZXMvc2VydmljZXMvcmVzb3VyY2UtbW9uaXRvcic7XG5pbXBvcnQgeyBDb25maWdMb2FkZXIgfSAgICBmcm9tICdtb2R1bGVzL3NlcnZpY2VzL2NvbmZpZy1sb2FkZXInO1xuaW1wb3J0IHsgQ29udGVudExvYWRlciB9ICAgZnJvbSAnbW9kdWxlcy9zZXJ2aWNlcy9jb250ZW50LWxvYWRlcic7XG5pbXBvcnQgKiBhcyBDb250cm9sbGVycyAgICBmcm9tICdtb2R1bGVzL2NvbnRyb2xsZXJzJztcbmltcG9ydCAqIGFzIFZpZXdzICAgICAgICAgIGZyb20gJ21vZHVsZXMvdmlld3MnO1xuXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb24gaW1wbGVtZW50cyBJQXBwbGljYXRpb24ge1xuICBldmVudHMgPSB7fTtcbiAgJHJvb3Q6IEpRdWVyeTtcbiAgJHdpbmRvdzogSlF1ZXJ5PFdpbmRvdz47XG4gIG1ldGE6IElBcHBsaWNhdGlvbk1ldGE7XG4gIGNvbmZpZ0xvYWRlcjogQ29uZmlnTG9hZGVyO1xuICBjb250ZW50TG9hZGVyOiBDb250ZW50TG9hZGVyO1xuICByZXNvdXJjZU1vbml0b3I6IFJlc291cmNlTW9uaXRvcjtcbiAgcm91dGVyOiBBcHBSb3V0ZXI7XG4gIHByZXZpb3VzUGF0aDogc3RyaW5nO1xuXG4gIHVpQ29udHJvbGxlcjogQ29udHJvbGxlcnMuVUlDb250cm9sbGVyO1xuICBtYWluQ29udHJvbGxlcjogQ29udHJvbGxlcnMuTWFpbkNvbnRyb2xsZXI7XG4gIGh0bWxWaWV3OiBWaWV3cy5IVE1MRGlyZWN0aXZlO1xuICBoZWFkVmlldzogVmlld3MuSGVhZERpcmVjdGl2ZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGJvb3RzdHJhcFNlbGVjdG9yOiBzdHJpbmcgPSAnLnNwYS1jb250ZW50Jykge1xuXG4gICAgdGhpcy5ib290c3RyYXAoJCh0aGlzLmJvb3RzdHJhcFNlbGVjdG9yKSk7XG4gICAgdGhpcy4kd2luZG93ID0gJCh3aW5kb3cpO1xuICAgIHRoaXMubWV0YSA9IHtcbiAgICAgIGJhc2VIUkVGOiAkKCdoZWFkIGJhc2UnKS5hdHRyKCdocmVmJylcbiAgICB9O1xuXG4gICAgdGhpcy5yZXNvdXJjZU1vbml0b3IgPSBuZXcgUmVzb3VyY2VNb25pdG9yKCk7XG4gICAgdGhpcy5jb25maWdMb2FkZXIgPSBuZXcgQ29uZmlnTG9hZGVyKHRoaXMpO1xuICAgIHRoaXMuY29udGVudExvYWRlciA9IG5ldyBDb250ZW50TG9hZGVyKHRoaXMpO1xuICAgIHRoaXMucm91dGVyID0gbmV3IEFwcFJvdXRlcih0aGlzLm1ldGEuYmFzZUhSRUYpO1xuXG4gICAgdGhpcy5yb3V0ZXIub24oLy4qLywgKHBhdGgpID0+IHtcbiAgICAgIHRoaXMuZW1pdCgnJGxvY2F0aW9uQ2hhbmdlU3VjY2VzcycsIHBhdGgsIHRoaXMucHJldmlvdXNQYXRoKTtcbiAgICAgIHRoaXMucHJldmlvdXNQYXRoID0gcGF0aDtcbiAgICB9KTtcblxuICAgIHRoaXMubWFpbkNvbnRyb2xsZXIgPSBuZXcgQ29udHJvbGxlcnMuTWFpbkNvbnRyb2xsZXIodGhpcyk7XG4gICAgdGhpcy51aUNvbnRyb2xsZXIgPSBuZXcgQ29udHJvbGxlcnMuVUlDb250cm9sbGVyKHRoaXMpO1xuICAgIHRoaXMuaHRtbFZpZXcgPSBuZXcgVmlld3MuSFRNTERpcmVjdGl2ZSh0aGlzKTtcbiAgICB0aGlzLmhlYWRWaWV3ID0gbmV3IFZpZXdzLkhlYWREaXJlY3RpdmUodGhpcyk7XG4gIH1cblxuICAkdGltZW91dChjYWxsYmFjazogRnVuY3Rpb24sIHdhaXQ/OiBudW1iZXIpIHtcbiAgICBpZiAod2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShjYWxsYmFjayBhcyBGcmFtZVJlcXVlc3RDYWxsYmFjaylcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH1cblxuICBvbihldmVudCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLmV2ZW50c1tldmVudF0gPSB0aGlzLmV2ZW50c1tldmVudF0gfHwgW107XG4gICAgdGhpcy5ldmVudHNbZXZlbnRdLnB1c2goe1xuICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgICAgY29udGV4dDogdGhpc1xuICAgIH0pO1xuICB9XG5cbiAgZW1pdChldmVudDogc3RyaW5nLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5ldmVudHNbZXZlbnRdIHx8IFtdO1xuICAgIGxldCBsaXN0ZW5lcklkeCA9IDA7XG4gICAgbGV0IGxpc3RlbmVyID0gbGlzdGVuZXJzW2xpc3RlbmVySWR4XTtcblxuICAgIHdoaWxlIChsaXN0ZW5lcikge1xuICAgICAgbGlzdGVuZXIuY2FsbGJhY2suYXBwbHkobGlzdGVuZXIuY29udGV4dCwgYXJndW1lbnRzKTtcbiAgICAgIGxpc3RlbmVySWR4Kys7XG4gICAgICBsaXN0ZW5lciA9IGxpc3RlbmVyc1tsaXN0ZW5lcklkeF07XG4gICAgfVxuICB9XG5cbiAgYm9vdHN0cmFwKCRyb290OiBKUXVlcnkpIHtcbiAgICBjb25zdCAkY29udGVudFBhZ2UgPSAkcm9vdC5maW5kKCcuc3BhLWNvbnRlbnRfX3BhZ2UnKTtcblxuICAgIHRoaXMuJHJvb3QgPSAkcm9vdDtcbiAgICAkY29udGVudFBhZ2UuY3NzKHsgJ2Rpc3BsYXknOiAnbm9uZScgfSk7XG4gICAgJGNvbnRlbnRQYWdlLnJlbW92ZUNsYXNzKCdzcGEtY29udGVudC0tbm8tanMnKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHBsaWNhdGlvbjtcbiIsImV4cG9ydCAqIGZyb20gJy4vbWFpbi1jb250cm9sbGVyJztcbmV4cG9ydCAqIGZyb20gJy4vdWktY29udHJvbGxlciciLCJpbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ21vZHVsZXMvYXBwJztcblxuaW1wb3J0IHsgTW9kdWxlIH0gICAgICAgICAgZnJvbSAnLi4vbGliL21vZHVsZSc7XG5pbXBvcnQgeyBET01Ob2RlUmVnaXN0ZXIgfSBmcm9tICdtb2R1bGVzL21vZGVscy9kb20tbm9kZS1yZWdpc3Rlcic7XG5cblxuZXhwb3J0IGNsYXNzIE1haW5Db250cm9sbGVyIGV4dGVuZHMgTW9kdWxlIHtcbiAgY29uZmlnOiBJQ29uZmlnTG9hZGVyRGF0YTtcbiAgc2NyaXB0UmVnaXN0ZXI6IERPTU5vZGVSZWdpc3RlciA9IG5ldyBET01Ob2RlUmVnaXN0ZXIoKTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgYXBwOiBBcHBsaWNhdGlvbikge1xuICAgIHN1cGVyKGFwcCk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMuY29uZmlnTG9hZGVyLmdldERlZmF1bHRzKCk7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBhc3luYyBpbml0KCk6IFByb21pc2U8dm9pZD4ge1xuXG4gICAgYXdhaXQgdGhpcy5jb25maWdMb2FkZXIuZmV0Y2hDb25maWcoKGVyciwgY29uZmlnRGF0YSkgPT4ge1xuICAgICAgdGhpcy5jb25maWcgPSBjb25maWdEYXRhIHx8IHRoaXMuY29uZmlnO1xuXG4gICAgICB0aGlzLiRvbignJGxvY2F0aW9uQ2hhbmdlU3VjY2VzcycsIGFzeW5jIChldmVudCwgdG8sIGZyb20pID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ3JvdXRlOiAlbycsIGV2ZW50LCB0bywgZnJvbSk7XG5cbiAgICAgICAgaWYgKHRvID09PSBmcm9tKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coJ21haW5Db250cm9sbGVyLiRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3MoKSAtIHJvdXRpbmcgdG8gJW8nLCB0byk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5jb250ZW50TG9hZGVyLmdldEhUTUwodG8sIHtcbiAgICAgICAgICB1c2VDYWNoZTogdGhpcy5jb25maWcudXNlQ2FjaGUsXG4gICAgICAgICAgcmV1c2VQYWdlczogdGhpcy5jb25maWcucmV1c2VQYWdlcyxcbiAgICAgICAgICBkb25lOiAoZXJyLCAkRE9NKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybihlcnIpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB7ICRET00gfTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJ21haW5Db250cm9sbGVyLiRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3MoKSAtIHVwZGF0ZScpO1xuXG4gICAgICAgICAgICB0aGlzLiRicm9hZGNhc3QoJ3ZpZXc6dXBkYXRlJywgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLiR3aW5kb3cudHJpZ2dlcigndmlldzp1cGRhdGUnLCBkYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIHVybCBmcm9tICd1cmwnO1xuXG5pbXBvcnQgKiBhcyAkIGZyb20gJ2pxdWVyeSc7XG5cbi8vIGxvY2FsIG1vZHVsZXNcbmltcG9ydCAqIGFzIHV0aWxzICAgICAgZnJvbSAnbW9kdWxlcy9saWIvdXRpbHMnO1xuaW1wb3J0IHsgTW9kdWxlIH0gICAgICBmcm9tICdtb2R1bGVzL2xpYi9tb2R1bGUnO1xuaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICdtb2R1bGVzL2FwcCc7XG5pbXBvcnQgeyBMb2FkaW5nVmlldyB9IGZyb20gJ21vZHVsZXMvdmlld3MvbG9hZGluZyc7XG5cbi8vIGpxdWVyeSBwbHVnaW5zXG5pbXBvcnQgJ21vZHVsZXMvdmlld3MvanF1ZXJ5Lm9uZS1zdHJpY3QnO1xuaW1wb3J0ICdtb2R1bGVzL3ZpZXdzL2pxdWVyeS5wcmVwZW5kZWQtY3NzJztcblxuaW50ZXJmYWNlIElVSUNvbnRyb2xsZXJGbGFncyB7XG4gIHNob3dMb2FkaW5nU2NyZWVuPzogYm9vbGVhbjtcbiAgYXN5bmNBbmltYXRpb24/OiBib29sZWFuO1xuICBlbmZvcmNlU21vb3RoPzogYm9vbGVhbjtcbiAgdXNlU2NyZWVuQ2xpcD86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBVSUNvbnRyb2xsZXIgZXh0ZW5kcyBNb2R1bGUge1xuICAkYm9keTogSlF1ZXJ5PEhUTUxCb2R5RWxlbWVudD47XG4gICRjbGlja2FibGVzPzogSlF1ZXJ5PEhUTUxCb2R5RWxlbWVudFtdPjtcblxuICBjb25maWc6IElDb25maWdMb2FkZXJEYXRhO1xuICBmbGFnczogSVVJQ29udHJvbGxlckZsYWdzID0ge307XG4gIG1haW5TZWxlY3Rvcjogc3RyaW5nO1xuICBleGVjPzogKGNhbGxiYWNrOiBGdW5jdGlvbiwgdGltZT86IG51bWJlcikgPT4gdm9pZDtcbiAgbG9hZGluZ1ZpZXc6IExvYWRpbmdWaWV3O1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBhcHA6IEFwcGxpY2F0aW9uKSB7XG4gICAgc3VwZXIoYXBwKTtcbiAgICB0aGlzLmNvbmZpZyA9IHV0aWxzLmRlZmF1bHRzPElDb25maWdMb2FkZXJEYXRhPih0aGlzLmNvbmZpZ0xvYWRlci5nZXREZWZhdWx0cygpLCB7IHRpbWVvdXQ6IDIwMDAgfSk7XG4gICAgdGhpcy4kYm9keSA9ICQoJ2JvZHknKTtcblxuICAgIHRoaXMubWFpblNlbGVjdG9yID0gdGhpcy5jb25maWdMb2FkZXIuZ2V0TWFpblNlbGVjdG9yKCk7XG4gICAgdGhpcy51cGRhdGVDb25maWd1cmF0aW9uKCk7XG5cblxuICAgIHRoaXMubG9hZGluZ1ZpZXcgPSBuZXcgTG9hZGluZ1ZpZXcoe1xuICAgICAgaW5kaWNhdG9yVHlwZTogdGhpcy4kcm9vdC5kYXRhKCd3cC1zcGEtbG9hZGVyLXR5cGUnKSxcbiAgICAgIGluZGljYXRvckNvbG9yOiB0aGlzLiRyb290LmRhdGEoJ3dwLXNwYS1sb2FkZXItY29sb3InKVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuZmxhZ3Muc2hvd0xvYWRpbmdTY3JlZW4pIHtcbiAgICAgIHRoaXMubG9hZGluZ1ZpZXcuYXBwZW5kVG8odGhpcy4kYm9keSk7XG5cbiAgICAgIC8vIG1ha2UgdXNlIG9mZiBjc3MgdHJhbnNpdGlvbiB0byBzbW9vdGggbG9hZGluZyBpbnRyb1xuICAgICAgdGhpcy5sb2FkaW5nVmlldy5zaG93KDApO1xuICAgICAgdGhpcy4kdGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMubG9hZGluZ1ZpZXcuc2hvdyg1MCk7XG4gICAgICB9KVxuICAgIH1cbiAgICB0aGlzLmV4ZWMoKCkgPT4ge1xuXG4gICAgICAvLyBzaG93IGFuaW1hdGlvbiBvbiBmaXJzdCByZW5kZXJcbiAgICAgIHRoaXMuYWRkUGFnZSh0aGlzLiRib2R5LmZpbmQoJy5zcGEtY29udGVudF9fcGFnZScpLCB0aGlzLiRib2R5WzBdLmF0dHJpYnV0ZXMsICgpID0+IHtcbiAgICAgICAgdGhpcy5sb2FkaW5nVmlldy5oaWRlKCk7XG5cbiAgICAgICAgLy8gc3RhcnQgcHJlLWNhY2hpbmdcbiAgICAgICAgdGhpcy5jb250ZW50TG9hZGVyLnByZUNhY2hlKCk7XG4gICAgICB9KTtcbiAgICB9LCAxMiAqIDEwMDApO1xuXG4gICAgdGhpcy5jb25maWdMb2FkZXIuZmV0Y2hDb25maWcoKGVyciwgY29uZmlnRGF0YSkgPT4ge1xuICAgICAgdGhpcy5jb25maWcgPSB1dGlscy5kZWZhdWx0cyhjb25maWdEYXRhLCB0aGlzLmNvbmZpZyk7XG5cbiAgICAgIHRoaXMudXBkYXRlQ29uZmlndXJhdGlvbigpO1xuICAgICAgdGhpcy5ob29rSW50b1BhZ2UodGhpcy4kYm9keSk7XG5cbiAgICAgIHRoaXMuJG9uKCdoZWFkOnVwZGF0ZScsIChldmVudCwgZGF0YSkgPT4ge1xuICAgICAgICBsZXQgJERPTSA9IGRhdGEuJERPTSxcbiAgICAgICAgICAkYm9keSA9ICRET00uZmluZCgnYm9keScpLFxuICAgICAgICAgICRuZXdDb250ZW50ID0gJGJvZHkuZmluZCh0aGlzLm1haW5TZWxlY3RvciksXG4gICAgICAgICAgJGFjdGl2ZUNvbnRlbnQgPSB0aGlzLiRib2R5LmZpbmQodGhpcy5tYWluU2VsZWN0b3IpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCdib2R5LnZpZXc6dXBkYXRlIC0gbmV3ICRzcGFDb250ZW50OiAlbycsICRuZXdDb250ZW50KTtcblxuICAgICAgICB0aGlzLmxvYWRpbmdWaWV3LnNob3coMCk7XG4gICAgICAgIHRoaXMudW5Ib29rKCk7XG4gICAgICAgIGlmICh0aGlzLmZsYWdzLmFzeW5jQW5pbWF0aW9uKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVQYWdlKCRhY3RpdmVDb250ZW50KTtcbiAgICAgICAgICB0aGlzLmFkZFBhZ2UoJG5ld0NvbnRlbnQsICRib2R5WzBdLmF0dHJpYnV0ZXMsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubG9hZGluZ1ZpZXcuaGlkZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucmVtb3ZlUGFnZSgkYWN0aXZlQ29udGVudCwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5sb2FkaW5nVmlldy5zaG93KDUwKTtcbiAgICAgICAgICAgIHRoaXMuYWRkUGFnZSgkbmV3Q29udGVudCwgJGJvZHlbMF0uYXR0cmlidXRlcywgKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmxvYWRpbmdWaWV3LmhpZGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGludGVyY2VwdEFjdGlvbihldnQpIHtcbiAgICBjb25zb2xlLmxvZygnbmdCb2R5LmludGVyY2VwdEFjdGlvbigpJyk7XG4gICAgY29uc3QgdGFyZ2V0SHJlZiA9IGV2dC5jdXJyZW50VGFyZ2V0LmhyZWYgfHwgbG9jYXRpb24uaHJlZjtcbiAgICBjb25zdCByb3V0ZSA9IHRoaXMuZ2V0Um91dGVGcm9tSFJFRih0YXJnZXRIcmVmKTtcblxuICAgIGlmIChyb3V0ZSkge1xuICAgICAgY29uc29sZS5sb2coJ25nQm9keS5pbnRlcmNlcHRBY3Rpb24oKSAgLSByb3V0aW5nIHRvICVzJywgdXRpbHMuZ2V0UGF0aEZyb21VcmwodGFyZ2V0SHJlZikpO1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAocm91dGUgPT0gJ0AnKSB7XG4gICAgICAgIC8vIGF0dGVtcHRpbmcgcm91dGUgdG8gY3VycmVudCBwYWdlXG4gICAgICAgIHRoaXMuc2hha2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucm91dGVyLnBhdGgocm91dGUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnbmdCb2R5LmludGVyY2VwdEFjdGlvbigpIC0gbm8tb3AnKTtcbiAgICB9XG4gIH1cblxuICBnZXRSb3V0ZUZyb21IUkVGKGhyZWYpIHtcbiAgICBsZXQgdGFyZ2V0SHJlZk1ldGEgPSB1cmwucGFyc2UoaHJlZik7XG4gICAgaWYgKC9cXC93cFxcLShhZG1pbnxsb2dpbilcXC8/Ly50ZXN0KHRhcmdldEhyZWZNZXRhLnBhdGgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChsb2NhdGlvbi5ocmVmLm1hdGNoKG5ldyBSZWdFeHAodGFyZ2V0SHJlZk1ldGEucGF0aG5hbWUgKyAnXFwvPyQnKSkpIHtcbiAgICAgIHJldHVybiAnQCc7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRoaXMuY29uZmlnLmNhcHR1cmVBbGxcblxuICAgICAgLy8gYW5pbWF0ZSBmb3IgcGF0aCBjaGFuZ2VzLiBhbGxvdyBuYXRpdmUgaGFzaCBvdGhlcndpc2VcbiAgICAgIHx8IHRhcmdldEhyZWZNZXRhLmhhc2ggJiYgdXJsLnBhcnNlKGxvY2F0aW9uLmhyZWYpLnBhdGhuYW1lICE9IHRhcmdldEhyZWZNZXRhLnBhdGhuYW1lXG5cbiAgICAgIHx8IHRoaXMuY29udGVudExvYWRlci5oYXNQYWdlU3luYyhocmVmKVxuICAgICAgfHwgdGhpcy5jb250ZW50TG9hZGVyLmhhc1Bvc3RTeW5jKGhyZWYpKSB7XG4gICAgICByZXR1cm4gdGFyZ2V0SHJlZk1ldGEucGF0aG5hbWVcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQW5pbWF0aW9uT3B0aW9ucygpIHtcbiAgICB0aGlzLmZsYWdzLmVuZm9yY2VTbW9vdGggPSBOdW1iZXIodGhpcy5jb25maWcuZW5mb3JjZVNtb290aCkgPT09IDE7XG4gICAgdGhpcy5mbGFncy5hc3luY0FuaW1hdGlvbiA9IE51bWJlcih0aGlzLmNvbmZpZy5hc3luY0FuaW1hdGlvbikgPT09IDE7XG4gICAgdGhpcy5mbGFncy51c2VTY3JlZW5DbGlwID0gTnVtYmVyKHRoaXMuY29uZmlnLnVzZVNjcmVlbkNsaXApID09PSAxO1xuICAgIHRoaXMuZmxhZ3Muc2hvd0xvYWRpbmdTY3JlZW4gPSAhIXRoaXMuJHJvb3QuYXR0cignZGF0YS13cC1zcGEtbG9hZGVyLXR5cGUnKTtcbiAgfVxuXG4gIHVwZGF0ZUV4ZWN1dGlvbk1ldGhvZCgpIHtcbiAgICB0aGlzLmV4ZWMgPSB0aGlzLmZsYWdzLmVuZm9yY2VTbW9vdGggPyB0aGlzLmV4ZWNPbklkbGUgOiB0aGlzLmV4ZWNJbW1lZGlhdGU7XG4gIH1cblxuICB1cGRhdGVDb25maWd1cmF0aW9uKCkge1xuICAgIHRoaXMudXBkYXRlQW5pbWF0aW9uT3B0aW9ucygpO1xuICAgIHRoaXMudXBkYXRlRXhlY3V0aW9uTWV0aG9kKCk7XG4gIH1cblxuICBkZXN0cm95Q2xpY2tPdmVycmlkZXMoKSB7XG4gICAgaWYgKHRoaXMuJGNsaWNrYWJsZXMpIHtcbiAgICAgIHRoaXMuJGNsaWNrYWJsZXMub2ZmKCdjbGljaycsIG51bGwsIGV2dCA9PiB0aGlzLmludGVyY2VwdEFjdGlvbihldnQpKTtcbiAgICB9XG4gICAgZGVsZXRlIHRoaXMuJGNsaWNrYWJsZXM7XG4gIH1cblxuICBjcmVhdGVDbGlja092ZXJyaWRlcygkcGFnZSkge1xuICAgIHRoaXMuJGNsaWNrYWJsZXMgPSAkcGFnZS5maW5kKCdbaHJlZl0nKS5ub3QoJ1tkYXRhLXNwYS1pbml0aWFsaXplZF0nKTtcbiAgICB0aGlzLiRjbGlja2FibGVzLm9uKCdjbGljaycsIGV2dCA9PiB0aGlzLmludGVyY2VwdEFjdGlvbihldnQpKTtcbiAgICB0aGlzLiRjbGlja2FibGVzLmF0dHIoJ2RhdGEtc3BhLWluaXRpYWxpemVkJywgMSk7XG4gIH1cblxuICBzaGFrZSgpIHtcbiAgICB0aGlzLiRyb290Lm9uZVRpbWVvdXQoJ2FuaW1hdGlvbmVuZCcsICgpID0+IHtcbiAgICAgIHRoaXMuJHJvb3QucmVtb3ZlQ2xhc3MoJ3NwYS1jb250ZW50LS1zaGFrZScpO1xuICAgIH0sIDMwMDApO1xuICAgIHRoaXMuJHJvb3QuYWRkQ2xhc3MoJ3NwYS1jb250ZW50LS1zaGFrZScpO1xuICB9XG5cbiAgaG9va0ludG9QYWdlKCRwYWdlKSB7XG4gICAgdGhpcy5jcmVhdGVDbGlja092ZXJyaWRlcygkcGFnZSk7XG4gIH1cblxuICBleGVjT25JZGxlVGltZWQoY2FsbGJhY2ssIGR1cmF0aW9uKSB7XG4gICAgbGV0IGlzQ2FsbGJhY2tDbGVhbiA9IHRydWU7XG4gICAgbGV0IHRpbWVvdXRJZDtcbiAgICBsZXQgc3RyaWN0Q2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICAgIGlmIChpc0NhbGxiYWNrQ2xlYW4pIHtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5yZXNvdXJjZU1vbml0b3Iub25jZShzdHJpY3RDYWxsYmFjayk7XG5cbiAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlzQ2FsbGJhY2tDbGVhbiA9IGZhbHNlO1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9LCBkdXJhdGlvbik7XG4gIH1cblxuICBleGVjT25JZGxlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMucmVzb3VyY2VNb25pdG9yLm9uY2UoY2FsbGJhY2spO1xuICB9XG5cbiAgZXhlY0ltbWVkaWF0ZShjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLiR0aW1lb3V0KGNhbGxiYWNrKTtcbiAgfVxuXG4gIHVuSG9vaygpIHtcbiAgICB0aGlzLmRlc3Ryb3lDbGlja092ZXJyaWRlcygpXG4gIH1cblxuICBhZGRQYWdlKCRwYWdlLCBhdHRycywgY2FsbGJhY2spIHtcbiAgICBsZXQgJHZpZXcgPSAkcGFnZS5maW5kKCcuc3BhLWNvbnRlbnRfX3ZpZXcnKTtcbiAgICBsZXQgYXR0cklkeCA9IDA7XG4gICAgbGV0IGJvZHlDbGFzc2VzO1xuICAgIGxldCBhdHRyO1xuXG4gICAgdGhpcy5ob29rSW50b1BhZ2UoJHBhZ2UpO1xuXG4gICAgbGV0IHN0YXJ0QW5pbWF0aW9uRW5kV2F0Y2ggPSAkcGFnZS5vbmVEZWxheWVkVGltZW91dCgnYW5pbWF0aW9uZW5kJywgKCkgPT4ge1xuICAgICAgdGhpcy4kdGltZW91dCgoKSA9PiB7XG4gICAgICAgIC8vIHJlc3RvcmUgY2xhc3NlcyB0byBub3JtYWxcbiAgICAgICAgdGhpcy4kYm9keS5hdHRyKCdjbGFzcycsIGJvZHlDbGFzc2VzKTtcbiAgICAgICAgJHZpZXcucmVtb3ZlQ2xhc3MoYm9keUNsYXNzZXMpO1xuICAgICAgICAkcGFnZS5yZW1vdmVDbGFzcygnYW5pbWF0ZS1wYWdlLWluJylcbiAgICAgICAgICAuY3NzKHtcblxuICAgICAgICAgICAgJ2FuaW1hdGlvbi1kdXJhdGlvbic6ICcnLFxuICAgICAgICAgICAgJ2FuaW1hdGlvbi1uYW1lJzogJydcbiAgICAgICAgICB9KTtcblxuICAgICAgICBpZiAoY2FsbGJhY2spIGNhbGxiYWNrKCk7XG5cbiAgICAgICAgLy8gaW5pdCBzb21lIGV2ZW50cyBpbiBjYXNlIDNyZC1wYXJ0eSBsaWIgdXNlcyBpdCBmb3IgcmVuZGVyaW5nXG4gICAgICAgIHRoaXMuJHdpbmRvdy5yZXNpemUoKTtcbiAgICAgICAgdGhpcy4kd2luZG93LnNjcm9sbCgpO1xuICAgICAgfSk7XG4gICAgfSwgTnVtYmVyKHRoaXMuY29uZmlnLmFuaW1hdGlvbkluRHVyYXRpb24pICsgdGhpcy5jb25maWcudGltZW91dCk7XG5cbiAgICB3aGlsZSAoYXR0ciA9IGF0dHJzW2F0dHJJZHgrK10pIHtcbiAgICAgIHN3aXRjaCAoYXR0ci5uYW1lKSB7XG4gICAgICAgIGNhc2UgJ2NsYXNzJzpcblxuICAgICAgICAgIC8vIGNvcHkgYm9keSBjbGFzc05hbWVzIHRvIHZpZXcgZWxlbWVudCBhbmQgY2xlYXIgYm9keVxuICAgICAgICAgIC8vIHdlJ2xsIGFkZCB0aGUgY2xhc3NlcyB0byB0aGUgYm9keSBvbmNlIHRoZSBhbmltYXRpb24gaXMgY29tcGxldGVcbiAgICAgICAgICB0aGlzLiRib2R5LmF0dHIoYXR0ci5uYW1lLCAnJyk7XG4gICAgICAgICAgYm9keUNsYXNzZXMgPSBhdHRyLnZhbHVlO1xuICAgICAgICAgICR2aWV3LmFkZENsYXNzKGJvZHlDbGFzc2VzKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRoaXMuJGJvZHkuYXR0cihhdHRyLm5hbWUsIGF0dHIudmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHNldCBwYWdlIHByb3BlcnRpZXNcbiAgICBpZiAodGhpcy5mbGFncy51c2VTY3JlZW5DbGlwKSB7XG4gICAgICAkcGFnZS5hZGRDbGFzcygnYW5pbWF0ZS1wYWdlLWluLS1jbGlwcGVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRwYWdlLnJlbW92ZUNsYXNzKCdhbmltYXRlLXBhZ2UtaW4tLWNsaXBwZWQnKTtcbiAgICB9XG5cbiAgICAkcGFnZS5jc3MoeyAnZGlzcGxheSc6ICdub25lJyB9KVxuICAgICAgLmFkZENsYXNzKCdhbmltYXRlLXBhZ2UtaW4nKTtcblxuICAgIC8vIGF0dGFjaCB0byBkb20gaWYgcGFnZSBpc24ndCBhbHJlYWR5XG4gICAgaWYgKCEoJC5jb250YWlucyhkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsICRwYWdlWzBdKSkpIHtcbiAgICAgIHRoaXMuJHJvb3QucHJlcGVuZCgkcGFnZSk7XG4gICAgfVxuXG4gICAgdGhpcy5leGVjKCgpID0+IHtcblxuICAgICAgLy8ganVtcCB0byB0b3Agb2Ygc2NyZWVuXG4gICAgICAvLyBoZWxwcyBrZWVwIHRyYW5zaXRpb25zIGJldHdlZW4gcGFnZXMgc2VhbWxlc3NcbiAgICAgIHV0aWxzLmp1bXBUbygwKTtcblxuICAgICAgLy8gcmVtb3ZlIGNsaXBwZWQgdmlldyBpZiBuZWVkZWRcbiAgICAgICRwYWdlLnJlbW92ZUNsYXNzKCdhbmltYXRlLXBhZ2UtaW4tLWNsaXBwZWQnKTtcblxuICAgICAgc3RhcnRBbmltYXRpb25FbmRXYXRjaCgpO1xuXG4gICAgICAvLyBwbGF5IGFuaW1hdGlvblxuICAgICAgJHBhZ2UuY3NzKHtcbiAgICAgICAgJ2Rpc3BsYXknOiAnJyxcbiAgICAgICAgJ2FuaW1hdGlvbi1uYW1lJzogdGhpcy5jb25maWcuYW5pbWF0aW9uSW5OYW1lLFxuICAgICAgICAnYW5pbWF0aW9uLWR1cmF0aW9uJzogdGhpcy5jb25maWcuYW5pbWF0aW9uSW5EdXJhdGlvbiArICdtcydcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcmVtb3ZlUGFnZSgkcGFnZSwgY2FsbGJhY2s/KSB7XG4gICAgbGV0ICR2aWV3ID0gJHBhZ2UuZmluZCgnLnNwYS1jb250ZW50X192aWV3Jyk7XG4gICAgbGV0IGJvZHlDbGFzc05hbWVzID0gdGhpcy4kYm9keS5hdHRyKCdjbGFzcycpO1xuXG4gICAgLy8gYWRqdXN0IGZvciBjbGlwcGVkIHZpZXdcbiAgICAvLyBwb3NzaWJseSBwcm92aWRlcyByZWxpZWYgZnJvbSBmbGlja2VyXG4gICAgaWYgKHRoaXMuZmxhZ3MudXNlU2NyZWVuQ2xpcCkge1xuICAgICAgdGhpcy4kcm9vdC5wcmVwZW5kZWRDU1MoW1xuICAgICAgICB7XG4gICAgICAgICAgc2VsZWN0b3I6ICcuYW5pbWF0ZS1wYWdlLW91dC5hbmltYXRlLXBhZ2Utb3V0LS1jbGlwcGVkIC5zcGEtY29udGVudF9fdmlldycsXG4gICAgICAgICAgc3R5bGVzOiB7XG4gICAgICAgICAgICAnbWFyZ2luLXRvcCc6IHRoaXMuJHdpbmRvdy5zY3JvbGxUb3AoKSAqIC0xICsgJ3B4J1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHNlbGVjdG9yOiAnLmFuaW1hdGUtcGFnZS1vdXQuYW5pbWF0ZS1wYWdlLW91dC0tY2xpcHBlZCcsXG4gICAgICAgICAgc3R5bGVzOiB7XG4gICAgICAgICAgICAnYW5pbWF0aW9uLW5hbWUnOiAnbm9uZScsXG4gICAgICAgICAgICAnbWluLWhlaWdodCc6ICcxMDB2aCcsXG4gICAgICAgICAgICAnb3ZlcmZsb3cnOiAnaGlkZGVuJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXSk7XG4gICAgICAkcGFnZS5hZGRDbGFzcygnYW5pbWF0ZS1wYWdlLW91dC0tY2xpcHBlZCcpO1xuXG4gICAgICAvLyBqdW1wIHRvIHRvcCBvZiBzY3JlZW5cbiAgICAgIC8vIGhlbHBzIGtlZXAgdHJhbnNpdGlvbnMgYmV0d2VlbiBwYWdlcyBzZWFtbGVzc1xuICAgICAgdXRpbHMuanVtcFRvKDApO1xuICAgIH0gZWxzZSB7XG4gICAgICAkcGFnZS5yZW1vdmVDbGFzcygnYW5pbWF0ZS1wYWdlLW91dC0tY2xpcHBlZCcpO1xuICAgICAgdGhpcy4kcm9vdC5wcmVwZW5kZWRDU1MoW1xuICAgICAgICB7XG4gICAgICAgICAgc2VsZWN0b3I6ICcuYW5pbWF0ZS1wYWdlLW91dCcsXG4gICAgICAgICAgc3R5bGVzOiB7XG4gICAgICAgICAgICAnYW5pbWF0aW9uLW5hbWUnOiAnbm9uZSdcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgIH1cbiAgICAkcGFnZS5hZGRDbGFzcygnYW5pbWF0ZS1wYWdlLW91dCcpO1xuXG4gICAgbGV0IHN0YXJ0QW5pbWF0aW9uRW5kV2F0Y2ggPSAkcGFnZS5vbmVEZWxheWVkVGltZW91dCgnYW5pbWF0aW9uZW5kJywgKCkgPT4ge1xuXG4gICAgICAkcGFnZS5yZW1vdmUoKTtcbiAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soKTtcbiAgICAgIGlmICh0aGlzLmZsYWdzLnVzZVNjcmVlbkNsaXApIHtcbiAgICAgICAgdGhpcy4kcm9vdC5wcmVwZW5kZWRDU1MoJ3JlbW92ZScpO1xuICAgICAgfVxuXG4gICAgfSwgTnVtYmVyKHRoaXMuY29uZmlnLmFuaW1hdGlvbk91dER1cmF0aW9uKSArIHRoaXMuY29uZmlnLnRpbWVvdXQpO1xuXG4gICAgLy8gZHVwbGljYXRlIGJvZHkgY2xhc3NOYW1lcyB0byAkcGFnZSBzY29wZVxuICAgICR2aWV3LmFkZENsYXNzKGJvZHlDbGFzc05hbWVzKTtcblxuICAgIC8vIGFsbG93IG92ZXJmbG93IHJlbmRlcmluZyBmaXJzdFxuICAgIHRoaXMuZXhlYygoKSA9PiB7XG4gICAgICBzdGFydEFuaW1hdGlvbkVuZFdhdGNoKCk7XG4gICAgICAkcGFnZS5jc3Moe1xuICAgICAgICAnYW5pbWF0aW9uLW5hbWUnOiB0aGlzLmNvbmZpZy5hbmltYXRpb25PdXROYW1lLFxuICAgICAgICAnYW5pbWF0aW9uLWR1cmF0aW9uJzogdGhpcy5jb25maWcuYW5pbWF0aW9uT3V0RHVyYXRpb24gKyAnbXMnXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG4iLCJpbXBvcnQgKiBhcyAkIGZyb20gJ2pxdWVyeSc7XG5cbmV4cG9ydCBjbGFzcyBET01QYXJzZXIge1xuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgcGFyc2VGcm9tU3RyaW5nKERPTVN0cmluZzogc3RyaW5nKTogSlF1ZXJ5PEhUTUxFbGVtZW50PiB7XG4gICAgcmV0dXJuICQoRE9NU3RyaW5nKTtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IFRyaWdnZXJlZEV2ZW50ID0gSlF1ZXJ5LlRyaWdnZXJlZEV2ZW50O1xuXG50eXBlIElIaXN0b3J5RXZlbnQgPSBUcmlnZ2VyZWRFdmVudDxXaW5kb3csIFBvcFN0YXRlRXZlbnQ+O1xudHlwZSBJSGlzdG9yeUNoYW5nZUNhbGxiYWNrID0gKGV2dDogSUhpc3RvcnlFdmVudCkgPT4gdm9pZDtcblxuY29uc3QgSElTVE9SWV9DSEFOR0VfRVZFTlQgPSAnc3RhdGVjaGFuZ2UnO1xuXG5leHBvcnQgY2xhc3MgQXBwSGlzdG9yeSB7XG5cbiAgcHJpdmF0ZSAkd2luZG93ID0gJCh3aW5kb3cpO1xuICBwcml2YXRlIGNhbGxiYWNrczogSUhpc3RvcnlDaGFuZ2VDYWxsYmFja1tdID0gW107XG5cbiAgY29uc3RydWN0b3IocHVibGljIGhpc3Rvcnk6IEhpc3RvcnkgPSB3aW5kb3cuaGlzdG9yeSkge1xuICAgIHRoaXMuJHdpbmRvdy5vbihISVNUT1JZX0NIQU5HRV9FVkVOVCwgKGV2ZW50KSA9PiB0aGlzLmV4ZWNDYWxsYmFja3MoZXZlbnQpKTtcbiAgfVxuXG4gIHByaXZhdGUgZXhlY0NhbGxiYWNrcyhldmVudDogVHJpZ2dlcmVkRXZlbnQ8V2luZG93LCBQb3BTdGF0ZUV2ZW50Pikge1xuICAgIHRoaXMuY2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2sgJiYgY2FsbGJhY2soZXZlbnQpKTtcbiAgfVxuXG4gIGdldFN0YXRlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuaGlzdG9yeS5zdGF0ZTtcbiAgfVxuXG4gIHB1c2hTdGF0ZShkYXRhPzogYW55LCB0aXRsZT86IHN0cmluZywgdXJsPzogc3RyaW5nKSB7XG4gICAgdGhpcy5oaXN0b3J5LnB1c2hTdGF0ZShkYXRhLCB0aXRsZSwgdXJsKTtcbiAgICB0aGlzLiR3aW5kb3cudHJpZ2dlcihuZXcgJC5FdmVudChISVNUT1JZX0NIQU5HRV9FVkVOVCwge1xuICAgICAgZGF0YToge1xuICAgICAgICB0aXRsZSxcbiAgICAgICAgdXJsLFxuICAgICAgICAuLi5kYXRhXG4gICAgICB9XG4gICAgfSkpO1xuICB9XG5cbiAgb25DaGFuZ2UoY2FsbGJhY2s/OiBJSGlzdG9yeUNoYW5nZUNhbGxiYWNrKSB7XG4gICAgY29uc3QgY291bnQgPSB0aGlzLmNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICBjb25zdCBpbmRleCA9IGNvdW50IC0gMTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLmNhbGxiYWNrc1tpbmRleF0gPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy4kd2luZG93Lm9mZihISVNUT1JZX0NIQU5HRV9FVkVOVCk7XG4gIH07XG59IiwiaW1wb3J0IHsgQXBwbGljYXRpb24gfSAgICAgZnJvbSAnbW9kdWxlcy9hcHAnO1xuaW1wb3J0IHsgQXBwUm91dGVyIH0gICAgICAgZnJvbSAnbW9kdWxlcy9saWIvcm91dGVyJztcbmltcG9ydCB7IENvbmZpZ0xvYWRlciB9ICAgIGZyb20gJ21vZHVsZXMvc2VydmljZXMvY29uZmlnLWxvYWRlcic7XG5pbXBvcnQgeyBDb250ZW50TG9hZGVyIH0gICBmcm9tICdtb2R1bGVzL3NlcnZpY2VzL2NvbnRlbnQtbG9hZGVyJztcbmltcG9ydCB7IFJlc291cmNlTW9uaXRvciB9IGZyb20gJ21vZHVsZXMvc2VydmljZXMvcmVzb3VyY2UtbW9uaXRvcic7XG5cbmNvbnN0IGRlZmF1bHRFeHRlbmRlZFByb3BzID0gW1xuICAnJHRpbWVvdXQnLFxuICAnJHdpbmRvdycsXG4gICckcm9vdCcsXG4gICdtZXRhJyxcbiAgJ3Jlc291cmNlTW9uaXRvcicsXG4gICdjb25maWdMb2FkZXInLFxuICAnY29udGVudExvYWRlcicsXG4gICdyb3V0ZXInXG5dO1xuXG5leHBvcnQgY2xhc3MgTW9kdWxlIHtcbiAgbWV0YTogSU1vZHVsZU1ldGE7XG4gICR3aW5kb3c6IEpRdWVyeTxJTW9kdWxlRWxlbWVudD47XG4gICRyb290OiBKUXVlcnk8SU1vZHVsZUVsZW1lbnQ+O1xuICByZXNvdXJjZU1vbml0b3I6IFJlc291cmNlTW9uaXRvcjtcbiAgY29uZmlnTG9hZGVyOiBDb25maWdMb2FkZXI7XG4gIGNvbnRlbnRMb2FkZXI6IENvbnRlbnRMb2FkZXI7XG4gIHJvdXRlcjogQXBwUm91dGVyO1xuXG4gIHByZXZpb3VzUGF0aDogc3RyaW5nO1xuICAkdGltZW91dDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgYXBwOiBBcHBsaWNhdGlvbikge1xuICAgIHRoaXMuYXBwID0gYXBwO1xuXG4gICAgZm9yIChsZXQgcHJvcGVydHlOYW1lIG9mIGRlZmF1bHRFeHRlbmRlZFByb3BzKSB7XG4gICAgICB0aGlzW3Byb3BlcnR5TmFtZV0gPSB0aGlzLmFwcFtwcm9wZXJ0eU5hbWVdO1xuICAgIH1cbiAgfVxuXG4gICRvbihldmVudCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLmFwcC5vbihldmVudCwgY2FsbGJhY2spXG4gIH1cblxuICAkYnJvYWRjYXN0KGV2ZW50OiBzdHJpbmcsIC4uLmRhdGE6IGFueVtdKSB7XG4gICAgdGhpcy5hcHAuZW1pdChldmVudCwgLi4uZGF0YSlcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgdXJsIGZyb20gJ3VybCc7XG5cbmltcG9ydCB7IEFwcEhpc3RvcnkgfSBmcm9tICdtb2R1bGVzL2xpYi9oaXN0b3J5JztcblxuXG5leHBvcnQgY2xhc3MgQXBwUm91dGVyIGltcGxlbWVudHMgSVJvdXRlciB7XG4gIGhpc3Rvcnk6IEFwcEhpc3RvcnkgPSBuZXcgQXBwSGlzdG9yeSgpO1xuICByb3V0ZXM6IElSb3V0ZXJIYW5kbGVyW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgYmFzZTogc3RyaW5nID0gJy8nKSB7XG4gICAgdGhpcy5oaXN0b3J5Lm9uQ2hhbmdlKChldnQpID0+IHtcbiAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5oaXN0b3J5LmdldFN0YXRlKCk7XG4gICAgICBjb25zdCBwYXRoID0gc3RhdGUucGF0aDtcblxuICAgICAgY29uc29sZS5sb2coJ3N0YXRlY2hhbmdlOicsIHN0YXRlLCBldnQpO1xuXG4gICAgICBmb3IgKGxldCByb3V0ZUhhbmRsZXIgb2YgdGhpcy5yb3V0ZXMpIHtcbiAgICAgICAgaWYgKHJvdXRlSGFuZGxlci5wYXRoLnRlc3QocGF0aCkpIHtcbiAgICAgICAgICByb3V0ZUhhbmRsZXIuY2FsbGJhY2socGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG9uKHBhdGgsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5yb3V0ZXMucHVzaCh7XG4gICAgICBwYXRoOiBwYXRoLFxuICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgfSlcbiAgfVxuXG4gIHBhdGgocGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgcGF0aFVybCA9IHVybC5yZXNvbHZlKHRoaXMuYmFzZSwgcGF0aCk7XG4gICAgY29uc3QgZGF0YSA9IHsgcGF0aCwgdXJsOiBwYXRoVXJsIH07XG5cbiAgICB0aGlzLmhpc3RvcnkucHVzaFN0YXRlKGRhdGEsIHVuZGVmaW5lZCwgcGF0aFVybCk7XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIHVybCAgICAgZnJvbSAndXJsJztcbmltcG9ydCAqIGFzICQgICAgICAgICAgICBmcm9tICdqcXVlcnknO1xuXG5pbXBvcnQgeyBET01QYXJzZXIgfSBmcm9tICcuL2RvbS1wYXJzZXInO1xuXG5jb25zdCBzaXRlVVJMID0gJCgnaGVhZCBiYXNlJykuYXR0cignaHJlZicpO1xuY29uc3Qgc2l0ZVVSTE1ldGEgPSB1cmwucGFyc2Uoc2l0ZVVSTCk7XG5jb25zdCBkb21QYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb29raWUobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBkYXlzOiBudW1iZXIpIHtcbiAgbGV0IGV4cGlyZXM6IHN0cmluZyA9ICcnO1xuXG4gIGlmIChkYXlzKSB7XG4gICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIGRhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSArIChkYXlzICogMjQgKiA2MCAqIDYwICogMTAwMCkpO1xuICAgIGV4cGlyZXMgPSAnOyBleHBpcmVzPScgKyBkYXRlLnRvVVRDU3RyaW5nKCk7XG4gIH1cblxuICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgJz0nICsgdmFsdWUgKyBleHBpcmVzICsgJzsgcGF0aD0vJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlYWRDb29raWUobmFtZTogc3RyaW5nKSB7XG4gIGxldCBuYW1lRVEgPSBuYW1lICsgJz0nO1xuICBsZXQgY2EgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGNhLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGMgPSBjYVtpXTtcbiAgICB3aGlsZSAoYy5jaGFyQXQoMCkgPT0gJyAnKSBjID0gYy5zdWJzdHJpbmcoMSwgYy5sZW5ndGgpO1xuICAgIGlmIChjLmluZGV4T2YobmFtZUVRKSA9PSAwKSByZXR1cm4gYy5zdWJzdHJpbmcobmFtZUVRLmxlbmd0aCwgYy5sZW5ndGgpO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlcmFzZUNvb2tpZShuYW1lKSB7XG4gIGxldCB2YWx1ZSA9ICcnO1xuICBsZXQgZXhwaXJlczogc3RyaW5nID0gJyc7XG5cbiAgZG9jdW1lbnQuY29va2llID0gbmFtZSArICc9JyArIHZhbHVlICsgZXhwaXJlcyArICc7IHBhdGg9Lyc7XG59XG5cbmludGVyZmFjZSBJU2Nyb2xsT3B0aW9ucyBleHRlbmRzIEpRdWVyeS5FZmZlY3RzT3B0aW9uczxIVE1MRWxlbWVudD4ge1xuICBkdXJhdGlvbj86IG51bWJlcjtcbiAgY2FsbGJhY2s/OiBGdW5jdGlvbjtcbiAgY29udGV4dD86IGFueTtcbiAgYXJndW1lbnRzPzogQXJyYXk8YW55Pjtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtICR0YXJnZXQge2pRdWVyeXxOdW1iZXJ9XG4gKiBAcGFyYW0gb3B0aW9ucyB7b2JqZWN0fSAtIHtkdXJhdGlvbiwgY2FsbGJhY2ssIGNvbnRleHR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzY3JvbGxUbygkdGFyZ2V0LCBvcHRpb25zOiBJU2Nyb2xsT3B0aW9ucykge1xuICBsZXQgYW5pbWF0ZU9wdGlvbnMgPSB7XG4gICAgICBkdXJhdGlvbjogb3B0aW9ucyAmJiBvcHRpb25zLmR1cmF0aW9uID8gb3B0aW9ucy5kdXJhdGlvbiA6IDYwMFxuICAgIH0sIGNhbGxiYWNrQ291bnQgPSAxLFxuICAgIHNjcm9sbFRvcCA9ICR0YXJnZXQub2Zmc2V0ID8gKCR0YXJnZXQub2Zmc2V0KCkudG9wIC0gJCgnaGVhZGVyJykuaGVpZ2h0KCkgKyAyKSA6ICR0YXJnZXQ7XG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMuY2FsbGJhY2spIHtcbiAgICBhbmltYXRlT3B0aW9uc1snY29tcGxldGUnXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChjYWxsYmFja0NvdW50LS0pIHtcbiAgICAgICAgb3B0aW9ucy5jYWxsYmFjay5hcHBseShvcHRpb25zLmNvbnRleHQsIG9wdGlvbnMuYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgIHNjcm9sbFRvcDogc2Nyb2xsVG9wLy8gKzIgZm9yIGdvb2QgbWVhc3VyZVxuICB9LCB7IGR1cmF0aW9uOiA2MDAsIC4uLmFuaW1hdGVPcHRpb25zIH0pO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0gJHRhcmdldFxuICovXG5leHBvcnQgZnVuY3Rpb24ganVtcFRvKCR0YXJnZXQpIHtcbiAgbGV0IHNjcm9sbFRvcCA9ICR0YXJnZXQub2Zmc2V0ID8gKCR0YXJnZXQub2Zmc2V0KCkudG9wIC0gJCgnaGVhZGVyJykuaGVpZ2h0KCkgKyAyKSA6ICR0YXJnZXQ7XG4gICQoJ2h0bWwsIGJvZHknKS5zY3JvbGxUb3AoKHNjcm9sbFRvcCA8IDApID8gMCA6IHNjcm9sbFRvcCk7IC8vICsyIGZvciBnb29kIG1lYXN1cmVcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIGh0bWxcbiAqIEBwYXJhbSBvcHRpb25zXG4gKiBAcmV0dXJucyB7KnxqUXVlcnl8SFRNTEVsZW1lbnR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZURPTVN0cmluZyhodG1sLCBvcHRpb25zKSB7XG4gIGxldCBvcHRzID0gZGVmYXVsdHMoe1xuICAgIHNhZmVtb2RlOiB0cnVlXG4gIH0sIG9wdGlvbnMpO1xuICBpZiAob3B0cy5zYWZlbW9kZSkge1xuICAgIHRyeSB7XG4gICAgICBsZXQgRE9NID0gZG9tUGFyc2VyLnBhcnNlRnJvbVN0cmluZyhodG1sKTtcbiAgICAgIHJldHVybiAkKERPTSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIHJldHVybiAkKGh0bWwpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJChkb21QYXJzZXIucGFyc2VGcm9tU3RyaW5nKGh0bWwpKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudFBhdGgoKSB7XG4gIHJldHVybiBsb2NhdGlvbi5wYXRobmFtZS5zdWJzdHIoZ2V0Um9vdFBhdGgoeyB0cmFpbGluZ1NsYXNoOiBmYWxzZSB9KS5sZW5ndGgpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIHJvb3QgcGF0aFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy50cmFpbGluZ1NsYXNoID0gdHJ1ZV1cbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRSb290UGF0aChvcHRpb25zOiB7IHRyYWlsaW5nU2xhc2g6IGJvb2xlYW4gfSA9IHsgdHJhaWxpbmdTbGFzaDogdHJ1ZSB9KSB7XG4gIHJldHVybiBzaXRlVVJMTWV0YS5wYXRobmFtZSArICgob3B0aW9ucyAmJiBvcHRpb25zLnRyYWlsaW5nU2xhc2ggPT09IGZhbHNlKSA/ICcnIDogJy8nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJvb3RVcmwoKSB7XG4gIHJldHVybiBzaXRlVVJMO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdFVSTFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFBhdGhGcm9tVXJsKHJlcXVlc3RVUkwpIHtcbiAgY29uc3QgZG9tYWluVXJsID0gZ2V0Um9vdFVybCgpO1xuICBjb25zdCBwYXRoU3RhcnRJbmRleCA9IHJlcXVlc3RVUkwuaW5kZXhPZihkb21haW5VcmwpICsgZG9tYWluVXJsLmxlbmd0aDtcblxuICByZXR1cm4gcmVxdWVzdFVSTC5zdWJzdHIocGF0aFN0YXJ0SW5kZXgpO1xufVxuXG4vKipcbiAqIFNhbml0aXplcyBhIHBhdGgvdXJsIGFrYSBhZGRzIHRyYWlsaW5nIHNsYXNoIGlmIG5lZWQgYmUgdG8gYW55IHBhdGhcbiAqIEBwYXJhbSB7c3RyaW5nfSByZXF1ZXN0VVJMXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVVcmwocmVxdWVzdFVSTDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIC9cXC8kLy50ZXN0KHJlcXVlc3RVUkwpID8gYCR7cmVxdWVzdFVSTH0vYCA6IHJlcXVlc3RVUkw7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSByZXF1ZXN0VVJMXG4gKiBAcmV0dXJucyB7KnxqUXVlcnl8SFRNTEVsZW1lbnR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2FkQ3NzKHJlcXVlc3RVUkwpIHtcbiAgbGV0ICRsaW5rID0gJChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJykpO1xuICAkbGluay5hdHRyKHtcbiAgICByZWw6ICdzdHlsZXNoZWV0JyxcbiAgICB0eXBlOiAndGV4dC9jc3MnLFxuICAgIGhyZWY6IHJlcXVlc3RVUkxcbiAgfSk7XG4gICRsaW5rLmFwcGVuZFRvKCdoZWFkJyk7XG4gIHJldHVybiAkbGluaztcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1pblxuICogQHBhcmFtIHtOdW1iZXJ9IG1heFxuICogQHJldHVybnMge051bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJhbmQobWluLCBtYXgpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0czxUID0gYW55PiguLi5hcmdzOiBBcnJheTxQYXJ0aWFsPFQ+Pik6IFQge1xuICBsZXQgaWR4ID0gMDtcbiAgbGV0IGJhc2UgPSBhcmd1bWVudHNbaWR4KytdIHx8IHt9O1xuICBsZXQgbmV4dDtcbiAgbGV0IGtleTtcblxuICBkbyB7XG4gICAgbmV4dCA9IGFyZ3NbaWR4KytdO1xuICAgIGZvciAoa2V5IGluIG5leHQpIHtcbiAgICAgIGlmIChuZXh0Lmhhc093blByb3BlcnR5KGtleSkgJiYgYmFzZVtrZXldID09IHVuZGVmaW5lZCkge1xuICAgICAgICBiYXNlW2tleV0gPSBuZXh0W2tleV1cbiAgICAgIH1cbiAgICB9XG4gIH0gd2hpbGUgKG5leHQpO1xuICByZXR1cm4gYmFzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemUodGV4dDogc3RyaW5nKSB7XG4gIHJldHVybiB0ZXh0WzBdLnRvVXBwZXJDYXNlKCkgKyB0ZXh0LnN1YnN0cigxKTtcbn1cbiIsImV4cG9ydCBjbGFzcyBET01Ob2RlUmVnaXN0ZXIge1xuICAgIHJlZ2lzdHJ5OiBJUmVnaXN0ZXJFbnRyeVtdO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMucmVnaXN0cnkgPSBbXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVnaXN0ZXJFbnRyeX0gcmVnRW50cnlcbiAgICAgKi9cbiAgICBjb250YWlucyhyZWdFbnRyeTogSVJlZ2lzdGVyRW50cnkpIHtcbiAgICAgICAgY29uc3QgcmVnRW50cnlJZCA9IHJlZ0VudHJ5LmdldElkKCk7XG4gICAgICAgIGxldCByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgbGV0IGlkeCA9IDA7XG5cbiAgICAgICAgd2hpbGUgKHRoaXMucmVnaXN0cnlbaWR4XSAmJiAhcmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5yZWdpc3RyeVtpZHhdLmdldElkKCkgPT0gcmVnRW50cnlJZCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlkeCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlZ2lzdGVyRW50cnl9IHJlZ0VudHJ5XG4gICAgICovXG4gICAgYWRkKHJlZ0VudHJ5OiBJUmVnaXN0ZXJFbnRyeSkge1xuICAgICAgICBpZiAoIXRoaXMuY29udGFpbnMocmVnRW50cnkpKSB7XG4gICAgICAgICAgICB0aGlzLnJlZ2lzdHJ5LnB1c2gocmVnRW50cnkpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0ICogYXMgJCBmcm9tICdqcXVlcnknO1xuXG5leHBvcnQgY2xhc3MgUmVnaXN0ZXJFbnRyeSBpbXBsZW1lbnRzIElSZWdpc3RlckVudHJ5IHtcbiAgICBtZXRhOiBhbnk7XG4gICAgZWw6IEhUTUxTY3JpcHRFbGVtZW50O1xuICAgICRlbDogSlF1ZXJ5PEhUTUxTY3JpcHRFbGVtZW50PjtcblxuICAgIGNvbnN0cnVjdG9yKHNjcmlwdERPTU5vZGU6IEhUTUxTY3JpcHRFbGVtZW50KSB7XG4gICAgICAgIHRoaXMubWV0YSA9IHt9O1xuICAgICAgICB0aGlzLmVsID0gc2NyaXB0RE9NTm9kZTtcbiAgICAgICAgdGhpcy4kZWwgPSAkKHNjcmlwdERPTU5vZGUpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFJlZ2lzdGVyRW50cnkgfSBmcm9tICcuL3JlZ2lzdGVyLWVudHJ5JztcblxuZXhwb3J0IGNsYXNzIFNjcmlwdFJlZ2lzdGVyRW50cnkgZXh0ZW5kcyBSZWdpc3RlckVudHJ5IGltcGxlbWVudHMgSVJlZ2lzdGVyRW50cnkge1xuXG4gICAgZ2V0SWQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWwuc3JjIHx8IHRoaXMuJGVsLmh0bWwoKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBSZWdpc3RlckVudHJ5IH0gZnJvbSAnLi9yZWdpc3Rlci1lbnRyeSc7XG5cbmV4cG9ydCBjbGFzcyBTdHlsZVJlZ2lzdGVyRW50cnkgZXh0ZW5kcyBSZWdpc3RlckVudHJ5IGltcGxlbWVudHMgSVJlZ2lzdGVyRW50cnkge1xuXG4gICAgZ2V0SWQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJGVsLmF0dHIoJ2hyZWYnKSB8fCB0aGlzLiRlbC5odG1sKCk7XG4gICAgfVxufVxuIiwiaW1wb3J0ICogYXMgJCBmcm9tICdqcXVlcnknO1xuXG5pbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ21vZHVsZXMvYXBwJztcbmltcG9ydCB7IE1vZHVsZSB9ICAgICAgZnJvbSAnLi4vbGliL21vZHVsZSc7XG5pbXBvcnQgKiBhcyB1dGlscyAgICAgIGZyb20gJ21vZHVsZXMvbGliL3V0aWxzJztcblxuZXhwb3J0IHR5cGUgQ29uZmlnTG9hZGVyQ2FsbGJhY2sgPSAoZXJyb3I6IEVycm9yIHwgbnVsbCwgZGF0YT86IElDb25maWdMb2FkZXJEYXRhKSA9PiBhbnk7XG5cbmV4cG9ydCBjbGFzcyBDb25maWdMb2FkZXIgZXh0ZW5kcyBNb2R1bGUge1xuICBwcml2YXRlIF9zdGF0ZTogSUNvbmZpZ0xvYWRlclN0YXRlO1xuICBwcml2YXRlIF9kYXRhOiBJQ29uZmlnTG9hZGVyRGF0YTtcbiAgY29uZmlnVVJMOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoYXBwOiBBcHBsaWNhdGlvbikge1xuICAgIHN1cGVyKGFwcCk7XG4gICAgdGhpcy5fc3RhdGUgPSB7XG4gICAgICBmbGFnOiB1bmRlZmluZWRcbiAgICB9O1xuXG4gICAgLy8gdXNlIGRlZmF1bHRzIGZvciBub3dcbiAgICB0aGlzLl9kYXRhID0gdGhpcy5nZXREZWZhdWx0cygpO1xuXG4gICAgdGhpcy5jb25maWdVUkwgPSB1dGlscy5nZXRSb290VXJsKCkgKyAnP3dwX3NwYV9jb25maWc9JyArIERhdGUubm93KCk7XG4gIH1cblxuICBnZXRNYWluU2VsZWN0b3IoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJy5zcGEtY29udGVudF9fcGFnZSc7XG4gIH1cblxuICBnZXREZWZhdWx0cygpOiBJQ29uZmlnTG9hZGVyRGF0YSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxvYWRpbmdTY3JlZW5UeXBlOiAnSWNvbicsXG4gICAgICBhbmltYXRpb25Jbk5hbWU6ICdwYWdlSW4nLFxuICAgICAgYW5pbWF0aW9uT3V0TmFtZTogJ3BhZ2VPdXQnLFxuICAgICAgYW5pbWF0aW9uSW5EdXJhdGlvbjogNDAwLFxuICAgICAgYW5pbWF0aW9uT3V0RHVyYXRpb246IDQwMCxcbiAgICAgIHJldXNlUGFnZXM6IDAsXG4gICAgICB1c2VDYWNoZTogMSxcbiAgICAgIHVzZVNjcmVlbkNsaXA6IDAsXG4gICAgICBzaG93TG9hZGluZ1NjcmVlbjogMSxcbiAgICAgIGFzeW5jQW5pbWF0aW9uOiAwLFxuICAgICAgY2FwdHVyZUFsbDogMVxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9jaGVja0FuaW1hdGlvblJlc291cmNlKGNhbGxiYWNrOiBDb25maWdMb2FkZXJDYWxsYmFjaykge1xuICAgIGF3YWl0ICQuYWpheCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvYW5pbWF0ZS5jc3MvMy41LjIvYW5pbWF0ZS5jc3MnLFxuICAgICAgY29tcGxldGU6IChyZXNwb25zZSkgPT4ge1xuICAgICAgICB0aGlzLl9zdGF0ZS5mbGFnID0gcmVzcG9uc2Uuc3RhdHVzID49IDIwMCAmJiByZXNwb25zZS5zdGF0dXMgPCA0MDAgPyAnbm9ybWFsJyA6ICdkZWZhdWx0LW9ubHknO1xuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5mb3JjZVVwZGF0ZV1cbiAgICovXG4gIGFzeW5jIGZldGNoQ29uZmlnKGNhbGxiYWNrOiBDb25maWdMb2FkZXJDYWxsYmFjaywgb3B0aW9ucz86IHsgZm9yY2VVcGRhdGU/OiBib29sZWFuIH0pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBvcHRzID0gdXRpbHMuZGVmYXVsdHMob3B0aW9ucywge30pO1xuXG4gICAgaWYgKG9wdHMuZm9yY2VVcGRhdGUpIHRoaXMuX3N0YXRlLmZsYWcgPSAndXBkYXRlLW9ubHknO1xuICAgIGlmICghdGhpcy5fc3RhdGUuZmxhZykge1xuICAgICAgcmV0dXJuIHRoaXMuX2NoZWNrQW5pbWF0aW9uUmVzb3VyY2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCB0aGlzLmZldGNoQ29uZmlnKGNhbGxiYWNrLCBvcHRpb25zKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3dpdGNoICh0aGlzLl9zdGF0ZS5mbGFnKSB7XG4gICAgICBjYXNlICdsb2FkZWQnOlxuICAgICAgICBpZiAoY2FsbGJhY2spIGNhbGxiYWNrKG51bGwsIHRoaXMuX2RhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2RlZmF1bHQtb25seSc6XG4gICAgICAgIHRoaXMuX2RhdGEgPSB0aGlzLmdldERlZmF1bHRzKCk7XG4gICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2sobnVsbCwgdGhpcy5nZXREZWZhdWx0cygpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd1cGRhdGUtb25seSc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhd2FpdCAkLmFqYXgoe1xuICAgICAgICAgIHVybDogdGhpcy5jb25maWdVUkwsXG4gICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2RhdGEgPSAkLmV4dGVuZCh0aGlzLl9kYXRhLCBKU09OLnBhcnNlKHJlc3BvbnNlKSk7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5fc3RhdGUuZmxhZykge1xuICAgICAgICAgICAgICB0aGlzLl9zdGF0ZS5mbGFnID0gJ2xvYWRlZCc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGhvdGZpeCB0byBjaGVjayBmb3IgdmFsaWQgY29uZmlnXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgY29uc3QgY2FsbGJhY2tEYXRhID0gdGhpcy5fZGF0YS5hbmltYXRpb25Jbk5hbWUgPyB0aGlzLl9kYXRhIDogdGhpcy5nZXREZWZhdWx0cygpO1xuICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBjYWxsYmFja0RhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXJyb3I6IChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcignQ291bGQgbm90IGZldGNoIGNvbmZpZycpLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG4iLCJpbXBvcnQgKiBhcyAkICAgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCAqIGFzIHVybCBmcm9tICd1cmwnO1xuXG5pbXBvcnQgKiBhcyB1dGlscyAgICAgIGZyb20gJy4uL2xpYi91dGlscyc7XG5pbXBvcnQgeyBNb2R1bGUgfSAgICAgIGZyb20gJy4uL2xpYi9tb2R1bGUnO1xuaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICdtb2R1bGVzL2FwcCc7XG5pbXBvcnQgeyBjYXBpdGFsaXplIH0gIGZyb20gJy4uL2xpYi91dGlscyc7XG5cbmludGVyZmFjZSBJQ2FsbGJhY2tPcHRpb25zIHtcbiAgZG9uZT86IEZ1bmN0aW9uO1xuICBjb250ZXh0PzogYW55O1xufVxuXG5leHBvcnQgY2xhc3MgQ29udGVudExvYWRlciBleHRlbmRzIE1vZHVsZSB7XG4gIGRhdGE6IElDb250ZW50TG9hZGVyRGF0YVJlZ2lzdHJ5ID0ge1xuICAgIHBhZ2VzOiBbXSxcbiAgICBwb3N0czogW10sXG4gICAgaXNSZWFkeTogZmFsc2VcbiAgfTtcbiAgcHJpdmF0ZSBfY2FjaGU6IElDb250ZW50TG9hZGVyQ2FjaGU7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGFwcDogQXBwbGljYXRpb24pIHtcbiAgICBzdXBlcihhcHApO1xuICAgIHRoaXMuX2NhY2hlID0ge307XG4gICAgdGhpcy5kb3dubG9hZFNpdGVNYXAoKTtcbiAgfVxuXG4gIGdldDxUIGV4dGVuZHMga2V5b2YgSUNvbnRlbnRMb2FkZXJEYXRhUmVnaXN0cnkgPSBrZXlvZiBJQ29udGVudExvYWRlckRhdGFSZWdpc3RyeT4ocGF0aDogVCk6IElDb250ZW50TG9hZGVyRGF0YVJlZ2lzdHJ5W1RdIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhW3BhdGhdO1xuICB9XG5cbiAgc2V0KHBhdGgsIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVtwYXRoXSA9IHZhbHVlO1xuICB9XG5cbiAgaXNSZWFkeSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoJ2lzUmVhZHknKTtcbiAgfVxuXG4gIHByZUNhY2hlKGlkeDogbnVtYmVyID0gMCkge1xuICAgIGNvbnN0IHBvc3RzID0gdGhpcy5nZXQoJ3Bvc3RzJyk7XG4gICAgY29uc3Qgcm91dGUgPSBwb3N0c1tpZHhdO1xuXG4gICAgaWYgKHJvdXRlKSB7XG4gICAgICB0aGlzLmdldEhUTUwodXJsLnBhcnNlKHJvdXRlKS5wYXRobmFtZSwgeyB1c2VDYWNoZTogdHJ1ZSB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5nZXQoJ3Bvc3RzJylbaWR4ICsgMV0gPyB0aGlzLnByZUNhY2hlKGlkeCArIDEpIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gcm91dGVcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnVzZUNhY2hlPWZhbHNlXVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnJldXNlUGFnZXM9ZmFsc2VdXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmRvbmVdXG4gICAqL1xuICBhc3luYyBnZXRIVE1MKHJvdXRlLCBvcHRpb25zKSB7XG4gICAgY29uc3Qgb3B0cyA9IHV0aWxzLmRlZmF1bHRzKG9wdGlvbnMsIHt9KTtcblxuICAgIGlmIChvcHRzLnVzZUNhY2hlICYmIHRoaXMuX2NhY2hlW3JvdXRlXSkge1xuICAgICAgdmFyICRET00gPSBvcHRzLnJldXNlUGFnZXMgPyB0aGlzLl9jYWNoZVtyb3V0ZV0gOiB0aGlzLl9jYWNoZVtyb3V0ZV0uY2xvbmUoKTtcbiAgICAgIGNvbnNvbGUubG9nKCdzcGFDb250ZW50Ll9jYWNoZVslc10gPSAoJU8pJywgcm91dGUsICRET00pO1xuICAgICAgaWYgKG9wdHMuZG9uZSkgb3B0cy5kb25lLmNhbGwobnVsbCwgbnVsbCwgJERPTSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3YWl0ICQuYWpheCh7XG4gICAgICAgIHVybDogL15odHRwLy50ZXN0KHJvdXRlKSA/IHJvdXRlIDogdXJsLnJlc29sdmUodGhpcy5tZXRhLmJhc2VIUkVGLCByb3V0ZSksXG4gICAgICAgIHN1Y2Nlc3M6IChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IF9ET00gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdodG1sJyk7XG4gICAgICAgICAgX0RPTS5pbm5lckhUTUwgPSByZXNwb25zZTtcbiAgICAgICAgICBjb25zdCAkRE9NID0gJChfRE9NKTtcbiAgICAgICAgICBpZiAob3B0cy51c2VDYWNoZSkge1xuICAgICAgICAgICAgdGhpcy5fY2FjaGVbcm91dGVdID0gJERPTTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG9wdHMuZG9uZSkge1xuICAgICAgICAgICAgb3B0cy5kb25lLmNhbGwobnVsbCwgbnVsbCwgb3B0cy5yZXVzZVBhZ2VzID8gJERPTSA6ICRET00uY2xvbmUoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgaWYgKG9wdHMuZG9uZSkge1xuICAgICAgICAgICAgb3B0cy5kb25lLmNhbGwobnVsbCwgbmV3IEVycm9yKCdzcGFDb250ZW50Lmh0dHAuZ2V0KFwiJyArIHJvdXRlICsgJ1wiKSAtIEZhaWxlZDonICsgcmVzcG9uc2UpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmRvbmVdXG4gICAqL1xuICBhc3luYyBkb3dubG9hZFNpdGVNYXAob3B0aW9ucz86IElDYWxsYmFja09wdGlvbnMpIHtcbiAgICB2YXIgX29wdGlvbnMgPSB1dGlscy5kZWZhdWx0cyhvcHRpb25zLCB7XG4gICAgICAgIGNvbnRleHQ6IHRoaXNcbiAgICAgIH0pLFxuICAgICAgc2l0ZU1hcFVSTCA9IHV0aWxzLmdldFJvb3RVcmwoKSArICc/d3Bfc3BhX3NpdGVtYXAnO1xuXG4gICAgYXdhaXQgJC5hamF4KHtcbiAgICAgIHVybDogc2l0ZU1hcFVSTCxcbiAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICBzdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgdmFyIHNpdGVNYXAgPSByZXNwb25zZTtcbiAgICAgICAgY29uc29sZS5sb2coJ1dvcmRQcmVzcyBkb3dubG9hZGVkIHNpdGVtYXAgZGF0YTogJywgc2l0ZU1hcCk7XG4gICAgICAgIGZvciAodmFyIHBvc3RUeXBlIGluIHNpdGVNYXApIHtcbiAgICAgICAgICBpZiAoc2l0ZU1hcC5oYXNPd25Qcm9wZXJ0eShwb3N0VHlwZSkpIHtcbiAgICAgICAgICAgIHN3aXRjaCAocG9zdFR5cGUpIHtcbiAgICAgICAgICAgICAgY2FzZSAncGFnZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5zZXQoJ3BhZ2VzJywgc2l0ZU1hcFtwb3N0VHlwZV0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KCdwb3N0cycsIHNpdGVNYXBbcG9zdFR5cGVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy9jb25zb2xlLmxvZygnV29yZFByZXNzIHByb2Nlc3NlZCBzaXRlbWFwIGRhdGE6ICcsIHRoaXMpO1xuICAgICAgICB0aGlzLnNldCgnaXNSZWFkeScsIHRydWUpO1xuICAgICAgICB0aGlzLiRicm9hZGNhc3QoJ3dvcmRwcmVzczppbml0Jyk7XG4gICAgICAgIGlmIChfb3B0aW9ucy5kb25lKSBfb3B0aW9ucy5kb25lLmNhbGwoX29wdGlvbnMuY29udGV4dCk7XG4gICAgICB9LFxuICAgICAgZXJyb3I6IChyZXNwb25zZSkgPT4ge1xuICAgICAgICB2YXIgc2l0ZU1hcEZldGNoRXJyb3IgPSBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBmZXRjaCBzaXRlbWFwJyk7XG5cbiAgICAgICAgY29uc29sZS5lcnJvcihzaXRlTWFwRmV0Y2hFcnJvcik7XG5cbiAgICAgICAgaWYgKF9vcHRpb25zLmRvbmUpIHtcbiAgICAgICAgICBfb3B0aW9ucy5kb25lLmNhbGwoX29wdGlvbnMuY29udGV4dCwgc2l0ZU1hcEZldGNoRXJyb3IsIHJlc3BvbnNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLmNvbnRleHRdXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmRvbmVdXG4gICAqIEByZXR1cm5zIHtbU3RyaW5nXX1cbiAgICovXG4gIGdldFBhZ2VzKG9wdGlvbnM/OiBJQ2FsbGJhY2tPcHRpb25zKSB7XG4gICAgdmFyIF9vcHRpb25zID0gdXRpbHMuZGVmYXVsdHMob3B0aW9ucywge30pO1xuICAgIGlmICh0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgX29wdGlvbnMuZG9uZS5jYWxsKF9vcHRpb25zLmNvbnRleHQsIHRoaXMuZ2V0KCdwYWdlcycpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiRvbignd29yZHByZXNzOmluaXQnLCAoKSA9PiB7XG4gICAgICAgIF9vcHRpb25zLmRvbmUuY2FsbChfb3B0aW9ucy5jb250ZXh0LCB0aGlzLmdldCgncGFnZXMnKSlcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmRvbmVdXG4gICAqIEByZXR1cm5zIHtbU3RyaW5nXX1cbiAgICovXG4gIGdldFBvc3RzKG9wdGlvbnM/OiBJQ2FsbGJhY2tPcHRpb25zKSB7XG4gICAgdmFyIF9vcHRpb25zID0gdXRpbHMuZGVmYXVsdHMob3B0aW9ucywge30pO1xuICAgIGlmICh0aGlzLmlzUmVhZHkoKSkge1xuICAgICAgX29wdGlvbnMuZG9uZS5jYWxsKF9vcHRpb25zLmNvbnRleHQsIHRoaXMuZ2V0KCdwYWdlcycpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiRvbignd29yZHByZXNzOmluaXQnLCAoKSA9PiB7XG4gICAgICAgIF9vcHRpb25zLmRvbmUuY2FsbChfb3B0aW9ucy5jb250ZXh0LCB0aGlzLmdldCgncGFnZXMnKSlcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gdXJsXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMuZG9uZV1cbiAgICovXG4gIGhhc1BhZ2UodXJsOiBzdHJpbmcsIG9wdGlvbnM/OiBJQ2FsbGJhY2tPcHRpb25zKSB7XG4gICAgdGhpcy52ZXJpZnkoJ3BhZ2VzJywgdXJsLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gcmVxdWVzdGVkVVJMXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaGFzUGFnZVN5bmMocmVxdWVzdGVkVVJMOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoJ3BhZ2VzJykuaW5jbHVkZXMocmVxdWVzdGVkVVJMKTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gdXJsXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMuZG9uZV1cbiAgICovXG4gIGhhc1Bvc3QodXJsOiBzdHJpbmcsIG9wdGlvbnM/OiBJQ2FsbGJhY2tPcHRpb25zKSB7XG4gICAgdGhpcy52ZXJpZnkoJ3Bvc3RzJywgdXJsLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gcmVxdWVzdGVkVVJMXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaGFzUG9zdFN5bmMocmVxdWVzdGVkVVJMOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoJ3Bvc3RzJykuaW5jbHVkZXMocmVxdWVzdGVkVVJMKTtcbiAgfVxuXG4gIHZlcmlmeSh0eXBlOiBzdHJpbmcsIHVybDogc3RyaW5nLCBvcHRpb25zPzogSUNhbGxiYWNrT3B0aW9ucykge1xuICAgIGNvbnN0IF9vcHRpb25zID0gdXRpbHMuZGVmYXVsdHMob3B0aW9ucywge30pO1xuICAgIGNvbnN0IHZlcmlmaWNhdGlvbk1ldGhvZE5hbWUgPSAnZ2V0JyArIGNhcGl0YWxpemUodHlwZSk7XG4gICAgY29uc3QgdmVyaWZpY2F0aW9uTWV0aG9kID0gdGhpc1t2ZXJpZmljYXRpb25NZXRob2ROYW1lXTtcblxuICAgIHZlcmlmaWNhdGlvbk1ldGhvZCh7XG4gICAgICBkb25lOiAodXJscykgPT4ge1xuICAgICAgICBjb25zdCByZXF1ZXN0ZWRVcmwgPSB1dGlscy5zYW5pdGl6ZVVybCh1cmwpO1xuICAgICAgICBpZiAoX29wdGlvbnMuZG9uZSkge1xuICAgICAgICAgIF9vcHRpb25zLmRvbmUuY2FsbChfb3B0aW9ucy5jb250ZXh0LCB1cmxzLmluZGV4T2YocmVxdWVzdGVkVXJsKSA+PSAwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgUmVzb3VyY2VNb25pdG9yIGltcGxlbWVudHMgSVJlc291cmNlTW9uaXRvciB7XG4gIHN0YXRlOiBJUmVzb3VyY2VNb25pdG9yU3RhdGU7XG4gIGNvbmZpZzogSVJlc291cmNlTW9uaXRvckNvbmZpZztcbiAgc3Vic2NyaXB0aW9uczogRnVuY3Rpb25bXTtcbiAgc3RvcmU6IG51bWJlcltdO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogSVJlc291cmNlTW9uaXRvckNvbmZpZyA9IHt9KSB7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICBidWZmZXJTaXplOiBjb25maWcuYnVmZmVyU2l6ZSB8fCAyMDAsXG4gICAgICBpZGxlRnJlcXVlbmN5OiBjb25maWcuaWRsZUZyZXF1ZW5jeSB8fCAoMTAwMCAvIDYwKSAvLyA1MCBmcmFtZXMgcGVyIG1pbGxpc2Vjb25kXG4gICAgfTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaXNJbml0aWFsaXplZDogZmFsc2UsXG4gICAgICBpc1NsZWVwaW5nOiB0cnVlLFxuICAgICAgZ2NQdHI6IDAsXG4gICAgICBoZWFkUHRyOiB0aGlzLmNvbmZpZy5idWZmZXJTaXplIC0gMSxcbiAgICAgIHN1bTogMCxcbiAgICAgIGxhdGVzdDogMCxcbiAgICAgIHByZXY6IDAsXG4gICAgICBzbGVlcFRpbWVvdXRJZDogbnVsbFxuICAgIH07XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gW107XG4gICAgdGhpcy5zdG9yZSA9IFswXTsgLy8gZm9yIHRoZSBtb3N0IHJlY2VudCB0aWNrXG5cbiAgICB3aGlsZSAodGhpcy5zdG9yZS5sZW5ndGggPD0gdGhpcy5jb25maWcuYnVmZmVyU2l6ZSkge1xuICAgICAgdGhpcy5zdG9yZS5wdXNoKDApXG4gICAgfVxuICB9XG5cbiAgdGljaygpIHtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMub25BbmltYXRpb25GcmFtZSgpKTtcbiAgfVxuXG4gIHNsZWVwKCkge1xuICAgIHRoaXMuc3RhdGUuaXNTbGVlcGluZyA9IHRydWU7XG4gICAgdGhpcy50aWNrKCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5zdGF0ZS5zbGVlcFRpbWVvdXRJZCk7XG4gICAgdGhpcy5zdGF0ZS5pc1NsZWVwaW5nID0gZmFsc2U7XG4gICAgdGhpcy50aWNrKCk7XG4gIH1cblxuICBvbmNlKGNhbGxiYWNrKSB7XG4gICAgdmFyIHN1YnNjcmlwdGlvbklkeCA9IHRoaXMuc3Vic2NyaXB0aW9ucy5sZW5ndGggPyB0aGlzLnN1YnNjcmlwdGlvbnMubGVuZ3RoIC0gMSA6IDA7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goKCkgPT4ge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5zcGxpY2Uoc3Vic2NyaXB0aW9uSWR4LCAxKTtcbiAgICB9KTtcbiAgICB0aGlzLnN0YXJ0KCk7XG4gIH1cblxuICBvbkFuaW1hdGlvbkZyYW1lKCkge1xuICAgIGxldCBjYWxsYmFja0lkeCA9IDA7XG4gICAgbGV0IGNhbGxiYWNrO1xuXG4gICAgaWYgKHRoaXMuaXNTbGVlcGluZygpKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXNldCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyByZWNvcmQgdGltaW5nIG9mIGxhdGVzdCB0aWNrIGRlbGF5XG4gICAgICB0aGlzLnN0YXRlLnByZXYgPSB0aGlzLnN0YXRlLmxhdGVzdDtcbiAgICAgIHRoaXMuc3RhdGUubGF0ZXN0ID0gRGF0ZS5ub3coKTtcblxuICAgICAgLy8gY2FsY3VsYXRlIGFuZCBzYXZlIG5ldyBkZWxheVxuICAgICAgdGhpcy5zdG9yZVt0aGlzLnN0YXRlLmhlYWRQdHJdID0gdGhpcy5zdGF0ZS5sYXRlc3QgLSB0aGlzLnN0YXRlLnByZXY7XG5cblxuICAgICAgLy8gdXBkYXRlIHN0b3JlIGluZGV4IHJlZmVyZW5jZXNcbiAgICAgIHRoaXMuc3RhdGUuZ2NQdHIgPSAodGhpcy5zdGF0ZS5nY1B0ciArIDEpICUgdGhpcy5jb25maWcuYnVmZmVyU2l6ZTtcbiAgICAgIHRoaXMuc3RhdGUuaGVhZFB0ciA9ICh0aGlzLnN0YXRlLmhlYWRQdHIgKyAxKSAlIHRoaXMuY29uZmlnLmJ1ZmZlclNpemU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNSZWFkeSgpKSB7XG5cbiAgICAgIGlmICghdGhpcy5zdGF0ZS5pc0luaXRpYWxpemVkKSB7XG4gICAgICAgIHRoaXMuc3RhdGUuaXNJbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzLnRpY2soKVxuICAgICAgfVxuXG4gICAgICAvLyBhZGQgbmV3IGRpZmYgdG8gc3VtXG4gICAgICB0aGlzLnN0YXRlLnN1bSArPSB0aGlzLnN0b3JlW3RoaXMuc3RhdGUuaGVhZFB0cl07XG5cbiAgICAgIC8vIHN1YnRyYWN0IG9sZCBkaWZmIGZyb20gc3VtXG4gICAgICB0aGlzLnN0YXRlLnN1bSAtPSB0aGlzLnN0b3JlW3RoaXMuc3RhdGUuZ2NQdHJdO1xuXG4gICAgICBpZiAodGhpcy5nZXRTcGVlZCgpIDwgdGhpcy5jb25maWcuaWRsZUZyZXF1ZW5jeSkge1xuICAgICAgICBkbyB7XG4gICAgICAgICAgY2FsbGJhY2sgPSB0aGlzLnN1YnNjcmlwdGlvbnNbY2FsbGJhY2tJZHgrK107XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSB3aGlsZSAoY2FsbGJhY2spXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5oYXNRdWV1ZSgpID8gdGhpcy50aWNrKCkgOiB0aGlzLnNsZWVwKCk7XG4gIH1cblxuICBnZXRTcGVlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5zdW0gLyB0aGlzLmNvbmZpZy5idWZmZXJTaXplXG4gIH1cblxuICBpc1JlYWR5KCkge1xuICAgIHJldHVybiB0aGlzLnN0b3JlW3RoaXMuc3RhdGUuaGVhZFB0cl0gJiYgdGhpcy5zdG9yZVt0aGlzLnN0YXRlLmdjUHRyXTtcbiAgfVxuXG4gIGlzU2xlZXBpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuaXNTbGVlcGluZztcbiAgfVxuXG4gIGhhc1F1ZXVlKCkge1xuICAgIHJldHVybiB0aGlzLnN1YnNjcmlwdGlvbnMubGVuZ3RoID4gMFxuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5zdG9yZSA9IHRoaXMuc3RvcmUubWFwKCgpID0+IDApO1xuICAgIHRoaXMuc3RhdGUuZ2NQdHIgPSAwO1xuICAgIHRoaXMuc3RhdGUuaGVhZFB0ciA9IHRoaXMuY29uZmlnLmJ1ZmZlclNpemUgLSAxO1xuICAgIHRoaXMuc3RhdGUuc3VtID0gMDtcbiAgICB0aGlzLnN0YXRlLnByZXYgPSAwO1xuICAgIHRoaXMuc3RhdGUubGF0ZXN0ID0gMDtcbiAgICB0aGlzLnN0YXRlLmlzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgJCBmcm9tICdqcXVlcnknO1xuXG5cbmltcG9ydCB7IE1vZHVsZSB9ICAgICAgZnJvbSAnbW9kdWxlcy9saWIvbW9kdWxlJztcbmltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAnbW9kdWxlcy9hcHAnO1xuXG5leHBvcnQgY2xhc3MgSGVhZERpcmVjdGl2ZSBleHRlbmRzIE1vZHVsZSB7XG4gICRlbGVtZW50OiBKUXVlcnk8SFRNTEVsZW1lbnQ+O1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBhcHA6IEFwcGxpY2F0aW9uKSB7XG4gICAgc3VwZXIoYXBwKTtcblxuICAgIHRoaXMuJGVsZW1lbnQgPSAkKCdoZWFkJyk7XG5cbiAgICB0aGlzLiRvbignaHRtbDp1cGRhdGUnLCAoZXZlbnQsIGRhdGEpID0+IHtcbiAgICAgIGNvbnN0ICRET00gPSBkYXRhLiRET007XG4gICAgICBjb25zdCAkaGVhZCA9ICRET00uZmluZCgnaGVhZCcpO1xuICAgICAgY29uc3QgJG5ld1N0eWxlcyA9IGRhdGEubmV3LiRzdHlsZXM7XG5cbiAgICAgIC8vICRvbGRTY3JpcHRzLnJlbW92ZSgpO1xuXG4gICAgICAvLyBhZGQgbmV3IHN0eWxlcyB0byBpbmNvbWluZyBoZWFkXG4gICAgICAkaGVhZC5hcHBlbmQoJG5ld1N0eWxlcyk7XG5cbiAgICAgIC8vIHVwZGF0ZSBtZXRhXG4gICAgICB0aGlzLiRlbGVtZW50LmZpbmQoJ21ldGEnKS5yZW1vdmUoKTtcbiAgICAgIHRoaXMuJGVsZW1lbnQucHJlcGVuZCgkaGVhZC5maW5kKCdtZXRhJykpO1xuICAgICAgdGhpcy4kZWxlbWVudC5maW5kKCd0aXRsZScpLnJlbW92ZSgpO1xuICAgICAgdGhpcy4kZWxlbWVudC5wcmVwZW5kKCRoZWFkLmZpbmQoJ3RpdGxlJykpO1xuXG4gICAgICB0aGlzLiRicm9hZGNhc3QoJ2hlYWQ6dXBkYXRlJywgZGF0YSlcbiAgICB9KTtcbiAgfVxuXG5cbn1cbiIsImltcG9ydCAqIGFzICQgZnJvbSAnanF1ZXJ5JztcblxuaW1wb3J0IHsgQXBwbGljYXRpb24gfSAgICAgICAgIGZyb20gJ21vZHVsZXMvYXBwJztcbmltcG9ydCAqIGFzIHV0aWxzICAgICAgICAgICAgICBmcm9tICdtb2R1bGVzL2xpYi91dGlscyc7XG5pbXBvcnQgeyBNb2R1bGUgfSAgICAgICAgICAgICAgZnJvbSAnbW9kdWxlcy9saWIvbW9kdWxlJztcbmltcG9ydCB7IERPTU5vZGVSZWdpc3RlciB9ICAgICBmcm9tICdtb2R1bGVzL21vZGVscy9kb20tbm9kZS1yZWdpc3Rlcic7XG5pbXBvcnQgeyBTY3JpcHRSZWdpc3RlckVudHJ5IH0gZnJvbSAnbW9kdWxlcy9tb2RlbHMvc2NyaXB0LXJlZ2lzdGVyLWVudHJ5JztcbmltcG9ydCB7IFN0eWxlUmVnaXN0ZXJFbnRyeSB9ICBmcm9tICdtb2R1bGVzL21vZGVscy9zdHlsZS1yZWdpc3Rlci1lbnRyeSc7XG5cblxuLyoqXG4gKiBAZXh0ZW5kcyBNb2R1bGVcbiAqIEBjbGFzcyBIVE1MRGlyZWN0aXZlXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIEhUTUxEaXJlY3RpdmUgZXh0ZW5kcyBNb2R1bGUge1xuICAgIHNlbGVjdG9yczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcbiAgICBzY3JpcHRSZWdpc3RlcjogRE9NTm9kZVJlZ2lzdGVyO1xuICAgIHN0eWxlUmVnaXN0ZXI6IERPTU5vZGVSZWdpc3RlcjtcbiAgICAkZWxlbWVudDogSlF1ZXJ5PEhUTUxIdG1sRWxlbWVudD47XG5cbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcGxpY2F0aW9uKSB7XG4gICAgICAgIHN1cGVyKGFwcCk7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQgPSAkKCdodG1sJykgYXMgSlF1ZXJ5PEhUTUxIdG1sRWxlbWVudD47XG4gICAgICAgIHRoaXMuc2VsZWN0b3JzID0ge1xuICAgICAgICAgICAgc2NyaXB0OiAnc2NyaXB0JyxcbiAgICAgICAgICAgIHN0eWxlOiBcImxpbmtbcmVsPSdzdHlsZXNoZWV0J10sIHN0eWxlXCIsXG4gICAgICAgICAgICBzcGFTY3JpcHQ6ICdbc3JjKj1cIndwLXNwYS1wdWJsaWNcIl0nXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zY3JpcHRSZWdpc3RlciA9IG5ldyBET01Ob2RlUmVnaXN0ZXIoKTtcbiAgICAgICAgdGhpcy5zdHlsZVJlZ2lzdGVyID0gbmV3IERPTU5vZGVSZWdpc3RlcigpO1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTY3JpcHRzKHRoaXMuJGVsZW1lbnQuZmluZCgnc2NyaXB0JykpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyU3R5bGVzKHRoaXMuJGVsZW1lbnQuZmluZCh0aGlzLnNlbGVjdG9ycy5zdHlsZSkpO1xuXG4gICAgICAgIHRoaXMuZm9ybWF0RE9NKHRoaXMuJGVsZW1lbnQsIHtpZ25vcmU6IHRoaXMuc2VsZWN0b3JzLnNwYVNjcmlwdH0pO1xuXG4gICAgICAgIHRoaXMuJG9uKCd2aWV3OnVwZGF0ZScsIChldmVudCwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgJERPTSA9IGRhdGEuJERPTTtcblxuICAgICAgICAgICAgdGhpcy5mb3JtYXRET00oJERPTSwgeyByZW1vdmU6IHRoaXMuc2VsZWN0b3JzLnNwYVNjcmlwdCB9KTtcblxuICAgICAgICAgICAgY29uc3QgJHN0eWxlcyA9ICRET00uZmluZCh0aGlzLnNlbGVjdG9ycy5zdHlsZSk7XG4gICAgICAgICAgICBjb25zdCAkc2NyaXB0cyA9ICRET00uZmluZCh0aGlzLnNlbGVjdG9ycy5zY3JpcHQpO1xuXG4gICAgICAgICAgICAkc2NyaXB0cy5lYWNoKChpbmRleCwgZWwpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgc2NyaXB0UmVnRW50cnkgPSBuZXcgU2NyaXB0UmVnaXN0ZXJFbnRyeShlbCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2NyaXB0UmVnaXN0ZXIuY29udGFpbnMoc2NyaXB0UmVnRW50cnkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcmlwdFJlZ0VudHJ5LiRlbC5hdHRyKCdkYXRhLXNwYS1sb2FkZWQnLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ25nLmh0bWwgLSBleGNsdWRpbmcgJW8nLCBlbClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcmlwdFJlZ2lzdGVyLmFkZChzY3JpcHRSZWdFbnRyeSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignbmcuaHRtbCAtIGFkZGluZyAlbycsIGVsKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkc3R5bGVzLmVhY2goKGluZGV4LCBlbCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBzdHlsZVJlZ0VudHJ5ID0gbmV3IFN0eWxlUmVnaXN0ZXJFbnRyeShlbCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3R5bGVSZWdpc3Rlci5jb250YWlucyhzdHlsZVJlZ0VudHJ5KSkge1xuICAgICAgICAgICAgICAgICAgICBzdHlsZVJlZ0VudHJ5LiRlbC5hdHRyKCdkYXRhLXNwYS1sb2FkZWQnLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ25nLmh0bWwgLSBleGNsdWRpbmcgJW8nLCBlbClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlUmVnaXN0ZXIuYWRkKHN0eWxlUmVnRW50cnkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ25nLmh0bWwgLSBhZGRpbmcgJW8nLCBlbClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGV2ZW50RGF0YSA9IHV0aWxzLmRlZmF1bHRzKHtcbiAgICAgICAgICAgICAgICAkc2NyaXB0czogJHNjcmlwdHMsXG4gICAgICAgICAgICAgICAgJHN0eWxlczogJHN0eWxlcyxcbiAgICAgICAgICAgICAgICBvbGQ6IHtcbiAgICAgICAgICAgICAgICAgICAgJHNjcmlwdHM6ICRzY3JpcHRzLm5vdChcIltkYXRhLXNwYS1sb2FkZWQ9J3RydWUnXVwiKSxcbiAgICAgICAgICAgICAgICAgICAgJHN0eWxlczogJHN0eWxlcy5ub3QoXCJbZGF0YS1zcGEtbG9hZGVkPSd0cnVlJ11cIilcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG5ldzoge1xuICAgICAgICAgICAgICAgICAgICAkc2NyaXB0czogJHNjcmlwdHMuZmlsdGVyKFwiW2RhdGEtc3BhLWxvYWRlZD0ndHJ1ZSddXCIpLFxuICAgICAgICAgICAgICAgICAgICAkc3R5bGVzOiAkc3R5bGVzLmZpbHRlcihcIltkYXRhLXNwYS1sb2FkZWQ9J3RydWUnXVwiKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy4kYnJvYWRjYXN0KCdodG1sOnVwZGF0ZScsIGV2ZW50RGF0YSlcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJTY3JpcHRzKCRzY3JpcHRzKSB7XG4gICAgICAgICRzY3JpcHRzLmVhY2goKGluZGV4LCBlbCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zY3JpcHRSZWdpc3Rlci5hZGQobmV3IFNjcmlwdFJlZ2lzdGVyRW50cnkoZWwpKTtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignbmcuaHRtbCAtIGFkZGluZyAlbycsIGVsKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHJlZ2lzdGVyU3R5bGVzKCRzdHlsZXMpIHtcbiAgICAgICAgJHN0eWxlcy5lYWNoKChpbmRleCwgZWwpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGVSZWdpc3Rlci5hZGQobmV3IFN0eWxlUmVnaXN0ZXJFbnRyeShlbCkpO1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCduZy5odG1sIC0gYWRkaW5nICVvJywgZWwpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJERPTVxuICAgICAqIEBwYXJhbSBbb3B0aW9uc11cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuaWdub3JlXVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5yZW1vdmVdXG4gICAgICovXG4gICAgZm9ybWF0RE9NKCRET00sIG9wdGlvbnM/OiB7IHJlbW92ZT86IHN0cmluZyB8IEpRdWVyeSwgaWdub3JlPzogc3RyaW5nIHwgSlF1ZXJ5IH0pIHtcbiAgICAgICAgY29uc3QgX29wdGlvbnMgPSB1dGlscy5kZWZhdWx0cyh7fSwgb3B0aW9ucyk7XG4gICAgICAgIGxldCAkc2NyaXB0cyA9ICRET00uZmluZCgnc2NyaXB0Jyk7XG5cbiAgICAgICAgaWYgKF9vcHRpb25zLmlnbm9yZSkge1xuICAgICAgICAgICAgJHNjcmlwdHMgPSAkc2NyaXB0cy5ub3QoX29wdGlvbnMuaWdub3JlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoX29wdGlvbnMucmVtb3ZlKSB7XG4gICAgICAgICAgICB2YXIgJHJlbW92ZWRTY3JpcHRzID0gJHNjcmlwdHMuZmlsdGVyKF9vcHRpb25zLnJlbW92ZSkucmVtb3ZlKCk7XG4gICAgICAgICAgICAkc2NyaXB0cyA9ICRzY3JpcHRzLm5vdCgkcmVtb3ZlZFNjcmlwdHMpO1xuICAgICAgICB9XG4gICAgICAgICRzY3JpcHRzLmRldGFjaCgpO1xuICAgICAgICAkRE9NLmZpbmQodGhpcy5jb25maWdMb2FkZXIuZ2V0TWFpblNlbGVjdG9yKCkpLmFwcGVuZCgkc2NyaXB0cyk7XG4gICAgfVxufVxuIiwiZXhwb3J0ICogZnJvbSBcIi4vaGVhZFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vaHRtbFwiO1xuIiwiaW1wb3J0ICogYXMgJCBmcm9tICdqcXVlcnknO1xuXG4kLmZuLm9uZVRpbWVvdXQgPSBmdW5jdGlvbiAoZXZlbnQsIGNhbGxiYWNrLCBkdXJhdGlvbikge1xuICAgIHZhciAkZWwgPSB0aGlzLFxuICAgICAgICBpc0NhbGxiYWNrQ2xlYW4gPSB0cnVlLFxuICAgICAgICB0aW1lb3V0SWQsXG4gICAgICAgIHN0cmljdENhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgICAgICBpZiAoaXNDYWxsYmFja0NsZWFuKSBjYWxsYmFjaygpO1xuICAgICAgICB9O1xuXG4gICAgdGhpcy5vbmUoZXZlbnQsIHN0cmljdENhbGxiYWNrKTtcblxuICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBpc0NhbGxiYWNrQ2xlYW4gPSBmYWxzZTtcbiAgICAgICAgJGVsLm9mZihldmVudCwgbnVsbCwgc3RyaWN0Q2FsbGJhY2spO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgIH0sIGR1cmF0aW9uKTtcbn07XG5cbiQuZm4ub25lRGVsYXllZFRpbWVvdXQgPSBmdW5jdGlvbiAoZXZlbnQsIGNhbGxiYWNrLCBkdXJhdGlvbikge1xuICAgIHZhciAkZWwgPSB0aGlzLFxuICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgIHJldHVybiBmdW5jdGlvbigpe1xuICAgICAgICAkLmZuLm9uZVRpbWVvdXQuYXBwbHkoJGVsLCBhcmdzKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9ICQ7XG4iLCJpbXBvcnQgKiBhcyAkIGZyb20gJ2pxdWVyeSc7XG5cbiQuZm4ucHJlcGVuZGVkQ1NTID0gZnVuY3Rpb24gKG9wOiBJUHJlcGVuZENTU0FyZ3MpOiB2b2lkIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvcCkpe1xuICAgICAgICBsZXQgY3NzICA9ICcnO1xuXG4gICAgICAgIG9wLmZvckVhY2goZnVuY3Rpb24oY3NzU3R5bGUpe1xuICAgICAgICAgICAgY3NzICs9IGNzc1N0eWxlLnNlbGVjdG9yICsgXCJ7XCI7XG4gICAgICAgICAgICBmb3IgKGxldCBwcm9wTmFtZSBpbiBjc3NTdHlsZS5zdHlsZXMpe1xuICAgICAgICAgICAgICAgIGlmIChjc3NTdHlsZS5zdHlsZXMuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKXtcbiAgICAgICAgICAgICAgICAgICAgY3NzICs9IHByb3BOYW1lICsgJzonICsgY3NzU3R5bGUuc3R5bGVzW3Byb3BOYW1lXSArICc7JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjc3MgKz0gXCJ9XCI7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJHN0eWxlcyA9ICQoXCI8c3R5bGU+XCIgKyBjc3MgKyBcIjwvc3R5bGU+XCIpO1xuICAgICAgICB0aGlzLnByZXBlbmQodGhpcy4kc3R5bGVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzd2l0Y2gob3ApIHtcbiAgICAgICAgICAgIGNhc2UgJ3JlbW92ZSc6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuJHN0eWxlcykgdGhpcy4kc3R5bGVzLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSAkOyIsImltcG9ydCAqIGFzIHV0aWxzIGZyb20gJ21vZHVsZXMvbGliL3V0aWxzJztcblxuaW50ZXJmYWNlIElMb2FkaW5nVmlld0NvbmZpZyB7XG4gIGxvYWRpbmdDbGFzc05hbWU6IHN0cmluZztcbiAgbG9hZGluZ0hUTUxDb250ZW50OiBzdHJpbmc7XG4gIGluZGljYXRvclR5cGU6ICdpbmRldGVybWluYXRlJyB8ICdwcm9ncmVzcycgfCBzdHJpbmc7XG4gIGluZGljYXRvckNvbG9yOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBJTG9hZGluZ1ZpZXdTdGF0ZSB7XG4gIGhhc0xvYWRlZDogYm9vbGVhbjtcbiAgcHJvZ3Jlc3M6IG51bWJlcjtcbiAgYXV0b0luY3JlbWVudFRpbWVvdXRJZD86IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIExvYWRpbmdWaWV3IHtcbiAgJGxvYWRpbmdWaWV3OiBKUXVlcnk8SFRNTEVsZW1lbnQ+O1xuICAkbG9hZGluZ0ljb246IEpRdWVyeTxIVE1MRWxlbWVudD47XG4gICRsb2FkaW5nQmFyOiBKUXVlcnk8SFRNTEVsZW1lbnQ+O1xuICAkaW5kaWNhdG9yOiBKUXVlcnk8SFRNTEVsZW1lbnQ+O1xuXG4gIGNvbmZpZzogSUxvYWRpbmdWaWV3Q29uZmlnO1xuICBzdGF0ZTogSUxvYWRpbmdWaWV3U3RhdGUgPSB7IGhhc0xvYWRlZDogZmFsc2UsIHByb2dyZXNzOiAwIH07XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucz86IFBhcnRpYWw8SUxvYWRpbmdWaWV3Q29uZmlnPikge1xuICAgIHRoaXMuY29uZmlnID0gdXRpbHMuZGVmYXVsdHMob3B0aW9ucywge1xuICAgICAgbG9hZGluZ0NsYXNzTmFtZTogJ3dwLXNwYS1sb2FkaW5nLXZpZXctLWxvYWRpbmcnLFxuICAgICAgbG9hZGluZ0hUTUxDb250ZW50OiByZXF1aXJlKCdyYXctbG9hZGVyIS4vLi4vdmlld3MvaHRtbC9sb2FkaW5nLXZpZXcuaHRtbCcpLmRlZmF1bHQsXG4gICAgICBpbmRpY2F0b3JUeXBlOiAnaW5kZXRlcm1pbmF0ZScsXG4gICAgICBpbmRpY2F0b3JDb2xvcjogJydcbiAgICB9KTtcblxuICAgIHRoaXMuJGxvYWRpbmdWaWV3ID0gJCh0aGlzLmNvbmZpZy5sb2FkaW5nSFRNTENvbnRlbnQpO1xuICAgIHRoaXMuJGxvYWRpbmdJY29uID0gdGhpcy4kbG9hZGluZ1ZpZXcuZmluZCgnLndwLXNwYS1sb2FkaW5nLXZpZXdfX2ljb24nKTtcbiAgICB0aGlzLiRsb2FkaW5nQmFyID0gdGhpcy4kbG9hZGluZ1ZpZXcuZmluZCgnLndwLXNwYS1sb2FkaW5nLXZpZXdfX3Byb2dyZXNzLWJhcicpO1xuICAgIHRoaXMuJGxvYWRpbmdWaWV3LmFkZENsYXNzKCd3cC1zcGEtbG9hZGluZy12aWV3LS0nICsgdGhpcy5jb25maWcuaW5kaWNhdG9yVHlwZSk7XG4gIH1cblxuXG4gIHNob3coYW1vdW50OiBudW1iZXIpIHtcbiAgICB0aGlzLiRsb2FkaW5nVmlldy5hZGRDbGFzcyh0aGlzLmNvbmZpZy5sb2FkaW5nQ2xhc3NOYW1lKTtcbiAgICBpZiAodGhpcy5jb25maWcuaW5kaWNhdG9yVHlwZSA9PSAncHJvZ3Jlc3MnICYmIChhbW91bnQgPT09IDAgfHwgYW1vdW50ID4gMCkpIHRoaXMuc2V0TG9hZGluZ1Byb2dyZXNzKGFtb3VudCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnN0YXRlLnByb2dyZXNzID0gMDtcbiAgICB0aGlzLnN0YXRlLmhhc0xvYWRlZCA9IGZhbHNlO1xuICAgIHRoaXMuJGxvYWRpbmdWaWV3LnJlbW92ZUNsYXNzKHRoaXMuY29uZmlnLmxvYWRpbmdDbGFzc05hbWUpO1xuICAgIHRoaXMuJGxvYWRpbmdCYXIuY3NzKHtcbiAgICAgICdvcGFjaXR5JzogJydcbiAgICB9KTtcbiAgfVxuXG4gIHNldExvYWRpbmdQcm9ncmVzcyhhbW91bnQ6IG51bWJlcikge1xuICAgIGlmICghdGhpcy5zdGF0ZS5wcm9ncmVzcykge1xuICAgICAgdGhpcy5zdGF0ZS5wcm9ncmVzcyA9IDA7XG4gICAgICB0aGlzLiRsb2FkaW5nQmFyLmNzcyh7ICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoMCwgMCwgMCknIH0pO1xuICAgIH1cblxuICAgIC8vIHVzZSBhbW91bnQgb25seSBpZiBoaWdoZXIgdGhhbiBjdXJyZW50IHByb2dyZXNzXG4gICAgdGhpcy5zdGF0ZS5wcm9ncmVzcyA9IGFtb3VudCAmJiBhbW91bnQgPiB0aGlzLnN0YXRlLnByb2dyZXNzID8gYW1vdW50IDogdGhpcy5zdGF0ZS5wcm9ncmVzcztcbiAgICBzd2l0Y2ggKGFtb3VudCkge1xuICAgICAgY2FzZSAxMDA6XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnN0YXRlLmF1dG9JbmNyZW1lbnRUaW1lb3V0SWQpO1xuICAgICAgICB0aGlzLnN0YXRlLmhhc0xvYWRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuJGxvYWRpbmdCYXIuY3NzKHtcbiAgICAgICAgICAndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZTNkKDEwMCUsIDAsIDApJyxcbiAgICAgICAgICAnb3BhY2l0eSc6ICcwJ1xuICAgICAgICB9KTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnJlc2V0KCksIDEwMDApO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAwOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy4kbG9hZGluZ0Jhci5jc3Moe1xuICAgICAgICAgICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoJyArIHRoaXMuc3RhdGUucHJvZ3Jlc3MgKyAnJSwgMCwgMCknXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnN0YXRlLmF1dG9JbmNyZW1lbnRUaW1lb3V0SWQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuc3RhdGUucHJvZ3Jlc3MgPCA3NSAmJiAhdGhpcy5zdGF0ZS5oYXNMb2FkZWQpIHRoaXMuc2hvdyh0aGlzLnN0YXRlLnByb2dyZXNzICsgMilcbiAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gIH1cblxuICBoaWRlKCkge1xuICAgIGlmICh0aGlzLmNvbmZpZy5pbmRpY2F0b3JUeXBlID09ICdwcm9ncmVzcycpIHtcbiAgICAgIHRoaXMuc2V0TG9hZGluZ1Byb2dyZXNzKDEwMCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy4kbG9hZGluZ1ZpZXcuZmluZCgnLndwLXNwYS1sb2FkaW5nLXZpZXdfX2ljb24nKS5jc3MoeyBvcGFjaXR5OiAwIH0pO1xuXG4gICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gaGlkZSBldmVyeXRoaW5nXG4gICAgICB0aGlzLiRsb2FkaW5nVmlldy5maW5kKCcud3Atc3BhLWxvYWRpbmctdmlld19faWNvbicpLmNzcyh7IG9wYWNpdHk6ICcnIH0pO1xuICAgICAgdGhpcy4kbG9hZGluZ1ZpZXcucmVtb3ZlQ2xhc3ModGhpcy5jb25maWcubG9hZGluZ0NsYXNzTmFtZSk7XG4gICAgfSwgNjUwKTtcbiAgfVxuXG4gIGFwcGVuZFRvKCRwYXJlbnQ6IEpRdWVyeTxIVE1MRWxlbWVudD4pIHtcbiAgICB0aGlzLiRpbmRpY2F0b3IgPSB0aGlzLmNvbmZpZy5pbmRpY2F0b3JUeXBlID09ICdwcm9ncmVzcycgPyB0aGlzLiRsb2FkaW5nQmFyIDogdGhpcy4kbG9hZGluZ0ljb247XG4gICAgdGhpcy4kaW5kaWNhdG9yLmNzcyh7XG4gICAgICAnYmFja2dyb3VuZC1jb2xvcic6IHRoaXMuY29uZmlnLmluZGljYXRvckNvbG9yXG4gICAgfSk7XG4gICAgJHBhcmVudC5hcHBlbmQodGhpcy4kbG9hZGluZ1ZpZXcpO1xuICB9XG59XG4iLCIvLyBsb2FkcyBmcm9tIGdsb2JhbCB3b3JkcHJlc3MgaW5zdGFuY2Vcbm1vZHVsZS5leHBvcnRzID0gd2luZG93LmpRdWVyeS5ub0NvbmZsaWN0KCk7Il0sInNvdXJjZVJvb3QiOiIifQ==