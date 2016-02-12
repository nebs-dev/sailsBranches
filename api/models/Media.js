/**
 * Media.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var fs = require('fs-extra');
module.exports = {

    types: {
        checkType: function (model) {
            if(this.type !== 'custom') return true;

            var availableModels = generalHelper.getTypeModels();
            return availableModels.indexOf(model) !== -1 && this.relationKey;
        }
    },

    schema: true,

    attributes: {

        title: {
            type: 'string',
            required: true
        },

        url: {
            type: 'string',
            url: true
        },

        relationModel: {
            type: 'string',
            checkType: true
        },

        relationKey: {
            type: 'string'
        },

        type: {
            type: 'string',
            enum: ['photo', 'video', 'document', 'audio', 'custom'],
            required: true
        },

        categories: {
            collection: 'mediaCategory',
            via: 'media'
        },

        tree: {
            model: 'tree',
            required: true
        },

        branches: {
            collection: 'branch',
            via: 'media'
        },

        toJSON: function () {
            var obj = this.toObject();
            obj.url = sails.getBaseurl() + '/uploads/media/' + obj.url;
            return obj;
        }
    },

    /**
     * Remove media after object Media destroyed
     * @param destroyedRecords
     * @param cb
     * @returns {*}
     */
    afterDestroy: function (destroyedRecords, cb) {
        if (!destroyedRecords.length) return cb();

        var filePath = 'uploads/media/' + destroyedRecords[0].url;

        fs.remove(filePath, function (err) {
            if (err) return cb(err);

            cb();
        });
    }
};

