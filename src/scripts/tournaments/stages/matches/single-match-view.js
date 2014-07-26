define([
    'marionette',
    'helpers/navigator',
    'hbs!tournaments/stages/matches/single-match-tmp'
], function (Marionette, Navigator, Template) {
    'use strict';

    return Marionette.ItemView.extend({
        className: 'clearfix',
        template: Template,
        events: {
            "click .js-edit": "editMatch"
        },

        initialize: function (options) {
            this.tournament = options.tournament;
        },

        editMatch: function (event) {
            event.preventDefault();
            event.stopPropagation();

            Navigator("t/" + this.tournament.id + "/m/" + this.model.id);
        },
        serializeData: function () {
            return {
                HomeName: this.model.get("Home").get("Name"),
                HomeScore: this.model.get("HomeScore"),
                AwayName: this.model.get("Away").get("Name"),
                AwayScore: this.model.get("AwayScore"),
                Winner: 0
            };
        }
    });
});