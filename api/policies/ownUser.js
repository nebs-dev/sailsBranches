module.exports = function(req, res, next) {
    var userId = req.param('id');
    //var currentUserId = req.token.sid;
    var currentUserId = req.token;

    if (userId != currentUserId) {
        return res.json(403, {err: 'You are not allowed to do that'});
    }

    next();
};