define([
    'marionette',
    'handlebars',
    'helpers/utils',
    'tournaments/stages/elimination/bracket-config',
    'generator/stages/editor/elimination/round-view'
], function (Marionette, Handlebars, Utils, Config, RoundView) {
    'use strict';

    return  Marionette.CollectionView.extend({
        className: 'clearfix bracket',
        itemView: RoundView,
        itemViewOptions: function () {
            return {
                bracketPos: this.bracketPos,
                participants: this.participants
            };
        },

        initialize: function (options) {
            this.participants = options.participants;
            this.bracketPos = this.calculateBracketPos();
        },

        bindParticipants: function () {
            this.children.each(function (view) {
                view.bindParticipants();
            });
        },

        calculateBracketPos: function () {
            var pos = [];
            this.collection.each(function (round, rIndex) {
                var newPos = [];
                round.getMatches().each(function (match, mIndex) {
                    if (rIndex === 0) {
                        newPos.push(mIndex * (Config.heightMatch + Config.spacerHori) + Config.height + Config.spacerHori);
                    } else {
                        var rPos = pos[rIndex - 1];
                        newPos.push(Math.floor((rPos[mIndex * 2] + rPos[(mIndex * 2) + 1]) / 2));
                    }
                });
                pos.push(newPos);
            });

            return pos;
        }
    });
});