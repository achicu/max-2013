/*
 * Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(["mobileui/ui/app-card-view",
        "mobileui/ui/touch-item-view",
        "mobileui/utils/bus",
        // Make sure that the container view is preloaded by the optimizer.
        "views/slide-container-view"],
    function(AppCardView, TouchItemView, bus) {

    var needsTopBar = false;

    var SlideItemView = TouchItemView.extend({
        initialize: function(slideView) {
            SlideItemView.__super__.initialize.call(this, slideView);
            this.setVerticalLayout().matchParentSize();
        },

        render: function() {
            this.$el.addClass("js-slide-item-view");
            return SlideItemView.__super__.render.call(this);
        },

        _onTapStart: function() {
            this.listView().prepareNextCard();
        },

        _onTap: function(touch) {
            this.listView().trigger("tap", touch);
        }
    });

    var SlideView = AppCardView.extend({
        initialize: function() {
            SlideView.__super__.initialize.call(this);

            this._contentView = new SlideItemView().setListView(this);
            this.append(this._contentView.render());

            this.on("deactivate", this._onDeactivate, this);
            this.on("tap", this._onTap, this);

            this._slideContentView = null;
        },

        setSlideContentView: function(slideContentView) {
            if (this._slideContentView) {
                this._slideContentView.remove();
                this._slideContentView = null;
            }
            if (slideContentView) {
                this._slideContentView = slideContentView;
                slideContentView.matchParentSize();
                this._contentView.filterView().append(slideContentView);
            }
            return this;
        },

        slideContentView: function() {
            return this._slideContentView;
        },

        _onDeactivate: function() {
            this._contentView.resetAnimations();
        },

        needsTopBar: function() {
            return needsTopBar;
        },

        hasLayoutMarginFromTopBar: function() {
            return false;
        },

        prepareNextCard: function() {
            if (this.navigatorView().nextCard())
                return;
            var nextCard = this.nextCard();
            if (nextCard)
                this.navigatorView().prepareNextCard(nextCard);
        },

        hasNextCard: function() {
            return this._slideContentView ? bus.get("slideManager").hasNextSlide(this._slideContentView) : false;
        },

        nextSlide: function() {
            return this._slideContentView ? bus.get("slideManager").lookupNextSlide(this._slideContentView) : null;
        },

        nextCard: function() {
            return SlideView.encapsulateSlide(this.nextSlide());
        },

        hasPreviousCard: function() {
            return this._slideContentView ? bus.get("slideManager").hasPreviousSlide(this._slideContentView) : false;
        },

        previousSlide: function() {
            return this._slideContentView ? bus.get("slideManager").lookupPreviousSlide(this._slideContentView) : null;
        },

        previousCard: function() {
            return SlideView.encapsulateSlide(this.previousSlide());
        },

        _onTap: function() {
            needsTopBar = !needsTopBar;
            this._updateNavigationBar();
        },

        render: function() {
            this.$el.addClass("js-slide-view");
            return SlideView.__super__.render.call(this);
        },

        url: function() {
            return this._slideContentView ? "slide/" + encodeURIComponent(this._slideContentView.constructor.label) : null;
        },

        updateRouterLocation: function() {
            var url = this.url();
            if (!url)
                return;
            bus.get("router").navigate(url, { trigger: false });
        },

        slideConstructor: function() {
            return this._slideContentView.constructor;
        },

        remove: function() {
            // Push the slide view back in a list, so that we could reuse it
            // if user just navigates around.
            SlideView.recoverSlideView(this);
            return this;
        }
    }, {
        _cachedSlides: [],

        encapsulateSlide: function(slide) {
            var slideView = this.lookupCachedSlide(slide);
            return slideView ? slideView : (slide ? this.createSlideView(slide) : null);
        },

        createSlideView: function(slide) {
            var slideItem = bus.get("slideManager").createSlide(slide);
            return new SlideView().setSlideContentView(slideItem).render();
        },

        lookupCachedSlide: function(slide) {
            var cachedSlideView = _.find(this._cachedSlides, function(slideView) {
                return slideView.slideConstructor() === slide;
            });
            if (cachedSlideView) {
                var index = _.indexOf(this._cachedSlides, cachedSlideView);
                this._cachedSlides.splice(index, 1);
                cachedSlideView.setVisible(true)
                    .setOpacity(1)
                    .transform().clear();
            }
            return cachedSlideView;
        },

        recoverSlideView: function(slideView) {
            this._cachedSlides.push(slideView.setVisible(false));
        }
    });

    return SlideView;

});