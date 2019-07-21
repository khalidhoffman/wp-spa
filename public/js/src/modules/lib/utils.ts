import * as url     from 'url';
import $            from 'jquery';

import { DOMParser } from './dom-parser';

const siteURL = $('head base').attr('href');
const siteURLMeta = url.parse(siteURL);
const domParser = new DOMParser();

export function createCookie(name: string, value: string, days: number) {
  let expires: string = '';

  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }

  document.cookie = name + '=' + value + expires + '; path=/';
}

export function readCookie(name: string) {
  let nameEQ = name + '=';
  let ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }

  return null;
}

export function eraseCookie(name) {
  let value = '';
  let expires: string = '';

  document.cookie = name + '=' + value + expires + '; path=/';
}

interface IScrollOptions extends JQuery.EffectsOptions<HTMLElement> {
  duration?: number;
  callback?: Function;
  context?: any;
  arguments?: Array<any>;
}

/**
 *
 * @param $target {jQuery|Number}
 * @param options {object} - {duration, callback, context}
 */
export function scrollTo($target, options: IScrollOptions) {
  let animateOptions = {
      duration: options && options.duration ? options.duration : 600
    }, callbackCount = 1,
    scrollTop = $target.offset ? ($target.offset().top - $('header').height() + 2) : $target;
  if (options && options.callback) {
    animateOptions['complete'] = function () {
      if (callbackCount--) {
        options.callback.apply(options.context, options.arguments);
      }
    }
  }
  $('html, body').animate({
    scrollTop: scrollTop// +2 for good measure
  }, { duration: 600, ...animateOptions });
}

/**
 *
 * @param $target
 */
export function jumpTo($target) {
  let scrollTop = $target.offset ? ($target.offset().top - $('header').height() + 2) : $target;
  $('html, body').scrollTop((scrollTop < 0) ? 0 : scrollTop); // +2 for good measure
}

/**
 *
 * @param html
 * @param options
 * @returns {*|jQuery|HTMLElement}
 */
export function parseDOMString(html, options) {
  let opts = defaults({
    safemode: true
  }, options);
  if (opts.safemode) {
    try {
      let DOM = domParser.parseFromString(html);
      return $(DOM);
    } catch (e) {
      console.error(e);
      return $(html);
    }
  } else {
    return $(domParser.parseFromString(html));
  }
}

export function getCurrentPath() {
  return location.pathname.substr(getRootPath({ trailingSlash: false }).length);
}

/**
 * Returns the root path
 * @param {Object} [options]
 * @param {Boolean} [options.trailingSlash = true]
 * @returns {String}
 */
export function getRootPath(options: { trailingSlash: boolean } = { trailingSlash: true }) {
  return siteURLMeta.pathname + ((options && options.trailingSlash === false) ? '' : '/');
}

export function getRootUrl() {
  return siteURL;
}

/**
 *
 * @param {String} requestURL
 * @returns {string}
 */
export function getPathFromUrl(requestURL) {
  const domainUrl = getRootUrl();
  const pathStartIndex = requestURL.indexOf(domainUrl) + domainUrl.length;

  return requestURL.substr(pathStartIndex);
}

/**
 * Sanitizes a path/url aka adds trailing slash if need be to any path
 * @param {string} requestURL
 * @returns {string}
 */
export function sanitizeUrl(requestURL: string): string {
  return /\/$/.test(requestURL) ? `${requestURL}/` : requestURL;
}

/**
 *
 * @param {string} requestURL
 * @returns {*|jQuery|HTMLElement}
 */
export function loadCss(requestURL) {
  let $link = $(document.createElement('link'));
  $link.attr({
    rel: 'stylesheet',
    type: 'text/css',
    href: requestURL
  });
  $link.appendTo('head');
  return $link;
}

/**
 *
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
export function getRand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function defaults<T = any>(...args: Array<Partial<T>>): T {
  let idx = 0;
  let base = arguments[idx++] || {};
  let next;
  let key;

  do {
    next = args[idx++];
    for (key in next) {
      if (next.hasOwnProperty(key) && base[key] == undefined) {
        base[key] = next[key]
      }
    }
  } while (next);
  return base;
}

export function capitalize(text: string) {
  return text[0].toUpperCase() + text.substr(1);
}
