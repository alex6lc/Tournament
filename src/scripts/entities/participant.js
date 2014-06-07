define([
    'backbone',
    'relational'
], function (Backbone) {
    'use strict';

    return Backbone.RelationalModel.extend({
        idAttribute: "Id",
        defaults: {
            Name: ""
        }
    });
});
