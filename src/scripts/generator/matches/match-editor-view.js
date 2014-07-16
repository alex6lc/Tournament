define([
    'backbone',
    'marionette',
    'entities/match',
    'helpers/utils',
    'helpers/navigator',
    'hbs!generator/matches/match-editor-tmp'
], function (Backbone, Marionette, Match, Utils, Navigator, Template) {
    'use strict';

    return Marionette.ItemView.extend({
        template: Template,
        ui: {
            homeStatus: "input[name='HomeStatus']",
            awayStatus: "input[name='AwayStatus']"
        },
        events: {
            'change @ui.homeStatus': 'onChangeHome',
            'change @ui.awayStatus': 'onChangeAway',
            'submit form': 'saveForm'
        },

        initialize: function (options) {
            this.tournament = options.tournament;
        },

        onChangeHome: function () {
            var homeVal = this.ui.homeStatus.filter(":checked").val();
            var val = this.extractStatusValue(homeVal);

            this.ui.awayStatus.filter("[value=" + val + "]").prop("checked", true);
        },
        onChangeAway: function () {
            var awayVal = this.ui.awayStatus.filter(":checked").val();
            var val = this.extractStatusValue(awayVal);

            this.ui.homeStatus.filter("[value=" + val + "]").prop("checked", true);
        },
        saveForm: function (event) {
            event.preventDefault();
            event.stopPropagation();

            var data = Utils.serializeObject(event.target);

            this.model.set({
                HomeScore: data.HomeScore,
                HomeStatus: this.statusToEnum(data.HomeStatus),
                AwayScore: data.AwayScore,
                AwayStatus: this.statusToEnum(data.AwayStatus)
            });

            this.tournament.save().done(function () {
                Backbone.history.history.back();
            });
        },
        statusToEnum: function (val) {
            var enumStatus = -1;
            if (val === "win") {
                enumStatus = Match.status.WIN;
            } else if (val === "loss") {
                enumStatus = Match.status.LOSS;
            } else if (val === "draw") {
                enumStatus = Match.status.DRAW;
            }
            return enumStatus;
        },
        extractStatusValue: function (val) {
            var newVal = "";
            if (val === "win") {
                newVal = "loss";
            } else if (val === "loss") {
                newVal = "win";
            } else if (val === "draw") {
                newVal = "draw";
            }
            return newVal;
        },
        serializeData: function () {
            var homeStatus = this.model.get("HomeStatus");
            var awayStatus = this.model.get("AwayStatus");

            return {
                HomeName: this.model.get("Home").get("Name"),
                HomeScore: this.model.get("HomeScore"),
                HasHomeWin: homeStatus === Match.status.WIN,
                HasHomeLoss: homeStatus === Match.status.LOSS,
                HasHomeDraw: homeStatus === Match.status.DRAW,
                AwayName: this.model.get("Away").get("Name"),
                AwayScore: this.model.get("AwayScore"),
                HasAwayWin: awayStatus === Match.status.WIN,
                HasAwayLoss: awayStatus === Match.status.LOSS,
                HasAwayDraw: awayStatus === Match.status.DRAW
            };
        }
    });
});