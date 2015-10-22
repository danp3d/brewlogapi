/// <reference path="../typings/jwt-simple/jwt-simple.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var beer = require('../models/beer');
var user = require('../models/user');
var base = require('./base');
var mongoose = require('mongoose');
var BeerCtrl = (function (_super) {
    __extends(BeerCtrl, _super);
    function BeerCtrl() {
        var _this = this;
        _super.apply(this, arguments);
        this.getBeers = function (req, res) {
            var user_id = _this.getUserId(req, res);
            user.User.findById(user_id).exec(function (err, usr) {
                if (err)
                    return res.status(500).send({ message: 'Internal server error' });
                console.log(user_id);
                beer.Beer.find({ $or: [{ 'author': new mongoose.Types.ObjectId(user_id) }, { '_id': { $in: usr.bookmarks } }] })
                    .populate('author')
                    .exec(function (err, beers) {
                    if (err)
                        return res.status(500).send({ message: 'Internal server error' });
                    return res.status(200).send({ 'beers': beers });
                });
            });
        };
        this.getBeer = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var beer_id = req.params.beer_id;
            beer.Beer.findById(beer_id).populate('author').exec(function (err, b) {
                if (err) {
                    return res.status(500).send({ message: 'Internal server error. ' + JSON.stringify(err) });
                }
                return res.status(200).send({ "beer": b });
            });
        };
        this.createBeer = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var body = req.body;
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
            newBeer.save(function (err, b) {
                if (err) {
                    return res.status(500).send({ message: 'Error saving new beer. ' + JSON.stringify(err) });
                }
                return res.status(200).send({ "beer": b });
            });
        };
        this.updateBeer = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var beer_id = req.params.beer_id;
            var body = req.body;
            beer.Beer.findById(beer_id).populate('author').exec(function (err, b) {
                if (err) {
                    return res.status(500).send({ message: 'Error searching for beer. ' + JSON.stringify(err) });
                }
                b.name = body.name;
                b.malts = body.malts;
                b.yeasts = body.yeasts;
                b.hops = body.hops;
                b.recipe = body.recipe;
                b.save(function (err, newB) {
                    if (err) {
                        return res.status(500).send({ message: 'Error saving updates to beer. ' + JSON.stringify(err) });
                    }
                    return res.status(200).send({ message: 'Beer saved.', "beer": newB });
                });
            });
        };
        this.deleteBeer = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var beer_id = req.params.beer_id;
            beer.Beer.findByIdAndRemove(beer_id, function (err, b) {
                if (err) {
                    return res.status(500).send({ message: 'Error deleting beer. ' + JSON.stringify(err) });
                }
                return res.status(200).send({ message: 'Beer deleted', "beer": b });
            });
        };
        this.getBeerCheers = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var beer_id = req.params.beer_id;
            beer.Beer.findById(beer_id).populate('author').exec(function (err, b) {
                if (err) {
                    return res.status(500).send({ message: 'Internal server error. ' + JSON.stringify(err) });
                }
                return res.status(200).send({ "cheers": b.cheers });
            });
        };
        this.createBeerCheers = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var beer_id = req.params.beer_id;
            beer.Beer.findById(beer_id).populate('author').exec(function (err, b) {
                if (err) {
                    return res.status(500).send({ message: 'Error searching for beer. ' + JSON.stringify(err) });
                }
                b.cheers.push({
                    "user": new mongoose.Types.ObjectId(user_id),
                    "dateTime": new Date()
                });
                b.save(function (err, newB) {
                    if (err) {
                        return res.status(500).send({ message: 'Error saving new cheers to beer. ' + JSON.stringify(err) });
                    }
                    return res.status(200).send({ message: 'Cheers saved.', "beer": newB });
                });
            });
        };
        this.getBeerComments = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var beer_id = req.params.beer_id;
            beer.Beer.findById(beer_id).populate('author').exec(function (err, b) {
                if (err) {
                    return res.status(500).send({ message: 'Internal server error. ' + JSON.stringify(err) });
                }
                return res.status(200).send({ "comments": b.comments });
            });
        };
        this.createBeerComment = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var beer_id = req.params.beer_id;
            if (!req.body.comment)
                return res.status(500).send({ message: 'Comment is mandatory' });
            beer.Beer.findById(beer_id).populate('author').exec(function (err, b) {
                if (err) {
                    return res.status(500).send({ message: 'Error searching for beer. ' + JSON.stringify(err) });
                }
                b.comments.push({
                    "user": new mongoose.Types.ObjectId(user_id),
                    "dateTime": new Date(),
                    "comment": req.body.comment,
                    "cheers": []
                });
                b.save(function (err, newB) {
                    if (err) {
                        return res.status(500).send({ message: 'Error saving new cheers to beer. ' + JSON.stringify(err) });
                    }
                    return res.status(200).send({ message: 'Cheers saved.', "beer": newB });
                });
            });
        };
        this.getBeerComment = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var beer_id = req.params.beer_id;
            var comment_id = req.params.comment_id;
            beer.Beer.findById(beer_id).exec(function (err, b) {
                if (err)
                    return res.status(500).send({ message: 'Unable to find beer. ' + JSON.stringify(err) });
                return res.status(200).send({ "comment": b.comments.id(comment_id) });
            });
        };
        this.updateBeerComment = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var beer_id = req.params.beer_id;
            var comment_id = req.params.comment_id;
            var body = req.body;
            beer.Beer.findById(beer_id).exec(function (err, b) {
                if (err) {
                    return res.status(500).send({ message: 'Error searching for beer. ' + JSON.stringify(err) });
                }
                b.comments.id(comment_id).comment = body.comment;
                b.save(function (err, newB) {
                    if (err)
                        return res.status(500).send({ message: 'Error updating comment. ' + JSON.stringify(err) });
                    return res.status(200).send({ message: 'Comment saved.', "beer": b });
                });
            });
        };
        this.deleteBeerComment = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var beer_id = req.params.beer_id;
            var comment_id = req.params.comment_id;
            beer.Beer.findByIdAndUpdate(beer_id, { '$pull': { 'comments': { '_id': new mongoose.Types.ObjectId(comment_id) } } }).exec(function (err, b) {
                if (err) {
                    return res.status(500).send({ message: 'Error searching for beer. ' + JSON.stringify(err) });
                }
                return res.status(200).send({ message: 'Comment saved.', "beer": b });
            });
        };
        this.createBeerCommentCheers = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var beer_id = req.params.beer_id;
            var comment_id = req.params.comment_id;
            beer.Beer.findById(beer_id).populate('author').exec(function (err, b) {
                if (err) {
                    return res.status(500).send({ message: 'Error searching for beer. ' + JSON.stringify(err) });
                }
                b.comments.cheers.push({
                    "user": new mongoose.Types.ObjectId(user_id),
                    "dateTime": new Date()
                });
                b.save(function (err, newB) {
                    if (err) {
                        return res.status(500).send({ message: 'Error saving new cheers to beer. ' + JSON.stringify(err) });
                    }
                    return res.status(200).send({ message: 'Cheers saved.', "beer": newB });
                });
            });
        };
    }
    return BeerCtrl;
})(base.BaseCtrl);
module.exports = new BeerCtrl();
//# sourceMappingURL=beer.js.map