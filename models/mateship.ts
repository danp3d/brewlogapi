import mongoose = require('mongoose');

var mateshipSchema:mongoose.Schema = new mongoose.Schema({
	user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export interface IMateship extends mongoose.Document {
	user1: mongoose.Schema.Types.ObjectId,
	user2: mongoose.Schema.Types.ObjectId
}

export interface IMateshipModel extends IMateship, mongoose.Document { }

export var Mateship = mongoose.model<IMateshipModel>("Mateship", mateshipSchema);
