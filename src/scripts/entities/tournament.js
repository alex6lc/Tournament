define([
    'backbone',
    './participant',
    './participants',
    './stage',
    './stages',
    'relational'
], function (Backbone, Participant, Participants, Stage, Stages) {
    'use strict';

    var statuses = {
        INITIALIZED: 0,
        STARTED: 10,
        PAUSED: 20
    };

    var tournament = Backbone.RelationalModel.extend({
        idAttribute: "Id",
        relations: [
            {
                type: 'HasMany',
                key: 'Participants',
                relatedModel: Participant,
                collectionType: Participants
            },
            {
                type: 'HasMany',
                key: 'Stages',
                relatedModel: Stage,
                collectionType: Stages
            }
        ],
        defaults: {
            Title: "",
            Location: "",
            Description: "",
            Sponsors: "",
            Date: "",
            Participants: null,
            Stages: null,
            Status: statuses.INITIALIZED
        },

        start: function () {
            this.set("Status", statuses.STARTED);
            this.save();
        }
    });

    tournament.statuses = statuses;

    return tournament;
});
