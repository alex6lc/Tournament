define([
    'underscore',
    'marionette',
    'moment',
    'contexts/login-context',
    'helpers/utils',
    'helpers/navigator',
    'hbs!participants/next-match-tmp'
], function (_, Marionette, Moment, LoginContext, Utils, Navigator, Template) {
    'use strict';

    return Marionette.ItemView.extend({
        template: Template,

        ui: {
            timeLeft: ".js-time-left"
        },

        initialize: function () {
            var us = LoginContext.getCurrentParticipantId();
            this.otherParticipant = this.getOpponent(us);
        },

        serializeData: function () {
            var diff = this.getFormattedTimeDifference();
            return {
                ParticipantName: this.otherParticipant.get("Name"),
                Location: "",
                TimeLeft: diff
            };
        },

        onShow: function () {
            this.timer = setInterval(_.bind(this.updateTimeLeft, this), 1000);
        },

        getFormattedTimeDifference: function () {
            var matchScheduleAt = this.model.get("ScheduleAt");
            var milliseconds = Moment.utc().diff(matchScheduleAt);

            var duration = Moment.duration(milliseconds);
            // todo localize that
            return duration.hours() + ":" + duration.minutes() + ":" + duration.seconds();
        },

        updateTimeLeft: function () {
            var diff = this.getFormattedTimeDifference();
            this.ui.timeLeft.text(diff);
        },

        getOpponent: function (us) {
            var them = null;
            if (this.model.get('Home').id === us) {
                them = this.model.get('Away');
            } else if (this.model.get('Away').id === us) {
                them = this.model.get('Home');
            } else {
                // something went terribly wrong !
            }
            return them;
        },

        clearTimer: function () {
            clearInterval(this.timer);
            this.timer = undefined;
        },

        onClose: function () {
            this.clearTimer();
        }
    });
});
