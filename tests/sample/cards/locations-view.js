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

define(["mobileui/ui/touch-item-view",
        "mobileui/ui/touch-list-view",
        "mobileui/views/layout-params",
        "sample/views/url-card-view-mixin",
        "sample/data/locations",
        "sample/app"],
    function(TouchItemView,
            TouchListView,
            LayoutParams,
            UrlCardViewMixin,
            LocationLabels,
            app) {

    var ItemView = TouchItemView.extend({
        initialize: function(options) {
            _.extend(this, options);
            ItemView.__super__.initialize.call(this);
            this.addModelLabel().addClass("js-location-item-view-label");
            this.setEffect("fold");
        },

        setVerticalLayout: function() {
            this._verticalLayout = true;
            this.setParams(new LayoutParams().matchParentWidth());
            this.bounds().setHeight(100);
        },

        render: function() {
            ItemView.__super__.render.call(this);
            this.filterView().$el.addClass("js-location-item-view")
                .css("background-color", "hsl(" + this.hue + ", " + this.saturation + "%, " + Math.min(100, 28 + this.model.get("index") * 2) + "%)");
            return this;
        },

        _onTapStart: function() {
            if (app.mainView.navigatorView().nextCard())
                return;
            app.mainView.navigatorView().prepareNextCard(app.router.lookupCard("Location View", encodeURIComponent(this.model.get("label"))));
        }
    });

    var LocationsView = TouchListView.extend(_.extend({

        initialize: function(options) {
            this.hue = 283;
            this.saturation = 15;
            if (options && options.path) {
                var data = decodeURIComponent(options.path).split(":");
                this.hue = parseInt(data[0], 10);
                this.saturation = parseInt(data[1], 10);
            }
            this.model = LocationLabels;
            LocationsView.__super__.initialize.call(this);
            this.listView().setScrollDirection("vertical");
            this.listView().contentView().setParams(new LayoutParams()
                    .matchParentWidth().matchChildrenHeight());
            this.setVerticalLayout();
        },

        url: function() {
            return "card/" + encodeURIComponent("Locations View") + "/" + this.hue + ":" + this.saturation;
        },

        render: function() {
            this.$el.addClass("js-locations-view");
            return LocationsView.__super__.render.call(this);
        },

        _createTouchListItemView: function(model) {
            return new ItemView({ model: model, hue: this.hue, saturation: this.saturation });
        }

    }, UrlCardViewMixin));

    return {
        label: "Locations View",
        view: LocationsView
    };

});