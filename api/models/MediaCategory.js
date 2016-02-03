/**
 * MediaCategory.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    schema: true,

    attributes: {
        name: {
            type: 'string',
            required: true,
            unique: true
        },

        media: {
            collection: 'media',
            via: 'category'
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

