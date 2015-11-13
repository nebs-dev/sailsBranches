/**
 * Role.js
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

        add_branch: {
            type: 'boolean',
            required: true
        },

        add_student: {
            type: 'boolean',
            required: true
        },

        users: {
            collection: 'user',
            via: 'role'
        }
    }
};

