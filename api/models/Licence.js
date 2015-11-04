/**
 * Licence.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    schema: true,

    attributes: {
        name: {
            type: 'string',
            required: true
        },

        vertical: {
            type: 'integer',
            required: true
        },

        horizontal: {
            type: 'integer',
            required: true
        },

        price: {
            type: 'float',
            required: true
        },

        status: {
            type: 'boolean',
            defaultsTo: true
        },

        trees: {
            collection: 'tree',
            via: 'licence'
        }
    }

};

