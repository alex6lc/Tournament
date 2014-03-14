define([
    'jqueryui',
    'underscore',
    'marionette',
    'helpers/utils',
    'generator/stages/editor/participants-label-view',
    'generator/stages/editor/elimination/bracket-view',
    'hbs!generator/stages/editor/elimination/stage-elimination-tmp'
], function (ui, _, Marionette, Utils, ParticipantsLabelView, BracketView, template) {
    'use strict';

    return Marionette.Layout.extend({
        template: template,

        regions: {
            participants: '.js-participants-list',
            rounds: '.js-rounds'
        },

        initialize: function (options) {
            this.tournament = options.tournament;

            if (this.model.isNew()) {
                var nbParticipants = this.tournament.get("Participants").length;
                this.model.generateSingleEliminationStage(nbParticipants);
            }
        },

        onRender: function () {
            this.participantsView = new ParticipantsLabelView({
                collection: this.getUnassignedParticipants()
            });

            this.bracketView = new BracketView({
                participants: this.tournament.get("Participants").clone(),
                collection: this.model.get("Rounds")
            });

            this.rounds.show(this.bracketView);
            this.participants.show(this.participantsView);

            this.setUISortable();
        },

        getUnassignedParticipants: function () {
            var clone = this.tournament.get("Participants").clone();
            var list = [];
            this.model.get("Matches").each(function (m) {
                list.push(m.get("Home"));
                list.push(m.get("Away"));
            });
            clone.remove(_.compact(list));
            return clone;
        },

        setUISortable: function () {
            this.participants.$el.find(".js-selectable").sortable({
                connectWith: ".js-selectable",
                placeholder: "test-class"
            });
        },

        sanitizeView: function () {
            this.bracketView.bindParticipants();
            var clone = this.getUnassignedParticipants();
            this.participantsView.collection.reset(clone.models, { silent: true });
        }
    });
});
