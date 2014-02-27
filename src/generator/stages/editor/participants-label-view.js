define([
    'marionette',
    'generator/stages/editor/participant-label-view'
], function (Marionette, ParticipantLabelView) {
    return Marionette.CollectionView.extend({
        itemView: ParticipantLabelView,
        tagName: 'ul',
        className: 'participant-label-list js-selectable'
    });
});