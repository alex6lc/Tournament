define([
    'jquery',
    'marionette',
    'generator/stages/editor/participant-label-view',
    'tournaments/stages/elimination/bracket-config',
    'hbs!generator/stages/editor/elimination/match-tmp'
], function ($, Marionette, ParticipantLabelView, conf, MatchTemplate) {
    'use strict';

    return Marionette.Layout.extend({
        className: 'team-bracket',
        tagName: 'table',

        template: MatchTemplate,

        regions: {
            home: ".js-home",
            away: ".js-away"
        },

        initialize: function (options) {
            this.bracketPos = options.bracketPos;
            this.participants = options.participants;
        },

        renderParticipant: function (region, prop) {
            var $region = this.$(region.el);
            if (!this.model.has(prop)) {
                if (this.model.isAvailable(prop)) {
                    $region.addClass('valid');
                } else {
                    $region.removeClass('valid');
                }
                return;
            } else {
                $region.removeClass('valid');
            }

            var view = new ParticipantLabelView({
                model: this.model.get(prop)
            });
            region.show(view);
        },

        renderParticipants: function () {
            this.renderParticipant(this.home, "Home");
            this.renderParticipant(this.away, "Away");
        },

        onRender: function () {
            this.renderParticipants();

            var round = this.model.get("Round");
            var roundIndex = round.collection.indexOf(round);
            var indexMatch = round.getMatchIndex(this.model);

            var value = this.bracketPos[roundIndex][indexMatch];
            this.$el.css('height', conf.heightMatch);
            this.$el.css('width', conf.widthMatch);
            this.$el.css('top', value);
        },
        bindParticipants: function () {
            var id = null, $p = null, home = null, away = null;

            $p = this.$(this.home.el).find(".participant-label");
            if ($p.length > 0) {
                id = $p.find("span").data("id");
                home = this.participants.get(id);
            }

            $p = this.$(this.away.el).find(".participant-label");
            if ($p.length > 0) {
                id = $p.find("span").data("id");
                away = this.participants.get(id);
            }

            this.model.set("Home", home, { silent: true });
            this.model.set("Away", away, { silent: true });
        }
    });
});