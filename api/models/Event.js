/**
 * Event.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    types: {
        checkDate: function (model) {
            return this.fromDate.getTime() <= this.toDate.getTime();
        }
    },

    schema: true,

    attributes: {

        title: {
            type: 'string',
            required: true
        },

        fromDate: {
            type: 'date',
            required: true
        },

        toDate: {
            type: 'date',
            required: true,
            checkDate: true
        },

        type: {
            model: 'eventType',
            via: 'event',
            required: true
        },

        tree: {
            model: 'tree',
            via: 'events',
            required: true
        },

        media: {
            collection: 'media'
        },

        branches: {
            collection: 'branch',
            via: 'events'
        }

    }
};

