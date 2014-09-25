define([
    'jquery',
    'underscore',
    'marionette',
    'backbone',
    'entities/tournaments',
    'tournaments/router',
    'generator/router',
    'participants/router'
], function ($, _, Marionette, Backbone, Tournaments, TournamentsRouter, GeneratorRouter, ParticipantsRouter) {
    'use strict';

    var tournaments = new Tournaments();
    tournaments.fetch();
    var app = new Marionette.Application();

    app.addInitializer(function () {
        app.tournamentsRouter = new ParticipantsRouter({
            app: app,
            tournaments: tournaments
        });
    });

    app.addInitializer(function () {
        app.participantsRouter = new TournamentsRouter({
            app: app,
            tournaments: tournaments
        });
    });

    app.addInitializer(function () {
        var router = app.generatorRouter = new GeneratorRouter({
            app: app,
            tournaments: tournaments
        });

        router.on("route", function (page, args) {
            if (args.length > 0 && _.isString(args[0])) {
                var tournament = tournaments.get(args[0]);

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

    app.on("start", function () {
        if (Backbone.history) {
            Backbone.history.start({ pushState: true });

            $(document).on('click', 'a:not([data-bypass])', function (event) {
                var href = $(this).attr('href');
                var protocol = this.protocol + '//';

                if (href.slice(protocol.length) !== protocol) {
                    event.preventDefault();

                    Backbone.history.navigate(href, true);
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