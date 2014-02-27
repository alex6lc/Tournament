define([
    'marionette',
    'handlebars',
    'generator/stages/editor/participant-label-view'
], function (Marionette, Handlebars, ParticipantLabelView) {
    return Marionette.CompositeView.extend({
        className: 'group-editor',
        template: Handlebars.compile('<div>{{Title}}<a href="#" class="js-delete">X</a></div><ul class="js-selectable"></ul>'),

        itemView: ParticipantLabelView,
        itemViewContainer: "ul",

        triggers: {
            "click .js-delete": "group:removed"
        },

        initialize: function () {
            this.collection = this.model.get("Participants");
        },

        bindParticipants: function (allParticipants) {
            var p = [];
            this.$("li").each(function () {
                var participantId = $(this).find("span").data("id");
                var model = allParticipants.get(participantId);
                p.push(model);
            });

            this.model.get("Participants").reset(p, { silent: true });
        }
    });
});