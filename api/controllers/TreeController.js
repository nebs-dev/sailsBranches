/**
 * TreeController
 *
 * @description :: Server-side logic for managing trees
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    /**
     * Create tree
     * @param req
     * @param res
     */
    create: function (req, res) {
        var params = req.params.all();

        Tree.create(params).then(function (tree) {
            return res.json(tree);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Add licence to Tree
     * @param req
     * @param res
     * @returns {*}
     */
    addLicence: function (req, res) {
        var params = req.params.all();
        if (!params.licence_id || !params.tree_id) return res.customBadRequest('Missing Parameters.');

        async.parallel({
            tree: function (cb) {
                Tree.findOne(params.tree_id).populate('licence').exec(cb);
            },

            licence: function (cb) {
                Licence.findOne(params.licence_id).exec(cb);
            }

        }, function(err, result) {
            if (err) return res.negotiate(err);

            var tree = result.tree;
            var licence = result.licence;

            licence.trees.add(tree);
            licence.save(function (err, licence) {
                if (err) return res.negotiate(err);

                return res.json(tree);
            });
        });
    }

};

