import * as $ from 'jquery';
import TriggeredEvent = JQuery.TriggeredEvent;

type IHistoryEvent = TriggeredEvent<Window, PopStateEvent>;
type IHistoryChangeCallback = (evt: IHistoryEvent) => void;

const HISTORY_CHANGE_EVENT = 'statechange';

export class AppHistory {

  private $window = $(window);
  private callbacks: IHistoryChangeCallback[] = [];

  constructor(public history: History = window.history) {
    this.$window.on(HISTORY_CHANGE_EVENT, (event) => this.execCallbacks(event));
  }

  private execCallbacks(event: TriggeredEvent<Window, PopStateEvent>) {
    this.callbacks.forEach(callback => callback && callback(event));
  }

  getState(): any {
    return this.history.state;
  }

  pushState(data?: any, title?: string, url?: string) {
    this.history.pushState(data, title, url);
    this.$window.trigger(new $.Event(HISTORY_CHANGE_EVENT, {
      data: {
        title,
        url,
        ...data
      }
    }));
  }

  onChange(callback?: IHistoryChangeCallback) {
    const count = this.callbacks.push(callback);
    const index = count - 1;

    return () => {
      this.callbacks[index] = null;
    }
  }

  destroy(): void {
    this.$window.off(HISTORY_CHANGE_EVENT);
  };
}