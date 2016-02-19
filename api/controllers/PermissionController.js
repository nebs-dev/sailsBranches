/**
 * PermissionController
 *
 * @description :: Server-side logic for managing permissions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    /**
     * Give user permission for branch
     * @param req
     * @param res
     * @returns {*}
     */
    add: function (req, res) {
        var params = req.params.all();

        Permission.destroy({user: params.user}).then(function () {
            // Create permission for each params.branches
            async.each(params.branches, function (branch, cb) {
                Permission.create({user: params.user, branch: branch}).then(function (permission) {
                    return cb();
                }).catch(function (err) {
                   return cb(err);
                });

            }, function (err) {
                if (err) return res.negotiate(err);
                return res.ok();
            });

        }).catch(function (err) {
           return res.negotiate(err);
        });

        // First check if this permission already exist.
        //Permission.findOne({user: params.user, branch: params.branch}).then(function (permission) {
        //    if (permission) return res.customBadRequest('Already added');
        //    return Permission.create(data)
        //
        //}).then(function (permission) {
        //    return res.json(permission);
        //
        //}).catch(function (err) {
        //    return res.negotiate(err);
        //});
    },

    /**
     * Remove user permission for branch
     * @param req
     * @param res
     * @returns {*}
     */
    remove: function (req, res) {
        var params = req.params.all();
        if (!params.user || !params.branch) return res.customBadRequest('Missing Parameters.');

        Permission.destroy({where: {user: params.user, branch: params.branch}}).then(function () {
            return res.json('Destroyed');
        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};

