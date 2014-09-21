define([
    'marionette',
    'helpers/utils',
    'helpers/navigator',
    'participants/next-match-view',
    'hbs!tournaments/dashboard-tmp',
    'hbs!tournaments/tournament-item-tmp'
], function (Marionette, Utils, Navigator, NextMatchView, dashboardTemplate, itemTemplate) {
    'use strict';

    var ItemView = Marionette.ItemView.extend({
        template: itemTemplate,
        events: {
            "click .js-edit": "editTournament",
            "click .js-delete": "deleteTournament",
            "click .js-view": "viewTournament"
        },
        viewTournament: function (event) {
            event.preventDefault();
            event.stopPropagation();

            Navigator("t/" + this.model.id);
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

    var TournamentList = Marionette.CollectionView.extend({
        childView: ItemView
    });

    var Layout = Marionette.LayoutView.extend({
        template: dashboardTemplate,

        regions: {
            list: ".js-list",
            nextMatch: ".js-next-match"
        },

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
        },

        initTournamentList: function () {
            return new TournamentList({
                collection: this.collection
            });
        },

        onShow: function () {
            this.list.show(this.initTournamentList());

            this.nextMatch.show(new NextMatchView());
        }

    });

    return Layout;
});
