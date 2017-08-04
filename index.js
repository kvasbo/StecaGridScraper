'use strict';

const http = require('http');

module.exports = stecaGridScraper;

function stecaGridScraper(host) {

    this.host = host;

    this.getEffect = function () {

        return new Promise((resolve, reject) => {

            const optionsEffect = {
                host: this.host,
                path: "/gen.measurements.table.js"
            };

            http.request(optionsEffect, function (res) {

                var data = '';

                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {

                    var start = data.indexOf("P AC");
                    start = start + 27;
                    data = data.substring(start);
                    var end = data.indexOf("<");
                    data = data.substring(0, end);
                    var dataInt = parseInt(data);
                    resolve(dataInt);

                });
            }).end();

        });

    };

    this.getProductionToday = function () {

        return new Promise((resolve, reject) => {

            const optionsProdToday = {
                host: host,
                path: "/gen.yield.day.chart.js"
            };

            http.request(optionsProdToday, function (res) {

                var data = '';

                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {

                    let start = data.indexOf("labelValueId") + 29;
                    let end = data.indexOf("Wh") - 1;

                    data = data.substring(start);
                    data = data.substring(0, end);
                    data = Math.round(parseFloat(data) * 1000);

                    resolve(data);

                });
            }).end();

        })
    };

    this.getProductionThisMonth = function () {

        return new Promise((resolve, reject) => {

            const optionsProdMonth = {
                host: host,
                path: "/gen.yield.month.chart.js"
            };

            http.request(optionsProdMonth, function (res) {

                var data = '';

                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {

                    var d = data.split(/\r?\n/);
                    var month = new Date().getMonth() + 1;

                    if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 10) {
                        var e = "{" + d[10] + d[11] + d[12] + d[13] + "}";
                    }
                    else {
                        var e = "{" + d[10] + d[11] + d[12] + "}";
                    }

                    let f = JSON.parse(e);

                    let sum = f.data.reduce((a, b) => a + b, 0);
                    sum = Math.round(parseFloat(sum) * 1000);

                    resolve(sum);

                });
            }).end();

        })

    };

    this.getProductionThisYear = function () {

        return new Promise((resolve, reject) => {

            const optionsProdYear = {
                host: host,
                path: "/gen.yield.year.chart.js"
            };

            http.request(optionsProdYear, function (res) {

                var data = '';

                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {

                    let d = data.split(/\r?\n/);
                    let e = "{" + d[10] + d[11] + "}";
                    let f = JSON.parse(e);

                    let sum = f.data.reduce((a, b) => a + b, 0);
                    sum = Math.round(parseFloat(sum) * 1000);

                    resolve(sum);

                });
            }).end();

        });

    };

    this.getProductionTotal = function () {

        return new Promise((resolve, reject) => {

            const optionsProdTotal = {
                host: host,
                path: "/gen.yield.total.chart.js"
            };

            http.request(optionsProdTotal, function (res) {

                var data = '';

                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {

                    let start = data.indexOf("labelValueId") + 29;
                    let end = data.indexOf("Wh") - 1;

                    data = data.substring(start);
                    data = data.substring(0, end);

                    data = Math.round(parseFloat(data) * 1000000);

                    resolve(data);

                });
            }).end();

        });

    }

}