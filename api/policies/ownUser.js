module.exports = function (req, res, next) {

    User.findOne(req.token.userId).populate('role').then(function (reqUser) {
        User.findOne(req.params.id).populate('role').then(function (user) {
            if (!user) return res.notFound('User not found.');

            // If req user is superadmin allow
            if (reqUser.role && reqUser.role.name == 'superadmin') return next();

            // if req user is superprof allow to edit prof && student
            if (reqUser.role.name === 'superprof' && (user.role.name === 'prof' || user.role.name === 'student'))
                return next();

            // Check if user updates himself
            if (user.id != reqUser.id)
                return res.accessDenied('You are not allowed to do that');

            // If user is not superadmin he can't change his role && licence
            delete req.body.role;
            delete req.body.licence;

            return next();
        });

    }).catch(function (err) {
        return res.negotiate(err);
    });
};