var mongoose = require('mongoose');
var mateshipSchema = new mongoose.Schema({
    user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
exports.Mateship = mongoose.model("Mateship", mateshipSchema);
//# sourceMappingURL=mateship.js.map