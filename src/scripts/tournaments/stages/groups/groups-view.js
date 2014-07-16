define([
    'marionette',
    'backbone',
    'handlebars',
    'helpers/navigator'
], function (Marionette, Backbone, Handlebars, Navigator) {
    'use strict';

    var Match = Marionette.ItemView.extend({
        template: Handlebars.compile("<div>{{HomeName}} vs {{AwayName}} <a href='#' class='js-edit'>Edit</a></div>"),
        events: {
            "click .js-edit": "editMatch"
        },

        initialize: function (options) {
            this.tournament = options.tournament;
        },

        editMatch: function (event) {
            event.preventDefault();
            event.stopPropagation();

            Navigator("t/" + this.tournament.id + "/m/" + this.model.id);
        },
        serializeData: function () {
            return {
                HomeName: this.model.get("Home").get("Name"),
                HomeScore: 0,
                AwayName: this.model.get("Away").get("Name"),
                AwayScore: 0,
                Winner: 0
            };
        }
    });

    var Round = Marionette.CompositeView.extend({
        childView: Match,
        childViewContainer: ".js-matches",
        template: Handlebars.compile('<div>{{Title}}</div><div class="js-matches"></div>'),
        childViewOptions: function () {
            return {
                tournament: this.tournament
            };
        },

        initialize: function (options) {
            this.tournament = options.tournament;
        }

    });

    var Rounds = Marionette.CollectionView.extend({
        childView: Round,
        childViewOptions: function (model) {
            var allMatches = this.stage.get("Matches").clone();
            var matches = allMatches.where({ Group: this.group, Round: model });

            return {
                collection: new Backbone.Collection(matches),
                model: model,
                tournament: this.tournament
            };
        },

        initialize: function (options) {
            this.group = options.group;
            this.stage = options.stage;
            this.tournament = options.tournament;
        }
    });

    var Group = Marionette.LayoutView.extend({
        template: Handlebars.compile('<div>{{Title}}</div><div><div class="js-standing"></div><div class="js-rounds"></div></div>'),
        regions: {
            standing: ".js-standing",
            rounds: ".js-rounds"
        },
        initialize: function (options) {
            this.tournament = options.tournament;
            this.stage = options.stage;
        },

        onRender: function () {
            var roundsView = new Rounds({
                group: this.model,
                stage: this.stage,
                tournament: this.tournament,
                collection: this.stage.get("Rounds")
            });

            this.rounds.show(roundsView);
        }
    });

    var Groups = Marionette.CollectionView.extend({
        childView: Group,
        childViewOptions: function () {
            return {
                stage: this.model,
                tournament: this.tournament
            };
        },
        initialize: function (options) {
            this.tournament = options.tournament;
            this.collection = this.model.get("Groups")
        }
    });

    return Groups;
});