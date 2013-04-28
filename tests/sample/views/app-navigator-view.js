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

define(['mobileui/ui/navigator-view',
        'mobileui/views/content-view',
        'mobileui/ui/button-view',
        'sample/views/app-settings-dialog-view',
        'mobileui/utils/settings',
        'mobileui/utils/lock',
        'sample/app'], function(NavigatorView, ContentView, ButtonView, AppSettingsDialogView, settings, lock, app) {

    var AppNavigatorView = NavigatorView.extend({

        initialize: function() {
            AppNavigatorView.__super__.initialize.call(this);
            this.topBarView().addClass("dark-header-bar");
            this.addTopBarButtons();

            this.on("card:precommit", this._updateBackButton, this);
            this.on("activate", this._updateBackButton, this);
        },

        render: function() {
            this.$el.addClass("js-app-navigator-view");
            this.contentView().addClass("js-app-navigator-content-view");
            return AppNavigatorView.__super__.render.call(this);
        },

        addTopBarButtons: function() {
            var topBar = this.topBarView();

            this._titleLabel = new ContentView()
                .setTextContent("MobileUI")
                .matchParentSize()
                .setIsPositioned(true)
                .matchLineHeight();
            topBar.append(this._titleLabel.render().addClass("js-navigator-top-bar-title-view"));

            this._backButton = new ButtonView().setLabel("Back")
                .on("tap", this._onBackButtonTap, this);
            this._backButton.margin().setLeft(5).setTop(5);
            topBar.append(this._backButton.render().addClass("dark-button"));

            this._homeButton = new ButtonView().setLabel("Home")
                .on("tap", this._onBackButtonTap, this);
            this._homeButton.margin().setLeft(5).setTop(5);
            topBar.append(this._homeButton.render().addClass("dark-button"));

            topBar.appendFiller();

            this._settingsButton = new ButtonView().setLabel("Settings")
                .on("tap", this._onSettingsButtonTap, this);
            this._settingsButton.margin().setRight(5).setTop(5);
            this._settingsButton.bounds().setWidth(80);
            topBar.append(this._settingsButton.render().addClass("dark-button"));
        },

        backButton: function() {
            return this._backButton;
        },

        homeButton: function() {
            return this._homeButton;
        },

        _updateBackButton: function() {
            if (this.canGoBack()) {
                this._backButton.show();
                this._homeButton.hide();
            } else {
                this._backButton.hide();
                if (this.activeCard() && this.activeCard().isDefaultScreen) {
                    this._homeButton.hide();
                } else {
                    this._homeButton.show();
                }
            }
        },

        _onBackButtonTap: function() {
            if (!lock.canStartTransition())
                return;
            if (!this.popCard())
                this.pushCard(app.router.lookupCard(app.defaultCard));
        },

        _onSettingsButtonTap: function() {
            if (this._settingsView)
                return;
            this._settingsView = new AppSettingsDialogView()
                .once("hide", this._onSettingsViewHidden, this)
                .render()
                .show(this);
        },

        _onSettingsViewHidden: function() {
            this._settingsView.remove();
            this._settingsView = null;
        }

    });

    return AppNavigatorView;

});