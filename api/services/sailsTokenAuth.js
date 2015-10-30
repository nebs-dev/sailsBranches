var jwt = require('jsonwebtoken');

module.exports = {

    issueToken: function (payload) {
        var token = jwt.sign(payload, process.env.TOKEN_SECRET || "our biggest secret", {
            expiresIn: 3600
        });
        return token;
    },

    verifyToken: function (token, verified) {
        return jwt.verify(token, process.env.TOKEN_SECRET || "our biggest secret", {}, verified);
    }
};