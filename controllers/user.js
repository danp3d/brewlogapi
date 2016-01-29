var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p)) d[p] = b[p];

    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var user = require('../models/user');
var base = require('./base');
var jwt = require('jwt-simple');
var mongoose = require('mongoose');

var UserCtrl = (function (_super) {
    __extends(UserCtrl, _super);

    function UserCtrl() {
        var _this = this;
        _super.apply(this, arguments);

        this.createToken = function (user, req, res) {
            // Generate token
            var payload = {
                iss: req.hostname,
                sub: user.id
            };
            var token = jwt.encode(payload, _this.secret);
            res.status(200).send({
                'user': user.toJSON(),
                'token': token
            });
        };

        this.register = function (req, res) {
            var data = req.body;

            if (data.email && data.password && data.name) {
                var newUsr = new user.User({
                    email: data.email,
                    password: data.password,
                    name: data.name
                });

                newUsr.save(function (err) {
                    if (err)
                        return res.status(500).send({
                            message: 'Unable to save user. ' + JSON.stringify(err)
                        });
                    _this.createToken(newUsr, req, res);
                });
            } else {
                return res.status(500).send({
                    message: 'Invalid registration data'
                });
            }
        };

        this.login = function (req, res) {
            var data = req.body;

            user.User.findOne({
                'email': data.email
            }).exec(function (err, usr) {
                if (err)
                    return res.status(500).send({
                        message: 'Internal server error. ' + JSON.stringify(err)
                    });
                if (!usr)
                    return res.status(401).send({
                        message: 'Invalid credentials'
                    });

                usr.comparePassword(data.password, function (err, result) {
                    if (err)
                        return res.status(500).send({
                            message: 'Internal server error. ' + JSON.stringify(err)
                        });
                    if (result) {
                        return _this.createToken(usr, req, res);
                    } else {
                        return res.status(401).send({
                            message: 'Invalid credentials'
                        });
                    }
                });
            });
        };

        this.addMate = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var data = req.body;

            user.User.findByIdAndUpdate(user_id, {
                "$push": {
                    "mates": {
                        "_id": new mongoose.Types.ObjectId(data.mate.id)
                    }
                }
            }).populate("mates").exec(function (err, usr) {
                if (err) return res.status(500).send({
                    message: 'Internal server error. ' + JSON.stringify(err)
                });

                if (!usr)
                    return res.status(401).send({
                        message: 'Invalid credentials'
                    });

                usr.mates.push({
                    _id: new mongoose.Types.ObjectId(data.mate.id)
                });
                usr.save(function (err, newUsr) {
                    if (err) return res.status(500).send({
                        message: 'Internal server error. ' + JSON.stringify(err)
                    });

                    return res.status(200).send({
                        message: "Mate added",
                        user: newUsr
                    });
                });
            });
        };

        this.getMates = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var data = req.body;

            user.User.findById(user_id).populate("mates").exec(function (err, usr) {
                if (err) return res.status(500).send({
                    message: 'Internal server error. ' + JSON.stringify(err)
                });


                return res.status(200).send({
                    mates: usr.mates
                });
            });
        };
    }
    return UserCtrl;
})(base.BaseCtrl);
module.exports = new UserCtrl();
//# sourceMappingURL=user.js.map
