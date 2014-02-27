define([
    'backbone',
    'marionette',
    'helpers/navigator',
    'hbs!generator/stages/stages-tmp',
    'hbs!generator/stages/stage-tmp'
], function (Backbone, Marionette, Navigator, stagesTemplate, stageTemplate) {
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

            Navigator("/Generator/"  + this.tournamentId + "/Stages/" + this.model.id);
        }
    });

    var View = Marionette.CompositeView.extend({
        template: stagesTemplate,

        events: {
            'click .js-new-stage': 'navigateNewStage'
        },

        itemView: ItemView,
        itemViewContainer: ".js-stages-list",
        itemViewOptions: function () {
            return {
                tournament: this.model
            };
        },

        initialize: function () {
            this.listenTo(this, "itemview:deleteStage", function (view){
                this.collection.remove(view.model);
                this.model.save();
            }, this);
        },

        navigateNewStage: function(event) {
            event.preventDefault();
            event.stopPropagation();

            Navigator("/Generator/"  + this.model.id + "/Stages/New");
        }
    });

    return View;
});
