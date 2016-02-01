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
        skipRegex: [/^\/api\/.*$/, /^\/docs\/.*$/]
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

    //////////////////////////
    ////////// AUTH //////////
    //////////////////////////
    /*
     * @api {post} /api/auth/login Login
     * @apiGroup Auth
     *
     * @apiParam {string} email User email (required)
     * @apiParam {string} password User password (required)
     */
    'POST /api/auth/login': 'Auth.login',

    /**
     * @api {post} /api/auth/register Register
     * @apiGroup Auth
     *
     * @apiParam {string} email User email (required)
     * @apiParam {string} password User password (required)
     * @apiParam {string} confirmPassword Repeated password (required)
     */
    'POST /api/auth/register': 'Auth.register',

    //////////////////////////
    ////////// USER //////////
    //////////////////////////
    /**
     * @api {get} /api/users list
     * @apiGroup User
     */
    'GET /api/users': 'User.list',

    'GET /api/user/show/:id': 'User.show',

    /**
     * @api {post} /api/user/update/:id update
     * @apiGroup User
     *
     * @apiParam {string} email User email
     * @apiParam {string} password User password
     */
    'POST /api/user/update/:id': 'User.update',

    /**
     * @api {post} /api/user/addRole add Role to User
     * @apiGroup User
     *
     * @apiParam {integer} user User ID (required)
     * @apiParam {integer} role Role ID (required)
     */
    'POST /api/user/addRole': 'User.addRole',

    /**
     * @api {post} /api/user/addTree add Tree to User
     * @apiGroup User
     *
     * @apiParam {integer} user User ID (required)
     * @apiParam {integer} tree Tree ID (required)
     */
    'POST /api/user/addTree': 'User.addTree',

    ///////////////////////////
    ////////// ROLES //////////
    ///////////////////////////
    /**
     * @api {get} /api/roles list
     * @apiGroup Role
     */
    'GET /api/roles': 'Role.list',

    /**
     * @api {post} /api/role/create create
     * @apiGroup Role
     *
     * @apiParam {string} name Role name (required)
     */
    'POST /api/role/create': 'Role.create',

    /**
     * @api {post} /api/role/update update
     * @apiGroup Role
     *
     * @apiParam {string} name Role name
     * @apiParam {boolean} add_branch Permission to add branch
     * @apiParam {boolean} add_student Permission to add students to branch
     */
    'POST /api/role/update/:id': 'Role.update',

    ////////////////////////////
    ////////// BRANCH //////////
    ////////////////////////////
    /**
     * @api {get} /api/branches list
     * @apiGroup Branch
     */
    'GET /api/branches': 'Branch.list',

    /**
     * @api {get} /api/branch/:id Branch data
     * @apiGroup Branch
     */
    'GET /api/branch/:id': 'Branch.view',

    /**
     * @api {post} /api/branch/create create
     * @apiGroup Branch
     *
     * @apiParam {string} name Branch name (required)
     * @apiParam {integer} parent parent Branch ID
     * @apiParam {integer} tree tree Tree ID ID (superadmin)
     * @apiParam {integer} user Branch creator ID (superadmin)
     */
    'POST /api/branch/create': 'Branch.create',

    /**
     * @api {post} /api/branch/update/:id update
     * @apiGroup Branch
     *
     * @apiParam {string} name Branch name
     * @apiParam {integer} user parent Branch ID
     * @apiParam {integer} user Branch creator ID (superadmin)
     * @apiParam {integer} tree Tree ID (superadmin)
     */
    'POST /api/branch/update/:id': 'Branch.update',

    /**
     * @api {post} /api/branch/destroy/:id destroy
     * @apiGroup Branch
     */
    'POST /api/branch/destroy/:id': 'Branch.destroy',

    //////////////////////////////////
    ////////// PERMISSSIONS //////////
    //////////////////////////////////
    /**
     * @api {post} /api/permission/add add
     * @apiGroup Permission
     *
     * @apiParam {integer} user User ID (required)
     * @apiParam {integer} branch Branch ID (required)
     */
    'POST /api/permission/add': 'Permission.add',

    /**
     * @api {post} /api/permission/remove remove
     * @apiGroup Permission
     *
     * @apiParam {integer} user User ID (required)
     * @apiParam {integer} branch Branch ID (required)
     */
    'POST /api/permission/remove': 'Permission.remove',

    /////////////////////////////
    ////////// LICENCE //////////
    /////////////////////////////
    /**
     * @api {post} /api/licence/create create
     * @apiGroup Licence
     *
     * @apiParam {string} name Licence name (required)
     * @apiParam {integer} vertical vertical levels (required)
     * @apiParam {integer} horizontal horizontal branches per level (required)
     * @apiParam {float} price horizontal Licence price (required)
     * @apiParam {boolean} status Licence status - active/inactive (true/false)
     */
    'POST /api/licence/create': 'Licence.create',

    /**
     * @api {post} /api/licence/update update
     * @apiGroup Licence
     *
     * @apiParam {string} name Licence name
     * @apiParam {integer} vertical vertical levels
     * @apiParam {integer} horizontal horizontal branches per level
     * @apiParam {float} price horizontal Licence price
     * @apiParam {boolean} status Licence status - active/inactive (true/false)
     */
    'POST /api/licence/update/:id': 'Licence.update',

    //////////////////////////
    ////////// TREE //////////
    //////////////////////////
    /**
     * @api {post} /api/tree/create create
     * @apiGroup Tree
     *
     * @apiParam {string} name Tree name (required)
     */
    'POST /api/tree/create': 'Tree.create',

    /**
     * @api {post} /api/tree/destroy destroy
     * @apiGroup Tree
     */
    'POST /api/tree/destroy/:id': 'Tree.destroy',

    /**
     * @api {post} /api/tree/addLicence add Licence to Tree
     * @apiGroup Tree
     *
     * @apiParam {integer} tree Tree ID (required)
     * @apiParam {integer} licence Licence ID (required)
     */
    'POST /api/tree/addLicence': 'Tree.addLicence',

    ///////////////////////////////////
    ////////// FILE CATEGORY //////////
    ///////////////////////////////////
    /**
     * @api {get} /api/fileCategories list
     * @apiGroup fileCategories
     */
    'GET /api/fileCategories': 'FileCategory.list',

    /**
     * @api {post} /api/fileCategories/create create
     * @apiGroup fileCategories
     *
     * @apiParam {string} name fileCategories name (required)
     */
    'POST /api/fileCategory/create': 'FileCategory.create',

    /**
     * @api {post} /api/fileCategory/destroy/:id destroy
     * @apiGroup fileCategories
     */
    'POST /api/fileCategory/destroy/:id': 'FileCategory.destroy',

    //////////////////////////
    ////////// FILE //////////
    //////////////////////////
    'POST /api/file/create': 'File.create',

    /**
     * @api {post} /api/file/destroy/:id destroy
     * @apiGroup File
     */
    'POST /api/file/destroy/:id': 'File.destroy',

    /**
     * @api {post} /api/file/upload upload
     * @apiGroup File
     *
     * @apiParam {file} fileToUpload file to upload (required)
     * @apiParam {integer} tree Tree ID (required)
     * @apiParam {integer} branch Branch ID
     */
    'POST /api/file/upload': 'File.upload',

    /**
     * @api {get} /api/file/get/:id get one
     * @apiGroup File
     */
    'GET /api/file/get/:id': 'File.getOne',

    /**
     * @api {get} /api/file/getByBranch/:id get all Files in Branch
     * @apiGroup File
     */
    'GET /api/file/getByBranch/:id': 'File.getByBranch'

};
