/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt');

module.exports = {

    schema: true,

    attributes: {
        email: {
            type: 'string',
            required: true,
            unique: true
        },

        encryptedPassword: {
            type: 'string'
        },

        secret: {
            type: 'string',
            required: false
        },

        superadmin: {
            type: 'boolean',
            defaultsTo: false
        },

        branches: {
            collection: 'branch',
            via: 'user'
        },

        toJSON: function () {
            var obj = this.toObject();
            delete obj.encryptedPassword;
            delete obj.secret;
            return obj;
        }
    },


    setSecret: function (user) {
        var random = Math.random().toString(36).substring(7);

        if(user) {
            user.secret = random;
        }

        return random;
    },

    beforeCreate: function (values, next) {
        var _this = this;
        bcrypt.genSalt(10, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(values.password, salt, function (err, hash) {
                if (err) return next(err);

                _this.setSecret(values);
                values.encryptedPassword = hash;
                next();
            });
        });
    },

    validPassword: function (password, user, cb) {
        bcrypt.compare(password, user.encryptedPassword, function (err, match) {
            if (err) cb(err);

            if (match) {
                cb(null, true);
            } else {
                cb(err);
            }
        });
    }
};

