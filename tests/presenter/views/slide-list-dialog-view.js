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

define(["mobileui/ui/dialog-view",
        "views/slide-list-view"], 
    function(DialogView, SlideListView) {

    var SlideListDialogView = DialogView.extend({

        initialize: function() {
            SlideListDialogView.__super__.initialize.call(this);
            this.contentView().bounds().setHeight(200);
            this._listView = new SlideListView();
            this._listView.on("slide:selected", this._onSlideSelected, this);
            this.contentView().append(this._listView.render());
        },

        render: function() {
            SlideListDialogView.__super__.render.call(this);
            this.$el.addClass("js-slide-list-dialog-view");
            return this;
        },

        _onSlideSelected: function(SlideView) {
            this.trigger("slide:selected", SlideView);
        }
    });

    return SlideListDialogView;
});