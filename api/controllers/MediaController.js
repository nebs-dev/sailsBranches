/**
 * MediaController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var path = require('path');
module.exports = {

    /**
     * Upload Media
     * @param req
     * @param res
     */
    upload: function (req, res) {
        var params = req.params.all();

        if (!params.tree && !params.branch) return res.customBadRequest('Missing Parameters.');

        req.file('fileToUpload').upload({
            // don't allow the total upload size to exceed ~10MB
            maxBytes: 10000000,
            dirname: sails.config.appPath + '/uploads/files/'

        }, function whenDone(err, uploadedFiles) {
            if (err) return res.negotiate(err);

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) return res.customBadRequest('No file was uploaded');

            params.url = path.basename(uploadedFiles[0].fd);

            // If branch is set use its tree
            if (params.branch) {
                Branch.findOne(params.branch).populate('media').then(function (branch) {
                    params.branch = branch.id;
                    params.tree = branch.tree;

                    // Create Media object with path to uploaded Media
                    Media.create(params).then(function (media) {

                        media.branches.add(branch);
                        Media.save(function (err, media) {
                            if (err) return res.negotiate(err);

                            return res.json(media);
                        });

                    }).catch(function (err) {
                        return res.negotiate(err);
                    });
                });

            // If branch is NOT set, use tree from params
            } else {
                // Create mdia object with path to uploaded media
                Media.create(params).then(function (media) {
                    return res.json(media);
                }).catch(function (err) {
                    return res.negotiate(err);
                });
            }
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

        Media.findOne(req.param('id')).exec(function (err, media){
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
                .on('error', function (err){
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
    }

};

