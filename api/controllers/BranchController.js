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
            return res.negotiate(err);
        });
    },

    /**
     * Get list of branches for "student" role
     * @param req
     * @param res
     */
    studentList: function (req, res) {
        User.findOne(req.token.userId).populate('permissions').then(function (user) {

            var children = _.pluck(user.permissions, 'branch');

            branchService.studentList(children, function (err, branches) {
                if (err) return res.negotiate(err);

                return res.ok(branches);
            });

        }).catch(function (err) {
            return res.negotiate(err);
        });
    },


    /**
     * Get single branch and its children
     * @param req
     * @param res
     */
    show: function (req, res) {
        Branch.findOne(req.params.id).then(function (branch) {
            if (!branch) return res.notFound('Branch not found.');

            branchService.list([branch.id], true, function (err, branches) {
                if (err) return res.negotiate(err);

                return res.ok(branches[0]);
            });

        }).catch(function (err) {
            return res.negotiate(err);
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

        branchService.getUsers(params, 'student', function (err, students) {
            if (err) return res.negotiate(err);
            return res.ok(students);
        });
    },

    /**
     * Get all users in branch and in its children
     * @param req
     * @param res
     */
    getUsers: function (req, res) {
        var params = req.params.all();
        if (params.type !== 'single' && params.type !== 'multiple') return res.customBadRequest();

        branchService.getUsers(params, 'all', function (err, students) {
            if (err) return res.negotiate(err);
            return res.ok(students);
        });
    }

};

