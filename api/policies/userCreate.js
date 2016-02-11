module.exports = function (req, res, next) {
    var params = req.params.all();

    // Find creator user object
    User.findOne(req.token.userId).then(function (creator) {
        // superadmin must send tree ID
        if (creator.role.name === 'superadmin') {
            if (!params.tree) return res.customBadRequest('Mising parameters.');
        } else {
            // set body.tree for controller
            req.body.tree = creator.tree;
            params.tree = creator.tree;
        }

        // user email must be unique in one tree
        User.findOne({email: params.email, tree: params.tree}).then(function (user) {
            if (user) return res.customBadRequest('Email already exists.');

            return next();
        });

    }).catch(function (err) {
        res.negotiate(err);
    });
};