/**
 * EventController
 *
 * @description :: Server-side logic for managing events
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * Create event
     * @param req
     * @param res
     */
    create: function (req, res) {
        var params = req.params.all();

        User.findOne(req.token.userId).populate('role').then(function (user) {
            if (!user) return res.notFound('User not found');
            if (user.role.name !== 'superadmin') params.tree = user.tree;

            return Event.create(params);

        }).then(function (event) {
            return res.ok(event);

        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Update event
     * @param req
     * @param res
     */
    update: function (req, res) {
      var params = req.params.all();

        Event.update(req.params.id, params).then(function (events) {
            return res.ok(events[0]);

        }).catch(function (err) {
           return res.negotiate(err);
        });
    },

    /**
     * List all events for user
     * @param req
     * @param res
     */
    list: function (req, res) {
        eventService.getList(req, function (err, events) {
            return res.ok(events);
        });
    },

    /**
     * Destroy event
     * @param req
     * @param res
     */
    destroy: function (req, res) {
        Event.destroy(req.params.id).then(function () {
            return res.ok();
        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};

