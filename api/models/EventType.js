/**
 * EventType.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {


    schema: true,

    attributes: {

        title: {
            type: 'string',
            required: true
        },

        color: {
            type: 'string',
            hexColor: true,
            regex: /^#.+/
        },

        events: {
            collection: 'event',
            via: 'type'
        },

        tree: {
            model: 'tree',
            via: 'eventTypes',
            required: true
        }
    },


    /**
     * After Event Type destroy
     * @param destroyedRecords
     * @param cb
     */
    afterDestroy: function (destroyedRecords, cb) {
        if (!destroyedRecords.length) return cb();

        Event.destroy({type: destroyedRecords[0].id}).then(function () {
            return cb();

        }).catch(function (err) {
            return cb(err);
        });
    }
};

