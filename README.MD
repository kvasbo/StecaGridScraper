Screen scraper for Stecagrid solar inverters with compatible firmwares. Uses the node.js built in http library.

Uses async/await, so requires a newer version of Node. 

*How to use*: 

Initialize with the IP address of the inverter: 

```javascript
const steca = require('stecagridscrape');
var mySteca = new steca("192.168.1.146");
```

Get the current effect (in watts):
```javascript
mySteca.getEffect()
```

Get the production today (in watt hours):
```javascript
mySteca.getProductionToday()
```

Get the production today by hour (in watt hours):
```javascript
mySteca.getProductionToday()
```

Get the production this month (in watt hours):
```javascript
mySteca.getProductionThisMonth()
```

Get the production this year (in watt hours):
```javascript
mySteca.getProductionThisYear()
```

Get the total production of the inverter (in watt hours):
```javascript
mySteca.getProductionTotal()
```

All functions return a promise that will resolve with the value in W or Wh.

```javascript
mySteca.getProductionTotal().then((data) => {
    console.log("Total Production", data)
});
```
Tested with the following Steca sw version set: 

* HMI BFAPI 2.5.4<br>
* HMI FBL 2.2.0<br>
* HMI APP	2.8.0<br>
* HMI PAR default	2.0.4<br>
* HMI OEM SG4200	1.0.4<br>
* PU BFAPI	2.5.4<br>
* PU FBL	1.1.1<br>
* PU APP	5.5.0<br>
* PU PAR	5.3.1<br>
* ENS1 BFAPI	2.5.4<br>
* ENS1 FBL	1.1.1<br>
* ENS1 APP	3.61.0<br>
* ENS1 PAR	22.0.0<br>
* ENS2 BFAPI	2.5.4<br>
* ENS2 FBL	1.1.1<br>
* ENS2 APP	3.61.0<br>
* ENS2 PAR	22.0.0<br>

