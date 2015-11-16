module.exports = function(req, res, next) {
    var params = req.params.all();

    // Need to be logged in
    if (!req.token || !req.token.userId) return res.accessDenied('You are not allowed to do that');

    // Check if user have permission to access this branch
    filePermission.checkPermission(req.token.userId, params.id, function (err) {
        if (err) return res.unauthorized();

        next();
    });
};