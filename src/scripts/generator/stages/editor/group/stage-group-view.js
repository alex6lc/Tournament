define([
    'jqueryui',
    'underscore',
    'marionette',
    'helpers/utils',
    'generator/stages/editor/participants-label-view',
    'generator/stages/editor/group/groups-view',
    'hbs!generator/stages/editor/group/stage-group-tmp'
], function (ui, _, Marionette, Utils, ParticipantsLabelView, GroupsView, template) {
    'use strict';

    return Marionette.Layout.extend({
        template: template,

        regions: {
            participants: '.js-participants-list',
            groups: '.js-groups'
        },

        events: {
            'click .js-reset': 'reset',
            'click .js-auto-assign': 'autoAssign',
            'click .js-shuffle': ''
        },

        initialize: function (options) {
            this.tournament = options.tournament;

            if (this.model.get("Groups").length === 0) {
                this.model.get("Groups").addGroup();
            }
        },

        onRender: function () {
            this.participantsView = new ParticipantsLabelView({
                collection: this.getUnassignedParticipants()
            });

            this.groupsView = new GroupsView({
                collection: this.model.get("Groups")
            });

            this.participants.show(this.participantsView);
            this.groups.show(this.groupsView);

            this.listenTo(this.groupsView, "group:added", this.setUISortable, this);
            this.listenTo(this.groupsView, "group:removed", this.groupRemoved, this);

            this.setUISortable();
        },
        autoAssign: function (event) {
            event.preventDefault();
            event.stopPropagation();

            var col = null;
            var groups = this.model.get("Groups");
            var participants = this.tournament.get("Participants").clone();

            groups.each(function (group) {
                group.get("Participants").reset([], { silent: true });
            });

            var numGroups = groups.length;
            var groupSize = participants.length / numGroups;

            var pLength = participants.length;

            for (var j = 0; j < Math.ceil(groupSize / 2); j++) {
                for (var g = 0; g < numGroups; g++) {
                    var a = j * numGroups + g;

                    col = groups.at(g).get("Participants");
                    col.add(participants.at(a), { silent: true});
                    if (col.length < groupSize) {
                        col.add(participants.at(pLength - 1 - a), { silent: true});
                    }
                }
            }

            this.render();
        },
        reset: function (event) {
            event.preventDefault();
            event.stopPropagation();

            this.model.get("Groups").each(function (group) {
                group.get("Participants").reset([], { silent: true });
            });

            this.render();
        },

        getUnassignedParticipants: function () {
            var clone = this.tournament.get("Participants").clone();
            clone.removeAssignedParticipants(this.model);
            return clone;
        },

        setUISortable: function () {
            this.$(".js-selectable").sortable({
                connectWith: ".js-selectable"
            });
        },

        groupRemoved: function () {
            this.sanitizeView();
            this.render();
        },

        sanitizeView: function () {
            this.groupsView.bindParticipants(this.tournament.get("Participants"));

            var clone = this.getUnassignedParticipants();
            this.participantsView.collection.reset(clone.models, { silent: true });
        }
    });
});
