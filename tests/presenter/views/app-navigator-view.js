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
        'mobileui/views/layer-view',
        'mobileui/ui/button-view',
        'views/app-settings-dialog-view',
        'views/slide-list-dialog-view',
        'views/slide-view',
        'mobileui/utils/settings',
        'mobileui/utils/lock',
        'mobileui/utils/bus'], function(NavigatorView, ContentView, LayerView, ButtonView, AppSettingsDialogView, SlideListDialogView, SlideView, settings, lock, bus) {

    var LogoView = LayerView.extend({
        layout: function() {
            LogoView.__super__.layout.call(this);
            var parent = this.parent();
            this.bounds()
                .setWidth(parent.bounds().width() / 20)
                .setX(parent.bounds().width() - this.bounds().width() - this.margin().right())
                .setY(parent.bounds().height());
        }
    });

    var AppNavigatorView = NavigatorView.extend({

        initialize: function() {
            AppNavigatorView.__super__.initialize.call(this);
            this.setUsesHistory(false);
            this.topBarView().addClass("dark-header-bar");
            this.addTopBarButtons();

            this.on("card:precommit", this._updateNavigationButtons, this);
            this.on("activate", this._updateNavigationButtons, this);

            this.on("keydown", this._onKeyDown, this);
        },

        render: function() {
            this.$el.addClass("js-app-navigator-view");
            this.contentView().addClass("js-app-navigator-content-view");
            return AppNavigatorView.__super__.render.call(this);
        },

        addTopBarButtons: function() {
            var topBar = this.topBarView();

            this._titleLabel = new ContentView()
                .setTextContent("CSS Performance Presentation")
                .matchParentSize()
                .setIsPositioned(true)
                .matchLineHeight();
            topBar.append(this._titleLabel.render().addClass("js-navigator-top-bar-title-view"));

            this._backButton = new ButtonView().setLabel("<")
                .on("tap", this._onBackButtonTap, this);
            this._backButton.margin().setLeft(5).setTop(5);
            topBar.append(this._backButton.render().addClass("dark-button"));

            this._nextButton = new ButtonView().setLabel(">")
                .on("tap", this._onNextButtonTap, this);
            this._nextButton.margin().setLeft(5).setTop(5);
            topBar.append(this._nextButton.render().addClass("dark-button"));

            topBar.appendFiller();

            this._slidesButton = new ButtonView().setLabel("Slides")
                .on("tap", this._onSlidesButtonTap, this);
            this._slidesButton.margin().setRight(5).setTop(5);
            this._slidesButton.bounds().setWidth(80);
            topBar.append(this._slidesButton.render().addClass("dark-button"));

            this._settingsButton = new ButtonView().setLabel("Settings")
                .on("tap", this._onSettingsButtonTap, this);
            this._settingsButton.margin().setRight(5).setTop(5);
            this._settingsButton.bounds().setWidth(80);
            topBar.append(this._settingsButton.render().addClass("dark-button"));

            this._logoView = new LogoView().forceLayer()
                .setIsPositioned(true)
                .addClass("js-logo-view");
            this._logoView.bounds().setSize(50, 85);
            this._logoView.margin().setRight(35);
            topBar.append(this._logoView.render());
        },

        backButton: function() {
            return this._backButton;
        },

        nextButton: function() {
            return this._nextButton;
        },

        _updateNavigationButtons: function() {
            this._backButton.setVisible(this.canGoBack());
            this._nextButton.setVisible(this.canGoForward());
        },

        _onBackButtonTap: function() {
            if (!lock.canStartTransition() || !this.canGoBack())
                return;
            if (!this.popCard())
                bus.get("router").defaultHandler();
        },

        _onNextButtonTap: function() {
            if (!lock.canStartTransition() || !this.canGoForward())
                return;
            this.pushCard();
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
        },

        _onSlidesButtonTap: function() {
            if (this._slidesView && this._slidesView.isActive())
                return;
            if (!this._slidesView) {
                this._slidesView = new SlideListDialogView()
                    .on("slide:selected", this._onSlideSelected, this)
                    .render();
            }
            this._slidesView.show(this);
        },

        _onSlideSelected: function(SlideConstructor) {
            this.pushCard(SlideView.encapsulateSlide(SlideConstructor));
        },

        _onKeyDown: function() {
            switch (event.keyCode) {
                case 37: // prev
                    return this._onBackButtonTap();
                case 32: // space
                case 39: // next
                    return this._onNextButtonTap();
            }
        }

    });

    return AppNavigatorView;

});