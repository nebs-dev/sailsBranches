module.exports = function (req, res, next) {
    if (!req.token || !req.token.userId) return res.accessDenied('You are not allowed to do that');

    User.findOne(req.token.userId).populate('role').then(function (user) {
        if ((!user || !user.role) || (user.role.name != 'superprof' && user.role.name != 'superadmin')) return res.accessDenied('You are not allowed to do that');

        next();

    }).catch(function (err) {
        return res.negotiate(err);
    });
};