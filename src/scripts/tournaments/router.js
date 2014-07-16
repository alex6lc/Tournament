define([
    'marionette',
    'entities/tournament',
    'helpers/navigator',
    'tournaments/dashboard-view',
    'tournaments/tournament-view',
    'tournaments/stages/stage-view',
], function (Marionette,
             Tournament,
             Navigator,
             DashboardView,
             TournamentView,
             StageView,
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
            "": "showDashboard",
            "t/:tournamentId": "showTournament",
            "t/:tournamentId/s/:stageId": "showStage",
        },
        controller: {
            showDashboard: function () {
                var view = new DashboardView({
                    collection: tournaments
                });
                app.main.show(view);
            },
            showTournament: function (tournamentId) {
                var model = tournaments.get(tournamentId);
                var view = new TournamentView({
                    model: model
                });
                app.main.show(view);
            },
            showStage: function (tournamentId, stageId) {
                var tournament = tournaments.get(tournamentId);

                var view = new StageView({
                    model: tournament.get("Stages").get(stageId),
                    tournament: tournament
                });
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