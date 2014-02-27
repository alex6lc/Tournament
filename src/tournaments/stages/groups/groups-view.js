define([
    'marionette',
    'backbone',
    'handlebars',
    'helpers/utils'
], function (Marionette, Backbone, Handlebars, Utils) {
    var Match = Marionette.ItemView.extend({
        template: Handlebars.compile("<div>{{HomeName}} vs {{AwayName}}</div>"),
        serializeData: function () {
            return {
                HomeName: this.model.get("Home").get("Name"),
                HomeScore: 0,
                AwayName: this.model.get("Away").get("Name"),
                AwayScore: 0,
                Winner: 0
            }
        }
    });

    var Round = Marionette.CompositeView.extend({
        itemView: Match,
        itemViewContainer: ".js-matches",
        template: Handlebars.compile('<div>{{Title}}</div><div class="js-matches"></div>')

    });

    var Rounds = Marionette.CollectionView.extend({
        itemView: Round,
        itemViewOptions: function (model) {
            var allMatches = this.stageModel.get("Matches").clone();
            var matches = allMatches.where({ Group: this.groupModel, Round: model });

            return {
                collection: new Backbone.Collection(matches),
                model: model
            }
        },

        initialize: function (options) {
            this.groupModel = options.groupModel;
            this.stageModel = options.stageModel;
        }
    });

    var Group = Marionette.Layout.extend({
        template: Handlebars.compile('<div>{{Title}}</div><div><div class="js-standing"></div><div class="js-rounds"></div></div>'),
        regions: {
            standing: ".js-standing",
            rounds: ".js-rounds"
        },
        initialize: function (options) {
            this.stageModel = options.stageModel
        },

        onRender: function () {
            var roundsView = new Rounds({
                groupModel: this.model,
                stageModel: this.stageModel,
                collection: this.stageModel.get("Rounds")
            });

            this.rounds.show(roundsView);
        }
    });

    var Groups = Marionette.CollectionView.extend({
        itemView: Group,
        itemViewOptions: function () {
            return {
                stageModel: this.stageModel
            }
        },
        initialize: function (options) {
            this.stageModel = options.stageModel
        }
    });

    return Groups;
});