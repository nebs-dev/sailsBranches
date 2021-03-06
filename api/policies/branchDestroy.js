module.exports = function (req, res, next) {
    var params = req.params.all();

    if (!req.token || !req.token.userId) return res.accessDenied('You are not allowed to do that');
    if (!params.id) return res.customBadRequest('Missing parameters.');

    // Check if user have permission to access this branch
    branchService.checkPermission(req.token.userId, params.id, function (err, user, branch) {
        if (err) return res.unauthorized(err.err);

        // Check if user have permission to destroy branch
        if (!user.role.add_branch && user.role.name != 'superadmin') return res.accessDenied('You are not allowed to do that');

        next();
    });
};