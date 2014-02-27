define(['backbone'], function (Backbone) {
    return function (url) {
        return Backbone.history.navigate(url, true);
    };
});
