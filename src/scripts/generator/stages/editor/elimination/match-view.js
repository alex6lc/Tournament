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
            if (!this.model.has(prop)) {
                return;
            }

            var view = new ParticipantLabelView({
                model: this.model.get(prop)
            });
            region.show(view);
        },

        onRender: function () {
            this.renderParticipant(this.home, "Home");
            this.renderParticipant(this.away, "Away");

            var round = this.model.get("Round");
            var roundIndex = round.collection.indexOf(round);
            var indexMatches = round.getMatches().indexOf(this.model);

            var value = this.bracketPos[roundIndex][indexMatches];

            this.$el.css('height', conf.heightMatch);
            this.$el.css('width', conf.widthMatch);
            this.$el.css('top', value);

            this.$(".js-selectable").sortable({
                connectWith: ".js-selectable",
                placeholder: "test-class",
                receive: function (event, ui) {
                    var $list = $(this);
                    if ($list.children().length > 1) {
                        $(ui.sender).sortable('cancel');
                    }
                }
            });
        },
        bindParticipants: function () {
            var $li = this.$("li");

            var home = this.participants.get($li.eq(0).find("span").data("id"));
            var away = this.participants.get($li.eq(1).find("span").data("id"));

            this.model.set("Home", home, { silent: true });
            this.model.set("Away", away, { silent: true });
        }
    });
});