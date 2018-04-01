const http = require('http');
const fetch = require('node-fetch');

function stecaGridScraper(host) {
    this.host = host;

    this.getFile = async (path) => {
      const url = `http://${this.host}/${path}`;
      try {
        console.log('getting', url);
        const data = await fetch(url);
        const text = await data.text();
        return text;
      } catch (err) {
        console.log(`Error fetching ${url}`);
        throw err;
      }
    } 

    this.getEffect = async () => {
      try {
        const content = await this.getFile('gen.measurements.table.js');
        const start = content.indexOf("P AC") + 27;
        const tmpFromStart = content.substring(start);
        const end = tmpFromStart.indexOf("<");
        const tmpDone = tmpFromStart.substring(0, end);
        const dataInt = parseInt(tmpDone);
        return dataInt;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }

    this.getProductionToday = async () => {
      try {
        const content = await this.getFile('gen.yield.day.chart.js');
        const start = content.indexOf("labelValueId") + 29;
        const tmpFromStart = content.substring(start);
        const end = tmpFromStart.indexOf("Wh") - 1;
        const tmpDone = tmpFromStart.substring(0, end);
        const dataInt = Math.round(parseFloat(tmpDone) * 1000);
        return dataInt;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }

    this.getProductionThisMonth = async () => {
      try {
        const data = await this.getFile('gen.yield.month.chart.js');
        var d = data.split(/\r?\n/);
        var month = new Date().getMonth() + 1;
        if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
            var e = "{" + d[10] + d[11] + d[12] + d[13] + "}";
        }
        else {
            var e = "{" + d[10] + d[11] + d[12] + "}";
        }
        let f = JSON.parse(e);
        let sum = f.data.reduce((a, b) => a + b, 0);
        sum = Math.round(parseFloat(sum) * 1000);
        return sum;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }

    this.getProductionThisYear = async () => {
      try {
        const data = await this.getFile('gen.yield.year.chart.js');
        let d = data.split(/\r?\n/);
        let e = "{" + d[10] + d[11] + "}";
        let f = JSON.parse(e);
        let sum = f.data.reduce((a, b) => a + b, 0);
        sum = Math.round(parseFloat(sum) * 1000);
        return sum;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }

    this.getProductionTotal = async () => {
      try {
        let data = await this.getFile('gen.yield.total.chart.js');
        let start = data.indexOf("labelValueId") + 29;
        data = data.substring(start);
        let end = data.indexOf("Wh") - 1;
        data = data.substring(0, end);
        sum = Math.round(parseFloat(data) * 1000000);
        return sum;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
}

module.exports = stecaGridScraper;
