/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/mime/mime.d.ts" />
/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/superagent/superagent.d.ts" />
/// <reference path="../typings/supertest/supertest.d.ts" />
/// <reference path="../typings/should/should.d.ts" />
/// <reference path="../typings/mongoose/mongoose.d.ts" />
var request = require('supertest');
var mongoose = require('mongoose');
var environment = require('./../configs/environment');
var beer = require('./../models/beer');
require('should');
var url = 'http://localhost:3667';
var deletedBeers = false;
var login = null;
describe('Beer', function () {
    before(function (done) {
        mongoose.connect(environment['test'].db);
        if (!deletedBeers) {
            deletedBeers = true;
            beer.Beer.remove({}, function (err) {
                if (err)
                    throw err;
                done();
            });
        }
    });
    it('Should create new beer', function (done) {
        var login = {
            "email": "test@test.com.au",
            "password": "test123"
        };
        request(url)
            .post('/user/login')
            .send(login)
            .end(function (err, res) {
            if (err)
                throw err;
            res.should.have.property('status', 200);
            res.body.should.have.property('user');
            res.body.should.have.property('token');
            var token = res.body.token;
            var beer = {
                name: 'Test beer',
                malts: [{
                        name: 'whatever',
                        qty: 3
                    }],
                yeast: [{
                        name: 'whichever',
                        qty: 1
                    }],
                hops: [{
                        name: 'random hop',
                        qty: 10,
                        time: '30 min',
                        dryHop: false
                    }],
                recipe: 'Whatever - :D'
            };
            request(url)
                .post('/beer')
                .set('Authorization', token)
                .send(beer)
                .end(function (err, res) {
                if (err)
                    throw err;
                res.should.have.property('status', 200);
                res.body.should.have.property('beer');
                done();
            });
            done();
        });
    });
});
//# sourceMappingURL=beer.js.map