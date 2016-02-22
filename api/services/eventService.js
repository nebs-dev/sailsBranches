module.exports = {

    getList: function (req, cb) {
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

            return cb(null, events);

        }).catch(function (err) {
            return cb(err);
        });
    }

};