var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p)) d[p] = b[p];

    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

// Includes
var beer = require('../models/beer');
var user = require('../models/user');
var base = require('./base');
var mongoose = require('mongoose');


var BeerCtrl = (function (_super) {
    // Implement inheritance
    __extends(BeerCtrl, _super);

    // Beer control
    function BeerCtrl() {
        var _this = this;
        _super.apply(this, arguments);

        // Get all beers (GET /beer/)
        this.getBeers = function (req, res) {
            var user_id = _this.getUserId(req, res);

            user.User.findById(user_id).exec(function (err, usr) {
                if (err)
                    return res.status(500).send({
                        message: 'Internal server error'
                    });

                // Find beers where author is the current user or 
                // current user has it bookmarked
                beer.Beer.find({
                        $or: [{
                            'author': new mongoose.Types.ObjectId(user_id)
                        }, {
                            '_id': {
                                $in: usr.bookmarks
                            }
                        }]
                    })
                    .populate('author')
                    .exec(function (err, beers) {
                        if (err)
                            return res.status(500).send({
                                message: 'Internal server error'
                            });

                        return res.status(200).send({
                            'beers': beers
                        });
                    });
            });
        };

        // Get beer by id (/beer/beer_id)
        this.getBeer = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var beer_id = req.params.beer_id;

            beer.Beer.findById(beer_id).populate('author').exec(function (err, b) {
                if (err) {
                    return res.status(500).send({
                        message: 'Internal server error. ' + JSON.stringify(err)
                    });
                }

                return res.status(200).send({
                    "beer": b
                });
            });
        };

        // Create new beer
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
                yeast: body.yeast,
                hops: body.hops,
                recipe: body.recipe
            });

            newBeer.save(function (err, b) {
                if (err) {
                    return res.status(500).send({
                        message: 'Error saving new beer. ' + JSON.stringify(err)
                    });
                }

                return res.status(200).send({
                    "beer": b
                });
            });
        };

        // Update existing beer
        this.updateBeer = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var beer_id = req.params.beer_id;
            var body = req.body;

            beer.Beer.findById(beer_id).populate('author').exec(function (err, b) {
                if (err) {
                    return res.status(500).send({
                        message: 'Error searching for beer. ' + JSON.stringify(err)
                    });
                }

                b.name = body.name;
                b.malts = body.malts;
                b.yeast = body.yeast;
                b.hops = body.hops;
                b.recipe = body.recipe;

                b.save(function (err, newB) {
                    if (err) {
                        return res.status(500).send({
                            message: 'Error saving updates to beer. ' + JSON.stringify(err)
                        });
                    }

                    return res.status(200).send({
                        message: 'Beer saved.',
                        "beer": newB
                    });
                });
            });
        };

        // Delete a beer
        this.deleteBeer = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var beer_id = req.params.beer_id;

            beer.Beer.findByIdAndRemove(beer_id).populate('author').exec(function (err, b) {
                if (err) {
                    return res.status(500).send({
                        message: 'Error deleting beer. ' + JSON.stringify(err)
                    });
                }

                return res.status(200).send({
                    message: 'Beer deleted',
                    "beer": b
                });
            });
        };

        // Retrieve all 'cheers' in a beer
        this.getBeerCheers = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var beer_id = req.params.beer_id;

            beer.Beer.findById(beer_id).populate('author').exec(function (err, b) {
                if (err) {
                    return res.status(500).send({
                        message: 'Internal server error. ' + JSON.stringify(err)
                    });
                }

                return res.status(200).send({
                    "cheers": b.cheers
                });
            });
        };

        // Give a 'Cheers' to a beer
        this.createBeerCheers = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var beer_id = req.params.beer_id;

            beer.Beer.findById(beer_id).populate('author').exec(function (err, b) {
                if (err) {
                    return res.status(500).send({
                        message: 'Error searching for beer. ' + JSON.stringify(err)
                    });
                }

                b.cheers.push({
                    "user": new mongoose.Types.ObjectId(user_id),
                    "dateTime": new Date()
                });

                b.save(function (err, newB) {
                    if (err) {
                        return res.status(500).send({
                            message: 'Error saving new cheers to beer. ' + JSON.stringify(err)
                        });
                    }

                    return res.status(200).send({
                        message: 'Cheers saved.',
                        "beer": newB
                    });
                });
            });
        };

        // Retrieve comments from a beer
        this.getBeerComments = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var beer_id = req.params.beer_id;

            beer.Beer.findById(beer_id).populate('author').exec(function (err, b) {
                if (err) {
                    return res.status(500).send({
                        message: 'Internal server error. ' + JSON.stringify(err)
                    });
                }

                return res.status(200).send({
                    "comments": b.comments
                });
            });
        };

        // Comment on a beer
        this.createBeerComment = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var beer_id = req.params.beer_id;

            if (!req.body.comment)
                return res.status(500).send({
                    message: 'Comment is mandatory'
                });

            beer.Beer.findById(beer_id).populate('author').exec(function (err, b) {
                if (err) {
                    return res.status(500).send({
                        message: 'Error searching for beer. ' + JSON.stringify(err)
                    });
                }

                b.comments.push({
                    "user": new mongoose.Types.ObjectId(user_id),
                    "dateTime": new Date(),
                    "comment": req.body.comment,
                    "cheers": []
                });

                b.save(function (err, newB) {
                    if (err) {
                        return res.status(500).send({
                            message: 'Error saving new cheers to beer. ' + JSON.stringify(err)
                        });
                    }

                    return res.status(200).send({
                        message: 'Cheers saved.',
                        "beer": newB
                    });
                });
            });
        };

        // Get a particular comment from a beer
        this.getBeerComment = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var beer_id = req.params.beer_id;
            var comment_id = req.params.comment_id;

            beer.Beer.findById(beer_id).exec(function (err, b) {
                if (err)
                    return res.status(500).send({
                        message: 'Unable to find beer. ' + JSON.stringify(err)
                    });

                return res.status(200).send({
                    "comment": b.comments.id(comment_id)
                });
            });
        };

        // Update comment
        this.updateBeerComment = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var beer_id = req.params.beer_id;
            var comment_id = req.params.comment_id;
            var body = req.body;

            beer.Beer.findById(beer_id).populate('author').exec(function (err, b) {
                if (err) {
                    return res.status(500).send({
                        message: 'Error searching for beer. ' + JSON.stringify(err)
                    });
                }

                b.comments.id(comment_id).comment = body.comment;
                b.save(function (err, newB) {
                    if (err)
                        return res.status(500).send({
                            message: 'Error updating comment. ' + JSON.stringify(err)
                        });

                    return res.status(200).send({
                        message: 'Comment saved.',
                        "beer": b
                    });
                });
            });
        };

        // Delete comment from beer
        this.deleteBeerComment = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var beer_id = req.params.beer_id;
            var comment_id = req.params.comment_id;

            beer.Beer.findById(beer_id).populate('author').exec(function (err, b) {
                if (err) {
                    return res.status(500).send({
                        message: 'Error searching for beer. ' + JSON.stringify(err)
                    });
                }

                b.comments.pull({
                    _id: new mongoose.Types.ObjectId(comment_id)
                });

                b.save(function (err, newB) {
                    if (err)
                        return res.status(500).send({
                            message: 'Error updating comment. ' + JSON.stringify(err)
                        });

                    return res.status(200).send({
                        message: 'Comment deleted.',
                        "beer": b
                    });
                });
            });
        };

        // Give 'cheers' to a beer comment
        this.createBeerCommentCheers = function (req, res) {
            var user_id = _this.getUserId(req, res);
            var beer_id = req.params.beer_id;
            var comment_id = req.params.comment_id;

            beer.Beer.findById(beer_id).populate('author').exec(function (err, b) {
                if (err) {
                    return res.status(500).send({
                        message: 'Error searching for beer. ' + JSON.stringify(err)
                    });
                }

                b.comments.id(comment_id).cheers.push({
                    "user": new mongoose.Types.ObjectId(user_id),
                    "dateTime": new Date()
                });

                b.save(function (err, newB) {
                    if (err) {
                        return res.status(500).send({
                            message: 'Error saving new cheers to beer. ' + JSON.stringify(err)
                        });
                    }

                    return res.status(200).send({
                        message: 'Cheers saved.',
                        "beer": newB
                    });
                });
            });
        };
    }

    return BeerCtrl;
})(base.BaseCtrl);


module.exports = new BeerCtrl();
