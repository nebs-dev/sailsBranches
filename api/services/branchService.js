
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
            });

        }).catch(function (err) {
            return callback(err);
        });
    },



    list: function (children, tree, cb) {
        var allBranches = [];

        async.until(function() {
            return !children.length;
        }, function(callback) {
            Branch.find(children).populate('children').populate('media').then(function (branches) {
                var allChildren = [];

                _.each(branches, function(branch) {
                    var branchToJSON = branch.toJSON();
                    branchToJSON.children = _.pluck(branchToJSON.children, 'id');
                    allBranches.push(branchToJSON);
                    allChildren = allChildren.concat(branchToJSON.children);
                });

                children = allChildren;
                return callback(null);

            }).catch(function(err) {
                return callback(err);
            });

        }, function(err){
            if (err) return cb(err);

            var levels = _.toArray(_.groupBy(allBranches, 'level'));

            // If !tree return all branches in one level
            var uniqueBranches = _.uniq(allBranches, function(item, key, id) {
                return item.id;
            });
            if (!tree) return cb(null, uniqueBranches);

            // Length = 1, 2, 3 / array = 0, 1, 2 => and we don't look last level because it don't have children, so length-2
            for(var levelNo=levels.length-2; levelNo>=0; levelNo--) {
                _.each(levels[levelNo], function(level) {
                    _.each(level.children, function(child, key) {
                        var childFound = _.findWhere(allBranches, {parent: level.id});
                        level.children[key] = childFound;
                        if(childFound) delete childFound.parent;
                    });
                });
            }

            return cb(null, levels[0]);
        });
    }
};