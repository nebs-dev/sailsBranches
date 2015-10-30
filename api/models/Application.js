/**
 * Application.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        domain: {
            type: 'url',
            unique: true
        },

        appToken: {
            type: 'string',
            unique: true,
            required: true
        },

        user: {
            model: 'user'
        }
    },

    beforeCreate: function (values, next) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) return next(err);

            var random = Math.random().toString(36).substring(10);

            bcrypt.hash(random, salt, function (err, hash) {
                if (err) return next(err);

                values.appToken = hash;
                next();
            });
        });
    }
};

