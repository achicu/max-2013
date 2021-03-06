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
        createSlide: function(ViewItem) {
            return new ViewItem().render();
        },

        lookupSlide: function(label) {
            var ViewItem = _.find(SlideList, function(item) {
                return item.label == label;
            });
            return ViewItem;
        },

        lookupNextSlide: function(view) {
            var index = _.indexOf(SlideList, view.constructor);
            return index == -1 ? SlideList[0] : SlideList[index + 1];
        },

        hasNextSlide: function(view) {
            return !!this.lookupNextSlide(view);
        },

        lookupPreviousSlide: function(view) {
            var index = _.indexOf(SlideList, view.constructor);
            return index == -1 ? null : SlideList[index - 1];
        },

        hasPreviousSlide: function(view) {
            return !!this.lookupPreviousSlide(view);
        }
    });

    var slideManager = new SlideManager();
    bus.set("slideManager", slideManager);
    return slideManager;

});