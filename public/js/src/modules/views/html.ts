import * as $ from 'jquery';

import { Application }         from 'modules/app';
import * as utils              from 'modules/lib/utils';
import { Module }              from 'modules/lib/module';
import { DOMNodeRegister }     from 'modules/models/dom-node-register';
import { ScriptRegisterEntry } from 'modules/models/script-register-entry';
import { StyleRegisterEntry }  from 'modules/models/style-register-entry';


/**
 * @extends Module
 * @class HTMLDirective
 * @constructor
 */
export class HTMLDirective extends Module {
    selectors: { [key: string]: string };
    scriptRegister: DOMNodeRegister;
    styleRegister: DOMNodeRegister;
    $element: JQuery<HTMLHtmlElement>;

    constructor(app: Application) {
        super(app);
        this.$element = $('html') as JQuery<HTMLHtmlElement>;
        this.selectors = {
            script: 'script',
            style: "link[rel='stylesheet'], style",
            spaScript: '[src*="wp-spa-public"]'
        };

        this.scriptRegister = new DOMNodeRegister();
        this.styleRegister = new DOMNodeRegister();

        this.registerScripts(this.$element.find('script'));
        this.registerStyles(this.$element.find(this.selectors.style));

        this.formatDOM(this.$element, {ignore: this.selectors.spaScript});

        this.$on('view:update', (event, data) => {
            const $DOM = data.$DOM;

            this.formatDOM($DOM, { remove: this.selectors.spaScript });

            const $styles = $DOM.find(this.selectors.style);
            const $scripts = $DOM.find(this.selectors.script);

            $scripts.each((index, el) => {
                var scriptRegEntry = new ScriptRegisterEntry(el);
                if (this.scriptRegister.contains(scriptRegEntry)) {
                    scriptRegEntry.$el.attr('data-spa-loaded', 1);
                    console.log('ng.html - excluding %o', el)
                } else {
                    this.scriptRegister.add(scriptRegEntry);
                    console.warn('ng.html - adding %o', el)
                }
            });

            $styles.each((index, el) => {
                var styleRegEntry = new StyleRegisterEntry(el);
                if (this.styleRegister.contains(styleRegEntry)) {
                    styleRegEntry.$el.attr('data-spa-loaded', 1);
                    console.log('ng.html - excluding %o', el)
                } else {
                    this.styleRegister.add(styleRegEntry);
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
            this.$broadcast('html:update', eventData)
        });
    }

    registerScripts($scripts) {
        $scripts.each((index, el) => {
            this.scriptRegister.add(new ScriptRegisterEntry(el));
            console.warn('ng.html - adding %o', el)
        })
    }

    registerStyles($styles) {
        $styles.each((index, el) => {
            this.styleRegister.add(new StyleRegisterEntry(el));
            console.warn('ng.html - adding %o', el)
        })
    }

    /**
     *
     * @param $DOM
     * @param [options]
     * @param {String} [options.ignore]
     * @param {String} [options.remove]
     */
    formatDOM($DOM, options?: { remove?: string | JQuery, ignore?: string | JQuery }) {
        const _options = utils.defaults({}, options);
        let $scripts = $DOM.find('script');

        if (_options.ignore) {
            $scripts = $scripts.not(_options.ignore);
        }
        if (_options.remove) {
            var $removedScripts = $scripts.filter(_options.remove).remove();
            $scripts = $scripts.not($removedScripts);
        }
        $scripts.detach();
        $DOM.find(this.configLoader.getMainSelector()).append($scripts);
    }
}
