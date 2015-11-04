module.exports = function(req, res, next) {

    // Need to be logged in
    if (!req.token || !req.token.userId) return res.accessDenied('You are not allowed to do that');

    User.findOne(req.token.userId).populate('role').populate('permissions').then(function (user) {

        // If user is superadmin allow
        if (user.role && user.role.name == 'superadmin') return next();

        Branch.findOne(req.params.id).then(function (branch) {

            // Check if user have permission for this branch
            var permittedBranches = _.pluck(user.permissions, 'branch');
            if (permittedBranches.indexOf(branch.id) > -1) return next();

            // Check if user have permission for any of this branch parents
            var allowedParents = _.intersection(permittedBranches, branch.parents);
            if (!allowedParents.length) return res.accessDenied();

            next();
        });

    }).catch(function (err) {
        return res.negotiate(err);
    });
};