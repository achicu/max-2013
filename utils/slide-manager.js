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

define(["mobileui/utils/bus", "slides/list"], function(bus, SlideList) {

    function SlideManager() {
    }

    _.extend(SlideManager.prototype, {
        createSlide: function(ViewItem, pathOptions) {
            var view = new ViewItem({
                path: pathOptions
            }).render();
            return view;
        },

        lookupSlide: function(label, pathOptions) {
            var ViewItem = _.find(SlideList, function(item) {
                return item.label == label;
            });
            if (!ViewItem)
                return null;
            return this.createSlide(ViewItem, pathOptions);
        },

        _nextSlideConstructor: function(view) {
            var index = _.indexOf(SlideList, view.constructor);
            return index == -1 ? SlideList[0] : SlideList[index + 1];
        },

        hasNextSlide: function(view) {
            return !!this._nextSlideConstructor(view);
        },

        lookupNextSlide: function(view, pathOptions) {
            var ViewItem = this._nextSlideConstructor(view);
            return ViewItem ? this.createSlide(ViewItem, pathOptions) : null;
        },

        _previousSlideConstructor: function(view) {
            var index = _.indexOf(SlideList, view.constructor);
            return index == -1 ? null : SlideList[index - 1];
        },

        hasPreviousSlide: function(view) {
            return !!this._previousSlideConstructor(view);
        },

        lookupPreviousSlide: function(view, pathOptions) {
            var ViewItem = this._previousSlideConstructor(view);
            return ViewItem ? this.createSlide(ViewItem, pathOptions) : null;
        }
    });

    var slideManager = new SlideManager();
    bus.set("slideManager", slideManager);
    return slideManager;

});