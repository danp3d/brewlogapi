var request = require('supertest');
var mongoose = require('mongoose');
var environment = require('./../configs/environment');
var user = require('./../models/user');
require('should');

var url = 'http://localhost:3667';
var deletedUsers = false;
var deletedBeers = false;
var login = null;
var loginToken = '';
var usrWithMates = null;
var usrWithMatesToken = '';

describe('User', function () {
    before(function (done) {
        if (mongoose.connection.readyState <= 0)
            mongoose.connect(environment['test'].db);
        if (!deletedUsers) {
            deletedUsers = true;
            user.User.remove({}, function (err) {
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
            .end(function (err, res) {
                if (err)
                    throw err;
                res.should.have.property('status', 200);
                res.body.should.have.property('user');
                res.body.should.have.property('token');

                login = res.body.user;
                loginToken = res.body.token;
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
            .end(function (err, res) {
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
            .end(function (err, res) {
                if (err)
                    throw err;
                res.should.have.property('status', 401);
                res.body.should.have.property('message');
                done();
            });
    });

    it('Should add mates', function (done) {
        var usr = {
            "email": "test2@test.com.au",
            "password": "newPass",
            "name": "Has Mates"
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

                var newlogin = res.body.user;
                var newToken = res.body.token;
                usrWithMates = newlogin;
                usrWithMatesToken = newToken;

                request(url)
                    .post('/user/mates')
                    .set('Authorization', 'bearer ' + newToken)
                    .send({
                        mate: {
                            id: login._id
                        }
                    })
                    .end(function (err, res) {
                        if (err) throw err;

                        res.should.have.property('status', 200);
                        res.body.should.have.property('user');
                        res.body.user.should.have.property('mates');
                        res.body.user.mates.length.should.equal(1);
                        res.body.user.mates[0].should.have.property('_id', login._id);

                        usrWithMates = res.body.user;

                        done();

                    });
            });
    });

    it('Should return mates', function (done) {
        request(url)
            .get('/user/mates')
            .set('Authorization', 'bearer ' + usrWithMatesToken)
            .end(function (err, res) {
                if (err) throw err;

                res.should.have.property('status', 200);
                res.body.should.have.property('mates');
                res.body.mates.length.should.equal(usrWithMates.mates.length);

                done();
            });
    });

    it('Should delete mates', function (done) {
        request(url)
            .delete('/user/mates/' + login._id)
            .set('Authorization', 'bearer ' + usrWithMatesToken)
            .send()
            .end(function (err, res) {
                if (err) throw err;

                res.should.have.property('status', 200);
                res.body.should.have.property('user');
                res.body.user.should.have.property('mates');
                res.body.user.mates.length.should.equal(0);

                done();
            });
    });
});
//# sourceMappingURL=user.js.map
