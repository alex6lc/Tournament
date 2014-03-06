define([
    'backbone',
    'marionette',
    'helpers/utils',
    'helpers/navigator',
    'hbs!generator/tournament-tmp'
], function (Backbone, Marionette, Utils, Navigator, template) {

    var View = Marionette.ItemView.extend({
        template: template,
        events: {
            'submit form': 'saveTournament'
        },

        saveTournament: function (event) {
            var self = this;

            event.preventDefault();
            event.stopPropagation();

            var data = Utils.serializeObject(event.target);
            this.model.save(data).done(function(){
                Navigator("/generator/" + self.model.id + "/participants");
            });
        }
    });

    return View;
});
