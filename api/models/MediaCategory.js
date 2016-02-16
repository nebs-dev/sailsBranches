/**
 * MediaCategory.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    schema: true,

    attributes: {
        title: {
            type: 'string',
            required: true
        },

        media: {
            collection: 'media',
            via: 'categories'
        },

        tree: {
            model: 'tree',
            via: 'mediaCategories'
        }
    },

    /**
     * Destroy all files in destroyed category
     * TODO: Multiple destroyed categories???
     * @param destroyedRecords
     * @param cb
     */
    afterDestroy: function (destroyedRecords, cb) {
        var category = destroyedRecords[0];

        Media.destroy({category: category.id}).then(function () {
            cb();
        }).catch(function (err) {
           cb(err);
        });
    }
};

