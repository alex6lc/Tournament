define([
    'backbone',
    './stage'
], function (Backbone, Stage) {
    'use strict';

    return Backbone.Collection.extend({
        model: Stage,
        findMatch: function (matchId) {
            var i = 0,
                match = null;

            while (match === null && i < this.length) {
                var m = this.at(i).get("Matches").get(matchId);
                if (m !== undefined) {
                    match = m;
                }

                i++;
            }

            return match;
        }
    });
});
