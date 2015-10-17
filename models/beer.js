/// <reference path="../typings/mongoose/mongoose.d.ts" />
var mongoose = require('mongoose');
var beerSchema = new mongoose.Schema({
    name: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: Date,
    cheers: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            dateTime: Date
        }],
    comments: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            dateTime: Date,
            comment: String,
            cheers: [{
                    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                    dateTime: Date
                }]
        }],
    malts: [{
            name: String,
            qty: Number
        }],
    yeast: [{
            name: String,
            qty: Number
        }],
    hops: [{
            name: String,
            qty: Number,
            time: String,
            dryHop: Boolean
        }],
    recipe: String
});
exports.Beer = mongoose.model("Beer", beerSchema);
//# sourceMappingURL=beer.js.map