define([
    'marionette',
    'helpers/utils',
    'helpers/navigator',
    'hbs!tournaments/dashboard-tmp',
    'hbs!tournaments/tournament-item-tmp'
], function (Marionette, Utils, Navigator, dashboardTemplate, itemTemplate) {
    'use strict';

    var ItemView = Marionette.ItemView.extend({
        template: itemTemplate,
        events: {
            "click .js-edit": "editTournament",
            "click .js-delete": "deleteTournament"
        },
        editTournament: function (event) {
            event.preventDefault();
            event.stopPropagation();

            Navigator("generator/" + this.model.id);
        },
        deleteTournament: function (event) {
            event.preventDefault();
            event.stopPropagation();

            this.model.destroy();
        }
    });

    var CompositeView = Marionette.CompositeView.extend({
        childView: ItemView,
        childViewContainer: ".js-list",

        template: dashboardTemplate,

        events: {
            "click .js-clear": "clear",
            "click .js-add": "addTournament"
        },

        clear: function (event) {
            event.preventDefault();
            event.stopPropagation();

            this.collection.each(function (model) {
                model.destroy();
            });
        },
        addTournament: function (event) {
            event.preventDefault();
            event.stopPropagation();

            Navigator("generator/new");
        }
    });

    return CompositeView;
});
