define([
    'backbone',
    'helpers/utils',
    './group'
], function (Backbone, Utils, Group) {
    'use strict';

    return Backbone.Collection.extend({
        model: Group,
        addGroup: function () {
            var count = this.length;

            this.add({
                Id: Utils.generateGUID(),
                Order: count,
                Title: "Group " + Utils.number2string(count + 1, true)
            });
        },
        getParticipants: function () {
            var p = [];
            this.each(function (group) {
                group.get("Participants").each(function (participant) {
                    p.push(participant);
                });
            });

            return p;
        },
        getNumberOfRound: function () {
            var nbPerGroup = this._getMaxNbParticipants();
            var isEven = nbPerGroup % 2 === 0;
            var nbMatches = this._getNumberOfMatches(nbPerGroup);

            var numberOfRound;
            if (isEven) {
                numberOfRound = nbMatches / (nbPerGroup / 2);
            } else {
                numberOfRound = nbMatches / ((nbPerGroup - 1) / 2);
            }

            return numberOfRound;
        },
        _getMaxNbParticipants: function () {
            var maxGroup = this.max(function (group) {
                return group.get("Participants").length;
            });
            return maxGroup.get("Participants").length;
        },
        _getNumberPerGroup: function (nbParticipants, numberOfGroup) {
            return Math.ceil(nbParticipants / numberOfGroup);
        },
        _getNumberOfMatches: function (nbPerGroup) {
            return nbPerGroup / 2 * (nbPerGroup - 1);
        }
    });
});
