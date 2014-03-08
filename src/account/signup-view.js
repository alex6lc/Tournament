define([
    'jquery',
    'backbone',
    'marionette',
    'helpers/utils',
    'hbs!account/signup-tmp'
], function ($, Backbone, Marionette, Utils, template) {
    'use strict';

    var View = Marionette.ItemView.extend({
        template: template,
        events: {
            'submit form': 'formSubmit'
        },

        formSubmit: function (event) {
            var self = this;

            event.preventDefault();
            event.stopPropagation();

            var data = Utils.serializeObject(event.target);

            $.post('/signup', data).done(function (res) {
                alert(res.status);
                alert(res.msg);
            });

            /*
            this.model.save(data).done(function(){
                Navigator("/Generator/" + self.model.id + "/Participants");
            });*/
        }
    });

    return View;
});
