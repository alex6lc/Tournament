define([
    'backbone',
    'marionette',
    'helpers/utils',
    'helpers/navigator',
    'hbs!generator/stages/rounds/round-tmp',
    'hbs!generator/stages/rounds/rounds-tmp'
], function (Backbone, Marionette, Utils, Navigator, roundTemplate, roundsTemplate) {
    'use strict';

    var ItemView = Marionette.ItemView.extend({
        tagName: "tr",
        template: roundTemplate
    });

    var View = Marionette.CompositeView.extend({
        template: roundsTemplate,

        events: {
            'submit form': 'saveForm'
        },

        itemView: ItemView,
        itemViewContainer: ".js-rounds-list",


        initialize: function (options) {
            this.stage = options.stage;
        },

        saveForm: function (event) {
            var self = this;

            event.preventDefault();
            event.stopPropagation();

            var data = Utils.serializeObject(event.target);
            var formattedData = Utils.mapPropertyToArray(data);

            this.collection.each(function (round, i) {
                round.set(formattedData[i]);
            });

            this.model.save().done(function () {
                //Navigator("/Generator/" + self.model.id + "/Stages/" + self.stage.id  + "/Preview");
                Navigator("/generator/" + self.model.id + "/stages");
            });
        }
    });

    return View;
});
