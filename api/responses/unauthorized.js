/**
 * 401 (Unauthorized) Handler
 *
 * Usage:
 * return res.unauthorized();
 * return res.unauthorized(msg);
 *
 * e.g.:
 * ```
 * return res.unauthorized(
 *   'No Authorization header was found',
 * );
 * ```
 */


module.exports = function unauthorized(msg) {

    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    // Set status code
    res.status(401);

    // Set summary msg
    if (msg === undefined) msg = 'Unauthorized';

    sails.log.verbose('Sending 401 ("Unauthorized") response');

    var response = {
        error: 'Unauthorized',
        status: 401,
        summary: msg
    };

    return res.jsonx(response);
};

