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
        User.find().populate('role').then(function (users) {
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
        User.findOne(req.params.id).populateAll().then(function (user) {
            if (!user) return res.notFound();
            return res.json(user);

        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Create user
     * @param req
     * @param res
     */
    create: function (req, res) {
        var params = req.params.all();

        User.create(params).then(function (user) {
            return [user, Role.findOne(params.role)];
        }).spread(function (user, role) {
            user.role = role;
            return [Permission.find({user: user.id}), user];
        }).spread(function (permissions, user) {
            user.permissions = permissions;
            return res.ok(user);

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
            return Permission.find({user: user.id});
        }).spread(function (permissions, user) {
            user.permissions = permissions;
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
        if (!params.user || !params.role) return res.customBadRequest('Missing Parameters.');

        Role.findOne(params.role).then(function (role) {

            role.users.add(params.user);
            role.save(function (err) {
                if (err) return res.negotiate(err);

                return res.json(role);
            });

        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Add Tree to User
     * @param req
     * @param res
     * @returns {*}
     */
    addTree: function (req, res) {
        var params = req.params.all();
        if (!params.user || !params.tree) return res.customBadRequest('Missing Parameters.');

        Tree.findOne(params.tree).then(function (tree) {
            tree.users.add(params.user);
            tree.save(function (err) {
                if (err) return res.negotiate(err);

                return res.json(tree);
            });

        }).catch(function (err) {
            return res.negotiate(err);
        });
    },


    /**
     * User destroy
     * @param req
     * @param res
     */
    destroy: function (req, res) {
        User.destroy(req.params.id).then(function () {
            return res.ok();
        }).catch(function (err) {
            return res.negotiate(err);
        });
    }
};

