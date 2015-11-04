module.exports = function(req, res, next) {
    var userId = req.param('id');
    var currentUserId = req.token.userId;

    User.findOne(req.token.userId).populate('role').then(function (user) {
        // If user is superadmin allow
        if (user.role && user.role.name == 'superadmin') return next();

        // Check if user updates himself
        if (userId != currentUserId)
            return res.accessDenied('You are not allowed to do that');

        // If user is not superadmin he can't change his role && licence
        delete req.body.role;
        delete req.body.licence;

        next();
    });
};