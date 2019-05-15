import { RegisterEntry } from './register-entry';

class StyleRegisterEntry extends RegisterEntry {

    getId() {
        return this.$el.attr('href') || this.$el.html();
    }
}

module.exports = StyleRegisterEntry;
