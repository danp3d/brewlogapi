/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/express/express.d.ts" />
/// <reference path="typings/body-parser/body-parser.d.ts" />
/// <reference path="typings/mime/mime.d.ts" />
/// <reference path="typings/mongoose/mongoose.d.ts" />
/// <reference path="typings/serve-static/serve-static.d.ts" />
/// <reference path="typings/jwt-simple/jwt-simple.d.ts" />
// Imports
var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var usrCtrl = require('./controllers/user');
var beerCtrl = require('./controllers/beer');
// Create the app object
var app = express();
// Connect to MongoDB (hardcoded to a local instance)
// TODO: create config object (development/production)
mongoose.connect('mongodb://localhost/beerlog');
// Parse body (we'll only deal with JSON - no need o XML crap)
app.use(bodyparser.json());
// Enable CORS 
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
// Routes. TODO: Create routes in a different file
app.post('/user/register', usrCtrl.register);
app.post('/user/login', usrCtrl.login);
// Beers
app.get('/beer', beerCtrl.getBeers);
app.get('/beer/:beer_id', beerCtrl.getBeer);
app.post('/beer', beerCtrl.createBeer);
app.put('/beer/:beer_id', beerCtrl.updateBeer);
app.delete('/beer/:beer_id', beerCtrl.deleteBeer);
// Ping (test communication)
app.get('/ping', function (req, res) {
    res.send({ message: 'pong' });
});
// Start the server. TODO: Config object (port);
app.listen(3366);
console.log('Brewlog API started. Listening on port 3366');
//# sourceMappingURL=server.js.map