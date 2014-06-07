define([
    'underscore',
    'backbone',
    './participant'
], function (_, Backbone, Participant) {
    'use strict';

    return Backbone.Collection.extend({
        model: Participant,
        removeAssignedParticipants: function (stage, options) {
            var self = this;
            _.each(stage.get("Groups").getParticipants(), function (p) {
                self.remove(p, options);
            });
            return this;
        }
    });
});
