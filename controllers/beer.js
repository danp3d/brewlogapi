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
                beer.Beer.find({ $or: [{ 'user': new mongoose.Types.ObjectId(user_id) }, { '_id': { $in: usr.bookmarks } }] })
                    .populate('author')
                    .exec(function (err, beers) {
                    if (err)
                        return res.status(500).send({ message: 'Internal server error' });
                    res.status(200).send({ 'beers': beers });
                });
            });
        };
    }
    return BeerCtrl;
})(base.BaseCtrl);
module.exports = new BeerCtrl();
//# sourceMappingURL=beer.js.map