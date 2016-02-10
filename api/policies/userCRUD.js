module.exports = function(req, res, next) {
    var params = req.params.all();
    if (!params.email) return res.customBadRequest('Missing parameters.');

    // Find creator user object
    User.findOne(req.token.userId).then(function (creator) {
        // superadmin must send tree ID
        if (creator.role.name === 'superadmin') {
            if (!params.tree) return res.customBadRequest('Mising parameters.');
        } else {
            req.body.tree = creator.tree;
            params.tree = creator.tree;
        }

        // user email must be unique in one tree
        User.findOne({email: params.email, tree: params.tree}).then(function (user) {
            if (user) return res.customBadRequest('Email already exists.');
            next();
        });

    }).catch(function (err) {
        res.negotiate(err);
    });
};