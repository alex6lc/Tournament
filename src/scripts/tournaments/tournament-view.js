define([
    'marionette',
    'helpers/utils',
    'helpers/navigator',
    'hbs!tournaments/tournament-tmp',
    'hbs!tournaments/stages/stage-item-tmp'
], function (Marionette, Utils, Navigator, tournamentTemplate, stageItemTemplate) {
    'use strict';

    var ItemView = Marionette.ItemView.extend({
        template: stageItemTemplate,
        events: {
            "click .js-view": "navigateStage"
        },

        initialize: function (options) {
            this.tournamentId = options.tournament.id;
        },
        navigateStage: function (event) {
            event.preventDefault();
            event.stopPropagation();

            Navigator("t/" + this.tournamentId + "/s/" + this.model.id);
        }
    });

    var CompositeView = Marionette.CompositeView.extend({
        template: tournamentTemplate,

        childView: ItemView,
        childViewContainer: ".js-list",
        childViewOptions: function () {
            return {
                tournament: this.model
            };
        },
        initialize: function () {
            this.collection = this.model.get("Stages");
        }
    });

    return CompositeView;
});
