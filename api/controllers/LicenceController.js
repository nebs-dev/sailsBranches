/**
 * LicenceController
 *
 * @description :: Server-side logic for managing licences
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    /**
     * Crete Licence
     * @param req
     * @param res
     */
    create: function (req, res) {
        var params = req.params.all();

        Licence.create(params).then(function (licence) {
            return res.json(licence);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};

