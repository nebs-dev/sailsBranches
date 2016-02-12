module.exports = function (req, res, next) {

    // Need to be logged in
    if (!req.token || !req.token.userId) return res.accessDenied('You are not allowed to do that');

    User.findOne(req.token.userId).populate('role').populate('tree').then(function (user) {

        // set Branch user to current user
        req.body.user = user.id;

        // If user is superadmin -> need to send tree ID
        if (user.role && user.role.name == 'superadmin') {
            return next();
        }

        // Only superprof can create branch for now
        if (!user.role || !user.role.add_branch) return res.accessDenied('You are not allowed to do that');

        // If user is NOT superadmin he has tree
        if (!user.tree) return res.accessDenied('You have no tree!');
        req.body.tree = user.tree;

        var parent = req.body.parent || 'undefined';

        // Get parent
        return [Branch.findOne(parent), user];

    }).spread(function (parent, user) {

        // Not allowed to create branch in a tree without licence
        if (!user.tree.licence) return res.accessDenied('Your tree has no licence!');

        // Get tree licence
        return [Licence.findOne(user.tree.licence), parent, user];

    }).spread(function (licence, parent, user) {

        // Set level
        var level = parent ? parent.level + 1 : 0;

        // Get branches in this level
        return [Branch.find({where: {level: level, tree: user.tree.id}}), licence];

    }).then(function (levelBranches, licence) {

        // horizontal check
        if (levelBranches.length + 1 > licence.horizontal)
            return res.accessDenied('Maximum branches in this level reached.');

        // vertical check
        if (level + 1 > licence.vertical)
            return res.accessDenied('Maximum levels reached.');

        next();

    }).catch(function (err) {
        return res.negotiate(err);
    });
};