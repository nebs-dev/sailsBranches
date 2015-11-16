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
        if (!params.user || !params.branch) return res.customBadRequest('Missing Parameters.');

        var data = {
            user: params.user,
            branch: params.branch
        };

        // First check if this permission already exist.
        Permission.findOne({user: params.user, branch: params.branch}).then(function (permission) {
            if (permission) return res.customBadRequest('Already added');

            Permission.create(data).then(function (permission) {
                return res.json(permission);
            });

        }).catch(function (err) {
            return res.negotiate(err);
        });
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

