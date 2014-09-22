define([
    'underscore',
    'marionette',
    'helpers/utils',
    'hbs!generator/participants/participant-item-tmp',
    'hbs!generator/participants/participant-editor-tmp'
], function (_, Marionette, Utils, ReadTemplate, EditorTemplate) {
    'use strict';

    var RenderingMode = {
        Read: 10,
        Editor: 20
    };

    return Marionette.ItemView.extend({
        tagName: "tr",

        triggers: {
            "click .js-delete": "deleteParticipant"
        },

        events: {
            "click .js-edit": "changeModeToEditorMode",
            "click .js-save": "saveParticipant"
        },

        getTemplate: function () {
            if (this.currentRenderingMode === RenderingMode.Editor) {
                return EditorTemplate;
            } else {
                return ReadTemplate;
            }
        },

        initialize: function () {
            if (this.model.isNew()) {
                this.currentRenderingMode = RenderingMode.Editor;
            } else {
                this.currentRenderingMode = RenderingMode.Read;
            }
        },

        changeToReadMode: function () {
            this.currentRenderingMode = RenderingMode.Read;
            this.render();
        },

        saveParticipant: function (event) {
            event.preventDefault();
            event.stopPropagation();

            this.model.set({
                Name: this.$("[name=Name]").val()
            });

            if (this.model.isNew()) {
                this.trigger("addParticipant");
            } else {
                this.changeToReadMode();
            }
        },

        changeModeToEditorMode: function (event) {
            event.preventDefault();
            event.stopPropagation();

            this.currentRenderingMode = RenderingMode.Editor;
            this.render();
        }
    });
});