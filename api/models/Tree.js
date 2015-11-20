/**
 * Tree.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    schema: true,

    attributes: {
        name: {
            type: 'string',
            unique: true
        },

        users: {
            collection: 'user',
            via: 'tree'
        },

        branches: {
            collection: 'branch',
            via: 'tree'
        },

        licence: {
            model: 'licence'
        },

        files: {
            collection: 'file',
            via: 'tree'
        }
    },

    /**
     * Destroy all branches && files in this Tree
     * @param destroyedRecords
     * @param cb
     */
    afterDestroy: function (destroyedRecords, cb) {
        Branch.destroy({tree: destroyedRecords[0].id}).then(function () {
            File.destroy({tree: destroyedRecords[0].id}).then(function () {
               return cb();
            });
        }).catch(function (err) {
            return cb(err);
        });
    }

};

