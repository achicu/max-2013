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
define(["utils/slide-module!slides/index.html?label=index",
        "utils/slide-module!slides/about-me.html?label=about-me",
        "utils/slide-module!slides/intro.html?label=intro",
        "utils/slide-module!slides/demos.html?label=demos",
        "utils/slide-module!slides/web-features.html?label=web-features",
        "utils/slide-module!slides/app-cache.html?label=app-cache",
        "utils/slide-module!slides/web-storage.html?label=web-storage",
        "utils/slide-module!slides/touch-gestures.html?label=touch-gestures",
        "utils/slide-module!slides/touch-combined.html?label=touch-combined",
        "utils/slide-module!slides/touch-platforms.html?label=touch-platforms",
        "utils/slide-module!slides/accelerated-properties.html?label=accelerated-properties",
        "utils/slide-module!slides/performance1.html?label=performance1",
        "utils/slide-module!slides/performance2.html?label=performance2",
        "utils/slide-module!slides/performance3.html?label=performance3",
        "utils/slide-module!slides/dom-remove.html?label=dom-remove",
        "utils/slide-module!slides/web-workers.html?label=web-workers",
        "utils/slide-module!slides/end.html?label=end"
       ], function() {
    var list = _.toArray(arguments);
    _.each(list, function(View, i) {
        View.index = i;
    });
    return list;
});