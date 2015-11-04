/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    /**
     * List all users
     * @param req
     * @param res
     */
    list: function (req, res) {
        User.find().populateAll().then(function (users) {
            return res.json(users);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Show user profile
     * @param req
     * @param res
     */
    show: function (req, res) {
        User.findOne(req.params.id).then(function (user) {
            if (!user) return res.notFound();
            return res.json(user);

        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Update user
     * @param req
     * @param res
     */
    update: function (req, res) {
        var params = req.params.all();

        User.update(req.params.id, params).then(function (user) {
            return res.json(user);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Add role to user
     * @param req
     * @param res
     * @returns {*}
     */
    addRole: function (req, res) {
        var params = req.params.all();
        if (!params.user_id || !params.role_id) return res.customBadRequest('Missing Parameters.');

        Role.findOne(params.role_id).then(function (role) {

            role.users.add(params.user_id);
            role.save(function (err, role) {
               if (err) return res.negotiate(err);

                return res.json(role);
            });

        }).catch(function (err) {
           return res.negotiate(err);
        });
    }

};

