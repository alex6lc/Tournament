define([
    'backbone',
    'marionette',
    'tournaments/stages/matches/single-match-view',
    'tournaments/stages/groups/group-standing-row-view',
    'hbs!tournaments/stages/groups/group-tmp'
], function (Backbone, Marionette, MatchesView, GroupStandingRowView, Template) {
    'use strict';

    var Standing = Marionette.CollectionView.extend({
        childView: GroupStandingRowView,
        childViewOptions: function (model) {
            return {
                model: model,
                tournament: this.tournament,
                matches: this.matches
            };
        },

        initialize: function (options) {
            this.matches = options.matches;
            this.tournament = options.tournament;
        }
    });

    var Matches = Marionette.CollectionView.extend({
        childView: MatchesView,
        childViewOptions: function (model) {
            return {
                model: model,
                tournament: this.tournament
            };
        },

        initialize: function (options) {
            this.tournament = options.tournament;
        }
    });

    return Marionette.LayoutView.extend({
        template: Template,
        regions: {
            standing: ".js-standing",
            matches: ".js-matches"
        },
        initialize: function (options) {
            this.tournament = options.tournament;
            this.stage = options.stage;
        },

        onRender: function () {
            var allMatches = this.stage.get("Matches").clone();
            var matches = new Backbone.Collection(allMatches.where({ Group: this.model }));

            var row = this.model.get("Participants").models;
            var standingView = new Standing({
                tournament: this.tournament,
                matches: matches,
                collection: new Backbone.Collection(row)
            });

            this.standing.show(standingView);

            var matchesView = new Matches({
                tournament: this.tournament,
                collection: matches
            });

            this.matches.show(matchesView);
        }
    });
});