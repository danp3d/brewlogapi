import mongoose = require('mongoose');
import bcrypt = require('bcrypt-nodejs');

var userSchema:mongoose.Schema = new mongoose.Schema({
	name: String,
	email: String,
	salt: String,
	password: String,
	following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Beer' }],
	currentToken: {
		accessToken: String,
		expiresOn: Date
	}
});

export interface IToken {
	accessToken: string;
	expiresOn: Date;
}

export interface IUser extends mongoose.Document {
	name: string;
	email: string;
	salt: string;
	password: string;
	bookmarks: mongoose.Types.ObjectId[];
	currentToken: IToken;
	comparePassword: (pass: string, cb: (err: any, res: Boolean) => void) => void;
}

userSchema.pre('save', function (next) {
	if (!this.isModified('password'))
		return next();
		
	var user = <IUser>this;
		
	bcrypt.genSalt(10, function(err, salt) {
		if (err)
			return next(err);
		user.salt = salt;
		
		bcrypt.hash(user.password, user.salt, null, (err, hashed_pass) => {
			if (err)
				return next(err);
				
			user.password = hashed_pass;
			next();
		});
	});
});

userSchema.methods.toJSON = function () {
	var user = <IUser>this.toObject();
	delete user.password;
	delete user.salt;
	return user;
};

userSchema.methods.comparePassword = function (pass: string, cb) {
	bcrypt.compare(pass, <IUser>this.password, cb);
};

userSchema.methods.getMates = function (cb) {
	var self = this;
	return self.model('Mateship').find({ $or: [{ 'user1': self._id }, { 'user2': self._id }]}).populate('user1').populate('user2').exec(cb);
};


export interface IUserModel extends IUser, mongoose.Document { }

export var User = mongoose.model<IUserModel>("User", userSchema);