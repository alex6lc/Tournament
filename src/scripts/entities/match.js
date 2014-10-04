define([
    'backbone',
    'moment',
    './round',
    './group',
    './participant',
    'relational'
], function (Backbone, Moment, Round, Group, Participant) {
    'use strict';

    var status = {
        WIN: 2,
        LOSS: 1,
        DRAW: 0
    };

    var Match = Backbone.RelationalModel.extend({
        idAttribute: "Id",
        defaults: {
            ScheduleAt: Moment.utc().unix(),
            Location: ""
        },
        relations: [{
            type: 'HasOne',
            key: 'Round',
            relatedModel: Round,
            includeInJSON: "Id"
        }, {
            type: 'HasOne',
            key: 'Group',
            relatedModel: Group,
            includeInJSON: "Id"
        }, {
            type: 'HasOne',
            key: 'Home',
            relatedModel: Participant,
            includeInJSON: "Id"
        }, {
            type: 'HasOne',
            key: 'Away',
            relatedModel: Participant,
            includeInJSON: "Id"
        }],
        hasParticipant: function () {
            return this.has("Home") || this.has("Away");
        },
        getNextMatch: function () {
            var round = this.get("Round");

            var nextRound = round.getNextRound();
            if (nextRound === null) {
                return null;
            }

            var matchIndex = round.getMatchIndex(this);
            var nextMatchIndex = Math.floor(matchIndex / 2);

            var nextMatches = this.collection.where({ Round: nextRound });
            return nextMatches[nextMatchIndex];
        },
        getPrevMatch: function (homeOrAway) {
            var round = this.get("Round");

            var prevRound = round.getPrevRound();
            if (prevRound === null) {
                return null;
            }

            var matchIndex = round.getMatchIndex(this);
            var prevMatchIndex = matchIndex * 2;

            var prevMatches = this.collection.where({ Round: prevRound });
            if (homeOrAway === "Home") {
                return prevMatches[prevMatchIndex];
            } else {
                return prevMatches[prevMatchIndex + 1];
            }
        },
        prevHasParticipant: function (homeOrAway) {
            var prev = this.getPrevMatch(homeOrAway);
            if (prev === null) {
                return false;
            }

            if (prev.hasParticipant()) {
                return true;
            } else {
                return prev.prevHasParticipant(homeOrAway);
            }
        },
        isAvailable: function (homeOrAway) {
            return !this.prevHasParticipant(homeOrAway) && !this.nextHasParticipant();
        },
        nextHasParticipant: function () {
            var next = this.getNextMatch();
            if (next === null) {
                return false;
            }

            var round = this.get("Round");
            var matchIndex = round.getMatchIndex(this);
            var goToHomeOrAway = (matchIndex % 2 === 0) ? "Home" : "Away";
            if (next.has(goToHomeOrAway)) {
                return true;
            } else {
                return next.nextHasParticipant();
            }
        }
    });

    Match.status = status;

    return Match;
});
