
module.exports = {

    checkPermission: function (user_id, branch_id, callback) {
        User.findOne(user_id).populate('role').populate('permissions').then(function (user) {

            // If user is superadmin allow
            if (user.role && user.role.name == 'superadmin') return callback(null, user, null);

            Branch.findOne(branch_id).then(function (branch) {

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

    }
};