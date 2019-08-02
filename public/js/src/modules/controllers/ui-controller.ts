import * as url from 'url';

import * as $ from 'jquery';

// local modules
import * as utils      from 'modules/lib/utils';
import { Module }      from 'modules/lib/module';
import { Application } from 'modules/app';
import { LoadingView } from 'modules/views/loading';

// jquery plugins
import 'modules/views/jquery.one-strict';
import 'modules/views/jquery.prepended-css';

interface IUIControllerFlags {
  showLoadingScreen?: boolean;
  asyncAnimation?: boolean;
  enforceSmooth?: boolean;
  useScreenClip?: boolean;
}

export class UIController extends Module {
  $body: JQuery<HTMLBodyElement>;
  $clickables?: JQuery<HTMLBodyElement[]>;

  config: IConfigLoaderData;
  flags: IUIControllerFlags = {};
  mainSelector: string;
  exec?: (callback: Function, time?: number) => void;
  loadingView: LoadingView;

  constructor(public app: Application) {
    super(app);
    this.config = utils.defaults<IConfigLoaderData>(this.configLoader.getDefaults(), { timeout: 2000 });
    this.$body = $('body');

    this.mainSelector = this.configLoader.getMainSelector();
    this.updateConfiguration();


    this.loadingView = new LoadingView({
      indicatorType: this.$root.data('wp-spa-loader-type'),
      indicatorColor: this.$root.data('wp-spa-loader-color')
    });

    if (this.flags.showLoadingScreen) {
      this.loadingView.appendTo(this.$body);

      // make use off css transition to smooth loading intro
      this.loadingView.show(0);
      this.$timeout(() => {
        this.loadingView.show(50);
      })
    }
    this.exec(() => {

      // show animation on first render
      this.addPage(this.$body.find('.spa-content__page'), this.$body[0].attributes, () => {
        this.loadingView.hide();

        // start pre-caching
        this.contentLoader.preCache();
      });
    }, 12 * 1000);

    this.configLoader.fetchConfig((err, configData) => {
      this.config = utils.defaults(configData, this.config);

      this.updateConfiguration();
      this.hookIntoPage(this.$body);

      this.$on('head:update', (event, data) => {
        let $DOM = data.$DOM,
          $body = $DOM.find('body'),
          $newContent = $body.find(this.mainSelector),
          $activeContent = this.$body.find(this.mainSelector);

        console.log('body.view:update - new $spaContent: %o', $newContent);

        this.loadingView.show(0);
        this.unHook();
        if (this.flags.asyncAnimation) {
          this.removePage($activeContent);
          this.addPage($newContent, $body[0].attributes, () => {
            this.loadingView.hide();
          });
        } else {
          this.removePage($activeContent, () => {
            this.loadingView.show(50);
            this.addPage($newContent, $body[0].attributes, () => {
              this.loadingView.hide();
            });
          });
        }
      });
    });
  }

  interceptAction(evt) {
    console.log('ngBody.interceptAction()');
    let targetHref = evt.currentTarget.href || location.href,
      route = this.getRouteFromHREF(targetHref);

    if (route) {
      console.log('ngBody.interceptAction()  - routing to %s', utils.getPathFromUrl(targetHref));
      evt.preventDefault();
      if (route == '@') {
        // attempting route to current page
        this.shake();
      } else {
        this.router.path(route);
      }
    } else {
      console.log('ngBody.interceptAction() - no-op');
    }
  }

  getRouteFromHREF(href) {
    let targetHrefMeta = url.parse(href);
    if (/\/wp\-(admin|login)\/?/.test(targetHrefMeta.path)) {
      return false;
    } else if (location.href.match(new RegExp(targetHrefMeta.pathname + '\/?$'))) {
      return '@';
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
  }

  updateAnimationOptions() {
    this.flags.enforceSmooth = Number(this.config.enforceSmooth) === 1;
    this.flags.asyncAnimation = Number(this.config.asyncAnimation) === 1;
    this.flags.useScreenClip = Number(this.config.useScreenClip) === 1;
    this.flags.showLoadingScreen = !!this.$root.attr('data-wp-spa-loader-type');
  }

  updateExecutionMethod() {
    this.exec = this.flags.enforceSmooth ? this.execOnIdle : this.execImmediate;
  }

  updateConfiguration() {
    this.updateAnimationOptions();
    this.updateExecutionMethod();
  }

  destroyClickOverrides() {
    if (this.$clickables) {
      this.$clickables.off('click', null, evt => this.interceptAction(evt));
    }
    delete this.$clickables;
  }

  createClickOverrides($page) {
    this.$clickables = $page.find('[href]').not('[data-spa-initialized]');
    this.$clickables.on('click', evt => this.interceptAction(evt));
    this.$clickables.attr('data-spa-initialized', 1);
  }

  shake() {
    this.$root.oneTimeout('animationend', () => {
      this.$root.removeClass('spa-content--shake');
    }, 3000);
    this.$root.addClass('spa-content--shake');
  }

  hookIntoPage($page) {
    this.createClickOverrides($page);
  }

  execOnIdleTimed(callback, duration) {
    let isCallbackClean = true;
    let timeoutId;
    let strictCallback = () => {
      clearTimeout(timeoutId);
      if (isCallbackClean) {
        callback();
      }
    };

    this.resourceMonitor.once(strictCallback);

    timeoutId = setTimeout(() => {
      isCallbackClean = false;
      callback();
    }, duration);
  }

  execOnIdle(callback) {
    return this.resourceMonitor.once(callback);
  }

  execImmediate(callback) {
    return this.$timeout(callback);
  }

  unHook() {
    this.destroyClickOverrides()
  }

  addPage($page, attrs, callback) {
    let $view = $page.find('.spa-content__view');
    let attrIdx = 0;
    let bodyClasses;
    let attr;

    this.hookIntoPage($page);

    let startAnimationEndWatch = $page.oneDelayedTimeout('animationend', () => {
      this.$timeout(() => {
        // restore classes to normal
        this.$body.attr('class', bodyClasses);
        $view.removeClass(bodyClasses);
        $page.removeClass('animate-page-in')
          .css({

            'animation-duration': '',
            'animation-name': ''
          });

        if (callback) callback();

        // init some events in case 3rd-party lib uses it for rendering
        this.$window.resize();
        this.$window.scroll();
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
    } else {
      $page.removeClass('animate-page-in--clipped');
    }

    $page.css({ 'display': 'none' })
      .addClass('animate-page-in');

    // attach to dom if page isn't already
    if (!($.contains(document.documentElement, $page[0]))) {
      this.$root.prepend($page);
    }

    this.exec(() => {

      // jump to top of screen
      // helps keep transitions between pages seamless
      utils.jumpTo(0);

      // remove clipped view if needed
      $page.removeClass('animate-page-in--clipped');

      startAnimationEndWatch();

      // play animation
      $page.css({
        'display': '',
        'animation-name': this.config.animationInName,
        'animation-duration': this.config.animationInDuration + 'ms'
      });
    });
  }

  removePage($page, callback?) {
    let $view = $page.find('.spa-content__view');
    let bodyClassNames = this.$body.attr('class');

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
    } else {
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

    let startAnimationEndWatch = $page.oneDelayedTimeout('animationend', () => {
      //$page.remove();
      //this.$root.prependedCSS('remove');
      //if (callback) callback();

      $page.remove();
      if (callback) callback();
      if (this.flags.useScreenClip) {
        this.$root.prependedCSS('remove');
      }

    }, Number(this.config.animationOutDuration) + this.config.timeout);

    // duplicate body classNames to $page scope
    $view.addClass(bodyClassNames);

    // allow overflow rendering first
    this.exec(() => {
      startAnimationEndWatch();
      $page.css({
        'animation-name': this.config.animationOutName,
        'animation-duration': this.config.animationOutDuration + 'ms'
      });
    });
  }
}

