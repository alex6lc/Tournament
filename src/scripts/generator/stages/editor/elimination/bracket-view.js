define([
    'marionette',
    'iscroll',
    'tournaments/stages/elimination/bracket-config',
    'generator/stages/editor/elimination/round-view',
    'hbs!generator/stages/editor/elimination/bracket-tmp'
], function (Marionette, IScroll, Config, RoundView, Template) {
    'use strict';

    return  Marionette.CompositeView.extend({
        className: 'clearfix bracket',
        template: Template,
        itemViewContainer: '.viewport-content',
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

        renderParticipants: function () {
            this.children.each(function (view) {
                view.renderParticipants();
            });
        },

        onRender: function () {
            var maxMatches = this.collection.first().getMatches().length;
            var totalHeight = maxMatches * (Config.heightMatch + Config.spacerHori) + Config.height + Config.spacerHori;
            var w = this.collection.length * (Config.widthMatch + Config.spacerVerc) - Config.spacerVerc;

            this.$(".viewport").width(w);
            this.$(".viewport").height(totalHeight);
        },

        onDomRefresh: function () {
            this.myScroll = new IScroll(this.$el[0], {
                zoom: true,
                zoomMax: 1,
                zoomMin: 0.5,
                scrollX: true,
                scrollY: true,
                mouseWheel: true,
                wheelAction: 'zoom'
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