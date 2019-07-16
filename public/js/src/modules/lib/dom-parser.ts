import $ from 'jquery';

export class DOMParser {
  constructor() {}

  parseFromString(DOMString: string): JQuery<HTMLElement> {
    return $(DOMString);
  }
}
