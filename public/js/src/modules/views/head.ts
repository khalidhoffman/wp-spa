import $ from 'jquery';


import { Module }      from 'modules/lib/module';
import { Application } from 'modules/app';

export class HeadDirective extends Module {
  $element: JQuery<HTMLElement>;

  constructor(public app: Application) {
    super(app);

    this.$element = $('head');

    this.$on('html:update', (event, data) => {
      const $DOM = data.$DOM;
      const $head = $DOM.find('head');
      const $newStyles = data.new.$styles;

      // $oldScripts.remove();

      // add new styles to incoming head
      $head.append($newStyles);

      // update meta
      this.$element.find('meta').remove();
      this.$element.prepend($head.find('meta'));
      this.$element.find('title').remove();
      this.$element.prepend($head.find('title'));

      this.$broadcast('head:update', data)
    });
  }


}
