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

define([
    'mobileui/utils/bus',
    'mobileui/utils/settings',
    // Router and MainView automatically inject in the bus.
    'router',
    'views/main-view',
    'mobileui/utils/less-module!../../style/topcoat/normalize.css?rootpath=../../style/topcoat/',
    'mobileui/utils/less-module!../../style/topcoat/topcoat-mobile.css?rootpath=../../style/topcoat/',
    'mobileui/utils/less-module!../../style/mobile-ui.css?rootpath=../../style/',
    'mobileui/utils/less-module!../../style/components.css?rootpath=../../style/',
    'mobileui/utils/less-module!style/style.less?rootpath=style/',
    'mobileui/utils/less-module!../sample/style/style.css?rootpath=../sample/style/'
],

function(bus, settings) {

    function init() {
        bus.trigger("init");
        settings.once("ready", function() {
            bus.trigger("start");
        });
        settings.init();
    }

    if (window.IsCordova)
        document.addEventListener("deviceready", init, true);
    else
        $(init);

});