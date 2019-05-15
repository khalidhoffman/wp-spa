
interface IRegisterEntry {
    meta: any;
    el: HTMLScriptElement;
    $el: JQuery<HTMLScriptElement>;

    getId?(): number;
}
