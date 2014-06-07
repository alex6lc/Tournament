define([
    'underscore',
    'backbone',
    'relational'
], function (_, Backbone) {
    'use strict';

    return Backbone.RelationalModel.extend({
        idAttribute: "Id",
        defaults: {
            BestOf: 1
        },
        getMatches: function () {
            return this.get("Stage").get("Matches").where({ Round: this });
        },
        getMatchIndex: function (match) {
            var matches = this.get("Stage").get("Matches").where({ Round: this });
            return _.indexOf(matches, match);
        },
        getNextRound: function () {
            var index = this.collection.indexOf(this);
            if (index === this.collection.length - 1) {
                return null;
            } else {
                return this.collection.at(index + 1);
            }
        },
        getPrevRound: function () {
            var index = this.collection.indexOf(this);
            if (index === 0) {
                return null;
            } else {
                return this.collection.at(index - 1);
            }
        }
    });
});
