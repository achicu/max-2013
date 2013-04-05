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
        "mobileui/utils/view-injector",
        "mobileui/utils/bus"],
    function(LayerView, ViewInjector, bus) {

    var SlideContainerView = LayerView.extend({
        initialize: function() {
            SlideContainerView.__super__.initialize.call(this);
            var self = this;
            this.$el.html(this._template);
            var viewInjector = new ViewInjector();
            viewInjector.convert(this).then(function() {
                self.trigger("views:injected");
            });
        },

        _onViewsInjected: function() {
            console.log("Loaded injected views!");
        },

        render: function() {
            this.$el.addClass("js-slide-container-view");
            return SlideContainerView.__super__.render.call(this);
        }
    });

    return SlideContainerView;

});