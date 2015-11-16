/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var path = require('path');
module.exports = {

    /**
     * Upload file
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
                Branch.findOne(params.branch).populate('files').then(function (branch) {
                    params.branch = branch.id;
                    params.tree = branch.tree;

                    // Create file object with path to uploaded file
                    File.create(params).then(function (file) {

                        file.branches.add(branch);
                        file.save();

                        return res.json(file);

                    }).catch(function (err) {
                        return res.negotiate(err);
                    });
                });

            // If branch is NOT set, use tree from params
            } else {
                // Create file object with path to uploaded file
                File.create(params).then(function (file) {
                    return res.json(file);
                }).catch(function (err) {
                    return res.negotiate(err);
                });
            }
        });

    },

    /**
     * Create file
     * @param req
     * @param res
     */
    create: function (req, res) {
        var params = req.params.all();

        File.create(params).then(function (file) {
            return res.json(file);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Destroy file
     * @param req
     * @param res
     */
    destroy: function (req, res) {
        File.destroy(req.params.id).then(function () {
            return res.ok();
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },


    /**
     * Get one file
     * @param req
     * @param res
     */
    getOne: function (req, res) {
        req.validate({
            id: 'string'
        });

        File.findOne(req.param('id')).exec(function (err, file){
            if (err) return res.negotiate(err);
            if (!file) return res.notFound();

            // User has no avatar image uploaded.
            // (should have never have hit this endpoint and used the default image)
            if (!file.url) {
                return res.notFound();
            }

            var SkipperDisk = require('skipper-disk');
            var fileAdapter = SkipperDisk(/* optional opts */);

            // Stream the file down
            fileAdapter.read('uploads/files/' + file.url)
                .on('error', function (err){
                    return res.serverError(err);
                })
                .pipe(res);
        });
    },

    /**
     * Get all files from one Branch
     * @param req
     * @param res
     */
    getByBranch: function (req, res) {
        var params = req.params.all();

        Branch.findOne(params.id).populate('files').then(function (branch) {
            return res.json(branch.files);
        }).catch(function (err) {
           return res.negotiate(err);
        });
    }

};

