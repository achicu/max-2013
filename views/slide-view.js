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

define(["mobileui/ui/app-card-view", "mobileui/utils/view-injector"],
    function(AppCardView, ViewInjector) {

    var viewInjector = new ViewInjector();

    var SlideView = AppCardView.extend({
        initialize: function() {
            SlideView.__super__.initialize.call(this);
            this._needsTopBar = false;
            this.addGestureDetector();
            this.on("tap", this._onTap, this);
            this.on("views:injected", this._onViewsInjected, this);

            var self = this;
            this.$el.html(this._template);
            viewInjector.convert(this).then(function() {
                self.trigger("views:injected");
            });
        },

        _onViewsInjected: function() {
            console.log("Loaded injected views!");
        },

        needsTopBar: function() {
            return this._needsTopBar;
        },

        hasLayoutMarginFromTopBar: function() {
            return false;
        },

        _onTap: function() {
            this._needsTopBar = !this._needsTopBar;
            this._updateNavigationBar();
        },

        render: function() {
            this.$el.addClass("js-slide-view");
            return SlideView.__super__.render.call(this);
        }
    });

    return SlideView;

});