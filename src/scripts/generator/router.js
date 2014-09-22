define([
    'marionette',
    'generator/tournament-view',
    'generator/participants/participants-view',
    'generator/stages/stages-view',
    'generator/stages/editor/stage-view',
    'generator/stages/rounds/rounds-view'
], function (Marionette,
             TournamentView,
             ParticipantsView,
             StagesView,
             StageEditorView,
             RoundsView
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
            "generator/new": "showNewTournament",
            "generator/:tournamentId": "showTournament",
            "generator/:tournamentId/participants": "showParticipants",
            "generator/:tournamentId/stages": "showStages",
            "generator/:tournamentId/stages/new": "showNewStage",
            "generator/:tournamentId/stages/:stageId": "showEditStage",
            "generator/:tournamentId/stages/:stageId/rounds": "showEditRounds"
        },
        controller: {
            showNewTournament: function () {
                //this is weird
                var tournament = new tournaments.model();
                tournaments.add(tournament);

                var view = new TournamentView({
                    model: tournament
                });
                app.main.show(view);
            },
            showTournament: function (tournamentId) {
                var tournament = tournaments.get(tournamentId);
                var view = new TournamentView({
                    model: tournament
                });
                app.main.show(view);
            },
            showParticipants: function (tournamentId) {
                var tournament = tournaments.get(tournamentId);
                var view = new ParticipantsView({
                    model: tournament,
                    collection: tournament.get("Participants")
                });
                app.main.show(view);
            },
            showStages: function (tournamentId) {
                var tournament = tournaments.get(tournamentId);
                var view = new StagesView({
                    model: tournament,
                    collection: tournament.get("Stages")
                });

                app.main.show(view);
            },
            showNewStage: function (tournamentId) {
                var tournament = tournaments.get(tournamentId);
                var view = new StageEditorView({
                    tournament: tournament
                });
                app.main.show(view);
            },
            showEditStage: function (tournamentId, stageId) {
                var tournament = tournaments.get(tournamentId);
                var stageModel = tournament.get("Stages").get(stageId);

                var view = new StageEditorView({
                    tournament: tournament,
                    model: stageModel
                });
                app.main.show(view);
            },
            showEditRounds: function (tournamentId, stageId) {
                var tournament = tournaments.get(tournamentId);
                var stage = tournament.get("Stages").get(stageId);
                var rounds = stage.get("Rounds");

                var view = new RoundsView({
                    model: tournament,
                    stage: stage,
                    collection: rounds
                });
                app.main.show(view);
            }
        }
    });
});