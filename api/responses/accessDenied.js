/**
 * 403 (Access Denied) Handler
 *
 * Usage:
 * return res.accessDenied();
 * return res.accessDenied(msg);
 *
 * e.g.:
 * ```
 * return res.accessDenied(
 *   'Please choose a valid `password` (6-12 characters)',
 * );
 * ```
 */


module.exports = function accessDenied(msg) {

    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    // Set status code
    res.status(403);

    // Set summary msg
    if (msg === undefined) msg = 'Access Denied';

    sails.log.verbose('Sending 403 ("Access Denied") response');

    var response = {
        error: 'Access Denied',
        status: 403,
        summary: msg
    };

    return res.jsonx(response);

};

