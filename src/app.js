define(['jquery', 'underscore', 'marionette', 'backbone', 'router'], function ($, _, Marionette, Backbone, Router) {
    'use strict';

    var app = new Marionette.Application();

    app.addInitializer(function () {
        var router = app.router = new Router({ app: app });

        router.on("route", function (page, args) {
            if (args.length > 0 && _.isString(args[0])) {
                var tournament = router.tournaments.get(args[0]);

                var setDebugInfo = function () {
                    var json = tournament.toJSON();
                    var string = JSON.stringify(json, null, 2);

                    $("#debug").html('<pre>' + string + '</pre>');
                };

                app.stopListening(tournament);
                app.listenTo(tournament, "sync", setDebugInfo);

                setDebugInfo();
            }
        });
    });

    app.on("initialize:after", function () {
        if (Backbone.history) {
            Backbone.history.start({ pushState: true });

            $(document).on('click', 'a:not([data-bypass])', function (event) {
                var href = $(this).attr('href');
                var protocol = this.protocol + '//';

                if (href.slice(protocol.length) !== protocol) {
                    event.preventDefault();
                    app.router.navigate(href, true);
                }
            });
        }
    });

    app.addRegions({
        main: "#main",
        navigation: "#nav"
    });

    return app;
});