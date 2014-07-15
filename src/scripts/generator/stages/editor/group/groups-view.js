define([
    'marionette',
    'handlebars',
    'helpers/utils',
    'generator/stages/editor/group/group-view'
], function (Marionette, Handlebars, Utils, GroupView) {
    'use strict';

    return  Marionette.CompositeView.extend({
        className: 'clearfix',
        childView: GroupView,
        childViewContainer: '.js-groups-list',

        template: Handlebars.compile('<div class="js-groups-list"></div><div class="group-editor js-add-group">Add</div>'),
        events: {
            'click .js-add-group': 'addGroup'
        },

        initialize: function () {
            this.listenTo(this, "childview:group:removed", this.removeGroup, this);
        },

        removeGroup: function (view) {
            this.collection.remove(view.model);
            this.trigger("group:removed");
        },

        addGroup: function (event) {
            event.preventDefault();
            event.stopPropagation();

            this.collection.addGroup();

            this.trigger("group:added");
        },

        bindParticipants: function (allParticipants) {
            this.children.each(function (view) {
                view.bindParticipants(allParticipants);
            });
        }
    });
});