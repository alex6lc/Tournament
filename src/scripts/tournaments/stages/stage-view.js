define([
    'marionette',
    'backbone',
    'handlebars',
    'helpers/utils',
    'tournaments/stages/groups/groups-view'
], function (Marionette, Backbone, Handlebars, Utils, StageGroupView) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: Handlebars.compile('<div class="js-stage"></div>'),

        regions: {
            stage: '.js-stage'
        },

        initialize: function (options) {
            this.tournament = options.tournament;
        },

        onShow: function () {
            var type = this.model.get("Type");
            this.stage.show(this.getStageTypeView(type));
        },

        getStageTypeView: function (type) {
            var View = null;
            if (type === 0) {
                View = StageGroupView;
            } else {
                View = StageEliminationView;
            }

            return new View({
                tournament: this.tournament,
                model: this.model
            });
        }
    });
});