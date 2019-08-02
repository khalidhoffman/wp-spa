import * as $ from 'jquery';

export class RegisterEntry implements IRegisterEntry {
    meta: any;
    el: HTMLScriptElement;
    $el: JQuery<HTMLScriptElement>;

    constructor(scriptDOMNode: HTMLScriptElement) {
        this.meta = {};
        this.el = scriptDOMNode;
        this.$el = $(scriptDOMNode);
    }
}
