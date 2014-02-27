require.config({
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'marionette': {
            deps: ['underscore', 'backbone', 'jquery'],
            exports: 'Marionette'
        },
        'handlebars': {
            exports: 'Handlebars'
        },
        'relational': {
            deps: ['underscore', 'backbone', 'jquery'],
            exports: 'Backbone.Relational'
        },
        'json2': {
            exports: 'JSON'
        }
    },
    paths: {
        jquery: '3rd/jquery/jquery',
        jqueryui: '3rd/jquery-ui/ui/jquery-ui',
        underscore: '3rd/underscore/underscore',
        backbone: '3rd/backbone/backbone',
        marionette: '3rd/marionette/lib/backbone.marionette',
        hbs: '3rd/hbs/hbs',
        handlebars: '3rd/handlebars/handlebars',
        json2: '3rd/hbs/hbs/json2',
        i18nprecompile: '3rd/hbs/hbs/i18nprecompile',
        localstorage: '3rd/backbone.localStorage/backbone.localStorage',
        relational: '3rd/backbone-relational/backbone-relational'
    },
    hbs: {
        disableI18n: true,
        templateExtension: 'html'
    }
});

require(['app'], function (app) {
    app.start();
});