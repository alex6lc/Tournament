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
    './next-match-view',
    'hbs!participants/dashboard-tmp'
], function (Marionette, NextMatchView, dashboardTemplate) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: dashboardTemplate,

        regions: {
            nextMatch: ".js-next-match"
        },

        onShow: function () {
            this.nextMatch.show(new NextMatchView());
        }
    });
});
