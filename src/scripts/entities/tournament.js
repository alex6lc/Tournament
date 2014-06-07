define([
    'backbone',
    './participant',
    './participants',
    './stage',
    './stages',
    'relational'
], function (Backbone, Participant, Participants, Stage, Stages) {
    'use strict';

    return Backbone.RelationalModel.extend({
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
            Stages: null
        }
    });
});
