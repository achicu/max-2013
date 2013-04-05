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
        "utils/slide-module!slides/slide1.html?label=slide1",
        "utils/slide-module!slides/slide1.html?label=slide2",
        "utils/slide-module!slides/slide1.html?label=slide3",
        "utils/slide-module!slides/slide1.html?label=slide4",
        "utils/slide-module!slides/slide1.html?label=slide5",
        "utils/slide-module!slides/slide1.html?label=slide6",
        "utils/slide-module!slides/slide1.html?label=slide7",
        "utils/slide-module!slides/slide1.html?label=slide8"
       ], function() {
    return _.toArray(arguments);
});