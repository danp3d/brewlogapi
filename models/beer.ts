
/// <reference path="../typings/mongoose/mongoose.d.ts" />

import mongoose = require('mongoose');

var beerSchema:mongoose.Schema = new mongoose.Schema({
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

export interface IIngredient {
	name: string,
	qty: number
}

export interface IHop extends IIngredient {
	time: String,
	dryHop: Boolean	
}

export interface ICheers {
	user: mongoose.Types.ObjectId;
	dateTime: Date;
}

export interface IComment {
	user: mongoose.Types.ObjectId;
	dateTime: Date;
	comment: string,
	cheers: ICheers[]
}

export interface IBeer extends mongoose.Document {
	name: string;
	author: mongoose.Types.ObjectId;
	createdAt: Date;
	cheers: ICheers[];
	comments: IComment[];
	malts: IIngredient[];
	yeasts: IIngredient[];
	hops: IHop[];
	recipe: string;
}

export interface IBeerModel extends IBeer, mongoose.Document { }

export var Beer = mongoose.model<IBeerModel>("Beer", beerSchema);
