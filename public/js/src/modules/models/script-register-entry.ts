import { RegisterEntry } from './register-entry';

export class ScriptRegisterEntry extends RegisterEntry implements IRegisterEntry {

    getId(): string {
        return this.el.src || this.$el.html();
    }
}
