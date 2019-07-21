export class DOMNodeRegister {
    registry: IRegisterEntry[];

    constructor() {
        this.registry = [];
    }

    /**
     *
     * @param {RegisterEntry} regEntry
     */
    contains(regEntry: IRegisterEntry) {
        const regEntryId = regEntry.getId();
        let result = false;
        let idx = 0;

        while (this.registry[idx] && !result) {
            if (this.registry[idx].getId() == regEntryId) {
                result = true;
            } else {
                idx++;
            }
        }
        return result;
    }

    /**
     *
     * @param {RegisterEntry} regEntry
     */
    add(regEntry: IRegisterEntry) {
        if (!this.contains(regEntry)) {
            this.registry.push(regEntry);
        }
    }
}
