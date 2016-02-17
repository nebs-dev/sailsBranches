/**
 * MediaCategoryController
 *
 * @description :: Server-side logic for managing media categories
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    /**
     * List media categories
     * @param req
     * @param res
     */
    list: function (req, res) {
        MediaCategory.find().then(function (categories) {
            return res.json(categories);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Create media category
     * @param req
     * @param res
     */
    create: function (req, res) {
        var params = req.params.all();

        MediaCategory.create(params).then(function (category) {
            return res.json(category);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Destroy media category
     * @param req
     * @param res
     */
    destroy: function (req, res) {
        MediaCategory.destroy(req.params.id).then(function () {
            return res.ok();
        }).catch(function (err) {
           return res.negotiate(err);
        });
    },

    show: function (req, res) {
        MediaCategory.findOne(req.params.id).populate('media').then(function (category) {
            return res.ok(category);
        }).catch(function (err) {
           return res.negotiate(err);
        });
    }

};

