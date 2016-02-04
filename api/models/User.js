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
            type: 'email',
            required: true
        },

        encryptedPassword: {
            type: 'string'
        },

        secret: {
            type: 'string',
            required: false
        },

        role: {
            model: 'role',
            required: true
        },

        branches: {
            collection: 'branch',
            via: 'user'
        },

        permissions: {
            collection: 'permission',
            via: 'user'
        },

        tree: {
            model: 'tree'
        },

        toJSON: function () {
            var obj = this.toObject();
            delete obj.encryptedPassword;
            delete obj.secret;
            return obj;
        }
    },


    /**
     * Set random secret
     * @param user
     * @returns {string}
     */
    setSecret: function (user) {
        var random = Math.random().toString(36).substring(7);

        if (user) {
            user.secret = random;
        }

        return random;
    },

    /**
     * Encrypt password and set secret before create
     * @param values
     * @param next
     */
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

    /**
     *
     * @param values
     * @param next
     * @returns {*}
     */
    beforeUpdate: function (values, next) {
        if (!values.password) return next();

        bcrypt.genSalt(10, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(values.password, salt, function (err, hash) {
                if (err) return next(err);

                values.encryptedPassword = hash;
                return next();
            });
        });
    },

    /**
     * Check if password is valid
     * @param password
     * @param user
     * @param cb
     */
    validPassword: function (password, user, cb) {
        bcrypt.compare(password, user.encryptedPassword, function (err, match) {
            if (err) return cb(err);

            if (match) {
                cb(null, true);
            } else {
                cb(err);
            }
        });
    },

    /**
     * After user destroy
     * @param destroyedRecords
     * @param cb
     */
    afterDestroy: function (destroyedRecords, cb) {
        if (!destroyedRecords.length) return cb();

        Permission.destroy({user: destroyedRecords[0].id}).then(function () {
            return cb();

        }).catch(function (err) {
            return cb(err);
        });
    }

};

