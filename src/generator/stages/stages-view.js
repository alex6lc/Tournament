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

            Navigator("/generator/"  + this.tournamentId + "/stages/" + this.model.id);
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

            Navigator("/generator/"  + this.model.id + "/stages/new");
        }
    });

    return View;
});
