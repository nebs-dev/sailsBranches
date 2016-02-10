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

            if (user.role.name === 'superadmin') {
                if (!params.tree) return res.customBadRequest('Mising parameters.');
            } else {
                params.tree = user.tree;
            }

            Event.create(params).then(function (event) {
               return res.ok(event);
            });
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
            console.log(user);

            var branchIds = _.pluck(user.permissions, 'branch');
            var options;

            if (user.role.name !== 'superadmin') {
                console.log(branchIds);
                options = {
                    id: branchIds
                };
            }

            Event.find({tree: user.tree}).populate('branches', options).then(function (events) {

                events = _.filter(events, function (event) {
                    return event.branches.length;
                });

                return res.ok(events);
            });

            //Event.find().populate('branches').then(function (events) {
            //    var allowedEvents = _.filter(events, function (event) {
            //        var allowedBranches = _.intersection(event.branches, branchIds);
            //        return allowedBranches.length ? 1 : 0;
            //    });
            //
            //    return res.ok(allowedEvents);
            //});

        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};

