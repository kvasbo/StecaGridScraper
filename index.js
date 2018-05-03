const fetch = require('node-fetch');
const moment = require('moment');

// Behold, the art of scraping!
function getProductionFromRawData(data) {
  try {
    const d = data.split(/\r?\n/); // Create array of lines
    const start = d.indexOf('"data": ['); // Find start of data set
    const choppedOfStart = d.slice(start); // Chop off from start
    const end = choppedOfStart.indexOf('}'); // Find end (in chopped array)
    const dataArray = d.slice(start, start + end); // Extract data set
    const jsonData = `{${dataArray.join('')}}`; // Create json object
    const outData = JSON.parse(jsonData); // Parse json
    return outData.data; // Return
  } catch (err) {
    throw err;
  }
}

function parseDailyData(data) {
  const time = moment().startOf('day');
  const out = [];
  for (let i = 0; i < 144; i += 1) {
    if (i < data.length) {
      time.add(10, 'minutes');
      out.push({ minutesFromMidnight: i * 10, time: time.toDate(), production: data[i] });
    }
  }
  return out;
}

function stecaGridScraper(host) {
  this.host = host;

  this.getFile = async (path) => {
    const url = `http://${this.host}/${path}`;
    try {
      const data = await fetch(url);
      const text = await data.text();
      return text;
    } catch (err) {
      throw err;
    }
  };

  this.getEffect = async () => {
    try {
      const content = await this.getFile('gen.measurements.table.js');
      const start = content.indexOf('P AC') + 27;
      const tmpFromStart = content.substring(start);
      const end = tmpFromStart.indexOf('<');
      const tmpDone = tmpFromStart.substring(0, end);
      const dataInt = parseInt(tmpDone, 10);
      return (Number.isNaN(dataInt)) ? 0 : dataInt;
    } catch (err) {
      throw err;
    }
  };

  this.getProductionToday = async () => {
    try {
      const content = await this.getFile('gen.yield.day.chart.js');
      const start = content.indexOf('labelValueId') + 29;
      const tmpFromStart = content.substring(start);
      const end = tmpFromStart.indexOf('Wh') - 1;
      const tmpDone = tmpFromStart.substring(0, end);
      const dataInt = Math.round(parseFloat(tmpDone) * 1000);
      return dataInt;
    } catch (err) {
      throw err;
    }
  };

  this.getProductionTodayByHour = async () => {
    try {
      const content = await this.getFile('gen.yield.day.chart.js');
      const byHour = parseDailyData(getProductionFromRawData(content));
      return byHour;
    } catch (err) {
      throw err;
    }
  };

  this.getProductionThisMonth = async () => {
    try {
      const data = await this.getFile('gen.yield.month.chart.js');
      const dayProduction = getProductionFromRawData(data);
      const sum = dayProduction.reduce((a, b) => a + b, 0);
      return Math.round(parseFloat(sum) * 1000);
    } catch (err) {
      throw err;
    }
  };

  this.getProductionThisYear = async () => {
    try {
      const data = await this.getFile('gen.yield.year.chart.js');
      const d = data.split(/\r?\n/);
      const e = `{${d[10]}${d[11]}}`;
      const f = JSON.parse(e);
      const sum = f.data.reduce((a, b) => a + b, 0);
      return Math.round(parseFloat(sum) * 1000);
    } catch (err) {
      throw err;
    }
  };

  this.getProductionTotal = async () => {
    try {
      const data = await this.getFile('gen.yield.total.chart.js');
      const start = data.indexOf('labelValueId') + 29;
      const dataWithoutStart = data.substring(start);
      const end = dataWithoutStart.indexOf('Wh') - 1;
      const doneData = dataWithoutStart.substring(0, end);
      return Math.round(parseFloat(doneData) * 1000000);
    } catch (err) {
      throw err;
    }
  };
}

module.exports = stecaGridScraper;
