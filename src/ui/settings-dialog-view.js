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

define(['mobileui/ui/dialog-view',
        'mobileui/views/layout-view',
        'mobileui/views/content-view',
        'mobileui/ui/app-checkbox-view',
        'mobileui/utils/settings'],
    function(DialogView, LayoutView, ContentView, AppCheckboxView, settings) {

    var SettingsDialogView = DialogView.extend({

        _addSettingsLine: function(label, valueName) {
            var boxView = new LayoutView()
                .addClass("js-setting-line-view")
                .setLayout("horizontal")
                .render();
            boxView.margin().setAll(13);
            boxView.ensureParams().matchParentWidth();
            boxView.bounds().setHeight(40);

            var labelView = new ContentView().setTextContent(label)
                .addClass("js-setting-line-label-view").render();
            labelView.content().addClass("js-setting-line-label-content-view");
            labelView.ensureParams().fillParentWidth().matchParentHeight();
            boxView.append(labelView);

            var checkboxView = new AppCheckboxView().setChecked(settings.getBoolean(valueName))
                    .addClass("js-setting-line-checbox-view").render();
            checkboxView.ensureParams().matchParentHeight();
            checkboxView.on("change", function() {
                settings.setBoolean(valueName, checkboxView.checked());
            });
            boxView.append(checkboxView);

            this.contentView().append(boxView);
        },

        render: function() {
            SettingsDialogView.__super__.render.call(this);
            this.$el.addClass("js-settings-dialog-view");
            return this;
        }

    });

    return SettingsDialogView;

});