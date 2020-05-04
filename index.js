const port = 16004;
const spdy = require('spdy');
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
var compression = require('compression');
app.use(compression());

app.use(function(req, res, next) {
    var allowedOrigins = [
        'https://localhost:8443',
        'https://localhost:16001',
        'https://localhost:16002',
        'https://localhost:16003',
        'https://localhost:16004',
        'https://localhost:16005',
        'https://localhost:16006',
		'https://40.74.19.17:8443'
    ];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
});
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies.
app.use('/',express.static(path.join(__dirname, 'public')));

const options = {
    key: fs.readFileSync(__dirname + '/certificates/key.pem'),
    cert:  fs.readFileSync(__dirname + '/certificates/cert.pem')
};
console.log(options);

spdy
  .createServer(options, app)
  .listen(port, (error) => {
    if (error) {
      console.error(error);
      return process.exit(1)
    } else {
      console.log('Listening on port: ' + port + '.')
    }
  });
