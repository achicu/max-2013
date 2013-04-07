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

define(["mobileui/views/layer-view",
        "mobileui/views/layout-params"],
function(LayerView, LayoutParams) {

    var NavigatorCardView = LayerView.extend({

        initialize: function() {
            NavigatorCardView.__super__.initialize.call(this);
            this.matchParentSize();
            this._navigatorView = null;
            this.on("activate", this._onActivate, this);
        },

        render: function() {
            this.$el.addClass("js-navigator-card-view");
            return NavigatorCardView.__super__.render.call(this);
        },

        // Called by the navigator when this view is set active.
        _setNavigatorView: function(navigatorView) {
            if (this._navigatorView === navigatorView)
                return this;
            this._navigatorView = navigatorView;
            this.trigger("change:navigatorView");
            this.trigger(this._navigatorView ? "attached" : "detached");
            this.setNeedsLayout(true);
            return this;
        },

        navigatorView: function() {
            return this._navigatorView;
        },

        needsTopBar: function() {
            return true;
        },

        displaysOnTop: function() {
            return false;
        },

        hasLayoutMarginFromTopBar: function() {
            return true;
        },

        layout: function() {
            var topBarView = this.topBarView();
            if (topBarView)
                this.margin().setTop(this.needsTopBar() && !this.displaysOnTop() && this.hasLayoutMarginFromTopBar() ?
                    topBarView.bounds().height() : 0);
            NavigatorCardView.__super__.layout.call(this);
        },

        _onActivate: function() {
            this.updateRouterLocation();
            this._updateNavigationBar();
        },

        _updateNavigationBar: function() {
            var topBarView = this.topBarView();
            if (topBarView)
                topBarView.updateVisiblity(this.needsTopBar());
        },

        updateRouterLocation: function() {
            // override this method.
        },

        topBarView: function() {
            return this._navigatorView ? this._navigatorView.topBarView() : null;
        },

        // Overwrite this to provide better history support, when the previous
        // slides are not in the history if the navigator.
        previousCard: function() {
            return null;
        },

        hasPreviousCard: function() {
            return false;
        },

        nextCard: function() {
            return null;
        },

        hasNextCard: function() {
            return false;
        }

    });

    return NavigatorCardView;
});