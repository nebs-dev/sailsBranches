/**
 * 400 (Bad Request) Handler
 *
 * Usage:
 * return res.customBadRequest();
 * return res.customBadRequest(msg);
 *
 * e.g.:
 * ```
 * return res.customBadRequest(
 *   'Please choose a valid `password` (6-12 characters)'
 * );
 * ```
 */

module.exports = function customBadRequest(msg) {

    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    // Set status code
    res.status(403);

    // Set summary msg
    if (msg === undefined) msg = 'Bad Request';

    sails.log.verbose('Sending 400 ("Bad Request") response');

    var response = {
        error: 'Bad Request',
        status: 400,
        summary: msg
    };

    return res.jsonx(response);

};

