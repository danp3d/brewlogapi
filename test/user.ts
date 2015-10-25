/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/mime/mime.d.ts" />
/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/superagent/superagent.d.ts" />
/// <reference path="../typings/supertest/supertest.d.ts" />
/// <reference path="../typings/should/should.d.ts" />
/// <reference path="../typings/mongoose/mongoose.d.ts" />

import assert = require('assert');
import request = require('supertest');
import mongoose = require('mongoose');
import environment = require('./../configs/environment');
import user = require('./../models/user');

require('should');

var url = 'http://localhost:3667';
var deletedUsers = false;
var deletedBeers = false;
var loginToken = '';

describe('User', function () {
	before((done) => {
		if (mongoose.connection.readyState <= 0)
			mongoose.connect(environment['test'].db);
		if (!deletedUsers) {
			deletedUsers = true;	
			user.User.remove({}, (err) => {
				if (err)
					throw err;
									
				done();
			});
		}
	});
	
	it('Should register new user', function (done) {
		var usr = {
			"email": "test@test.com.au",
			"password": "test123",
			"name": "Tester Test"
		};
		
		request(url)
		.post('/user/register')
		.send(usr)
		.end((err, res: request.Response) => {
			if (err)
				throw err;
				
			res.should.have.property('status', 200);
			res.body.should.have.property('user');
			res.body.should.have.property('token');
			done();
		});
	});
	
	it('Should login user', function (done) {
		var login = {
			"email": "test@test.com.au",
			"password": "test123"
		};
		
		request(url)
		.post('/user/login')
		.send(login)
		.end((err, res: request.Response) => {
			if (err)
				throw err;
			
			res.should.have.property('status', 200);
			res.body.should.have.property('user');
			res.body.should.have.property('token');
			done();
		});
	});
	
	it('Should fail to login', function (done) {
		var login = {
			"email": "daniel.exe@gmail.com",
			"password": "whatever"
		};
		
		request(url)
		.post('/user/login')
		.send(login)
		.end((err, res: request.Response) => {
			if (err)
				throw err;
				
			res.should.have.property('status', 401);
			res.body.should.have.property('message');
			done();
		});
	});
});
	