define([
    'marionette',
    'tournaments/stages/groups/group-view'
], function (Marionette, Group) {
    'use strict';

    return Marionette.CollectionView.extend({
        childView: Group,
        childViewOptions: function () {
            return {
                stage: this.model,
                tournament: this.tournament
            };
        },
        initialize: function (options) {
            this.tournament = options.tournament;
            this.collection = this.model.get("Groups");
        }
    });
});