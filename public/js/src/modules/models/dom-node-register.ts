class NodeRegister {
    registry: IRegisteEntry[];

    constructor() {
        this.registry = [];
    }

    /**
     *
     * @param {RegisterEntry} regEntry
     */
    contains(regEntry: IRegisteEntry) {
        const result = false;
        const regEntryId = regEntry.getId();
        const idx = 0;

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

module.exports = NodeRegister;
