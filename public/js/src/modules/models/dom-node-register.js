function NodeRegister() {
    this.registry = [];
}

NodeRegister.prototype = {

    /**
     *
     * @param {RegisterEntry} regEntry
     */
    contains: function (regEntry) {
        var result = false,
            idx = 0;
        while(this.registry[idx] && !result){
          if (this.registry[idx].getId() == regEntry.getId()) {
            result = true;
          } else {
            idx++;
          }
        }
        return result;
    },

    /**
     *
     * @param {RegisterEntry} regEntry
     */
    add: function (regEntry) {
        if (!this.contains(regEntry)) {
            this.registry.push(regEntry);
        }
    }
};

module.exports = NodeRegister;
