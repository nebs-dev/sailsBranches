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
     * list all trees
     * @param req
     * @param res
     */
    list: function (req, res) {
        Tree.find().then(function (trees) {
            return res.ok(trees);
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
     * Update tree
     * @param req
     * @param res
     */
    update: function (req, res) {
        var params = req.params.all();

        User.findOne(req.token.userId).populate('role').then(function (reqUser) {
            if ((reqUser.tree !== params.id) && reqUser.role.name !== 'superadmin') return res.unauthorized();
            if (reqUser.role.name !== 'superadmin') delete params.licence;
            return Tree.update(params.id, params);

        }).then(function (tree) {
            return res.ok(tree[0]);

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
        User.findOne(req.token.userId).populate(['role', 'permissions']).then(function (reqUser) {
            var options;

            // user get users from all trees
            if (reqUser.role.name !== 'superadmin') {
                options = {
                    tree: reqUser.tree
                };
            }

            return [reqUser, User.find(options).populate('role').populate('tree')]

        }).spread(function (reqUser, users) {
            // only superadmin can see superadmins in list
            if (reqUser.role.name !== 'superadmin') {
                var users = _.filter(users, function (user) {
                    return user.role.name !== 'superadmin' && user.role.name !== 'superprof';
                });
            }

            return res.ok(users);

        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};

