define([
    'require',
    'utils',
    'backbone',
    'jquery-masonry',
    'modules/models/gallery',
    '$elements',
    'lazyload',
    'modernizr',
    'modules/cache',
    'lightbox'
], function (require) {

    var utils = require('utils'),
        Backbone = require('backbone'),
        $elements = require('$elements'),
        cache = require('modules/cache'),
        Gallery = require('modules/models/gallery');
    return Backbone.View.extend({
        initialize: function (attrs) {
            console.log('GalleryView.initialize(%O)', attrs);
            var self = this;
            location.hash = location.hash || 'residential';
            this.state.isListening = true;
            this.render();
            this.$window = $elements.window;
            this.onHashChangedScoped = function () {
                self.onHashChange.apply(self, arguments);
            };
            this.$window.on('hashchange', self.onHashChangedScoped);
        },
        state : {
            isListening : true
        },
        selectors: {
            allImagesContainer: '#container-gallery-images',
            singleImageContainer: '.container-gallery-image',
            galleryImage: '.gallery-image',
            galleryContainer: '.container-gallery',
            galleryWrap: '#wrap-gallery-images',
            navLinkBtns: '.button-toggle',
            lazyLoadEls: '.lazy-load',
            loadMoreBtn: '.btn-more'
        },
        events: {
            'click .btn-top': 'onScrollTop',
            'click .btn-more:not(.disabled)': 'onLoadMore',
            'click .btn-more.disabled': 'noop'
        },
        noop : function(evt){
            if (evt && evt.preventDefault) evt.preventDefault();
        },
        onHashChange: function () {
            if(this.galleries[location.hash]){
                this.updateCategoryMenu();
                if (this.galleries[location.hash].pageIndex == 1) {
                    this.lazyloadPage();
                }
                if (this.$gallery.data('masonry')) {
                    this.updateGalleryDisplay();
                }
            }
            this.updateSubNav();
        },
        initMasonry : function(){
            var self = this;
            this.$gallery = this.$gallery.masonry({
                itemSelector: self.selectors.singleImageContainer+'.visible',
                columnWidth: self.selectors.singleImageContainer,
                percentPosition: true,
                gutter: 0,
                transitionDuration: '400ms'
            });
            this.onHashChange();
        },
        stopMasonry : function(){
            console.trace('GalleryView.stopMasonry()');
            this.$gallery.masonry('destroy');
        },
        stopGalleryListening : function(){
            var self = this;
            if(this.state.isListening){
                this.undelegateEvents();
                this.$window.off('hashchange', null, self.onHashChangedScoped);
                this.state.isListening = false;
            }
        },
        startGalleryListening : function(){
            var self = this;
            if(!this.state.isListening){
                this.delegateEvents();
                this.$window.on('hashchange', self.onHashChangedScoped);
                this.state.isListening = true;
            }
        },
        stopGallery : function(){
            console.trace('GalleryView.stopGallery()');
            if (this.$gallery.data('masonry')) this.stopMasonry();
            this.stopGalleryListening();
        },
        startGallery : function(){
            console.trace('GalleryView.startGallery()');
            this.startGalleryListening();
            this.initMasonry();
        },
        onDestroy: function () {
            console.log('GalleryView.onDestroy()');
            var self = this;
            this.stopGallery();
            console.log('GalleryView.onDestroy() - destroying galleries [%O]', this.galleries);
            _.forEach(this.galleries, function(gallery, index, arr){
                gallery.pageIndex = 1;
                console.log('GalleryView.onDestroy() - reset pageIndex for %O', gallery);
                gallery.reset();
                console.log('GalleryView.onDestroy() - destroying models for %O', gallery);
                //_.forEach(gallery.models, function(model, index){
                //    console.log('GalleryView.galleries[%s] is destroying %O', index, model);
                //    model.destroy();
                //});
            });
            this.remove();
        },
        updateGalleryDisplay: function () {
            console.log('GalleryView.updateGalleryDisplay()');

            var self = this,
                $requestedImages = Backbone.$(this.galleries[location.hash].getVisible()).parents(self.selectors.singleImageContainer),
                $otherCategoryImages = this.$allImages.not($requestedImages);

            this.$requestedHiddenImages = $requestedImages.not('.visible');
            this.$upForRemovalImages = $otherCategoryImages.filter('.visible');

            console.log('$requestedImages: %O', $requestedImages);
            console.log('$otherCategories:  %O', $otherCategoryImages);

            this.$gallery.one('removeComplete', function () {
                console.log("GalleryView.one('removeComplete')");
                // remove visible images from selectedGalleryImages
                self.$upForRemovalImages.removeClass('visible');
                self.$requestedHiddenImages.addClass('visible');
                var $appended = self.$requestedHiddenImages.appendTo(self.$gallery);
                console.log("GalleryView.$gallery.append(%O)", $appended);
                self.$gallery.masonry('appended', $appended);
                console.log('GalleryView.$requestedHiddenImages: %O', self.$requestedHiddenImages);
                self.$gallery.masonry('reloadItems');
                self.$gallery.masonry('layout');
                //self.trigger('masonry:loaded');

            });

            console.log('GalleryView.$upForRemovalImages: %O', self.$upForRemovalImages);
            this.$gallery.masonry('remove', self.$upForRemovalImages);

        },
        updateCategoryMenu: function () {
            console.log('GalleryView.updateCategoryMenu()');
            this.$categoryButtons.each(function (index, el) {
                var $el = Backbone.$(el);
                if ($el.hasClass(location.hash.substr(1))) {
                    $el.addClass('active');
                } else {
                    $el.removeClass('active');
                }
            });
        },
        updateSubNav: function () {
            console.log('GalleryView.updateSubNav()');
            if (this.galleries[location.hash].getNextPage({silent: true}).length == 0) {
                this.$loadMoreBtn.addClass('disabled');
            } else {
                this.$loadMoreBtn.removeClass('disabled');
            }
        },
        onScrollTop: function (evt) {
            if (evt && evt.preventDefault) evt.preventDefault();
            utils.scrollTo(this.$(this.selectors.galleryContainer), 500);
        },
        /**
         *
         * @param {object} options
         * @param {Number} options.pageNum
         * @returns {jQuery} Parent jQuery elements of images
         */
        lazyloadPage: function (options) {
            var self = this,
                currentImagesArray = this.galleries[location.hash].getPage(options),
                $images = Backbone.$(currentImagesArray);
            console.log('GalleryView.galleries[%s].getPage(%O) = %O', self, location.hash, options, currentImagesArray);
            console.log('GalleryView.lazyloadPage() - %O', $images);
            $images = $images.lazyload();

            return $images.parents(this.selectors.singleImageContainer);
        },
        onLoadMore: function (evt) {
            if (evt && evt.preventDefault) evt.preventDefault();
            if(!this.galleries[location.hash]) return;
            var $images = Backbone.$(this.galleries[location.hash].getNextPage());
            $images.lazyload();
            if(this.$gallery.data('masonry')) this.updateGalleryDisplay();
            this.updateSubNav();
        },
        render: function () {
            console.log('GalleryView.render()');
            var self = this;

            cache.galleries = cache.galleries || {};
            this.$gallery = this.$(self.selectors.galleryWrap);
            this.$categoryButtons = this.$(this.selectors.navLinkBtns);
            this.$lazyLoadEls = this.$(this.selectors.lazyLoadEls);
            this.$loadMoreBtn = this.$(this.selectors.loadMoreBtn);
            this.galleries = {};
            this.$allImages = this.$(this.selectors.singleImageContainer);
            this.$allImages.addClass('visible');
            this.$categoryButtons.each(function (index, el, arr) {
                var hash = el.hash,
                    imageElModels = [],
                    imageElsSelector = (hash == '#all') ? self.selectors.galleryImage : self.selectors.galleryImage + '.' + hash.substr(1);

                self.galleries[hash] = self.galleries[hash] || cache.galleries[hash] || new Gallery([], {
                        pageLength: Backbone.$(self.selectors.allImagesContainer).data('pageLength')
                    });

                cache.galleries[hash] = self.galleries[hash];
                console.log('GalleryView.galleries[%s].render() - looking for "%s"', hash, imageElsSelector);
                Backbone.$(imageElsSelector).each(function (index, imageEl) {
                    imageElModels.push({
                        el: imageEl
                    });
                });
                console.log('GalleryView.galleries[%s].reset(%O)', hash, imageElModels);
                self.galleries[hash].reset(imageElModels);
            });
            return this;
        }
    });

});