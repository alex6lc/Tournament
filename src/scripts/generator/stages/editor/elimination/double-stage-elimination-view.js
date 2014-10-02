define([
    'generator/stages/editor/elimination/stage-elimination-view',
    'generator/stages/editor/participants-label-view',
    'generator/stages/editor/elimination/double-bracket-view'
], function (SingleEliminationView, ParticipantsLabelView, DoubleBracketView) {
    'use strict';

    return SingleEliminationView.extend({

        onShow: function () {
            this.participantsView = new ParticipantsLabelView({
                collection: this.getUnassignedParticipants()
            });

            this.bracketView = new DoubleBracketView({
                participants: this.tournament.get("Participants").clone(),
                collection: this.model.get("Rounds")
            });

            this.rounds.show(this.bracketView);
            this.participants.show(this.participantsView);

            this.setUISortable();
        }
    });
});
