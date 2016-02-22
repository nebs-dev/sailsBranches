module.exports = function (req, res, next) {
    var params = req.params.all();

    // Find req user object
    User.findOne(req.token.userId).populate('role').then(function (reqUser) {

        // user email must be unique in one tree
        return [User.findOne({email: params.email, tree: params.tree}), User.findOne(req.params.id), reqUser];

    }).spread(function (userEmail, user, reqUser) {
        if (userEmail && userEmail.id !== req.params.id) return res.customBadRequest('Email already exists.');
        if (reqUser.role.name === 'superadmin') return next();

        // if !superadmin check if user is in reqUsers tree
        if (reqUser.tree !== user.tree) return res.unauthorized();

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