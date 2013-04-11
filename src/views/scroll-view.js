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
        "mobileui/views/layer-view",
        "mobileui/views/gesture-detector",
        "mobileui/utils/boilerplate",
        "mobileui/utils/momentum",
        "mobileui/utils/geometry",
        "mobileui/utils/transform"],
function(GestureView, LayerView, GestureDetector, boilerplate, Momentum,
            Geometry, Transform) {

    var minScrollIndicatorSize = 10;

    var ScrollView = GestureView.extend({

        initialize: function() {
            ScrollView.__super__.initialize.call(this);
            this.on("touchdragstart", this._onTouchDragStart, this);
            this.on("touchdragmove", this._onTouchDragMove, this);
            this.on("touchdragend", this._onTouchDragEnd, this);
            this._contentView = null;
            this._scrollLeft = 0;
            this._scrollTop = 0;
            this._touchStartState = null;
            this._canOverScroll = false;
            this._scrollDirection = ScrollView.BOTH;
            this._scrollAnimationDuration = 300;
            this._momentumLeft = new Momentum(this._scrollAnimationDuration);
            this._momentumTop = new Momentum(this._scrollAnimationDuration);
            this._maxMomentum = 100;
            this._useAnimation = false;

            this._horizontalView = new LayerView();
            this._horizontalView.forceLayer()
                .addClass("js-scroll-view-indicator")
                .addClass("js-scroll-view-horizontal-indicator")
                .setOpacity(0);
            this._horizontalView.bounds().setSize(1, 4);
            this._horizontalView.transform().translate().scale(0, 1);
            this.append(this._horizontalView.render());

            this._verticalView = new LayerView();
            this._verticalView.forceLayer()
                .addClass("js-scroll-view-indicator")
                .addClass("js-scroll-view-vertical-indicator")
                .setOpacity(0);
            this._verticalView.bounds().setSize(4, 1);
            this._verticalView.transform().translate().scale(1, 0);
            this.append(this._verticalView.render());

            this._snapToChildrenBounds = false;
            this._scrollBarsVisible = false;
            this._selectedView = null;
            this._maxIncrement = 1;
        },

        render: function() {
            this.$el
                .addClass("js-scroll-view")
                .on("mousewheel", this._onMouseWheel.bind(this));
            return ScrollView.__super__.render.call(this);
        },

        setSnapToChildrenBounds: function() {
            this._snapToChildrenBounds = true;
            return this;
        },

        setScrollAnimationDuration: function(duration) {
            this._scrollAnimationDuration = duration;
            this._momentumLeft.setDuration(duration);
            this._momentumTop.setDuration(duration);
            return this;
        },

        setScrollDirection: function(direction) {
            this._scrollDirection = direction;
            this.invalidate("scroll");
            return this;
        },

        _readSnapToChildrenBoundsAttribute: function() {
            var snapToChildrenBoundsAttribute = this.$el.attr("data-snap");
            if (snapToChildrenBoundsAttribute === undefined)
                return;
            this.setSnapToChildrenBounds();
        },

        _readScrollDirectionAttribute: function() {
            var scrollDirectionAttribute = this.$el.attr("data-scroll-direction");
            if (!scrollDirectionAttribute)
                return;
            this.setScrollDirection(scrollDirectionAttribute);
        },

        readViewAttributes: function() {
            ScrollView.__super__.readViewAttributes.call(this);
            this._readSnapToChildrenBoundsAttribute();
            this._readScrollDirectionAttribute();
        },

        selectedView: function() {
            return this._selectedView;
        },

        scrollLeft: function() {
            return this._scrollLeft;
        },

        scrollTop: function() {
            return this._scrollTop;
        },

        isScrolling: function() {
            return this._canOverScroll;
        },

        _verticalScrollHeight: function() {
            return Math.max(minScrollIndicatorSize, this.bounds().height() / this.scrollHeight() * this.bounds().height());
        },

        _horizontalScrollWidth: function() {
            return Math.max(minScrollIndicatorSize, this.bounds().width() / this.scrollWidth() * this.bounds().width());
        },

        _updateScrollBarVisibility: function(scrollBar, visible) {
            var wasVisible = scrollBar.visible();
            if (wasVisible == visible)
                return;
            scrollBar.setVisible(visible);
            scrollBar.animation().get("scrollbar-opacity").removeAll();
            scrollBar.setOpacity((visible && this._scrollBarsVisible) ? 1 : 0);
        },

        layout: function() {
            ScrollView.__super__.layout.call(this);

            if (!this._selectedView)
                this._updateSelectedView();

            this._updateScrollBarVisibility(this._verticalView, this.hasVerticalScroll());
            this._verticalView
                .bounds().setX(this.bounds().width() - this._verticalView.bounds().width());

            this._updateScrollBarVisibility(this._horizontalView, this.hasHorizontalScroll());
            this._horizontalView
                .bounds().setY(this.bounds().height() - this._horizontalView.bounds().height());

            this._verticalView.transform().get("scale").setY(this._verticalScrollHeight());
            this._horizontalView.transform().get("scale").setX(this._horizontalScrollWidth());

            this.invalidate("scroll");
        },

        _animateScrollBar: function(scrollBar, show) {
            if (!scrollBar.visible())
                return;
            scrollBar.animation().start().get("scrollbar-opacity")
                .removeAll()
                .chain()
                .opacity(100, show ? 1 : 0);
        },

        showScrollBars: function() {
            if (this._scrollBarsVisible)
                return;
            this._scrollBarsVisible = true;
            this._animateScrollBar(this._verticalView, true);
            this._animateScrollBar(this._horizontalView, true);
        },

        hideScrollBars: function() {
            if (!this._scrollBarsVisible)
                return;
            this._scrollBarsVisible = false;
            this._animateScrollBar(this._verticalView, false);
            this._animateScrollBar(this._horizontalView, false);
        },

        setContentView: function(view) {
            if (this._contentView === view)
                return;
            if (this._contentView) {
                this._contentView.remove();
                this._contentView = null;
            }
            if (view) {
                this._contentView = view.forceLayer();
                this.prepend(view);
            }
            return this;
        },

        contentView: function() {
            return this._contentView;
        },

        scrollToWithAnimation: function(left, top) {
            this._useAnimation = true;
            this.scrollTo(left, top);
        },

        scrollTo: function(left, top, noSelectedViewUpdate) {
            if (!this._contentView)
                return;
            if (this._scrollLeft == left &&
                this._scrollTop == top)
                return;
            this._scrollLeft = left;
            this._scrollTop = top;
            if (!noSelectedViewUpdate)
                this._updateSelectedView();
            this.invalidate("scroll");
            this.trigger("scroll");
        },

        scrollBy: function(left, top, noSelectedViewUpdate) {
            if (!this._contentView || (!left && !top))
                return;
            this._scrollLeft += left;
            this._scrollTop += top;
            if (!noSelectedViewUpdate)
                this._updateSelectedView();
            this.invalidate("scroll");
            this.trigger("scroll");
        },

        scrollWidth: function() {
            return this._contentView ? this._contentView.bounds().width() : 0;
        },

        scrollHeight: function() {
            return this._contentView ? this._contentView.bounds().height() : 0;
        },

        maxScrollLeft: function() {
            return Math.max(0, this._contentView.outerWidth() - this.bounds().width());
        },

        maxScrollTop: function() {
            return Math.max(0, this._contentView.outerHeight() - this.bounds().height());
        },

        hasHorizontalScroll: function() {
            return this.scrollWidth() > this.bounds().width();
        },

        hasVerticalScroll: function() {
            return this.scrollHeight() > this.bounds().height();
        },

        _internalSetSelectedView: function(view) {
            if (this._selectedView == view)
                return;
            this._selectedView = view;
            this.trigger("change:selected");
        },

        _updateSelectedView: function(checkForMaxIncrement) {
            if (!this._snapToChildrenBounds)
                return;
            // Align scroll with child objects.
            if (!this._contentView) {
                this._internalSetSelectedView(null);
                return;
            }
            var shortestDistance = 0, nearestView = null,
                centerX = this._scrollLeft + this.bounds().width() / 2,
                centerY = this._scrollTop + this.bounds().height() / 2;
            var children = this._contentView.childrenViews();
            _.each(children, function(view) {
                var dist = Geometry.dist(centerX, centerY, view.bounds().centerX(), view.bounds().centerY());
                if (!nearestView || shortestDistance > dist) {
                    shortestDistance = dist;
                    nearestView = view;
                }
            });
            if (!nearestView || !children.length) {
                this._internalSetSelectedView(null);
                return;
            }
            var newIndex = _.indexOf(children, nearestView);
            if (checkForMaxIncrement) {
                var oldIndex = this._selectedView ? _.indexOf(children, this._selectedView) : -1;
                if (oldIndex != -1 && Math.abs(newIndex - oldIndex) > this._maxIncrement) {
                    newIndex = Math.min(children.length - 1, Math.max(0, oldIndex + (newIndex > oldIndex ? 1 : -1)));
                    nearestView = children[newIndex];
                }
            }
            this._internalSetSelectedView(nearestView);
        },

        _snapScrollToChildrenPosition: function() {
            if (!this._selectedView || !this._snapToChildrenBounds)
                return;
            if (this._scrollDirection != ScrollView.VERTICAL)
                this._scrollLeft = this._selectedView.bounds().x();
            if (this._scrollDirection != ScrollView.HORIZONTAL)
                this._scrollTop = this._selectedView.bounds().y();
        },

        _checkScrollPosition: function() {
            if (!this._canOverScroll && this._snapToChildrenBounds)
                this._snapScrollToChildrenPosition();
            if (!this._canOverScroll || this._scrollDirection == ScrollView.VERTICAL)
                this._scrollLeft = Math.max(0, Math.min(this._scrollLeft, this.maxScrollLeft()));
            if (!this._canOverScroll || this._scrollDirection == ScrollView.HORIZONTAL)
                this._scrollTop = Math.max(0, Math.min(this._scrollTop, this.maxScrollTop()));
        },

        _validateScroll: function() {
            if (!this._contentView)
                return;
            if (this._useAnimation) {
                this._useAnimation = false;
                this._validateScrollWithAnimation();
                return;
            }
            this._checkScrollPosition();
            if (this._contentView.getLayout) {
                var contentViewLayout = this._contentView.getLayout();
                if (contentViewLayout && contentViewLayout.scroll) {
                    var scrollOptions = {
                        left: this._scrollLeft,
                        top: this._scrollTop
                    };
                    contentViewLayout.scroll(this, scrollOptions);
                    return;
                }
            }
            this._internalScroll();
        },

        _computeVerticalBarPosition: function(scrollTop) {
            return scrollTop / this.scrollHeight() * (this.bounds().height() - this._verticalView.bounds().height());
        },

        _computeHorizontalBarPosition: function(scrollLeft) {
            return scrollLeft / this.scrollWidth() * (this.bounds().width() - this._horizontalView.bounds().width());
        },

        _internalScroll: function() {
            var contentView = this.contentView();
            contentView
                .transform()
                .get("translate")
                .setX(-this._scrollLeft).setY(-this._scrollTop);
            this._verticalView.transform().get("translate").setY(this._computeVerticalBarPosition(this._scrollTop));
            this._horizontalView.transform().get("translate").setX(this._computeHorizontalBarPosition(this._scrollLeft));
        },

        _adjustMomentum: function(momentum, scroll, maxScroll) {
            return ((momentum > 0 && scroll >= 0) ||
                (momentum < maxScroll && scroll <= maxScroll)) ?
                    scroll :
                    Math.max(scroll - this._maxMomentum, Math.min(momentum, scroll + this._maxMomentum));
        },

        _validateScrollWithAnimation: function() {
            var momentumLeft = this._scrollLeft,
                momentumTop =  this._scrollTop;
            if (this._scrollDirection == ScrollView.VERTICAL)
                momentumLeft = Math.max(0, Math.min(momentumLeft, this.maxScrollLeft()));
            if (this._scrollDirection == ScrollView.HORIZONTAL)
                momentumTop = Math.max(0, Math.min(momentumTop, this.maxScrollTop()));
            this._checkScrollPosition();
            momentumLeft = this._adjustMomentum(momentumLeft, this._scrollLeft, this.maxScrollLeft());
            momentumTop = this._adjustMomentum(momentumTop, this._scrollTop, this.maxScrollTop());
            if (this._contentView.getLayout) {
                var contentViewLayout = this._contentView.getLayout();
                if (contentViewLayout && contentViewLayout.scrollWithAnimation) {
                    var scrollOptions = {
                        left: this._scrollLeft,
                        top: this._scrollTop,
                        momentumLeft: momentumLeft,
                        momentumTop: momentumTop,
                        duration: this._scrollAnimationDuration
                    };
                    contentViewLayout.scrollWithAnimation(this, scrollOptions);
                }
            }
            this._internalScrollWithAnimation(momentumLeft, momentumTop);
        },

        _internalScrollWithAnimation: function(momentumLeft, momentumTop) {
            this.showScrollBars();
            var contentView = this.contentView();
            var chain = contentView.animation().inlineStart().get("scroll").removeAll().chain();
            var chainVertical = this._verticalView.animation().inlineStart().get("scroll").removeAll().chain();
            var chainHorizontal = this._horizontalView.animation().inlineStart().get("scroll").removeAll().chain();
            var verticalTransform, horizontalTransform;

            if (momentumLeft != this._scrollLeft ||
                momentumTop != this._scrollTop) {
                chain = chain.transform(this._scrollAnimationDuration / 2,
                                    new Transform().translate(-momentumLeft, -momentumTop))
                             .setTimingFunction("easeOut");

                verticalTransform = this._verticalView.transform().clone();
                verticalTransform.get("translate").setY(this._computeVerticalBarPosition(momentumTop));

                chainVertical = chainVertical.transform(this._scrollAnimationDuration / 2, verticalTransform)
                                .setTimingFunction("easeOut");

                horizontalTransform = this._horizontalView.transform().clone();
                horizontalTransform.get("translate").setX(this._computeHorizontalBarPosition(momentumLeft));
                chainHorizontal = chainHorizontal.transform(this._scrollAnimationDuration / 2, horizontalTransform)
                                .setTimingFunction("easeOut");

                this.trigger("scroll:animation", momentumLeft, momentumTop, this._scrollAnimationDuration / 2, /* momentum */ true);
            }
            this.trigger("scroll:animation", this._scrollLeft, this._scrollTop, this._scrollAnimationDuration, /* momentum */ false);
            chain.transform(this._scrollAnimationDuration,
                            new Transform().translate(-this._scrollLeft, -this._scrollTop))
                 .setTimingFunction("easeOut")
                 .callback(function() {
                     this.hideScrollBars();
                     this.trigger("scroll");
                 }, this);

            verticalTransform = this._verticalView.transform().clone();
            verticalTransform.get("translate").setY(this._computeVerticalBarPosition(this._scrollTop));
            chainVertical.transform(this._scrollAnimationDuration, verticalTransform)
                                .setTimingFunction("easeOut");

            horizontalTransform = this._horizontalView.transform().clone();
            horizontalTransform.get("translate").setX(this._computeHorizontalBarPosition(this._scrollLeft));
            chainHorizontal.transform(this._scrollAnimationDuration, horizontalTransform)
                                .setTimingFunction("easeOut");
        },

        _onMouseWheel: function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            var ev = event.originalEvent,
                left = 0, top = ev.wheelDelta;
            if (ev.hasOwnProperty("wheelDeltaX")) {
                left = ev.wheelDeltaX;
                top = ev.wheelDeltaY;
            }
            if (boilerplate.lookupPrefix(ev, "directionInvertedFromDevice")) {
                left *= -1;
                top *= -1;
            }
            this.scrollBy(left, top);
            this.showScrollBars();
        },

        respondsToTouchGesture: function(gesture) {
            if (!this._contentView || this._scrollDirection == ScrollView.NONE ||
                gesture.type != GestureDetector.GestureType.DRAG)
                return false;
            return (this._scrollDirection != ScrollView.VERTICAL && gesture.scrollX) ||
                (this._scrollDirection != ScrollView.HORIZONTAL && gesture.scrollY);
        },

        _stopScrollAnimation: function() {
            this._useAnimation = false;
            var contentView = this.contentView();
            if (contentView.hasAnimation()) {
                var transform = contentView.transform().get("translate");
                this._scrolLeft = -transform.x();
                this._scrollTop = -transform.y();
                this.contentView().animation().stop().get("scroll").removeAll();
                this.trigger("scroll");
            }
        },

        _onTouchDragStart: function() {
            this._stopScrollAnimation();
            this._touchStartState = {
                scrollLeft: this._scrollLeft,
                scrollTop: this._scrollTop
            };
            this._momentumLeft.reset(this._scrollLeft);
            this._momentumTop.reset(this._scrollTop);
            this._canOverScroll = true;
            this.showScrollBars();
        },

        _onTouchDragMove: function(transform) {
            if (!this._touchStartState)
                return;
            var deltaX = this._touchStartState.scrollLeft - transform.dragX,
                deltaY = this._touchStartState.scrollTop - transform.dragY;
            this._momentumLeft.injectValue(deltaX);
            this._momentumTop.injectValue(deltaY);
            this.scrollTo(deltaX, deltaY, true);
        },

        _onTouchDragEnd: function(transform) {
            var deltaX = this._touchStartState.scrollLeft - transform.dragX,
                deltaY = this._touchStartState.scrollTop - transform.dragY;
            this._momentumLeft.injectValue(deltaX);
            this._momentumTop.injectValue(deltaY);
            this._scrollLeft = this._momentumLeft.compute();
            this._scrollTop = this._momentumTop.compute();
            this._useAnimation = true;
            this._canOverScroll = false;
            this._touchStartState = null;
            this._updateSelectedView(true);
            this.invalidate("scroll");
        }
    }, {
        BOTH: "both",
        VERTICAL: "vertical",
        HORIZONTAL: "horizontal",
        NONE: "none"
    });

    return ScrollView;

});