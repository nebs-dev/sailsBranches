module.exports = function(req, res, next) {

    // Need to be logged in
    if (!req.token || !req.token.userId) return res.accessDenied('You are not allowed to do that');

    // Check if user have permission to access this branch
    branchPermission.checkPermission(req.token.userId, params.branch, function (err, user, branch) {
        if (err) return res.unauthorized(err.err);

        next();
    });
};