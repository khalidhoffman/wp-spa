var unshift = Array.prototype.unshift,
    splice = Array.prototype.splice;

function ResourceMonitor(config) {
    var self = this,
        config = config || {};

    this.config = {
        bufferSize: config.bufferSize || 200,
        idleFrequency: config.idleFrequency || (1000/ 60) // 50 frames per millisecond
    };
    this.state = {
        isSleeping: true,
        gcPtr: 0,
        headPtr: this.config.bufferSize - 1,
        sum: 0,
        latest: 0,
        prev: 0
    };
    this.subscriptions = [];
    this.store = [0]; // for the most recent tick
    while (self.store.length <= self.config.bufferSize) {
        self.store.push(0)
    }
    this.onAnimationFrame = this.onAnimationFrame.bind(this);
}

ResourceMonitor.prototype = {
    tick: function () {
        window.requestAnimationFrame(this.onAnimationFrame);
    },

    start: function(){
        clearTimeout(this.state.sleepTimeoutId);
        this.state.isSleeping = false;
        this.tick();
    },

    once: function (callback) {
        var self = this,
            subscriptionIdx = this.subscriptions.length ? this.subscriptions.length - 1 : 0;
        this.subscriptions.push(function () {
            callback();
            self.subscriptions.splice(subscriptionIdx, 1);
        });
        this.start();
    },

    onAnimationFrame: function () {
        var callbackIdx = 0,
            callback;

        if (this.isSleeping()){
            return this.resetStore();
        } else {
            // record timing of latest tick delay
            this.state.prev = this.state.latest; 
            this.state.latest = Date.now();

            // calculate and save new delay
            this.store[this.state.headPtr] = this.state.latest - this.state.prev;

            
            // update store index references
            this.state.gcPtr = (this.state.gcPtr+1) % this.config.bufferSize;
            this.state.headPtr = (this.state.headPtr+1) % this.config.bufferSize;
        }

        if (this.isReady()){ 

            if (!this.state.isInitialized){ 
                this.state.isInitialized = true; 
                return this.tick()
            }

            // add new diff to sum
            this.state.sum += this.store[this.state.headPtr];

            // subtract old diff from sum
            this.state.sum -= this.store[this.state.gcPtr];
            
            if (this.getSpeed() < this.config.idleFrequency) {
                while (callback = this.subscriptions[callbackIdx++]) {
                    callback();
                }
            };
        }

        this.hasQueue() ?
            this.tick()
            :
            (function(self){
                self.state.isSleeping = true;
                self.tick();
            })(this);
    },

    getSpeed: function () {
        return this.state.sum / this.config.bufferSize
    },

    isReady: function(){
        return this.store[this.state.headPtr] && this.store[this.state.gcPtr];
    },

    isSleeping : function(){
        return this.state.isSleeping;
    },

    hasQueue: function(){
        return this.subscriptions.length > 0
    },

    resetStore: function(){
        this.store = this.store.map(function(){return 0;});
        this.state.gcPtr = 0; 
        this.state.headPtr = this.config.bufferSize - 1; 
        this.state.sum = 0;
        this.state.prev = 0;
        this.state.latest = 0;
        this.state.isInitialized = false;
    }
};

module.exports = ResourceMonitor;
