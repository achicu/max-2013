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

define(["mobileui/views/gesture-view",
        "mobileui/views/content-view",
        "mobileui/utils/bus"],
    function(GestureView, ContentView, bus) {

    var TouchHoldView = GestureView.extend({
        initialize: function() {
            TouchHoldView.__super__.initialize.call(this);
            this.addClass("js-touch-hold-view");

            this._contentView = null;

            this.on("tapstart", this._onTapStart, this);
            this.on("tapend", this._onTapEnd, this);
            this.on("tap", this._onTap, this);
            this.on("longtaptimer", this._onLongTap, this);
            
            this._state = "up";
            this._prevState = null;

            this._tapCount = 0;
            this._longTapCount = 0;

            this._validateState();
        },

        setContentView: function(view) {
            this._contentView = view;
            this.invalidate("state");
            return this;
        },

        _validateLabel: function() {
            if (this._contentView)
                this._contentView.$el.html(this._computeLabel());
        },

        _computeLabel: function() {
            var result = $("<div />");
            if (this._tapCount)
                result.append($("<div />").text("Taps: " + this._tapCount));
            if (this._longTapCount)
                result.append($("<div />").text("Long taps: " + this._longTapCount));
            console.log(result.get(0));
            return result;
        },

        _validateState: function() {
            if (this._prevState)
                this.$el.removeClass("js-touch-hold-view-" + this._prevState);
            this.$el.addClass("js-touch-hold-view-" + this._state);
            this._prevState = this._state;
        },

        _onTapStart: function() {
            this._state = "down";
            this.invalidate("state");
        },

        _onTapEnd: function() {
            this._state = "up";
            this.invalidate("state");
        },

        _onTap: function() {
            ++this._tapCount;
            this.invalidate("label");
        },

        _onLongTap: function() {
            ++this._longTapCount;
            this.invalidate("label");
        }
    });

    return TouchHoldView;

});