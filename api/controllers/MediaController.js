/**
 * MediaController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var path = require('path');
var fs = require('fs-extra');
module.exports = {

    /**
     * Upload Media
     * @param req
     * @param res
     */
    upload: function (req, res) {
        var params = req.params.all();
        return res.ok({response: req});

        //if (!params.tree && !params.branch) return res.customBadRequest('Missing Parameters.');

        req.file('fileToUpload').upload({
            // don't allow the total upload size to exceed ~10MB
            maxBytes: 10000000,
            dirname: sails.config.appPath + '/uploads/media/'

        }, function whenDone(err, uploadedFiles) {
            if (err) return res.negotiate(err);

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) return res.customBadRequest('No file was uploaded');

            params.url = path.basename(uploadedFiles[0].fd);

            // Create media object and add it to branches from params (check permissions first)
            mediaService.checkBranches(req, function (err, params) {
                if (err) {
                    fs.remove(uploadedFiles[0].fd, function (err) {
                        if (err) return cb(err);
                        return res.unauthorized();
                    });

                } else {
                    var categoryParams = _.clone(params);
                    delete params.categories;
                    params.mimeType = uploadedFiles[0].type;

                    // Create media object with params
                    Media.create(params).then(function (media) {
                        // Create/add media categories from params
                        mediaService.saveCategories(media, categoryParams, function (err, media) {
                            if (err) return res.negotiate(err);
                            return res.ok(media);
                        });

                    }).catch(function (err) {
                        // if err remove uploaded file
                        fs.remove(uploadedFiles[0].fd, function (error) {
                            if (error) return res.negotiate(error);
                            return res.negotiate(err);
                        });
                    });
                }
            });
        });
    },

    /**
     * Create media
     * @param req
     * @param res
     */
    create: function (req, res) {
        var params = req.params.all();

        Media.create(params).then(function (media) {
            return res.json(media);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Destroy media
     * @param req
     * @param res
     */
    destroy: function (req, res) {
        Media.destroy(req.params.id).then(function () {
            return res.ok();
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },


    /**
     * Get one media
     * @param req
     * @param res
     */
    getOne: function (req, res) {
        req.validate({
            id: 'string'
        });

        Media.findOne(req.param('id')).exec(function (err, media) {
            if (err) return res.negotiate(err);
            if (!media) return res.notFound();

            // Media object has no media uploaded
            // (should have never have hit this endpoint)
            if (!media.url) {
                return res.notFound();
            }

            var SkipperDisk = require('skipper-disk');
            var fileAdapter = SkipperDisk(/* optional opts */);

            // Stream the media down
            fileAdapter.read('uploads/media/' + media.url)
                .on('error', function (err) {
                    return res.serverError(err);
                })
                .pipe(res);
        });
    },

    /**
     * Get all media from one Branch
     * @param req
     * @param res
     */
    getByBranch: function (req, res) {
        var params = req.params.all();

        Branch.findOne(params.id).populate('media').then(function (branch) {
            return res.json(branch.media);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * List all media by tree
     * @param req
     * @param res
     */
    list: function (req, res) {
        var params = req.params.all();
        params.tree = params.tree || '';

        User.findOne(req.token.userId).then(function (reqUser) {
            // superadmin need to send tree ID in URL
            var tree = reqUser === 'superadmin' ? params.tree : reqUser.tree;
            return Media.find({tree: tree});

        }).then(function (media) {
            return res.ok(media);

        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};

