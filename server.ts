/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/express/express.d.ts" />
/// <reference path="typings/body-parser/body-parser.d.ts" />
/// <reference path="typings/mime/mime.d.ts" />
/// <reference path="typings/mongoose/mongoose.d.ts" />
/// <reference path="typings/serve-static/serve-static.d.ts" />
/// <reference path="typings/jwt-simple/jwt-simple.d.ts" />

// Imports
import express = require('express');
import mongoose = require('mongoose');
import bodyparser = require('body-parser');
import usrCtrl = require('./controllers/user');
import beerCtrl = require('./controllers/beer');

// Create the app object
var app = express();

// Connect to MongoDB (hardcoded to a local instance)
// TODO: create config object (development/production)
mongoose.connect('mongodb://localhost/beerlog');

// Parse body (we'll only deal with JSON - no need o XML crap)
app.use(bodyparser.json());

// Enable CORS 
app.use((req, res, next) => { // (vanilla express middleware)
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
app.post('/beer', beerCtrl.createBeer);

app.get('/beer/:beer_id', beerCtrl.getBeer);
app.put('/beer/:beer_id', beerCtrl.updateBeer);
app.delete('/beer/:beer_id', beerCtrl.deleteBeer);

app.get('/beer/:beer_id/cheers', beerCtrl.getBeerCheers);
app.post('/beer/:beer_id/cheers', beerCtrl.createBeerCheers);

app.get('/beer/:beer_id/comment', beerCtrl.getBeerComments);
app.post('/beer/:beer_id/comment', beerCtrl.createBeerComment);

app.get('/beer/:beer_id/comment/:comment_id', beerCtrl.getBeerComment);
app.put('/beer/:beer_id/comment/:comment_id', beerCtrl.updateBeerComment);
app.delete('/beer/:beer_id/comment/:comment_id', beerCtrl.deleteBeerComment);
app.post('/beer/:beer_id/comment/:comment_id/cheers', beerCtrl.createBeerCommentCheers);



// Ping (test communication)
app.get('/ping', function (req, res) {
	res.send({ message: 'pong' });
});

// Start the server. TODO: Config object (port);
app.listen(3366);
console.log('Brewlog API started. Listening on port 3366')