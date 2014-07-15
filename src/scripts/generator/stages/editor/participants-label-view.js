define([
    'marionette',
    'generator/stages/editor/participant-label-view'
], function (Marionette, ParticipantLabelView) {
    'use strict';

    return Marionette.CollectionView.extend({
        childView: ParticipantLabelView,
        tagName: 'ul',
        className: 'participant-label-list js-selectable'
    });
});