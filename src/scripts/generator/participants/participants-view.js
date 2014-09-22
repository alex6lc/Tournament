define([
    'backbone',
    'marionette',
    'entities/participant',
    'helpers/utils',
    'helpers/navigator',
    './participant-editor-view',
    'hbs!generator/participants/participants-tmp'
], function (Backbone, Marionette, Participant, Utils, Navigator, ItemView, template) {
    'use strict';

    return Marionette.CompositeView.extend({
        template: template,

        childView: ItemView,
        childViewContainer: "tbody",

        events: {
            'click .js-next': 'saveForm'
        },

        initialize: function () {
            this.listenTo(this, "childview:addParticipant", function (insertRowView) {
                var participantAttr = insertRowView.model.toJSON();

                this.collection.add(_.extend({
                    Id: Utils.generateGUID()
                }, participantAttr));

                // refresh insert row
                this.removeChildView(insertRowView);
                this.addInsertRow();
            });

            this.listenTo(this, "childview:deleteParticipant", function (childView) {
                var participant = childView.model;
                this.collection.remove(participant);
            });
        },

        onRender: function () {
            this.addInsertRow();
        },

        addInsertRow: function () {
            var emptyParticipant = new Participant();
            var index = this.collection.length;
            this.addChild(emptyParticipant, ItemView, index);
        },

        saveForm: function (event) {
            var self = this;

            event.preventDefault();
            event.stopPropagation();

            this.model.save().done(function () {
                Navigator("/generator/" + self.model.id + "/stages");
            });
        }
    });
});
