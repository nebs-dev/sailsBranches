/**
 * ApplicationController
 *
 * @description :: Server-side logic for managing applications
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    'create': function (req, res) {
        return res.json(req.param('token'));
    }

};

