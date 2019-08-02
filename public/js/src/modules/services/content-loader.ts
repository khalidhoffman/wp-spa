import * as $   from 'jquery';
import * as url from 'url';

import * as utils      from '../lib/utils';
import { Module }      from '../lib/module';
import { Application } from 'modules/app';
import { capitalize }  from '../lib/utils';

interface ICallbackOptions {
  done?: Function;
  context?: any;
}

export class ContentLoader extends Module {
  data: IContentLoaderDataRegistry = {
    pages: [],
    posts: [],
    isReady: false
  };
  private _cache: IContentLoaderCache;

  constructor(public app: Application) {
    super(app);
    this._cache = {};
    this.downloadSiteMap();
  }

  get<T extends keyof IContentLoaderDataRegistry = keyof IContentLoaderDataRegistry>(path: T): IContentLoaderDataRegistry[T] {
    return this.data[path];
  }

  set(path, value) {
    return this.data[path] = value;
  }

  isReady() {
    return this.get('isReady');
  }

  preCache(idx: number = 0) {
    const posts = this.get('posts');
    const route = posts[idx];

    if (route) {
      this.getHTML(url.parse(route).pathname, { useCache: true });
    }

    return this.get('posts')[idx + 1] ? this.preCache(idx + 1) : null;
  }

  /**
   *
   * @param route
   * @param {Object} [options]
   * @param {Boolean} [options.useCache=false]
   * @param {Boolean} [options.reusePages=false]
   * @param {Function} [options.done]
   */
  async getHTML(route, options) {
    const opts = utils.defaults(options, {});

    if (opts.useCache && this._cache[route]) {
      var $DOM = opts.reusePages ? this._cache[route] : this._cache[route].clone();
      console.log('spaContent._cache[%s] = (%O)', route, $DOM);
      if (opts.done) opts.done.call(null, null, $DOM);
    } else {
      await $.ajax({
        url: /^http/.test(route) ? route : url.resolve(this.meta.baseHREF, route),
        success: (response) => {
          const _DOM = document.createElement('html');
          _DOM.innerHTML = response;
          const $DOM = $(_DOM);
          if (opts.useCache) {
            this._cache[route] = $DOM;
          }
          if (opts.done) {
            opts.done.call(null, null, opts.reusePages ? $DOM : $DOM.clone());
          }
        },
        error: (response) => {
          if (opts.done) {
            opts.done.call(null, new Error('spaContent.http.get("' + route + '") - Failed:' + response));
          }
        }
      });
    }
  }

  /**
   *
   * @param {Object} [options]
   * @param {Function} [options.done]
   */
  async downloadSiteMap(options?: ICallbackOptions) {
    var _options = utils.defaults(options, {
        context: this
      }),
      siteMapURL = utils.getRootUrl() + '?wp_spa_sitemap';

    await $.ajax({
      url: siteMapURL,
      dataType: 'json',
      success: (response) => {
        var siteMap = response;
        console.log('WordPress downloaded sitemap data: ', siteMap);
        for (var postType in siteMap) {
          if (siteMap.hasOwnProperty(postType)) {
            switch (postType) {
              case 'page':
                this.set('pages', siteMap[postType]);
                break;
              default:
                this.set('posts', siteMap[postType]);
            }
          }
        }
        //console.log('WordPress processed sitemap data: ', this);
        this.set('isReady', true);
        this.$broadcast('wordpress:init');
        if (_options.done) _options.done.call(_options.context);
      },
      error: (response) => {
        var siteMapFetchError = new Error('Could not fetch sitemap');

        console.error(siteMapFetchError);

        if (_options.done) {
          _options.done.call(_options.context, siteMapFetchError, response);
        }
      }
    });
  }

  /**
   *
   * @param {Object} [options]
   * @param {Object} [options.context]
   * @param {Function} [options.done]
   * @returns {[String]}
   */
  getPages(options?: ICallbackOptions) {
    var _options = utils.defaults(options, {});
    if (this.isReady()) {
      _options.done.call(_options.context, this.get('pages'))
    } else {
      this.$on('wordpress:init', () => {
        _options.done.call(_options.context, this.get('pages'))
      });
    }
  }

  /**
   *
   * @param {Object} [options]
   * @param {Function} [options.done]
   * @returns {[String]}
   */
  getPosts(options?: ICallbackOptions) {
    var _options = utils.defaults(options, {});
    if (this.isReady()) {
      _options.done.call(_options.context, this.get('pages'))
    } else {
      this.$on('wordpress:init', () => {
        _options.done.call(_options.context, this.get('pages'))
      });
    }
  }

  /**
   *
   * @param url
   * @param {Object} [options]
   * @param {Function} [options.done]
   */
  hasPage(url: string, options?: ICallbackOptions) {
    this.verify('pages', url, options);
  }

  /**
   *
   * @param requestedURL
   * @returns {boolean}
   */
  hasPageSync(requestedURL: string): boolean {
    return this.get('pages').includes(requestedURL);
  }

  /**
   *
   * @param url
   * @param {Object} [options]
   * @param {Function} [options.done]
   */
  hasPost(url: string, options?: ICallbackOptions) {
    this.verify('posts', url, options);
  }

  /**
   *
   * @param requestedURL
   * @returns {boolean}
   */
  hasPostSync(requestedURL: string) {
    return this.get('posts').includes(requestedURL);
  }

  verify(type: string, url: string, options?: ICallbackOptions) {
    const _options = utils.defaults(options, {});
    const verificationMethodName = 'get' + capitalize(type);
    const verificationMethod = this[verificationMethodName];

    verificationMethod({
      done: (urls) => {
        const requestedUrl = utils.sanitizeUrl(url);
        if (_options.done) {
          _options.done.call(_options.context, urls.indexOf(requestedUrl) >= 0);
        }
      }
    });
  }
}
