/**
 * BranchController
 *
 * @description :: Server-side logic for managing branches
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    /**
     * List all branches && children
     * @param req
     * @param res
     */
    list: function (req, res) {
        User.findOne(req.token.userId).populate('permissions').then(function (user) {

            var children = _.pluck(user.permissions, 'branch');

            branchService.list(children, true, function (err, branches) {
                if (err) return res.negotiate(err);

                return res.ok(branches);
            });

        }).catch(function (err) {
            return res.json(err);
        });
    },

    /**
     * Create new branch
     * @param req
     * @param res
     */
    create: function (req, res) {
        var params = req.params.all();

        Branch.create(params).then(function (branch) {
            return res.json(branch);
        }).catch(function (err) {
            return res.json(err);
        });
    },

    /**
     * Update branch
     * @param req
     * @param res
     */
    update: function (req, res) {
        var params = req.params.all();

        Branch.update(req.params.id, params).then(function (branch) {
            return res.json(branch);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * View branch
     * @param req
     * @param res
     */
    view: function (req, res) {
        Branch.findOne(req.params.id).then(function (branch) {
            return res.json(branch);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Destroy Branch
     * @param req
     * @param res
     */
    destroy: function (req, res) {
        Branch.destroy(req.params.id).then(function () {
            return res.ok();
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Get all students in branch and in its children
     * @param req
     * @param res
     */
    getStudents: function (req, res) {
        var children = [];
        children.push(req.params.id);

        branchService.list(children, false, function (err, branches) {
            if (err) return res.negotiate(err);

            var branchIds = _.pluck(branches, 'id');
            Permission.find({branch: branchIds}).then(function (permissions) {
                var userIds = _.pluck(permissions, 'user');

                User.find(userIds).then(function (users) {
                    return res.ok(users);
                });

            }).catch(function (err) {
                return res.negotiate(err);
            });
        });
    }

};

