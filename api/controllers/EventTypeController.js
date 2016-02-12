/**
 * EventTypeController
 *
 * @description :: Server-side logic for managing event types
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * Create Event Type
     * @param req
     * @param res
     */
    create: function (req, res) {
        var params = req.params.all();

        User.findOne(req.token.userId).then(function (user) {
            if (user.role.name !== 'superadmin') params.tree = user.tree;
            return EventType.create(params);

        }).then(function (type) {
            return res.ok(type);

        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Update Event type
     * @param req
     * @param res
     */
    update: function (req, res) {
        var params = req.params.all();

        User.findOne(req.token.userId).then(function (user) {
            if (user.role.name !== 'superadmin') params.tree = user.tree;
            return EventType.update(params);
        }).then(function (type) {
            return res.ok(type[0]);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * List of all Event Types
     * @param req
     * @param res
     */
    list: function (req, res) {
        EventType.find().then(function (types) {
            return res.ok(types);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Destroy Event Type
     * @param req
     * @param res
     */
    destroy: function (req, res) {
        EventType.destroy(req.params.id).then(function () {
            return res.ok();
        }).catch(function (err) {
            return res.negotiate(err);
        });
    }
};

