module.exports = function(req, res, next) {
    var params = req.params.all();
    if (!params.email || !params.tree) return res.customBadRequest('Missing parameters.');

    User.findOne({email: params.email, tree: params.tree}).then(function (user) {

        if (user) return res.customBadRequest('Email already exists.');
        next();

    }).catch(function (err) {
        res.negotiate(err);
    });
};