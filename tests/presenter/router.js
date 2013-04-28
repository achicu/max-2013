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

define(["mobileui/utils/bus", "utils/slide-manager", "views/slide-view"],
    function(bus, slideManager, SlideView) {

    var Router = Backbone.Router.extend({
        routes: {
            "slide/*path/*options": "slide",
            "slide/*path": "slide",
            "*path": "defaultHandler"
        },

        defaultHandler: function() {
            var slide = slideManager.lookupSlide("index");
            return slide ? this._injectSlide(slide) : null;
        },

        slide: function(path, pathOptions) {
            var slide = slideManager.lookupSlide(decodeURIComponent(path), pathOptions);
            return slide ? this._injectSlide(slide) : this.defaultHandler();
        },

        _injectSlide: function(slide) {
            var slideView = SlideView.encapsulateSlide(slide);
            bus.get("mainView").navigatorView().resetCard(slideView);
            return slideView;
        }
    });

    var router = new Router();
    bus.set("router", router);

    bus.on("start", function() {
        Backbone.history.start({});
    });

    return router;
});