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

define(["mobileui/views/scroll-view",
        "mobileui/views/layout-view",
        "mobileui/views/layer-view",
        "mobileui/ui/button-view",
        "slides/list"], 
    function(ScrollView, LayoutView, LayerView, ButtonView, SlidesList) {

    var SlideListView = ScrollView.extend({

        initialize: function() {
            SlideListView.__super__.initialize.call(this);
            this.setScrollDirection("horizontal");
            this.matchParentSize();

            var contentView = new LayoutView().setLayout("horizontal");
            contentView.ensureParams().matchChildrenWidth().matchParentHeight();
            this.setContentView(contentView.render());

            var self = this;
            _.each(SlidesList, function(SlideView) {
                var itemView = new LayerView()
                    .forceLayer()
                    .addClass("js-slide-list-item-view");
                itemView.margin().setAll(15);
                itemView.ensureParams().matchParentHeight();
                itemView.bounds().setWidth(200);
                contentView.append(itemView.render());

                var slide = new SlideView().matchParentSize();
                itemView.append(slide.render());
                
                var tapView = new ButtonView()
                    .addClass("js-slide-list-button-view");
                tapView.matchParentSize()
                       .on("tap", self._onSlideSelected.bind(self, SlideView));
                itemView.append(tapView.render());

                contentView.append(itemView.render());
            });
        },

        _onSlideSelected: function(SlideView) {
            this.trigger("slide:selected", SlideView);
        }
    });

    return SlideListView;

});