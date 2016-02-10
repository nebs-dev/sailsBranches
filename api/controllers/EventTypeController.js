/**
 * EventTypeController
 *
 * @description :: Server-side logic for managing eventtypes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * Create Event Type
     * @param req
     * @param res
     */
    create: function (req, res) {
        EventType.create(req.params.all()).then(function (type) {
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
        EventType.update(req.params.all()).then(function (type) {
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

