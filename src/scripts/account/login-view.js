define([
    'jquery',
    'backbone',
    'marionette',
    'helpers/utils',
    'hbs!account/login-tmp'
], function ($, Backbone, Marionette, Utils, template) {
    'use strict';

    var View = Marionette.ItemView.extend({
        template: template,
        events: {
            'submit form': 'login'
        },

        login: function (event) {
            var self = this;

            event.preventDefault();
            event.stopPropagation();

            var data = Utils.serializeObject(event.target);

            $.post('/login', data).done(function (res) {
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
