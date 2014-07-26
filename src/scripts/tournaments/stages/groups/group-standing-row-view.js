define([
    'underscore',
    'marionette',
    'entities/match',
    'hbs!tournaments/stages/groups/group-standing-row-tmp'
], function (_, Marionette, Match, Template) {
    'use strict';

    return Marionette.ItemView.extend({
        template: Template,

        initialize: function (options) {
            this.matches = options.matches;
            this.tournament = options.tournament;
        },

        serializeData: function () {
            var model = this.model;

            var wins = 0,
                loses = 0,
                draws = 0;

            this.matches.each(function (m) {
                var status = null;

                if (m.get("Home") === model) {
                    status = m.get("HomeStatus");
                } else if (m.get("Away") === model) {
                    status = m.get("AwayStatus");
                }

                if (status === Match.status.WIN) {
                    wins += 1;
                } else if (status === Match.status.LOSS) {
                    loses += 1;
                } else if (status === Match.status.DRAW) {
                    draws += 1;
                }
            });

            return {
                Name: model.get("Name"),
                Wins: wins,
                Loses: loses,
                Draws: draws
            };
        }
    });
});