/**
 * RoleController
 *
 * @description :: Server-side logic for managing roles
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    /**
     * List roles
     * @param req
     * @param res
     */
    list: function (req, res) {
        Role.find().populateAll().then(function (roles) {
            return res.json(roles);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Create new role
     * @param req
     * @param res
     */
    create: function (req, res) {
        var params = req.params.all();

        Role.create(params).then(function (role) {
            return res.json(role);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Update role
     * @param req
     * @param res
     */
    update: function (req, res) {
        var params = req.params.all();

        Role.update(req.params.id, params).then(function(role) {
            return res.json(role);
        }).catch(function (err) {
           return res.negotiate(err);
        });
    }

};