define([
    'backbone',
    './tournament',
    'localstorage'
], function (Backbone, Tournament) {
    'use strict';

    return Backbone.Collection.extend({
        localStorage: new Backbone.LocalStorage("tournaments"),
        model: Tournament
    });
});
