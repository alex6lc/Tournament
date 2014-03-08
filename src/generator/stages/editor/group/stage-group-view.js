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

            var groups = this.model.get("Groups");
            var index = 0;
            var col = null;
            var participants = this.tournament.get("Participants").clone();

            groups.each(function (group) {
                group.get("Participants").reset([], { silent: true });
            });

            for (var i = 0; i < participants.length; i++) {
                index = Math.floor(i * groups.length / participants.length);
                col = groups.models[index].get("Participants");
                col.add(participants.at(i), { silent: true});
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
