/**
 * TreeController
 *
 * @description :: Server-side logic for managing trees
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    /**
     * Create tree
     * @param req
     * @param res
     */
    create: function (req, res) {
        var params = req.params.all();

        Tree.create(params).then(function (tree) {
            return res.json(tree);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Add licence to Tree
     * @param req
     * @param res
     * @returns {*}
     */
    addLicence: function (req, res) {
        var params = req.params.all();
        if (!params.licence || !params.tree) return res.customBadRequest('Missing Parameters.');

        async.parallel({
            tree: function (cb) {
                Tree.findOne(params.tree).populate('licence').exec(cb);
            },

            licence: function (cb) {
                Licence.findOne(params.licence).exec(cb);
            }

        }, function (err, result) {
            if (err) return res.negotiate(err);

            var tree = result.tree;
            var licence = result.licence;

            licence.trees.add(tree);
            licence.save(function (err) {
                if (err) return res.negotiate(err);

                return res.json(tree);
            });
        });
    },

    /**
     * Single tree
     * @param req
     * @param res
     */
    show: function (req, res) {
        Tree.findOne(req.params.id).populate('users').then(function (tree) {
            return res.json(tree);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Destroy Tree
     * @param req
     * @param res
     */
    destroy: function (req, res) {
        Tree.destroy(req.params.id).then(function () {
            return res.ok();
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Get all users from tree
     * @param req
     * @param res
     */
    getAllUsers: function (req, res) {
        User.findOne(req.token.userId).populate('role').then(function (reqUser) {
            var options;

            if (reqUser.role.name !== 'superadmin') {
                var options = {
                    tree: reqUser.tree
                };
            }

            User.find(options).populate('role').populate('tree').then(function (users) {
                if (reqUser.role.name !== 'superadmin') {
                    var users = _.filter(users, function (user) {
                        return user.role.name !== 'superadmin';
                    });
                }

                return res.ok(users);
            });

        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};

