define(['backbone'], function (Backbone) {
    'use strict';

    return function (url) {
        return Backbone.history.navigate(url, true);
    };
});
