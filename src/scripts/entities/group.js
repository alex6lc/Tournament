define([
    'backbone',
    './participant',
    './participants',
    'relational'
], function (Backbone, Participant, Participants) {
    'use strict';

    return Backbone.RelationalModel.extend({
        idAttribute: "Id",
        relations: [{
            type: 'HasMany',
            key: 'Participants',
            relatedModel: Participant,
            collectionType: Participants,
            includeInJSON: "Id"
        }]
    });
});
