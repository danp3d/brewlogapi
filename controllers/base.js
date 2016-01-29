var jwt = require('jwt-simple');

// Export constructor
exports.BaseCtrl = (function () { // encapsulating the constructor like this so we ensure that 'this' will be clean.
    function BaseCtrl() {
        var _this = this;
        this.secret = 'b33r15g00d';

        this.getUserId = function (req, res) {
            if (!req.headers.authorization)
                return res.status(401).send({
                    message: 'User not logged in'
                });

            var token = req.headers.authorization.split(' ');
            var payload = jwt.decode(token[1], _this.secret);
            var user_id = payload.sub;

            return user_id;
        };
    }

    return BaseCtrl;
})();
