define(["mobileui/ui/app-card-view"], function(AppCardView) {

    var IndexView = AppCardView.extend({
        render: function() {
            this.$el.css("background-color", "white");
            this.$el.append("<div class='center'>Hello world!</div>");
            return IndexView.__super__.render.call(this);
        }
    }, {
        label: "index"
    });

    return IndexView;

});