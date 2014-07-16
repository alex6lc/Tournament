define([
    'marionette',
    'entities/tournament',
    'helpers/navigator',
    'tournaments/dashboard-view',
    'tournaments/tournament-view',
    'tournaments/stages/stage-view',
    'generator/matches/match-editor-view'
], function (Marionette,
             Tournament,
             Navigator,
             DashboardView,
             TournamentView,
             StageView,
             MatchEditorView
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
            "t/:tournamentId/m/:matchId": "showMatch"
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
            showMatch: function (tournamentId, matchId) {
                var tournament = tournaments.get(tournamentId);

                var view = new MatchEditorView({
                    model: tournament.get("Stages").findMatch(matchId),
                    tournament: tournament
                });
                app.main.show(view);
            }
        }
    });
});