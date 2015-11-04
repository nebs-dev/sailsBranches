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

        if (!params.user_id || !params.branch_id) return res.customBadRequest('Missing Parameters.');

        var data = {
            user: params.user_id,
            branch: params.branch_id
        };

        Permission.create(data).then(function (permission) {

            return res.json(permission);

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

        if (!params.user_id || !params.branch_id) return res.customBadRequest('Missing Parameters.');

        Permission.destroy({where: {user: params.user_id, branch: params.branch_id}}).then(function () {

            return res.json('OK');

        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};

