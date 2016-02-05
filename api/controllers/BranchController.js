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

            // If parent == '' move branch to the top level
            console.log(params);
            if (params.parent && params.parent !== '') return res.ok(branch);

            delete branch[0].parent;
            branch[0].parents = [];
            branch[0].level = 0;

            branch[0].save(function (err, branch) {
                if (err) return res.negotiate(err);
                return res.ok(branch);
            })


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

        // Get branch && its children in save level
        branchService.list(children, false, function (err, branches) {
            if (err) return res.negotiate(err);

            // Get permissions for every branch
            var branchIds = _.pluck(branches, 'id');
            Permission.find({branch: branchIds}).then(function (permissions) {

                // Get users from branches permissions
                var userIds = _.pluck(permissions, 'user');
                User.find(userIds).populate('role').then(function (users) {

                    // Get only users with role 'student'
                    var students = _.filter(users, function (user) {
                        return user.role.name == 'student';
                    });
                    return res.ok(students);
                });

            }).catch(function (err) {
                return res.negotiate(err);
            });
        });
    }

};

