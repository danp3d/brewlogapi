// Imports
var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var usrCtrl = require('./user');
var beerCtrl = require('./beer');
var environment = require('./../configs/environment');


var api = {};

api.setup = function () {
    // Create the app object
    api.app = express();
    api.env = process.env.NODE_ENV || 'development';

    // Connect to MongoDB (hardcoded to a local instance)
    // TODO: create config object (development/production)
    mongoose.connect(environment[api.env].db);

    // Parse body (we'll only deal with JSON - no need to use XML crap)
    api.app.use(bodyparser.json());

    // Enable CORS 
    api.app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        next();
    });

};

api.configureRoutes = function () {

    // Routes. TODO: Create routes in a different file
    api.app.post('/user/register', usrCtrl.register);
    api.app.post('/user/login', usrCtrl.login);
    api.app.post('/user/mates', usrCtrl.addMate);
    api.app.get('/user/mates', usrCtrl.getMates);
    api.app.delete('/user/mates/:mate_id', usrCtrl.deleteMate);

    // Beers
    api.app.get('/beer', beerCtrl.getBeers);
    api.app.post('/beer', beerCtrl.createBeer);
    api.app.get('/beer/:beer_id', beerCtrl.getBeer);
    api.app.put('/beer/:beer_id', beerCtrl.updateBeer);
    api.app.delete('/beer/:beer_id', beerCtrl.deleteBeer);
    api.app.get('/beer/:beer_id/cheers', beerCtrl.getBeerCheers);
    api.app.post('/beer/:beer_id/cheers', beerCtrl.createBeerCheers);
    api.app.get('/beer/:beer_id/comment', beerCtrl.getBeerComments);
    api.app.post('/beer/:beer_id/comment', beerCtrl.createBeerComment);
    api.app.get('/beer/:beer_id/comment/:comment_id', beerCtrl.getBeerComment);
    api.app.put('/beer/:beer_id/comment/:comment_id', beerCtrl.updateBeerComment);
    api.app.delete('/beer/:beer_id/comment/:comment_id', beerCtrl.deleteBeerComment);
    api.app.post('/beer/:beer_id/comment/:comment_id/cheers', beerCtrl.createBeerCommentCheers);

    // Ping (test communication)
    api.app.get('/ping', function (req, res) {
        res.send({
            message: 'pong'
        });
    });

};


api.listen = function () {
    // Start the server. TODO: Config object (port);
    api.app.listen(environment[api.env].port);
    console.log('Environment: ' + api.env);
    console.log('Brewlog API started. Listening on port ' + environment[api.env].port);
};

module.exports = api;
