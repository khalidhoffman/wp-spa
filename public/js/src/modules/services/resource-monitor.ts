
class ResourceMonitor implements  IResourceMonitor {
    state: IResourceMonitorState;
    config: IResourceMonitorConfig;
    subscriptions: Function[];
    store: number[];

    constructor(config: IResourceMonitorConfig = {}) {
        this.config = {
            bufferSize: config.bufferSize || 200,
            idleFrequency: config.idleFrequency || (1000 / 60) // 50 frames per millisecond
        };
        this.state = {
            isInitialized: false,
            isSleeping: true,
            gcPtr: 0,
            headPtr: this.config.bufferSize - 1,
            sum: 0,
            latest: 0,
            prev: 0,
            sleepTimeoutId: null
        };
        this.subscriptions = [];
        this.store = [0]; // for the most recent tick

        while (this.store.length <= this.config.bufferSize) {
            this.store.push(0)
        }
    }

    tick() {
        window.requestAnimationFrame((...args) => {
            return this.onAnimationFrame(...args)
        });
    }

    sleep() {
        this.state.isSleeping = true;
        this.tick();
    }

    start() {
        clearTimeout(this.state.sleepTimeoutId);
        this.state.isSleeping = false;
        this.tick();
    }

    once(callback) {
        var subscriptionIdx = this.subscriptions.length ? this.subscriptions.length - 1 : 0;
        this.subscriptions.push(() => {
            callback();
            this.subscriptions.splice(subscriptionIdx, 1);
        });
        this.start();
    }

    onAnimationFrame() {
        let callbackIdx = 0;
        let callback;

        if (this.isSleeping()) {
            return this.reset();
        } else {
            // record timing of latest tick delay
            this.state.prev = this.state.latest;
            this.state.latest = Date.now();

            // calculate and save new delay
            this.store[this.state.headPtr] = this.state.latest - this.state.prev;


            // update store index references
            this.state.gcPtr = (this.state.gcPtr + 1) % this.config.bufferSize;
            this.state.headPtr = (this.state.headPtr + 1) % this.config.bufferSize;
        }

        if (this.isReady()) {

            if (!this.state.isInitialized) {
                this.state.isInitialized = true;
                return this.tick()
            }

            // add new diff to sum
            this.state.sum += this.store[this.state.headPtr];

            // subtract old diff from sum
            this.state.sum -= this.store[this.state.gcPtr];

            if (this.getSpeed() < this.config.idleFrequency) {
                do {
                    callback = this.subscriptions[callbackIdx++];
                    if (callback) {
                        callback();
                    }
                } while (callback)
            }
        }

        this.hasQueue() ? this.tick() : this.sleep();
    }

    getSpeed() {
        return this.state.sum / this.config.bufferSize
    }

    isReady() {
        return this.store[this.state.headPtr] && this.store[this.state.gcPtr];
    }

    isSleeping() {
        return this.state.isSleeping;
    }

    hasQueue() {
        return this.subscriptions.length > 0
    }

    reset() {
        this.store = this.store.map(() => 0);
        this.state.gcPtr = 0;
        this.state.headPtr = this.config.bufferSize - 1;
        this.state.sum = 0;
        this.state.prev = 0;
        this.state.latest = 0;
        this.state.isInitialized = false;
    }
}

module.exports = ResourceMonitor;
