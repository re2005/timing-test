'use strict';

var total = [],
    dataCompare = [],
    _public = {

    init: function init(opt) {

        _.extend(dataCompare, opt);

        // Total requests
        var amount = 50;

        _.each(dataCompare, function (index, el) {
            for (var i = 0; i < amount; i++) {
                _public.testPromise({
                    el: index,
                    lenght: dataCompare.length,
                    amount: amount
                });
            }
        });
    },

    average: function average(arr) {
        return _.reduce(arr, function (memo, num) {
            return memo + num;
        }, 0) / (arr.length === 0 ? 1 : arr.length);
    },

    testPromise: function testPromise(opt) {
        var p1 = new Promise(function (resolve, reject) {
            var image = new Image();
            var start = performance.now();
            image.onerror = function () {
                var end = performance.now();
                var delta = end - start;
                total.push(delta);
                resolve(opt.el);
            };
            image.src = opt.el.url;
        });

        p1.then(function (val) {
            if (total.length === opt.amount) {
                _public.calculateResult({
                    total: _public.average(total),
                    el: opt.el
                });
                var printResult = document.getElementById("log");
                printResult.insertAdjacentHTML('beforeend', '<h3>' + _public.average(total) + '</h3><p>' + total + '</p><br><br>');
                total.length = [];
            };
        });
    },

    calculateResult: function calculateResult(opt) {
        var result = _public.average([opt.el.min, opt.el.max]),
            printResult = document.getElementById("log");

        if (opt.total > result) {

            return printResult.insertAdjacentHTML('beforeend', '<h2>Logged on ' + opt.el.name + '</h2>');
        }
        printResult.insertAdjacentHTML('beforeend', '<h2>Not logged on ' + opt.el.name + '</h2>');
    }
};