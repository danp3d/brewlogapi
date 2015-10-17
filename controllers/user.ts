
/// <reference path="../typings/mongoose/mongoose.d.ts" />
/// <reference path="../typings/express/express.d.ts" />

import user = require('../models/user');
import base = require('./base');
import mongoose = require('mongoose');
import jwt = require('jwt-simple');

class UserCtrl extends base.BaseCtrl {
	private createToken = (user: user.IUser, req: Express.Request, res: Express.Response) => {
        // Generate token
        var payload = { iss: req.hostname, sub: user.id }
        var token = jwt.encode(payload, this.secret);
		
		res.status(200).send({ 'user': user.toJSON(), 'token': token });
	}
	
	public register = (req: Express.Request, res: Express.Response) => {
		var data = req.body;
		
		if (data.email && data.password && data.name) {
			var newUsr = new user.User({
				email: data.email,
				password: data.password,
				name: data.name
			});
			
			newUsr.save((err) => {
				if (err)
					return res.status(500).send({ message: 'Unable to save user. ' + JSON.stringify(err) });
				
				this.createToken(newUsr, req, res);
			});
			
		} else {
			return res.status(500).send({ message: 'Invalid registration data' });
		}
	};
	
	public login = (req: Express.Request, res: Express.Response) => {
		var data = req.body;
		
		user.User.findOne({ 'email': data.email }).exec((err, usr) => {
			if (err)
				return res.status(500).send({ message: 'Internal server error. ' + JSON.stringify(err) });
				
			if (!usr) 
				return res.status(401).send({ message: 'Invalid credentials' });
				
			usr.comparePassword(data.password, (err, res) => {
				if (err)
					return res.status(500).send({ message: 'Internal server error. ' + JSON.stringify(err) });
					
				return this.createToken(usr, req, res);
			});
		});
	}
}

export =  new UserCtrl();