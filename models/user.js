var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var userSchema = new mongoose.Schema({
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
userSchema.pre('save', function (next) {
    if (!this.isModified('password'))
        return next();
    var user = this;
    bcrypt.genSalt(10, function (err, salt) {
        if (err)
            return next(err);
        user.salt = salt;
        bcrypt.hash(user.password, user.salt, null, function (err, hashed_pass) {
            if (err)
                return next(err);
            user.password = hashed_pass;
            next();
        });
    });
});
userSchema.methods.toJSON = function () {
    var user = this.toObject();
    delete user.password;
    delete user.salt;
    return user;
};
userSchema.methods.comparePassword = function (pass, cb) {
    bcrypt.compare(pass, this.password, cb);
};
userSchema.methods.getMates = function (cb) {
    var self = this;
    return self.model('Mateship').find({ $or: [{ 'user1': self._id }, { 'user2': self._id }] }).populate('user1').populate('user2').exec(cb);
};
exports.User = mongoose.model("User", userSchema);
//# sourceMappingURL=user.js.map