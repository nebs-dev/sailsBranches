module.exports = function (req, res, next) {
    var token;

    if (req.headers && req.headers.authorization) {
        var parts = req.headers.authorization.split(' ');
        if (parts.length == 2) {
            var scheme = parts[0],
                credentials = parts[1];

            if (/^Bearer$/i.test(scheme)) {
                token = credentials;
            }
        } else {
            return res.unauthorized('Format is Authorization: Bearer [token]');
        }
    } else if (req.param('token')) {
        token = req.param('token');
        // We delete the token from param to not mess with blueprints
        delete req.query.token;
    } else {
        return res.unauthorized('No Authorization header was found');
    }

    sailsTokenAuth.verifyToken(token, function (err, token) {
        if (err) return res.unauthorized('The token is not valid');

        // Check user secret
        User.findOne(token.userId).then(function (user) {
            if (user.secret != token.secret) {
                return res.unauthorized('The token is not valid');
            }

            req.token = token;
            next();

            return null;

        }).catch(function (err) {
            if (err) return res.unauthorized(err);
        });
    });
};