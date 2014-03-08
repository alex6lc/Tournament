define([
    'marionette',
    'generator/stages/editor/elimination/match-view',
    'tournaments/stages/elimination/bracket-config',
    'hbs!generator/stages/editor/elimination/round-tmp'
], function (Marionette, MatchView, Config, RoundTemplate) {
    'use strict';

    return Marionette.CompositeView.extend({
        template: RoundTemplate,

        itemView: MatchView,
        itemViewContainer: ".js-matches",
        itemViewOptions: function () {
            return {
                bracketPos: this.bracketPos,
                participants: this.participants
            };
        },

        ui: {
            round: '.js-round-bracket',
            header: '.js-round-header',
            canvas: 'canvas'
        },

        initialize: function (options) {
            this.bracketPos = options.bracketPos;
            this.participants = options.participants;
            this.collection = this.model.getMatches();
        },

        bindParticipants: function () {
            this.children.each(function (view) {
                view.bindParticipants();
            });
        },

        onRender: function () {
            var maxMatches = this.model.collection.first().getMatches().length;
            var totalHeight = maxMatches * (Config.heightMatch + Config.spacerHori) + Config.height + Config.spacerHori;

            this.ui.round.css('height', totalHeight);
            this.ui.round.css('width', Config.widthMatch);

            this.ui.header.css('width', Config.widthMatch);
            this.ui.header.css('height', Config.height);

            if (this.model === this.model.collection.last()) {
                this.ui.canvas.remove();
                return;
            }

            var canvas = this.ui.canvas[0];
            canvas.width = Config.spacerVerc;
            canvas.height = totalHeight;

            if (canvas.getContext) {
                var context = canvas.getContext('2d');
                this._drawBracket(context);
            }
        },
        _drawBracket: function (context) {
            context.strokeStyle = Config.strokeStyle;
            context.fillStyle = Config.fillStyle;
            context.lineWidth = Config.lineWidth;

            var line = Config.lineWidth % 2 ? 0.5 : 0;
            var halfMatchHeight = Math.floor(Config.heightMatch / 2) + line;
            var halfSpacer = Math.floor(Config.spacerVerc / 2) + line;

            var roundIndex = this.model.collection.indexOf(this.model);
            var pos = this.bracketPos[roundIndex];

            for (var p = 0; p <= pos.length; p = p + 2) {
                context.beginPath();
                context.moveTo(0, pos[p] + halfMatchHeight);
                context.lineTo(halfSpacer, pos[p] + halfMatchHeight);
                context.lineTo(halfSpacer, pos[p + 1] + halfMatchHeight);
                context.lineTo(0, pos[p + 1] + halfMatchHeight);
                context.stroke();

                context.beginPath();
                context.moveTo(halfSpacer, Math.floor((pos[p] + pos[p + 1]) / 2) + halfMatchHeight);
                context.lineTo(Config.spacerVerc, Math.floor((pos[p] + pos[p + 1]) / 2) + halfMatchHeight);
                context.stroke();
            }
        }
    });
});