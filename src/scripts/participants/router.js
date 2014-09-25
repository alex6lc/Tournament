define([
    'marionette',
    './dashboard-view'
], function (Marionette, DashboardView) {
    'use strict';

    var app = null;
    var tournaments = null;

    return Marionette.AppRouter.extend({
        initialize: function (options) {
            this.app = app = options.app;
            this.tournaments = tournaments = options.tournaments;
        },
        appRoutes: {
            "p": "showDashboard"
        },
        controller: {
            showDashboard: function () {
                var view = new DashboardView({
                    collection: tournaments
                });
                app.main.show(view);
            }
        }
    });
});