/**
 * BranchController
 *
 * @description :: Server-side logic for managing branches
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    /**
     * List all branches
     * @param req
     * @param res
     */
    list: function (req, res) {
        var allBranches = [];

        User.findOne(req.token.userId).populate('permissions').then(function (user) {

            var children = _.pluck(user.permissions, 'branch');

            async.until(function() {
                return !children.length;
            }, function(callback) {
                Branch.find(children).populate('children').then(function (branches) {

                    var allChildren = [];

                    _.each(branches, function(branch) {
                        var branchToJSON = branch.toJSON();
                        branchToJSON.children = _.pluck(branchToJSON.children, 'id');
                        allBranches.push(branchToJSON);
                        allChildren = allChildren.concat(branchToJSON.children);
                    });

                    children = allChildren;
                    return callback(null);

                }).catch(function(err) {
                    return callback(err);
                });

            }, function(err){
                var levels = _.toArray(_.groupBy(allBranches, 'level'));

                for(var levelNo=levels.length-2; levelNo>=0; levelNo--) {
                    _.each(levels[levelNo], function(level) {
                        _.each(level.children, function(child, key) {
                            var childFound = _.findWhere(allBranches, {parent: level.id});
                            level.children[key] = childFound;
                            if(childFound) delete childFound.parent;
                        });
                    });
                }


                res.json(levels[0]);
            });


        }).catch(function (err) {
            return res.json(err);
        });
    },

    /**
     * Create new branch
     * @param req
     * @param res
     */
    create: function (req, res) {
        var params = req.params.all();

        Branch.create(params).then(function (branch) {
            return res.json(branch);
        }).catch(function (err) {
            return res.json(err);
        });
    },

    /**
     * Update branch
     * @param req
     * @param res
     */
    update: function (req, res) {
        var params = req.params.all();

        Branch.update(req.params.id, params).then(function (branch) {
            return res.json(branch);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * View branch
     * @param req
     * @param res
     */
    view: function (req, res) {
        Branch.findOne(req.params.id).then(function (branch) {
            return res.json(branch);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Destroy Branch
     * @param req
     * @param res
     */
    destroy: function (req, res) {
        Branch.destroy(req.params.id).then(function () {
            return res.ok();
        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};

