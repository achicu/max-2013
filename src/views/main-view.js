define(['app', 'views/common/layer-view'], function(app, LayerView) {

	var MainView = Backbone.View.extend({

		$content: null,

		render: function() {
			this.$el.html("<a href='#'>Main View</a>");
			if (!this.$content)
				this.$content = $("<div />").appendTo(this.$el);

			var layer1 = new LayerView();
			var layer2 = new LayerView();

			this.$el.append(layer1.render().$el.addClass("blue-box"))
					.append(layer2.render().$el.addClass("red-box"));

			layer1.bounds().setWidth(100).setHeight(100);
			layer1.transform().rotate(20);
			layer2.bounds().setWidth(200).setHeight(100).setX(100);
			layer2.transform().perspective(100).rotateX(20);

			setInterval(function() {
				layer1.transform().search("rotate").addAngle(1);
			}, 10);

			return this;
		},

		setContentView: function(view) {
			this.$content.html("");
			this.$content.append(view.render().$el);
		}
	});

	app.on("init", function() {
		app.mainView = new MainView({
			el: $("#main").get(0)
		}).render();
	});

	return MainView;

});