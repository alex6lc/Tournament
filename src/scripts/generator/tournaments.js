define([
    'underscore',
    'backbone',
    'helpers/utils',
    'relational',
    'localstorage'
], function (_, Backbone, Utils) {
    'use strict';

    var Participant = Backbone.RelationalModel.extend({
        idAttribute: "Id",
        defaults: {
            Name: ""
        }
    });

    var Participants = Backbone.Collection.extend({
        model: Participant,
        removeAssignedParticipants: function (stage, options) {
            var self = this;
            _.each(stage.get("Groups").getParticipants(), function (p) {
                self.remove(p, options);
            });
            return this;
        }
    });

    var Round = Backbone.RelationalModel.extend({
        idAttribute: "Id",
        defaults: {
            BestOf: 1
        },
        getMatches: function () {
            var m = this.get("Stage").get("Matches").clone().where({ Round: this });
            return new Matches(m);
        }
    });
    var Rounds = Backbone.Collection.extend({
        model: Round
    });

    var Group = Backbone.RelationalModel.extend({
        idAttribute: "Id",
        relations: [{
            type: 'HasMany',
            key: 'Participants',
            relatedModel: Participant,
            collectionType: Participants,
            includeInJSON: "Id"
        }]
    });

    var Groups = Backbone.Collection.extend({
        model: Group,
        addGroup: function () {
            var count = this.length;

            this.add({
                Id: Utils.generateGUID(),
                Order: count,
                Title: "Group " + Utils.number2string(count + 1, true)
            });
        },
        getParticipants: function () {
            var p = [];
            this.each(function (group) {
                group.get("Participants").each(function (participant) {
                    p.push(participant);
                });
            });

            return p;
        },
        getNumberOfRound: function () {
            var nbPerGroup = this._getMaxNbParticipants();
            var isEven = nbPerGroup % 2 === 0;
            var nbMatches = this._getNumberOfMatches(nbPerGroup);

            var numberOfRound;
            if (isEven) {
                numberOfRound = nbMatches / (nbPerGroup / 2);
            } else {
                numberOfRound = nbMatches / ((nbPerGroup - 1) / 2);
            }

            return numberOfRound;
        },
        _getMaxNbParticipants: function () {
            var maxGroup = this.max(function (group) {
                return group.get("Participants").length;
            });
            return maxGroup.get("Participants").length;
        },
        _getNumberPerGroup: function (nbParticipants, numberOfGroup) {
            return Math.ceil(nbParticipants / numberOfGroup);
        },
        _getNumberOfMatches: function (nbPerGroup) {
            return nbPerGroup / 2 * (nbPerGroup - 1);
        }
    });

    var Match = Backbone.RelationalModel.extend({
        idAttribute: "Id",
        relations: [{
            type: 'HasOne',
            key: 'Round',
            relatedModel: Round,
            includeInJSON: "Id"
        }, {
            type: 'HasOne',
            key: 'Group',
            relatedModel: Group,
            includeInJSON: "Id"
        }, {
            type: 'HasOne',
            key: 'Home',
            relatedModel: Participant,
            includeInJSON: "Id"
        }, {
            type: 'HasOne',
            key: 'Away',
            relatedModel: Participant,
            includeInJSON: "Id"
        }]
    });

    var Matches = Backbone.Collection.extend({
        model: Match
    });

    var Stage = Backbone.RelationalModel.extend({
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

    var Stages = Backbone.Collection.extend({
        model: Stage
    });

    var Tournament = Backbone.RelationalModel.extend({
        idAttribute: "Id",
        relations: [
            {
                type: 'HasMany',
                key: 'Participants',
                relatedModel: Participant,
                collectionType: Participants
            },
            {
                type: 'HasMany',
                key: 'Stages',
                relatedModel: Stage,
                collectionType: Stages
            }
        ],
        defaults: {
            Title: "",
            Location: "",
            Description: "",
            Sponsors: "",
            Date: "",
            Participants: null,
            Stages: null
        }
    });

    var Tournaments = Backbone.Collection.extend({
        localStorage: new Backbone.LocalStorage("tournaments"),
        model: Tournament
    });

    return Tournaments;
});