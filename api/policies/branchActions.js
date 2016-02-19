module.exports = function (req, res, next) {
    var params = req.params.all();

    if (!req.token || !req.token.userId) return res.accessDenied('You are not allowed to do that');
    if (!params.branches || !params.branches.length) return res.customBadRequest('Missing parameters.');

    if (!(params.branches instanceof Array)) {
        params.branches = [params.branches];
        req.body.branches = params.branches;
    }

    async.each(params.branches, function (branch, cb) {

        // Check if user have permission to access this branch
        branchService.checkPermission(req.token.userId, branch, function (err, user, branch) {
            if (err) return cb(err);

            // Check if user have permission to add user to branch
            if (!user.role.add_student && user.role.name != 'superadmin') return cb('You are not allowed to do that');

            cb();
        });

    }, function (err) {
        if (err) return res.unauthorized('You are not allowed to do that');

        next();
    });
};