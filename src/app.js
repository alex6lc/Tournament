define(['jquery', 'marionette', 'backbone', 'router'], function ($, Marionette, Backbone, Router) {
    var app = new Marionette.Application();

    app.addInitializer(function(){
        var router = new Router({ app: app });

        router.on("route", function(page, args) {
            if (args.length > 0 && args[0] !== undefined) {
                var tournament = router.tournaments.get(args[0]);

                function setDebugInfo() {
                    var json = tournament.toJSON();
                    var string = JSON.stringify(json, null, 2);

                    $("#debug").html('<pre>' + string + '</pre>');
                }

                app.stopListening(tournament);
                app.listenTo(tournament, "sync", setDebugInfo);

                setDebugInfo();
            }
        });
    });

    app.on("initialize:after", function () {
        if (Backbone.history) {
            Backbone.history.start();
        }
    });

    app.addRegions({
        main: "#main",
        navigation: "#nav"
    });

    return app;
});