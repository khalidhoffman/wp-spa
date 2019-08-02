import * as $ from 'jquery';
import TriggeredEvent = JQuery.TriggeredEvent;

type IHistoryEvent = TriggeredEvent<Window, PopStateEvent>;
type IHistoryChangeCallback = (evt: IHistoryEvent) => void;

export class AppHistory {

  private $window = $(window);
  private callbacks: IHistoryChangeCallback[] = [];

  constructor(public history: History = window.history) {
    this.$window.on('popstate', (event) => this.onPopState(event));
  }

  private onPopState(event: TriggeredEvent<Window, PopStateEvent>) {
    this.callbacks.forEach(callback => callback && callback(event));
  }

  getState(): any {
    return this.history.state;
  }

  pushState(data?: any, title?: string, url?: string) {
    this.history.pushState(data, title, url);
  }

  onChange(callback?: IHistoryChangeCallback) {
    const count = this.callbacks.push(callback);
    const index = count - 1;

    return () => {
      this.callbacks[index] = null;
    }
  }

  destroy(): void {
    this.$window.off('popstate');
  };
}