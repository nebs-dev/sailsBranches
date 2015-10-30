/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    'show': function (req, res) {
        var user_id = req.params.id;

        User.findOne(user_id).then(function (user) {
            if (!user) return res.notFound();
            return res.json(user);

        }).catch(function (err) {
            return res.serverError();
        });
    }

};

