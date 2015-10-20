
/// <reference path="../typings/jwt-simple/jwt-simple.d.ts" />

import beer = require('../models/beer');
import user = require('../models/user');
import base = require('./base');
import mongoose = require('mongoose');
import express = require('express');


class BeerCtrl extends base.BaseCtrl {
	public getBeers = (req: express.Request, res: express.Response) => {
		var user_id = this.getUserId(req, res);
		
		user.User.findById(user_id).exec((err, usr) => {
			if (err)
				return res.status(500).send({ message: 'Internal server error' });
			
			console.log(user_id);
			beer.Beer.find({ $or: [{ 'author': new mongoose.Types.ObjectId(user_id) }, { '_id': { $in: usr.bookmarks }}] })
			.populate('author')
			.exec((err, beers) => {
				if (err)
					return res.status(500).send({ message: 'Internal server error' })
				
				return res.status(200).send({ 'beers': beers });
			});
		});
	};
	
	public getBeer = (req: express.Request, res: express.Response) => {
		var user_id = this.getUserId(req, res);
		var beer_id = req.params.beer_id;
		
		beer.Beer.findById(beer_id).populate('author').exec((err, b) => {
			if (err) {
				return res.status(500).send({ message: 'Internal server error. ' + JSON.stringify(err) });
			}
			
			return res.status(200).send({ "beer": b });
		});
	};
	
	public createBeer = (req: express.Request, res: express.Response) => {
		var user_id = this.getUserId(req, res);
		var body = <beer.IBeer>req.body;
		
		var newBeer = new beer.Beer({
			name: body.name,
			author: new mongoose.Types.ObjectId(user_id),
			createdAt: new Date(),
			cheers: [],
			comments: [],
			malts: body.malts,
			yeast: body.yeasts,
			hops: body.hops,
			recipe: body.recipe
		});
		newBeer.save((err, b) => {
			if (err) {
				return res.status(500).send({ message: 'Error saving new beer. ' + JSON.stringify(err) });
			}
			
			return res.status(200).send({ "beer": b });
		});
	};
	
	public updateBeer = (req: express.Request, res: express.Response) => {
		var user_id = this.getUserId(req, res);
		var beer_id = req.params.beer_id;
		var body = <beer.IBeer>req.body;
		
		beer.Beer.findById(beer_id).populate('author').exec((err, b) => {
			if (err) {
				return res.status(500).send({ message: 'Error searching for beer. ' + JSON.stringify(err) });
			}
			
			b.name = body.name;
			b.malts = body.malts;
			b.yeasts = body.yeasts;
			b.hops = body.hops;
			b.recipe = body.recipe;
			
			b.save((err, newB) => {
				if (err) {
					return res.status(500).send({ message: 'Error saving updates to beer. ' + JSON.stringify(err) });
				}
				
				return res.status(200).send({ message: 'Beer saved.', "beer": newB });
			});
		});
	};
	
	public deleteBeer = (req: express.Request, res: express.Response) => {
		var user_id = this.getUserId(req, res);
		var beer_id = req.params.beer_id;
		
		beer.Beer.findByIdAndRemove(beer_id, (err, b) => {
			if (err) {
				return res.status(500).send({ message: 'Error deleting beer. ' + JSON.stringify(err) });
			}
			
			return res.status(200).send({ message: 'Beer deleted', "beer": b });
		});
	}
}

export =  new BeerCtrl();