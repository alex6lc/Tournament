define([
    'backbone',
    './tournament',
    'localstorage',
    'backfire'
], function (Backbone, Tournament) {
    'use strict';

    return Backbone.Collection.extend({
        //localStorage: new Backbone.LocalStorage("tournaments"),

        firebase: new Backbone.Firebase("https://tournament-data.firebaseio.com"),
        model: Tournament
    });
});
