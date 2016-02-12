module.exports = function (req, res, next) {
    var params = req.params.all();

    // Find req user object
    User.findOne(req.token.userId).then(function (reqUser) {

        // user email must be unique in one tree
        return [User.findOne({email: params.email, tree: params.tree}), reqUser];

    }).spread(function (user, reqUser) {
        if (user && user.id !== req.params.id) return res.customBadRequest('Email already exists.');
        if (reqUser.role.name === 'superadmin') return next();

        // Check if reqUser has permission to change user role
        if (params.role) {
            Role.findOne(params.role).then(function (role) {
                if (!role) return res.notFound('Role not found.');
                if (role.name === 'superadmin' || role.name === 'superprof') return res.unauthorized();

                return next();

            }).catch(function (err) {
                res.negotiate(err);
            });

        } else {
            return next();
        }

    }).catch(function (err) {
        res.negotiate(err);
    });
};