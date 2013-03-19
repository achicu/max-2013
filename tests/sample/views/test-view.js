define(['app',
        'mobileui/ui/window-view',
        'mobileui/ui/navigator-view',
        'mobileui/views/layer-view',
        'mobileui/views/touch-view',
        'mobileui/views/measured-view',
        'mobileui/views/layout-view',
        'mobileui/views/scroll-view',
        'mobileui/utils/transform',
        'mobileui/utils/transform-animation',
        'mobileui/views/layout-params'],
    function(app,
             WindowView,
             NavigatorView,
             LayerView,
             TouchView,
             MeasuredView,
             LayoutView,
             ScrollView,
             Transform,
             TransformAnimation,
             LayoutParams)
    {

    var MainView = WindowView.extend({

        initialize: function() {
            this._navigatorView = new NavigatorView();
            this.append(this._navigatorView.render());
            MainView.__super__.initialize.call(this);
        },

        render: function() {
            MainView.__super__.render.call(this);

            var contentLayer = new ScrollView(),
                layer0 = new LayoutView().setParams(new LayoutParams().matchChildren());
            contentLayer.setContentView(layer0);
            layer0.setLayout("vertical");
            this._navigatorView.contentView().append(contentLayer.render().matchParentSize());

            var layer1 = new LayoutView();
            layer1.setLayout("vertical");
            layer1.bounds().setSize(100, 300);

            var layer1_content1 = new LayerView();
            layer1_content1.bounds().setSize(90, 50);
            layer1_content1.render().$el.addClass("red-box").html("Inside of the first layer");
            layer1.append(layer1_content1);

            var layer1_content2 = new TouchView();
            layer1_content2.setParams(new LayoutParams().fillParentHeight()).bounds().setWidth(90);
            layer1_content2.render().$el.addClass("green-box").html("Inside of the second layer");
            layer1.append(layer1_content2);
            layer1_content2.on("touchend", function() {
                layer0.setLayoutWithAnimation("vertical");
            });

            var layer1_content3 = new LayerView();
            layer1_content3.bounds().setSize(90, 50);
            layer1_content3.render().$el.addClass("red-box").html("Inside of the third layer");
            layer1.append(layer1_content3);

            var layer2 = new TouchView();

            layer0.append(layer1.render().addClass("blue-box"))
                .append(layer2.render().addClass("red-box"));

            //layer1.transform().rotate(20);

            layer2.bounds().setWidth(200).setHeight(100);
            //layer2.transform().perspective(100).rotateY(20);
            layer2.on("touchend", function() {
                layer0.setLayoutWithAnimation("horizontal");
            });

            var layer4 = new LayoutView();
            layer4.setLayout("vertical");

            layer4.bounds().setX(100);
            layer0.append(layer4.render().addClass("red-box"));
            layer4.setParams(new LayoutParams().matchChildren());
            layer4.append(new MeasuredView().render().setContent("Line 1"));
            layer4.append(new MeasuredView().render().setContent("Line 2 is super long"));
            layer4.append(new MeasuredView().render().setContent("Line 3"));
            layer4.append(new MeasuredView().render().setContent("Line 4"));
            layer4.padding().setLeft(100).setTop(50).setBottom(10).setRight(60);

            // layer4.animation().chain()
            //     .transform(100, Transform().rotate(100));
                // .wait(500)
                // .transform(100, Transform().rotate(0))
                // .wait(500)
                // .transform(100, Transform().rotate(30))
                // .wait(500)
                // .transform(100, Transform().rotate(-30))
                // .wait(500)
                // .transform(100, Transform().rotate(0));

            var layer5;

            layer4.animation().chain(10);
            layer4.animation().start().once("stop", function() {
                var layer3 = new MeasuredView();
                layer0.beforeWithAnimation(layer3.render().addClass("green-box"), layer1);
                layer3.setContent("Box of the right size");

                layer5 = new MeasuredView();
                layer0.beforeWithAnimation(layer5.render().addClass("green-box"), layer4);
                layer5.setContent("Box of the right size<br /> - test");
            });

            layer4.$el.click(function() {
                if (!layer5)
                    return;
                if (layer5.parent())
                    layer5.detachWithAnimation();
                else
                    layer0.beforeWithAnimation(layer5, layer4);
            });

            var layer6 = new ScrollView();
            layer6.setContentView(new LayoutView().render().setLayout("vertical"));
            layer6.contentView()
                .setParams(new LayoutParams().matchChildrenHeight())
                .append(new MeasuredView().render().setContent("Item 1"))
                .append(new MeasuredView().render().setContent("Item 2"))
                .append(new MeasuredView().render().setContent("Item 3"))
                .append(new MeasuredView().render().setContent("Item 4"))
                .append(new MeasuredView().render().setContent("Item 6"))
                .append(new MeasuredView().render().setContent("Item 7"))
                .append(new MeasuredView().render().setContent("Item 8"))
                .append(new MeasuredView().render().setContent("Item 9"));
            layer6.$el.addClass("green-box");
            layer6.bounds().setSize(100, 100);
            layer6.scrollTo(0, 100);
            layer0.append(layer6.render());


            var layer7 = new ScrollView();
            layer7.setContentView(new LayoutView().render().setLayout("horizontal"));
            layer7.contentView()
                .setParams(new LayoutParams().matchChildrenWidth())
                .append(new MeasuredView().render().setContent("Item 1"))
                .append(new MeasuredView().render().setContent("Item 2"))
                .append(new MeasuredView().render().setContent("Item 3"))
                .append(new MeasuredView().render().setContent("Item 4"))
                .append(new MeasuredView().render().setContent("Item 6"))
                .append(new MeasuredView().render().setContent("Item 7"))
                .append(new MeasuredView().render().setContent("Item 8"))
                .append(new MeasuredView().render().setContent("Item 9"));
            layer7.$el.addClass("green-box");
            layer7.bounds().setSize(100, 100);
            layer7.scrollTo(100, 0);
            layer0.append(layer7.render());

            // setInterval(function() {
            //     if (!layer5)
            //         return;
            //     var layer6 = new MeasuredView();
            //     layer0.before(layer6.render().addClass("green-box"), layer4, true);
            //     layer6.setContent("Box of the right size<br /> - test");
            // }, 1000);


            return this;
        },

        setContentView: function(view) {
            
        }
    });

    app.on("init", function() {
        app.mainView = new MainView({
            el: $("#main").get(0)
        }).render();
    });

    return MainView;

});