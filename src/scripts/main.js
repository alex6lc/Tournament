require.config({
    shim: {
        'handlebars': {
            exports: 'Handlebars'
        },
        'jqueryui': {
            deps: ['jquery']
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        'relational': {
            deps: ['backbone']
        }
    },
    paths: {
        'jquery': '../3rd/jquery/dist/jquery',
        'jqueryui': '../3rd/jquery-ui/ui/jquery-ui',
        'underscore': '../3rd/underscore/underscore',
        'backbone': '../3rd/backbone/backbone',
        'marionette': '../3rd/marionette/lib/core/amd/backbone.marionette',
        'backbone.wreqr': '../3rd/backbone.wreqr/lib/amd/backbone.wreqr',
        'backbone.babysitter': '../3rd/backbone.babysitter/lib/amd/backbone.babysitter',
        'hbs': '../3rd/hbs/hbs',
        'handlebars': '../3rd/handlebars/handlebars',
        'localstorage': '../3rd/backbone.localStorage/backbone.localStorage',
        'relational': '../3rd/backbone-relational/backbone-relational'
    },
    hbs: {
        disableI18n: true,
        templateExtension: 'html'
    }
});

require(['app-init']);