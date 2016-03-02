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
            Branch.find(children).populate(['children', 'media', 'events']).then(function (branches) {
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

            allBranches = _.uniq(allBranches, function (item, key, id) {
                return item.id;
            });

            // If !tree return all branches in one level
            if (!tree) {
                return cb(null, allBranches);
            }

            // group branches by level
            var levels = _.toArray(_.groupBy(allBranches, 'level'));

            // Get all levels in tree form
            branchService.getLevelsTree(levels, function (err, levels) {
                if (err) return cb(err);
                return cb(null, levels);
            });
        });
    },

    /**
     * Get branch list for student
     * @param children
     * @param cb
     */
    studentList: function (children, cb) {
        Branch.find(children).then(function (branches) {

            // Get all branches (permitted branches and all its parents)
            var allParents = _.flatten(_.pluck(branches, 'parents'));
            var permittedBranches = _.pluck(branches, 'id');
            var allBranchIDs = _.uniq(_.union(allParents, permittedBranches));

            return [Branch.find(allBranchIDs), branches];

        }).spread(function (allBranches, permittedBranches) {
            allBranches = _.map(allBranches, function (b) {
                return b.toJSON();
            });

            // Get profs for each branch
            branchService.getProfs(allBranches, permittedBranches, function (err, allBranches) {
                if (err) return cb(err);

                // group branches by level
                var levels = _.toArray(_.groupBy(allBranches, 'level'));

                // Get all levels in tree form
                branchService.getLevelsTree(levels, function (err, levels) {
                    if (err) return cb(err);

                    return cb(null, levels);
                });
            });

        }).catch(function (err) {
            return cb(err);
        });
    },

    /**
     * Get users with role 'prof' for each branch
     * @param branches
     * @param cb
     */
    getProfs: function (branches, permittedBranches, cb) {

        // each branch
        async.each(branches, function (branch, callback) {
            // if branch is not in permitted branches, don't get profs
            if (!_.contains(_.pluck(permittedBranches, 'id'), branch.id)) return callback();

            // recursive function that search for profs in branch parents if branch don't have any
            findProfs(branch);
            function findProfs(branchTpm) {
                Permission.find({branch: branchTpm.id}).then(function (permissions) {
                    var usersIds = _.pluck(permissions, 'user');
                    return User.find(usersIds).populate('role');

                }).then(function (users) {

                    var profs = _.filter(users, function (user) {
                        return user.role.name === 'prof'
                    });
                    branchTpm.profs = profs;

                    if (branchTpm.profs.length || !branchTpm.parent) {
                        branch.profs = profs;
                        return callback();
                    } else {
                        Branch.findOne(branchTpm.parent).then(function (parent) {
                            findProfs(parent);
                        }).catch(function (err) {
                            return callback(err);
                        });
                    }

                }).catch(function (err) {
                    return callback(err);
                });
            }

        }, function (err) {
            if (err) return cb(err);
            return cb(null, branches);
        });
    },

    /**
     * Get all levels in tree form
     * @param levels
     * @param cb
     * @returns {*}
     */
    getLevelsTree: function (levels, cb) {
        for (var levelNo = levels.length - 2; levelNo >= 0; levelNo--) {
            _.each(levels[levelNo], function (branch) {

                var children = _.filter(levels[levelNo + 1], function (child) {
                    return child.parent === branch.id
                });

                branch.children = children;
            });
        }

        return cb(null, levels[0]);

        // Length = 1, 2, 3 / array = 0, 1, 2 => and we don't look last level because it don't have children, so length-2
        //for (var levelNo = levels.length - 2; levelNo >= 0; levelNo--) {
        //    _.each(levels[levelNo], function (level) {
        //        _.each(level.children, function (child, key) {
        //            var childFound = _.findWhere(allBranches, {parent: level.id});
        //            if (childFound) level.children[key] = childFound;
        //
        //            if (childFound) delete childFound.parent;
        //        });
        //    });
        //}
        //
        //return cb(null, levels[0]);
    }
    ,

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
    }
    ,

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
}
;