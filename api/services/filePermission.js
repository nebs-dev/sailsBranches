
module.exports = {

    checkPermission: function (user_id, file_id, cb) {
        User.findOne(user_id).populate('role').populate('permissions').then(function (user) {
            if (!user) return callback({err: "user not found"});

            // If user is superadmin allow
            if (user.role && user.role.name == 'superadmin') return cb();

            File.findOne(file_id).populate('branches').then(function (file) {

                // Check if user have permission for this branch
                var permittedBranches = _.pluck(user.permissions, 'branch');
                var fileBranches = _.pluck(file.branches, 'id');

                // If intersection between file branches && user branches return min one result - allow
                var allowedBranches = _.intersection(permittedBranches, fileBranches);
                if (!allowedBranches.length) return cb({err: "not allowed"});

                return cb();
            });

        }).catch(function (err) {
            return cb(err);
        });

    }
};