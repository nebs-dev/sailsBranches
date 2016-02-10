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
            if (params.parent && (params.parent !== '' || params.parent !== '0' || params.parent !== 0)) return res.ok(branch);

            delete branch[0].parent;
            branch[0].parents = [];
            branch[0].level = 0;

            branch[0].save(function (err) {
                if (err) return res.negotiate(err);
                return res.ok(branch[0]);
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
        var params = req.params.all();
        if (params.type !== 'single' && params.type !== 'multiple') return res.customBadRequest();

        // single level
        if (params.type === 'single') {

            var branchIds = [params.id];
            branchService.getUsers(branchIds, params.type, function (err, users) {
                if (err) return res.negotiate(err);
                return res.ok(users);
            });

        // multiple levels
        } else {
            var children = [];
            children.push(params.id);

            // Get branch && its children in save level
            branchService.list(children, false, function (err, branches) {
                if (err) return res.negotiate(err);

                // Get all branch IDs from user permission
                var branchIds = _.pluck(branches, 'id');
                branchService.getUsers(branchIds, params.type, function (err, users) {
                    if (err) return res.negotiate(err);
                    return res.ok(users);
                });
            });
        }
    }

};

