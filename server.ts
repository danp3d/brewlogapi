/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/express/express.d.ts" />
/// <reference path="typings/body-parser/body-parser.d.ts" />
/// <reference path="typings/mime/mime.d.ts" />
/// <reference path="typings/mongoose/mongoose.d.ts" />
/// <reference path="typings/serve-static/serve-static.d.ts" />
/// <reference path="typings/jwt-simple/jwt-simple.d.ts" />

import express = require('express');
import mongoose = require('mongoose');
import bodyparser = require('body-parser');
import usrCtrl = require('./controllers/user');
import beerCtrl = require('./controllers/beer');

var app = express();

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

app.post('/user/register', usrCtrl.register);
app.post('/user/login', usrCtrl.login);
app.get('/beer', beerCtrl.getBeers);
app.get('/', function (req, res) {
	res.send({ pikachu: 'pika pika' });
});

app.listen(3366);
console.log('Brewlog API started. Listening on port 3366')