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
            type: 'string'
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
            collection: 'media',
            via: 'tree'
        },

        events: {
            collection: 'event',
            via: 'tree'
        },

        eventTypes: {
            collection: 'eventType',
            via: 'tree'
        }
    },

    /**
     * Add basic licence before create
     * @param newlyInsertedRecord
     * @param cb
     */
    beforeCreate: function (values, cb) {
        values.licence = process.env.basicLicence;
        return cb();
    },

    /**
     * Destroy all branches && files in this Tree
     * @param destroyedRecords
     * @param cb
     */
    afterDestroy: function (destroyedRecords, cb) {
        Branch.destroy({tree: destroyedRecords[0].id}).then(function () {
            return Media.destroy({tree: destroyedRecords[0].id});
        }).then(function () {
            return Event.destroy({tree: destroyedRecords[0].id});
        }).then(function () {
            return cb();

        }).catch(function (err) {
            return cb(err);
        });
    }

};

