define([
    'backbone',
    'helpers/utils',
    './group',
    './groups',
    './round',
    './rounds',
    './match',
    './matches',
    'relational'
], function (Backbone, Utils, Group, Groups, Round, Rounds, Match, Matches) {
    'use strict';

    return Backbone.RelationalModel.extend({
        idAttribute: "Id",
        defaults: {
            Order: 0,
            Title: "",
            Type: 0
        },
        relations: [{
            type: 'HasMany',
            key: 'Groups',
            relatedModel: Group,
            collectionType: Groups
        }, {
            type: 'HasMany',
            key: 'Rounds',
            relatedModel: Round,
            collectionType: Rounds,
            reverseRelation: {
                key: 'Stage'
            }
        }, {
            type: 'HasMany',
            key: 'Matches',
            relatedModel: Match,
            collectionType: Matches
        }],
        generateSingleEliminationStage: function (nbParticipants) {
            var nbRound = Math.ceil(Utils.mathLog(nbParticipants, 2));
            var perfectNumber = Math.pow(2, nbRound);

            var rounds = [];
            var matches = [];
            for (var i = 0; i < nbRound; i++) {
                var r = {
                    Id: Utils.generateGUID(),
                    Order: i,
                    Title: "Round " + i
                };
                rounds.push(r);

                perfectNumber = perfectNumber / 2;
                for (var c = 0; c < perfectNumber; c++) {
                    matches.push({
                        Id: Utils.generateGUID(),
                        Round: r
                    });
                }
            }

            this.get("Rounds").reset(rounds);
            this.get("Matches").reset(matches);
        },
        generateGroupStageRounds: function () {
            var nbRounds = this.get("Groups").getNumberOfRound();
            var rounds = [];
            for (var i = 0; i < nbRounds; i++) {
                var round = new Round({
                    Id: Utils.generateGUID(),
                    Title: "Round " + (i + 1),
                    Order: i
                });
                rounds.push(round);
            }
            this.get("Rounds").reset(rounds);
        },
        generateGroupStageMatches: function () {
            var matches = this.get("Matches");
            var rounds = this.get("Rounds");
            var numRounds = rounds.length;

            matches.reset();
            this.get("Groups").each(function (group) {
                var participants = group.get("Participants").clone();
                for (var round = 0; round < numRounds; round++) {
                    var num = (participants.length / 2);
                    for (var i = 0; i < num; i++) {
                        matches.add({
                            Id: Utils.generateGUID(),
                            Round: rounds.at(round),
                            Group: group,
                            Home: participants.at(i),
                            Away: participants.at(numRounds - i)
                        });
                    }

                    participants.add(participants.pop(), { at: 1 });
                }
            }, this);
        }
    });
});
