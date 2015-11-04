/**
 * TreeController
 *
 * @description :: Server-side logic for managing trees
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    create: function (req, res) {
        var params = req.params.all();

        Tree.create(params).then(function (tree) {

            return res.json(tree);

        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};

