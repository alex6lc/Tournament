define([
    'backbone',
    './match'
], function (Backbone, Match) {
    'use strict';

    return Backbone.Collection.extend({
        model: Match
    });
});
