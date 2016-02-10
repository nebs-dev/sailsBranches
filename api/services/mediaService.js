module.exports = {

    /**
     * Add branches to media object
     * @param media
     * @param branches
     * @param cb
     * @returns {*}
     */
    saveBranches: function (media, branches, cb) {
        if (!branches || !branches.length) return cb();

        //media.branches.add(branches[0]);
        media.save(function (err) {
            console.log(err);
            if (err) return cb(err);

            return cb(null, media);
        });
    },

    /**
     * Check permission for one file
     * @param user_id
     * @param file_id
     * @param cb
     */
    checkPermission: function (user_id, file_id, cb) {
        User.findOne(user_id).populate('role').populate('permissions').then(function (user) {
            if (!user) return callback({err: "user not found"});

            // If user is superadmin allow
            if (user.role && user.role.name == 'superadmin') return cb();

            Media.findOne(file_id).populate('branches').then(function (media) {
                if (!media) return callback({err: "file not found"});

                // Check if user have permission for this branch
                var permittedBranches = _.pluck(user.permissions, 'branch');
                var fileBranches = _.pluck(media.branches, 'id');

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