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
        "mobileui/views/content-view",
        "mobileui/utils/view-injector",
        "mobileui/utils/rect",
        "mobileui/utils/bus",
        // Add all the dynamic components in here, so that the r.js optimizer
        // preloads them in the generated output.
        "mobileui/ui/link-view",
        "views/demo-view",
        "views/touch-hold-view",
        "mobileui/views/pan-view",
        "mobileui/views/transform-view"],
    function(LayerView, ContentView, ViewInjector, Rect, bus) {

    var defaultSlideRect = new Rect().setSize(1024, 768);

    var SlideContainerView = LayerView.extend({
        initialize: function() {
            SlideContainerView.__super__.initialize.call(this);
            this._slideBounds = new Rect()
                .set(defaultSlideRect)
                .on("change:size", this._onSlideBoundsChanged, this);

            this._contentView = new LayerView()
                .addClass("js-slide-container-content-view");
            if (this.constructor.label) {
                this.addClass("js-slide-container-" + this.constructor.label);
                this._contentView.addClass("js-slide-" + this.constructor.label);
            }
            this._contentView.bounds().set(this._slideBounds);
            this.append(this._contentView.render());

            var self = this;
            this._contentView.$el.html(this._template);
            var viewInjector = new ViewInjector();
            viewInjector.convert(this, this._contentView).then(function() {
                self.trigger("views:injected");
            });

            this._slideNumber = new ContentView()
                .setIsStaticView(true)
                .setTextContent(this.constructor.index + 1)
                .addClass("js-slide-number");
            this._contentView.append(this._slideNumber.render());
        },

        _onSlideBoundsChanged: function() {
            this.validate("slideBounds");
        },

        slideBounds: function() {
            return this._slideBounds;
        },

        _onViewsInjected: function() {
            console.log("Loaded injected views!");
        },

        render: function() {
            this.$el.addClass("js-slide-container-view");
            return SlideContainerView.__super__.render.call(this);
        },

        layout: function() {
            SlideContainerView.__super__.layout.call(this);
            this._validateSlideBounds();
        },

        _validateSlideBounds: function() {
            var factorX = this.bounds().width() / this._slideBounds.width(),
                factorY = this.bounds().height() / this._slideBounds.height(),
                scaleFactor = Math.min(factorX, factorY);
            this._contentView.transform().get("translate")
                .setX((this.bounds().width() - this._slideBounds.width() * scaleFactor) / 2)
                .setY((this.bounds().height() - this._slideBounds.height() * scaleFactor) / 2);
            this._contentView.transform().get("scale")
                .setX(scaleFactor)
                .setY(scaleFactor);
        }
    });

    return SlideContainerView;

});