define([
    'jquery',
    'underscore'
], function ($, _) {
    'use strict';

    return {
        number2string: function (n, isCaps) {
            return String.fromCharCode((isCaps ? 65 : 97) + (n - 1));
        },
        serializeObject: function (el)
        {
            var o = {};
            var a = $(el).serializeArray();
            $.each(a, function () {
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        },
        generateGUID: function () {
            function S4() {
                return (((1 + Math.random()) * 0x10000)|0).toString(16).substring(1);
            }

            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        },
        mapPropertyToArray: function (data) {
            //TODO Fix me
            var handle = function (array, values) {
                for (var i = 0; i < values.length; i++) {
                    if (!array[i]) {
                        array.push({});
                    }
                    array[i][prop] = values[i];
                }
            };

            var array = [];
            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    var values = data[prop];
                    if (!_.isArray(values)) {
                        values = [values];
                    }

                    handle(array, values);
                }
            }

            return array;
        },
        mathLog: function (n, base) {
            return Math.log(n) / (base ? Math.log(base) : 1);
        }
    };
});
