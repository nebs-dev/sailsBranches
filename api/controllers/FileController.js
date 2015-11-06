/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var path = require('path');
module.exports = {


    upload: function (req, res) {

        req.file('fileToUpload').upload({
            // don't allow the total upload size to exceed ~10MB
            maxBytes: 10000000,
            //dirname: require('path').resolve(sails.config.appPath, '/uploads/files'),
            dirname: sails.config.appPath + '/uploads/files/'
        }, function whenDone(err, uploadedFiles) {
            if (err) return res.negotiate(err);

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) return res.badRequest('No file was uploaded');

            var params = req.params.all();
            params.url = path.basename(uploadedFiles[0].fd);

            // Create file object with path to uploaded file
            File.create(params).then(function (file) {
                return res.json(file);
            }).catch(function (err) {
               return res.negotiate(err);
            });
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


    getOne: function (req, res) {
        req.validate({
            id: 'integer'
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
    }

};

