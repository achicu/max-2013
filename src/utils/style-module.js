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
/* Module based on requirejs.text to provide ahead of time base64 encoding. */
define(['mobileui/utils/underscore', 'mobileui/utils/text-module'], function (_, text) {

    var global = (function(){ return this; })();

    var StyleModule = _.extend({}, text, {
        modulePath: "mobileui/utils/style-module",

        injectStyle: function(content, moduleName, parsedName) {
            // If jquery is not available just return the content as is,
            // it means we are running under node in the r.js optimizer.
            if (global.StyleFix)
                content = global.StyleFix.fix(content);
            var style = parsedName ? parsedName.styleTag : this._createStyleTag(moduleName);
            style.removeAttr("data-preloading").html(content);
            return style;
        },

        _createStyleTag: function(moduleName) {
            return $("<style />")
                .attr("data-href", moduleName)
                .attr("data-noprefix", "") // Prevents prefix free runs.
                .attr("data-preloading", "")
                .appendTo($("head"));
        },

        onLoadStarted: function(moduleName, parsedName) {
            if (!global.navigator)
                return;
            // Add a placeholder style element until the real file is loaded
            // to make sure that the load always happens in the same order.
            parsedName.styleTag = this._createStyleTag(moduleName);
        },

        encodeContent: function(content, moduleName, parsedName) {
            return global.navigator ? this.injectStyle(content, moduleName, parsedName) : content;
        },

        createModuleAsync: function(content, moduleName, parsedName, callback) {
            var self = this;
            this.encodeContentAsync(content, moduleName, parsedName, function(encodedContent) {
                var code = "define(" + JSON.stringify([self.modulePath]) + ", " +
                "function(StyleModule) { return StyleModule.injectStyle(" +
                           JSON.stringify(encodedContent) + ", " + 
                           JSON.stringify(moduleName) +
                           "); });\n";
                callback(code);
            });
        }

    });

    return StyleModule;

});
