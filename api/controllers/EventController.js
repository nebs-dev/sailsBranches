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
     * List all events
     * @param req
     * @param res
     */
    list: function (req, res) {
        User.findOne(req.token.userId).populate('permissions').populate('role').then(function (user) {
            var branchIds = _.pluck(user.permissions, 'branch');
            var options;

            // if user !superadmin populate only branches with permission
            if (user.role.name !== 'superadmin') {
                options = {
                    id: branchIds
                };
            }

            return Event.find({tree: user.tree}).populate('branches', options);

        }).then(function (events) {

            // filter only events with branches (user permission)
            events = _.filter(events, function (event) {
                return event.branches.length;
            });

            return res.ok(events);

        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};

