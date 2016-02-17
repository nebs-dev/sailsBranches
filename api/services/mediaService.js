module.exports = {

    /**
     * Check user permissions for branches
     * @param req
     * @param cb
     */
    checkBranches: function (req, cb) {
        var params = req.params.all();
        if (!req.token) return cb({err: 'Token is mandatory'});

        // Find req user
        User.findOne(req.token.userId).then(function (reqUser) {
            return Permission.find({user: reqUser.id});

        }).then(function (permissions) {
            // Check if user added branch that is not allowed to him
            var permittedBranches = _.pluck(permissions, 'branch');
            var notAllowedBranches = _.difference(params.branches, permittedBranches);

            if (notAllowedBranches.length) return cb({err: 'not allowed'});

            return cb();

        }).catch(function (err) {
            return cb(err);
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

            return [Media.findOne(file_id).populate('branches'), user];

        }).spread(function (media, user) {
            if (!media) return callback({err: "file not found"});

            // Check if user have permission for this branch
            var permittedBranches = _.pluck(user.permissions, 'branch');
            var fileBranches = _.pluck(media.branches, 'id');

            // If intersection between file branches && user branches return min one result - allow
            var allowedBranches = _.intersection(permittedBranches, fileBranches);
            if (!allowedBranches.length) return cb({err: "not allowed"});

            return cb();

        }).catch(function (err) {
            return cb(err);
        });
    },

    /**
     * Save/create file categories
     * @param media
     * @param params
     * @param cb
     * @returns {*}
     */
    saveCategories: function (media, params, cb) {
        if (!params.categories) return cb(null, media);

        if (!(params.categories instanceof Array)) {
            params.categories = [params.categories];
        }

        var mediaClone = _.clone(media);

        // each param.categories
        async.map(params.categories, function (category, callback) {
            // find category by title
            MediaCategory.findOne({'title': category}).then(function (mediaCategory) {

                // if category not found, create it
                if (!mediaCategory) {
                    return MediaCategory.create({'title': category});
                } else {
                    return mediaCategory;
                }

            }).then(function (mCategory) {
                // add found/created category to media
                media.categories.add(mCategory);
                media.save(function (err) {
                    if (err) return callback(err);

                    mediaClone.categories.push(mCategory);
                    return callback(null, mCategory);
                });

            }).catch(function (err) {
                return cb(err);
            });

        }, function (err, data) {
            if (err) return cb(err);
            // return media with categories
            return cb(null, mediaClone);
        });
    },


    /**
     * Get uploaded media type
     * @param uploadedFile
     * @param cb
     */
    getMediaType: function (uploadedFile, cb) {
        var photoTypes = ['image/jpeg', 'image/png', 'image/gif'];
        var videoTypes = ['video/avi']
    }

};