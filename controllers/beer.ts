
/// <reference path="../typings/jwt-simple/jwt-simple.d.ts" />

import beer = require('../models/beer');
import user = require('../models/user');
import base = require('./base');
import mongoose = require('mongoose');


class BeerCtrl extends base.BaseCtrl {
	getBeers = (req: Express.Request, res: Express.Response) => {
		var user_id = this.getUserId(req, res);
		
		user.User.findById(user_id).exec((err, usr) => {
			if (err)
				return res.status(500).send({ message: 'Internal server error' });
			
			beer.Beer.find({ $or: [{ 'user': new mongoose.Types.ObjectId(user_id) }, { '_id': { $in: usr.bookmarks }}] })
			.populate('author')
			.exec((err, beers) => {
				if (err)
					return res.status(500).send({ message: 'Internal server error' })
				
				res.status(200).send({ 'beers': beers });
			});
		});
	}
}

export =  new BeerCtrl();