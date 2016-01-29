define([
        'require',
        'namespace',
        'backbone'
    ],
    function (require) {
        var NS = require('namespace'),
            Backbone = require('backbone');

        return Backbone.Collection.extend({
            initialize: function (models, attrs) {
                this.pageIndex = 1;
                this.pageLength = attrs.pageLength || 8;
            },
            getAll: function () {
                return this.models;
            },
            getVisible: function () {
                var self = this,
                    visibleImagesArr = [];
                for (var i = 1; i <= this.pageIndex; i++) {
                    //console.log('compiling page: ', i);
                    visibleImagesArr = visibleImagesArr.concat(self.getPage({
                        pageIndex: i
                    }));
                }
                console.trace('Gallery.getVisible(%i) = %O', this.pageIndex, visibleImagesArr);
                return visibleImagesArr;
            },
            /**
             * Returns array of HTMLElement img for the current page
             * @param {Object} [options]
             * @param {Number} [options.pageIndex]
             * @returns {[HTMLElement]}
             */
            getPage: function (options) {
                var _options = _.extend({}, options),
                    pageIndex = _options.pageIndex || this.pageIndex,
                    self = this,
                    min = (pageIndex < 1) ? 0 : ((pageIndex - 1) * self.pageLength),
                    max = (pageIndex) * self.pageLength,
                    models = this.slice(min, max);

                if (pageIndex < 1) throw new Error('Gallery attempted to fetch invalid page number');

                console.trace('Gallery.getPage(%i) = Gallery.models[%d:%d];', pageIndex, min, max);

                return models.map(function (model, index, arr) {
                    return model.get('el');
                });
            },
            /**
             * Returns array of HTMLElement img for the next page
             * @param [args]
             * @param {Boolean} [args.silent = false] whether the page counter should not be incremented
             * @returns {[HTMLElement]}
             */
            getNextPage: function (args) {
                if (args && args.silent) {
                    return this.getPage({
                        pageIndex: this.pageIndex + 1
                    });
                } else {
                    console.log('GalleryView.getNextPage() - incrementing pageIndex');
                    this.pageIndex++;
                    return this.getPage();
                }
            },
            /**
             *
             * @returns {exports}
             */
            incrementPage: function () {
                this.pageIndex++;
                return this;
            }
        });
    });