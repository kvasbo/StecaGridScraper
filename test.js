const steca = require('./index');

var mySteca = new steca("192.168.1.146");

mySteca.getEffect().then((data)=>console.log("now", data));
mySteca.getProductionToday().then((data)=>console.log("today", data));
mySteca.getProductionThisMonth().then((data)=>console.log("month", data));
mySteca.getProductionThisYear().then((data)=>console.log("year", data));
mySteca.getProductionTotal().then((data)=>console.log("total", data));

