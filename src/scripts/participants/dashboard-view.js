/*
* features:
* - Next matches
*   ~ Other teams
*       ~ Location
*       ~ Info
*       ~ Player
* - Current group / bracket
* - Notify admin
* - Chat ???
* -
* */

define([
    'marionette',
    'helpers/utils',
    'helpers/navigator',
    'hbs!tournaments/dashboard-tmp',
    'hbs!tournaments/tournament-item-tmp'
], function (Marionette, Utils, Navigator, dashboardTemplate, itemTemplate) {
    'use strict';

    return Marionette.ItemView.extend({
        template: itemTemplate,
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
});
