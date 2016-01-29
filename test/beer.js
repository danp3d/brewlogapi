var request = require('supertest');
var api = require('./../controllers/api');
var mongoose = require('mongoose');
var environment = require('./../configs/environment');
var beer = require('./../models/beer');
var user = require('./../models/user');
var should = require('should');

// Host api
process.env.NODE_ENV = 'test';
api.setup();
api.configureRoutes();
api.listen();

// Helper variables
var url = 'http://localhost:3667';
var deletedBeers = false;
var login = null;
var token = null;
var beerObj = null;

// Start tests
describe('Beer', function () {
    // Before hook - make sure a user exists and is logged in. Also, delete all beers.
    before(function (done) {
        if (!deletedBeers) {
            deletedBeers = true;
            beer.Beer.remove({}, function (err) {
                if (err)
                    throw err;

                user.User.remove({}, function (err) {
                    if (err) throw err;

                    var usr = {
                        "email": "test@test.com.au",
                        "password": "test123",
                        "name": "Tester Test"
                    };

                    request(url)
                        .post('/user/register')
                        .send(usr)
                        .end(function (err, res) {
                            if (err)
                                throw err;
                            res.should.have.property('status', 200);
                            res.body.should.have.property('user');
                            res.body.should.have.property('token');
                            login = res.body.user;
                            token = res.body.token;

                            beerObj = {
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
                                .set('Authorization', 'bearer ' + token)
                                .send(beerObj)
                                .end(function (err, res) {
                                    if (err)
                                        throw err;

                                    res.should.have.property('status', 200);
                                    res.body.should.have.property('beer');
                                    res.body.beer.should.have.property('name');
                                    res.body.beer.name.should.equal(beerObj.name);
                                    res.body.beer.recipe.should.equal(beerObj.recipe);
                                    res.body.beer.malts.length.should.equal(beerObj.malts.length);
                                    res.body.beer.yeast.length.should.equal(beerObj.yeast.length);
                                    res.body.beer.hops.length.should.equal(beerObj.hops.length);

                                    beerObj = res.body.beer;

                                    done();
                                });
                        });
                });
            });
        }
    });

    // Create beer
    it('Should create new beer', function (done) {
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
            .set('Authorization', 'bearer ' + token)
            .send(beer)
            .end(function (err, res) {
                if (err)
                    throw err;

                res.should.have.property('status', 200);
                res.body.should.have.property('beer');
                res.body.beer.should.have.property('name');
                res.body.beer.name.should.equal(beer.name);
                res.body.beer.recipe.should.equal(beer.recipe);
                res.body.beer.malts.length.should.equal(beer.malts.length);
                res.body.beer.yeast.length.should.equal(beer.yeast.length);
                res.body.beer.hops.length.should.equal(beer.hops.length);

                done();
            });
    });

    // Update beer
    it('Should update existing beer', function (done) {
        beerObj.name = 'updated';
        request(url)
            .put('/beer/' + beerObj._id.toString())
            .set('Authorization', 'bearer ' + token)
            .send(beerObj)
            .end(function (err, res) {
                if (err) throw err;

                res.should.have.property('status', 200);
                res.body.should.have.property('beer');
                res.body.beer.should.have.property('name');
                res.body.beer.name.should.equal('updated');

                beerObj = res.body.beer;

                done();
            });
    });

    // Select beer
    it('Should select existing beer', function (done) {
        request(url)
            .get('/beer/' + beerObj._id.toString())
            .set('Authorization', 'bearer ' + token)
            .send()
            .end(function (err, res) {
                if (err) throw err;

                res.should.have.property('status', 200);
                res.body.should.have.property('beer');
                res.body.beer.should.eql(beerObj);
                done();
            });
    });

    // Cheer beer
    it('Should cheer a beer', function (done) {
        request(url)
            .post('/beer/' + beerObj._id.toString() + '/cheers')
            .set('Authorization', 'bearer ' + token)
            .send()
            .end(function (err, res) {
                if (err) throw err;

                res.should.have.property('status', 200);
                res.body.should.have.property('beer');
                res.body.beer.should.have.property('name');
                res.body.beer.name.should.equal(beerObj.name);
                res.body.beer.should.have.property('cheers');
                res.body.beer.cheers.length.should.equal(1);
                res.body.beer.cheers[0].user.should.equal(login._id);

                beerObj = res.body.beer;

                done();
            });
    });

    // Get beer's cheers
    it('Should get beer\'s cheers', function (done) {
        request(url)
            .get('/beer/' + beerObj._id.toString() + '/cheers')
            .set('Authorization', 'bearer ' + token)
            .send()
            .end(function (err, res) {
                if (err) throw err;

                res.should.have.property('status', 200);
                res.body.should.have.property('cheers');
                res.body.cheers.should.eql(beerObj.cheers);

                done();
            });
    });

    // Comment beer
    it('Should comment on a beer', function (done) {
        var comment = {
            comment: "This is a comment!"
        };

        request(url)
            .post('/beer/' + beerObj._id.toString() + '/comment')
            .set('Authorization', 'bearer ' + token)
            .send(comment)
            .end(function (err, res) {
                if (err) throw err;

                res.should.have.property('status', 200);
                res.body.should.have.property('beer');
                res.body.beer.should.have.property('name');
                res.body.beer.name.should.equal(beerObj.name);
                res.body.beer.should.have.property("comments");
                res.body.beer.comments.length.should.equal(1);
                res.body.beer.comments[0].user.should.equal(login._id);
                res.body.beer.comments[0].comment.should.equal(comment.comment);

                beerObj = res.body.beer;
                done();
            });
    });

    // Update beer comment
    it('Should update beer comment', function (done) {
        var comment = beerObj.comments[beerObj.comments.length - 1];
        comment.comment = "New, updated comment";

        request(url)
            .put('/beer/' + beerObj._id.toString() + '/comment/' + comment._id.toString())
            .set('Authorization', 'bearer ' + token)
            .send(comment)
            .end(function (err, res) {
                if (err) throw err;

                res.should.have.property('status', 200);
                res.body.should.have.property('beer');
                res.body.beer.should.have.property('name');
                res.body.beer.name.should.equal(beerObj.name);
                res.body.beer.should.have.property("comments");
                res.body.beer.comments.length.should.equal(beerObj.comments.length);
                res.body.beer.comments[beerObj.comments.length - 1].should.eql(comment);

                beerObj = res.body.beer;
                done();
            });
    });

    // Get beer comments
    it('Should get beer\'s comments', function (done) {
        request(url)
            .get('/beer/' + beerObj._id.toString() + '/comment')
            .set('Authorization', 'bearer ' + token)
            .send()
            .end(function (err, res) {
                if (err) throw err;

                res.should.have.property('status', 200);
                res.body.should.have.property('comments');
                res.body.comments.should.eql(beerObj.comments);

                done();
            });
    });

    // Cheer beer comment
    it('Should cheer beer comment', function (done) {
        var comment = {
            comment: "should like this"
        };

        request(url)
            .post('/beer/' + beerObj._id.toString() + '/comment')
            .set('Authorization', 'bearer ' + token)
            .send(comment)
            .end(function (err, res) {
                if (err) throw err;

                res.should.have.property('status', 200);
                res.body.should.have.property('beer');
                res.body.beer.should.have.property('comments');
                res.body.beer.comments[res.body.beer.comments.length - 1].comment.should.equal(comment.comment);
                beerObj = res.body.beer;
                comment = res.body.beer.comments[res.body.beer.comments.length - 1];

                // now cheer it
                request(url)
                    .post('/beer/' + beerObj._id.toString() + '/comment/' + comment._id + '/cheers')
                    .set('Authorization', 'bearer ' + token)
                    .send()
                    .end(function (err, res) {
                        if (err) throw err;

                        res.should.have.property('status', 200);
                        res.body.should.have.property('beer');
                        res.body.beer.should.have.property('name');
                        res.body.beer.name.should.equal(beerObj.name);
                        res.body.beer.should.have.property("comments");
                        res.body.beer.comments[res.body.beer.comments.length - 1].comment.should.equal(comment.comment);
                        beerObj = res.body.beer;
                        comment = res.body.beer.comments[res.body.beer.comments.length - 1];

                        comment.cheers.length.should.equal(1);
                        comment.user.should.equal(login._id);

                        done();
                    });
            });

    });

    // Delete beer comment
    it('Should delete beer comment', function (done) {
        var comment = beerObj.comments.pop();

        request(url)
            .delete('/beer/' + beerObj._id.toString() + '/comment/' + comment._id.toString())
            .set('Authorization', 'bearer ' + token)
            .send()
            .end(function (err, res) {
                if (err) throw err;

                res.should.have.property('status', 200);
                res.body.should.have.property('beer');
                // Update the version (it will be different)
                beerObj.__v++;
                res.body.beer.should.eql(beerObj);
                beerObj = res.body.beer;

                done();
            });

    });

    // Delete beer
    it('Should delete beer', function (done) {
        request(url)
            .delete('/beer/' + beerObj._id.toString())
            .set('Authorization', 'bearer ' + token)
            .send()
            .end(function (err, res) {
                if (err) throw err;

                res.should.have.property('status', 200);
                res.body.should.have.property('beer');
                res.body.beer.should.eql(beerObj);
                beerObj = res.body.beer;


                request(url)
                    .get('/beer/' + beerObj._id.toString())
                    .set('Authorization', 'bearer ' + token)
                    .send()
                    .end(function (err, res) {
                        if (err) throw err;

                        res.should.have.property('status', 200);
                        res.body.should.have.property('beer');
                        should(res.body.beer).not.be.ok();
                        done();
                    });
            });

    });

});
//# sourceMappingURL=beer.js.map
