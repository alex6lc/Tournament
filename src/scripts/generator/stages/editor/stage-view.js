define([
    'underscore',
    'backbone',
    'marionette',
    'helpers/utils',
    'helpers/navigator',
    'generator/stages/editor/group/stage-group-view',
    'generator/stages/editor/elimination/stage-elimination-view',
    'hbs!generator/stages/editor/stage-tmp'
], function (_, Backbone, Marionette, Utils, Navigator, StageGroupView, StageEliminationView, template) {
    'use strict';

    return Marionette.Layout.extend({
        template: template,
        events: {
            'submit form': 'saveForm',
            'change .js-stage-type': 'changeType'
        },
        regions: {
            participants: '.js-participants',
            stage: '.js-stage'
        },

        initialize: function (options) {
            this.tournament = options.tournament;

            if (!options.model) {
                var stages = this.tournament.get("Stages");
                this.model = new stages.model();
            }
        },

        serializeData: function () {
            var data = Marionette.Layout.prototype.serializeData.apply(this);
            data.isGroup = this.model.get("Type") === 0;
            data.isElimination = this.model.get("Type") === 1;
            return data;
        },

        onShow: function () {
            var type = this.model.get("Type");
            this.stage.show(this.getStageTypeView(type));
        },

        getStageTypeView: function (type) {
            var View = null;
            if (type === 0) {
                View = StageGroupView;
            } else {
                View = StageEliminationView;
            }

            return new View({
                tournament: this.tournament,
                model: this.model
            });
        },
        changeType: function () {
            var type = parseInt(this.$(".js-stage-type").val(), 10);

            this.model.get("Matches").reset([], { silent: true });
            this.model.get("Groups").reset([], { silent: true });
            this.model.get("Rounds").reset([], { silent: true });
            this.model.set("Type", type);

            this.stage.show(this.getStageTypeView(type));
        },

        saveForm: function (event) {
            var self = this;

            event.preventDefault();
            event.stopPropagation();

            var stages = this.tournament.get("Stages");
            var stage = this.model;

            var data = Utils.serializeObject(event.target);
            data.Type = parseInt(data.Type, 10);
            stage.set(data);

            if (stage.isNew()) {
                stage.set({
                    Id: Utils.generateGUID()
                });
            }

            var stageView = this.stage.currentView;
            stageView.sanitizeView();

            if (data.Type === 0) {
                stage.generateGroupStageRounds();
                stage.generateGroupStageMatches();
            } else if (data.Type === 1) {
                // Do nothing
            } else {
                console.error("Unsupported stage type");
            }

            stages.add(stage);

            this.tournament.save().done(function () {
                Navigator("/generator/" + self.tournament.id + "/stages/" + stage.id + "/rounds");
            });
        }
    });
});
