import { RegisterEntry } from './register-entry';

export class ScriptRegisterEntry extends RegisterEntry {

    getId() {
        return this.el.src || this.$el.html();
    }
}

module.exports = ScriptRegisterEntry;
