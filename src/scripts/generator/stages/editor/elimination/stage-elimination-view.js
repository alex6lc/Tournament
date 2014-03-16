define([
    'jquery',
    'jqueryui',
    'underscore',
    'marionette',
    'helpers/utils',
    'generator/stages/editor/participants-label-view',
    'generator/stages/editor/elimination/bracket-view',
    'hbs!generator/stages/editor/elimination/stage-elimination-tmp'
], function ($, ui, _, Marionette, Utils, ParticipantsLabelView, BracketView, template) {
    'use strict';

    return Marionette.Layout.extend({
        template: template,

        regions: {
            participants: '.js-participants-list',
            rounds: '.js-rounds'
        },

        events: {
            'click .js-reset': 'reset',
            'click .js-auto-assign': 'autoAssign'
        },


        initialize: function (options) {
            this.tournament = options.tournament;

            if (this.model.isNew() || this.model.hasChanged('type')) {
                var nbParticipants = this.tournament.get("Participants").length;
                this.model.generateSingleEliminationStage(nbParticipants);
            }
        },

        reset: function (event) {
            event.preventDefault();
            event.stopPropagation();

            this.model.get("Matches").each(function (match) {
                match.set({
                    Home: null,
                    Away: null
                }, { silent: true });
            });

            this.render();
        },

        autoAssign: function (event) {
            event.preventDefault();
            event.stopPropagation();

            this.model.get("Matches").each(function (match) {
                match.set({
                    Home: null,
                    Away: null
                }, { silent: true });
            });

            this.render();
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
            var self = this;

            this.participantsView.$el.sortable({
                connectWith: ".js-selectable",
                placeholder: "test-class",
                receive: function () {
                    self.sanitizeView();
                    self.bracketView.renderParticipants();
                }
            });

            this.bracketView.$(".js-selectable").sortable({
                connectWith: ".js-selectable",
                placeholder: "test-class",
                receive: function (event, ui) {
                    var $list = $(this);
                    if (!$list.hasClass("valid")) {
                        $(ui.sender).sortable('cancel');
                    } else {
                        self.sanitizeView();
                        self.bracketView.renderParticipants();
                    }
                }
            });
        },

        sanitizeView: function () {
            this.bracketView.bindParticipants();
            var clone = this.getUnassignedParticipants();
            this.participantsView.collection.reset(clone.models, { silent: true });
        }
    });
});
