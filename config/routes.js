/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

    /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
     * etc. depending on your default view engine) your home page.              *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ***************************************************************************/


    'GET /*': {
        view: 'homepage',
        skipAssets: true,
        skipRegex: /^\/api\/.*$/
    },

    /***************************************************************************
     *                                                                          *
     * Custom routes here...                                                    *
     *                                                                          *
     *  If a request to a URL doesn't match any of the custom routes above, it  *
     * is matched against Sails route blueprints. See `config/blueprints.js`    *
     * for configuration options and examples.                                  *
     *                                                                          *
     ***************************************************************************/

    // AUTH
    'POST /api/auth/login': 'Auth.login',
    'POST /api/auth/register': 'Auth.register',

    // USER
    'GET /api/users': 'User.list',
    'POST /api/user/show/:id': 'User.show',
    'POST /api/user/update/:id': 'User.update',
    'POST /api/user/addRole': 'User.addRole',

    // ROLES
    'GET /api/roles': 'Role.list',
    'POST /api/role/create': 'Role.create',

    // BRANCH
    'POST /test': 'Branch.test',
    'GET /api/branches': 'Branch.list',
    'GET /api/branch/:id': 'Branch.view',
    'POST /api/branch/create': 'Branch.create',
    'POST /api/branch/update/:id': 'Branch.update',

    // PERMISSIONS
    'POST /api/permission/add': 'Permission.add',
    'POST /api/permission/remove': 'Permission.remove',

    // LICENCE
    'POST /api/licence/create': 'Licence.create',

    // TREE
    'POST /api/tree/create': 'Tree.create'

};
