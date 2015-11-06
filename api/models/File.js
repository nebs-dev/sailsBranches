/**
 * File.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    schema: true,

    attributes: {

        url: {
            type: 'string',
            required: true
        },

        category: {
            model: 'fileCategory'
        },

        tree: {
            model: 'tree',
            required: true
        },

        branches: {
            collection: 'branch',
            via: 'files'
        }

    }
};

