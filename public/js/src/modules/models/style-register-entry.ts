import { RegisterEntry } from './register-entry';

export class StyleRegisterEntry extends RegisterEntry implements IRegisterEntry {

    getId(): string {
        return this.$el.attr('href') || this.$el.html();
    }
}
