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
define(['mobileui/utils/underscore', 'mobileui/utils/style-module', 'require'], function (_, StyleModule, requireJS) {

    var global = (function() { return this; })();

    var LessModule = _.extend({}, StyleModule, {

        _less: null,
        _env: {},
        
        loadLess: function(callback) {
            if (this._less)
                return callback(this._less);
            if (global.navigator) {
                // Inside the browser, just load the less module using require.js.
                var self = this;
                requireJS(["third-party/less-1.3.3"], function() {
                    self._less = global.less;
                    callback(self._less);
                });
            } else {
                // You should have less installed in your node environment.
                var less = require.nodeRequire('less');
                this._less = less;
                this._env.syncImport = true;
                callback(less);
            }
        },
        
        encodeContentAsync: function(content, moduleName, parsedName, callback) {
            var self = this,
                options = _.extend({
                    rootpath: '' 
                }, parsedName.options);
            this.loadLess(function(less) {
                var parser = new less.Parser(_.extend({}, this._env, options));
                parser.parse(content, function (err, css) {
                    if (err) {
                        console.error(err);
                        return callback(null);
                    }
                    css = css.toCSS();
                    callback(global.navigator ? self.injectStyle(css, moduleName, parsedName) : css);
                });
            });
        }

    });

    return LessModule;

});
