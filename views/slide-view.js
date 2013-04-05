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
        "mobileui/utils/view-injector",
        "mobileui/utils/bus"],
    function(AppCardView, TouchItemView, ViewInjector, bus) {

    var viewInjector = new ViewInjector();
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
            this.listView().prepareNextSlide();
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
            this.on("views:injected", this._onViewsInjected, this);
            this.on("tap", this._onTap, this);

            var self = this;
            this._contentView.filterView().$el.html(this._template);
            viewInjector.convert(this, this._contentView.filterView()).then(function() {
                self.trigger("views:injected");
            });
        },

        _onDeactivate: function() {
            this._contentView.resetAnimations();
        },

        _onViewsInjected: function() {
            console.log("Loaded injected views!");
        },

        needsTopBar: function() {
            return needsTopBar;
        },

        hasLayoutMarginFromTopBar: function() {
            return false;
        },

        prepareNextSlide: function() {
            if (this.navigatorView().nextCard())
                return;
            var nextCard = bus.get("slideManager").lookupNextSlide(this);
            if (nextCard)
                this.navigatorView().prepareNextCard(nextCard);
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
            return "slide/" + encodeURIComponent(this.constructor.label);
        },

        updateRouterLocation: function() {
            var url = this.url();
            if (!url)
                return;
            bus.get("router").navigate(url, { trigger: false });
        }
    });

    return SlideView;

});