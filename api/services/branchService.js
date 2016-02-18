module.exports = {

    /**
     * Check user permission for single branch
     * @param user_id
     * @param branch_id
     * @param callback
     */
    checkPermission: function (user_id, branch_id, callback) {
        User.findOne(user_id).populate('role').populate('permissions').then(function (user) {
            if (!user) return callback({err: "user not found"});

            // If user is superadmin allow
            if (user.role && user.role.name == 'superadmin') return callback(null, user, null);

            Branch.findOne(branch_id).then(function (branch) {
                if (!branch) return callback({err: "branch not found"});

                // Check if user have permission for this branch
                var permittedBranches = _.pluck(user.permissions, 'branch');
                if (permittedBranches.indexOf(branch.id) > -1) return callback(null, user, branch);

                // Check if user have permission for any of this branch parents
                var allowedParents = _.intersection(permittedBranches, branch.parents);
                if (!allowedParents.length) return callback({err: "not allowed"});

                return callback(null, user, branch);
            }).catch(function (err) {
               return callback(err);
            });

        }).catch(function (err) {
            return callback(err);
        });
    },


    /**
     * Get list of branches by IDs
     * @param children
     * @param tree
     * @param cb
     */
    list: function (children, tree, cb) {
        var allBranches = [];

        async.until(function () {
            return !children.length;
        }, function (callback) {
            Branch.find(children).populate('children').populate('media').then(function (branches) {
                var allChildren = [];

                _.each(branches, function (branch) {
                    var branchToJSON = branch.toJSON();
                    branchToJSON.children = _.pluck(branchToJSON.children, 'id');
                    allBranches.push(branchToJSON);
                    allChildren = allChildren.concat(branchToJSON.children);
                });

                children = allChildren;
                return callback(null);

            }).catch(function (err) {
                return callback(err);
            });

        }, function (err) {
            if (err) return cb(err);

            var levels = _.toArray(_.groupBy(allBranches, 'level'));

            // If !tree return all branches in one level
            var uniqueBranches = _.uniq(allBranches, function (item, key, id) {
                return item.id;
            });
            if (!tree) return cb(null, uniqueBranches);

            // Length = 1, 2, 3 / array = 0, 1, 2 => and we don't look last level because it don't have children, so length-2
            for (var levelNo = levels.length - 2; levelNo >= 0; levelNo--) {
                _.each(levels[levelNo], function (level) {
                    _.each(level.children, function (child, key) {
                        var childFound = _.findWhere(allBranches, {parent: level.id});
                        level.children[key] = childFound;
                        if (childFound) delete childFound.parent;
                    });
                });
            }

            return cb(null, levels[0]);
        });
    },

    /**
     * Get all users by level, role && branchIDs
     * @param params
     * @param role
     * @param cb
     */
    getUsers: function (params, role, cb) {
        // single level
        if (params.type === 'single') {
            var branchIds = [params.id];
            branchService.getBranchUsers(branchIds, role, function (err, users) {
                if (err) return cb(err);
                return cb(null, users);
            });

            // multiple levels
        } else {
            var children = [];
            children.push(params.id);

            // Get branch && its children in save level
            branchService.list(children, false, function (err, branches) {
                if (err) return cb(err);

                // Get all branch IDs from user permission
                var branchIds = _.pluck(branches, 'id');
                branchService.getBranchUsers(branchIds, role, function (err, users) {
                    if (err) return cb(err);
                    return cb(null, users);
                });
            });
        }
    },

    /**
     * Get users by branchIds and role
     * @param branch
     * @param cb
     */
    getBranchUsers: function (branchIds, role, cb) {
        // Get permissions for every branch
        Permission.find({branch: branchIds}).then(function (permissions) {

            // Get users from branch permissions
            var userIds = _.pluck(permissions, 'user');
            return [User.find(userIds).populate('role'), branchIds, role];

        }).spread(function (users, branchIds, role) {

            // Get only users with role 'student' if role === 'student'
            if (role === 'student') {
                var users = _.filter(users, function (user) {
                    return user.role.name === role;
                });
            } else {
                var users = _.filter(users, function (user) {
                    return user.role.name !== 'superadmin' && user.role.name !== 'superprof';
                });
            }

            return cb(null, users);

        }).catch(function (err) {
            return cb(err);
        });
    }
};