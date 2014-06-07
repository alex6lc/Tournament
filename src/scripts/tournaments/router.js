define([
    'marionette',
    'account/login-view',
    'account/signup-view',
    'tournaments/dashboard-view',
    'tournaments/stages/groups/groups-view'
], function (Marionette,
             LoginView,
             SignupView,
             DashboardView,
             GroupsView
) {
    'use strict';

    var app = null;
    var tournaments = null;

    return Marionette.AppRouter.extend({
        initialize: function (options) {
            this.app = app = options.app;
            this.tournaments = tournaments = options.tournaments;
        },
        appRoutes: {
            "": "tournaments",
            "login": "showLogin",
            "signup": "showSignup"
        },
        controller: {
            tournaments: function () {
                var view = new DashboardView({
                    collection: tournaments
                });
                app.main.show(view);
            },
            showLogin: function () {
                var view = new LoginView();
                app.main.show(view);
            },
            showSignup: function () {
                var view = new SignupView();
                app.main.show(view);
            },
            showStagePreview: function (tournamentId, stageId) {
                var tournament = tournaments.get(tournamentId);
                var stage = tournament.get("Stages").get(stageId);
                var groups = stage.get("Groups");

                var view = new GroupsView({
                    model: tournament,
                    collection: groups,
                    stageModel: stage
                });
                app.main.show(view);
            }
        }
    });
});