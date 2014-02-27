define([
    'marionette',
    'handlebars'
], function (Marionette, Handlebars) {
    return Marionette.ItemView.extend({
        tagName: 'li',
        className: 'participant-label',
        template: Handlebars.compile('<span data-id="{{Id}}">{{Name}}</span>')
    });
});