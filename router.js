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

define(["mobileui/utils/bus", "slides/list"],
    function(bus, SlideList) {

    var Router = Backbone.Router.extend({
        routes: {
            "slide/*path/*options": "slide",
            "slide/*path": "slide",
            "*path": "defaultHandler"
        },

        defaultHandler: function() {
            var view = this.lookupSlide("index");
            console.log(view);
            if (view)
                bus.get("mainView").navigatorView().resetCard(view);
        },

        slide: function(path, pathOptions) {
            var view = this.lookupSlide(decodeURIComponent(path), pathOptions);
            if (view)
                bus.get("mainView").navigatorView().resetCard(view);
        },

        lookupSlide: function(label, pathOptions) {
            var ViewItem = _.find(SlideList, function(item) {
                return item.label == label;
            });
            if (!ViewItem)
                return null;
            var view = new ViewItem({
                path: pathOptions
            }).render();
            return view;
        }
    });

    var router = new Router();
    bus.set("router", router);

    bus.on("start", function() {
        Backbone.history.start({});
    });

    return router;
});