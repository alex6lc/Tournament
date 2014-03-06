define([
    'underscore',
    'backbone',
    'marionette',
    'helpers/utils',
    'helpers/navigator',
    'hbs!generator/participants-tmp'
], function (_, Backbone, Marionette, Utils, Navigator, template) {

    var View = Marionette.ItemView.extend({
        template: template,
        events: {
            'submit form': 'saveForm'
        },

        serializeData: function () {
            var participants = this.model.get("Participants");
            if (participants) {
                var names = "";
                participants.each(function (p, index) {
                    names += p.get("Name")

                    var isLast = index === participants.length - 1;
                    if (!isLast) {
                        names += "\r\n";
                    }
                });

                return {
                    Names: names
                };
            }
            return { };
        },

        saveForm: function (event) {
            var self = this;

            event.preventDefault();
            event.stopPropagation();

            var data = Utils.serializeObject(event.target);
            var names = data.Names.split(/\r\n|\r|\n/g);
            var newData = _.map(names, function (name) {
                return {
                    Id: Utils.generateGUID(),
                    Name: name
                };
            });

            var worstCheckEver = this.model.get("Participants").length === newData.length;
            if(worstCheckEver) {
                Navigator("/generator/" + self.model.id + "/stages");
                return;
            }

            this.model.get("Participants").reset(newData);

            this.model.save().done(function(){
                Navigator("/generator/" + self.model.id + "/stages");
            });
        }
    });

    return View;
});
