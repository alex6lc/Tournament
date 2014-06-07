define([
    'backbone',
    './stage'
], function (Backbone, Stage) {
    'use strict';

    return Backbone.Collection.extend({
        model: Stage
    });
});
