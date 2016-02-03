/**
 * FileCategoryController
 *
 * @description :: Server-side logic for managing file categories
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    /**
     * List file categories
     * @param req
     * @param res
     */
    list: function (req, res) {
        FileCategory.find().then(function (categories) {
            return res.json(categories);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Create file category
     * @param req
     * @param res
     */
    create: function (req, res) {
        var params = req.params.all();

        FileCategory.create(params).then(function (category) {
            return res.json(category);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Destroy file category
     * @param req
     * @param res
     */
    destroy: function (req, res) {
        FileCategory.destroy(req.params.id).then(function () {
            return res.ok();
        }).catch(function (err) {
           return res.negotiate(err);
        });
    }

};

