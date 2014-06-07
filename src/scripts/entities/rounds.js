define([
    'backbone',
    './round'
], function (Backbone, Round) {
    'use strict';

    return Backbone.Collection.extend({
        model: Round
    });
});
