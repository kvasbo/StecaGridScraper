'use strict';

var http = require('http');

var production = {};
production.effect = {val: null, time: null};
production.today = {val: null, time: null};
production.month = {val: null, time: null};
production.year = {val: null, time: null};
production.total = {val: null, time: null};
production.counter = 0;

export default class stecaGridScraper {

    updateData() {

        var host = "192.168.1.146";

        var optionsEffect = {
            host: host,
            path: "/gen.measurements.table.js"
        };

        http.request(optionsEffect, function (res) {

            var data = '';

            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {

                var effect = cleanUpEffect(data);
                production.effect.val = effect;
                production.effect.time = new Date().getTime();

            });
        }).end();

        if (production.counter % 5 === 0) {

            var optionsProdToday = {
                host: host,
                path: "/gen.yield.day.chart.js"
            };

            http.request(optionsProdToday, function (res) {

                var data = '';

                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {

                    var effect = cleanUpProduction(data);

                    production.today.val = effect;
                    production.today.time = new Date().getTime();
                });
            }).end();

        }

        if (production.counter % 25 === 0) {

            var optionsProdMonth = {
                host: host,
                path: "/gen.yield.month.chart.js"
            };

            http.request(optionsProdMonth, function (res) {

                var data = '';

                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {

                    var effect = getMonthSum(data);

                    production.month.val = effect;
                    production.month.time = new Date().getTime();
                });
            }).end();

            var optionsProdYear = {
                host: host,
                path: "/gen.yield.year.chart.js"
            };

            http.request(optionsProdYear, function (res) {

                var data = '';

                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {

                    var effect = getYearSum(data);

                    production.year.val = effect;
                    production.year.time = new Date().getTime();
                });
            }).end();

            var optionsProdTotal = {
                host: host,
                path: "/gen.yield.total.chart.js"
            };

            http.request(optionsProdTotal, function (res) {

                var data = '';

                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {
                    var effect = cleanUpProduction(data);

                    production.total.val = effect * 1000;
                    production.total.time = new Date().getTime();
                });
            }).end();

        }

        production.counter++;

    }

    getDaySum(data) {
        var d = data.split(/\r?\n/);

        var e = "{" + d[33] + d[34] + d[35] + d[36] + d[37] + d[38] + d[39] + d[40] + d[41] + d[42] + d[43] + "}";

        var f = JSON.parse(e);

        var sum = f.data.reduce((a, b) => a + b, 0);

        sum = sum / 6;

        return sum;

    }

    getMonthSum(data) {

        var d = data.split(/\r?\n/);

        var month = new Date().getMonth() + 1;

        if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 10) {
            var e = "{" + d[10] + d[11] + d[12] + d[13] + "}";
        }
        else {
            var e = "{" + d[10] + d[11] + d[12] + "}";
        }

        var f = JSON.parse(e);

        var sum = f.data.reduce((a, b) => a + b, 0);

        sum = Math.round(parseFloat(sum) * 1000);

        return sum;

    }

    getYearSum(data) {

        var d = data.split(/\r?\n/);
        var e = "{" + d[10] + d[11] + "}";
        var f = JSON.parse(e);

        var sum = f.data.reduce((a, b) => a + b, 0);

        sum = Math.round(parseFloat(sum) * 1000);

        return sum;
    }

    cleanUpEffect(data) {
        var start = data.indexOf("P AC");

        start = start + 27;

        data = data.substring(start);

        var end = data.indexOf("<");

        data = data.substring(0, end);

        var dataInt = parseInt(data);

        return dataInt;

    }

    cleanUpProduction(data) {

        var start = data.indexOf("labelValueId");

        start = start + 29;

        data = data.substring(start);

        var end = data.indexOf("Wh") - 1;

        data = data.substring(0, end);

        data = Math.round(parseFloat(data) * 1000);

        return data;
    }

    getData(callBack) {
        callBack(production);
    }

}