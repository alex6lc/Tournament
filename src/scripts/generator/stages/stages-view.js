define([
    'backbone',
    'marionette',
    'helpers/navigator',
    'hbs!generator/stages/stages-tmp',
    'hbs!generator/stages/stage-tmp'
], function (Backbone, Marionette, Navigator, stagesTemplate, stageTemplate) {
    'use strict';

    var ItemView = Marionette.ItemView.extend({
        template: stageTemplate,
        triggers: {
            "click .js-delete-stage": "deleteStage"
        },
        events: {
            "click .js-edit-stage": "editStage"
        },
        initialize: function (options) {
            this.tournamentId = options.tournament.id;
        },
        editStage: function (event) {
            event.preventDefault();
            event.stopPropagation();

            Navigator("/generator/"  + this.tournamentId + "/stages/" + this.model.id);
        }
    });

    var View = Marionette.CompositeView.extend({
        template: stagesTemplate,

        events: {
            'click .js-new-stage': 'navigateNewStage',
            'click .js-start': 'startTournament'
        },

        childView: ItemView,
        childViewContainer: ".js-stages-list",
        childViewOptions: function () {
            return {
                tournament: this.model
            };
        },

        initialize: function () {
            this.listenTo(this, "childview:deleteStage", function (view) {
                this.collection.remove(view.model);
                this.model.save();
            }, this);
        },

        navigateNewStage: function (event) {
            event.preventDefault();
            event.stopPropagation();

            Navigator("/generator/"  + this.model.id + "/stages/new");
        },

        startTournament: function (event) {
            event.preventDefault();
            event.stopPropagation();

            this.model.start();

            Navigator("/t/"  + this.model.id);
        }
    });

    return View;
});
