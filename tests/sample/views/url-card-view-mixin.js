define(["sample/app"],
    function(app) {

    var UrlCardViewMixin = {

        updateRouterLocation: function() {
            if (app.noUrlChanges)
                return;
            var url = this.url();
            if (!url)
                return;
            app.router.navigate(url, { trigger: false });
        }
    };

    return UrlCardViewMixin;

});