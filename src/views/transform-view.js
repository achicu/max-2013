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
        "mobileui/utils/transform",
        "mobileui/views/gesture-detector"], 
    function(GestureView, Transform, GestureDetector) {

    var TransformView = GestureView.extend({
        initialize: function() {
            TransformView.__super__.initialize.call(this);

            this._shouldRestoreTransform = true;

            this.forceLayer();

            this.on("touchtransformstart", this._onTransformViewTouchTransformStart, this);
            this.on("touchtransformend", this._onTransformViewTouchTransformEnd, this);
            this.on("touchtransform", this._onTouchTransformMove, this);

            this._startTransform = null;
        },

        render: function() {
            this.$el.addClass("js-transform-view");
            return TransformView.__super__.render.call(this);
        },

        _restoreTransform: function(el) {
            this.trigger("transformend");
            if (this._shouldRestoreTransform)
                this.resetTransform();
        },

        setShouldRestoreTransform: function(value) {
            this._shouldRestoreTransform = value;
            if (value && !this._startTransform)
                this.resetTransform();
            return this;
        },

        resetTransform: function() {
            this.animation().start().get("transform").chain()
                .transform(500, new Transform());
        },

        _onTransformViewTouchTransformStart: function() {
            this._startTransform = this.transform().toMatrix3d();
        },

        _onTouchTransformMove: function(transform) {
            console.log(transform);
            this.transform().clear()
                .translate(transform.dragX, transform.dragY)
                .append(this._startTransform)
                .translate(transform.originX, transform.originY)
                .rotate(transform.rotation)
                .scale(transform.scale, transform.scale)
                .translate(-transform.originX, -transform.originY);
            console.log(this.transform().toString());
        },

        _onTransformViewTouchTransformEnd: function() {
            this._restoreTransform();
        },

        respondsToTouchGesture: function(gesture) {
            if (this.disabled())
                return false;
            return (gesture.type == GestureDetector.GestureType.TRANSFORM);
        }

    });

    return TransformView;
});