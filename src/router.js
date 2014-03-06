define([
    'marionette',
    'account/login-view',
    'account/signup-view',
    'generator/tournaments',
    'tournaments/dashboard-view',
    'generator/tournament-view',
    'generator/participants-view',
    'generator/stages/stages-view',
    'generator/stages/editor/stage-view',
    'generator/stages/rounds/rounds-view',
    'tournaments/stages/groups/groups-view'
], function (Marionette,
             LoginView,
             SignupView,
             Tournaments,
             DashboardView,
             TournamentView,
             ParticipantsView,
             StagesView,
             StageEditorView,
             RoundsView,
             GroupsView
) {
    var app = null;
    var tournaments = null;

    var Router = Marionette.AppRouter.extend({
        initialize: function (options) {
            options = options || {};
            this.app = app = options.app;

            this.tournaments = tournaments = new Tournaments();
            this.tournaments.fetch();
        },
        appRoutes: {
            "": "tournaments",
            "login": "showLogin",
            "signup": "showSignup",
            "generator/new": "showNewTournament",
            "generator/:tournamentId": "showTournament",
            "generator/:tournamentId/participants": "showParticipants",
            "generator/:tournamentId/stages": "showStages",
            "generator/:tournamentId/stages/new": "showNewStage",
            "generator/:tournamentId/stages/:stageId": "showEditStage",
            "generator/:tournamentId/stages/:stageId/rounds": "showEditRounds",
            "generator/:tournamentId/stages/:stageId/preview": "showStagePreview"
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
            showNewTournament: function() {
                //this is weird
                var tournament = new tournaments.model();
                tournaments.add(tournament);

                var view = new TournamentView({
                    model: tournament
                });
                app.main.show(view);
            },
            showTournament: function(tournamentId) {
                var tournament = tournaments.get(tournamentId);
                var view = new TournamentView({
                    model: tournament
                });
                app.main.show(view);
            },
            showParticipants: function(tournamentId) {
                var tournament = tournaments.get(tournamentId);
                var view = new ParticipantsView({
                    model: tournament
                });
                app.main.show(view);
            },
            showStages: function(tournamentId) {
                var tournament = tournaments.get(tournamentId);
                var view = new StagesView({
                    model: tournament,
                    collection: tournament.get("Stages")
                });

                app.main.show(view);
            },
            showNewStage: function(tournamentId) {
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
            showEditRounds: function(tournamentId, stageId) {
                var tournament = tournaments.get(tournamentId);
                var stage = tournament.get("Stages").get(stageId);
                var rounds = stage.get("Rounds");

                var view = new RoundsView({
                    model: tournament,
                    stage: stage,
                    collection: rounds
                });
                app.main.show(view);
            },
            showStagePreview: function(tournamentId, stageId) {
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

    return Router;
});
