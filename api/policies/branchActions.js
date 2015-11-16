module.exports = function (req, res, next) {
    var params = req.params.all();

    if (!req.token || !req.token.userId) return res.accessDenied('You are not allowed to do that');
    if (!params.branch) return res.customBadRequest('Missing parameters.');

    // Check if user have permission to access this branch
    branchPermission.checkPermission(req.token.userId, params.branch, function (err, user, branch) {
        if (err) return res.unauthorized();

        // Check if user have permission to add user to branch
        if (!user.role.add_student && user.role.name != 'superadmin') return res.accessDenied('You are not allowed to do that');

        next();
    });
};