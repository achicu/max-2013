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

define(["mobileui/views/content-view",
        "mobileui/views/layout-params"], function(ContentView, LayoutParams) {

    var MeasuredView = ContentView.extend({
        initialize: function() {
            MeasuredView.__super__.initialize.call(this);
        },

        render: function() {
            this.$el.addClass("js-measured-view");
            return MeasuredView.__super__.render.call(this);
        },

        layout: function() {
            this.layoutBounds();
            this.layoutChildren();
            this._validateHtml();
            this._validateText();
            var params = this.params(),
                hasParentDerivedWidth = params && params.hasParentDerivedWidth(),
                hasParentDerivedHeight = params && params.hasParentDerivedHeight();
            if (this.checkInvalidationFlag("size")) {
                this.$contentView.css("width", hasParentDerivedWidth ? this.bounds().width() : "");
                this.$contentView.css("height", hasParentDerivedHeight ? this.bounds().height() : "");
            }
            if (hasParentDerivedWidth || hasParentDerivedHeight) {
                // Make sure we are not going to flicker while doing this forced layout.
                this.$contentView.css("visibility", "hidden");
                if (!hasParentDerivedWidth)
                    this.bounds().setWidth(this.$contentView.outerWidth());
                if (!hasParentDerivedHeight)
                    this.bounds().setHeight(this.$contentView.outerHeight());
                this.invalidate("layoutVisibility");
            }

            this.setNeedsLayout(false);
        },

        _validateLayoutVisibility: function() {
            this.$contentView.css("visibility", "");
        }
    });

    return MeasuredView;

});