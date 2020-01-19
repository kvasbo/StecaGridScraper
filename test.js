/* eslint-disable no-console */
const Steca = require('./index');

const mySteca = new Steca('192.168.1.146');

mySteca.getEffect().then(data => console.log('now', data));
mySteca.getProductionToday().then(data => console.log('today', data));
mySteca.getProductionTodayByHour().then(data => console.log('today by hour', data));
mySteca.getProductionThisMonth().then(data => console.log('month', data));
mySteca.getProductionThisYear().then(data => console.log('year', data));
mySteca.getProductionTotal().then(data => console.log('total', data));
