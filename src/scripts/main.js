require.config({
    shim: {
        'handlebars': {
            exports: 'Handlebars'
        },
        'iscroll': {
            exports: 'window.IScroll'
        }
    },
    paths: {
        'jquery': '../3rd/jquery/dist/jquery',
        'jqueryui': '../3rd/jquery-ui/jquery-ui',
        'underscore': '../3rd/underscore/underscore',
        'backbone': '../3rd/backbone/backbone',
        'marionette': '../3rd/marionette/lib/core/backbone.marionette',
        'backbone.wreqr': '../3rd/backbone.wreqr/lib/backbone.wreqr',
        'backbone.babysitter': '../3rd/backbone.babysitter/lib/backbone.babysitter',
        'hbs': '../3rd/hbs/hbs',
        'handlebars': '../3rd/handlebars/handlebars',
        'localstorage': '../3rd/backbone.localStorage/backbone.localStorage',
        'relational': '../3rd/backbone-relational/backbone-relational',
        'iscroll': '../3rd/iscroll/build/iscroll-zoom'
    },
    hbs: {
        disableI18n: true,
        templateExtension: 'html'
    }
});

require(['app-init']);