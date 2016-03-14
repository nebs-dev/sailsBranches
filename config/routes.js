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


    //'GET /*': {
    //    view: 'homepage',
    //    skipAssets: true,
    //    skipRegex: [/^\/api\/.*$/, /^\/docs\/.*$/]
    //},

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

    /**
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

    /**
     * @api {get} /api/user/show/:id User data
     * @apiGroup User
     */
    'GET /api/user/show/:id': 'User.show',

    /**
     * @api {post} /api/user/update/:id update
     * @apiGroup User
     *
     * @apiParam {email} email User email
     * @apiParam {string} password User password
     * @apiParam {string} firstName first name
     * @apiParam {string} lastName last name
     * @apiParam {string} mobile mobile
     */
    'POST /api/user/update/:id': 'User.update',

    /**
     * @api {post} /api/user/destroy/:id destroy
     * @apiGroup User
     */
    'POST /api/user/destroy/:id': 'User.destroy',

    /**
     * @api {post} /api/user/create create
     * @apiGroup User
     *
     * @apiParam {email} email User email (required)
     * @apiParam {string} firstName first name (required)
     * @apiParam {string} lastName last name (required)
     * @apiParam {string} mobile mobile (required)
     * @apiParam {string} password User password (required)
     * @apiParam {string} confirmPassword confirm User password (required)
     * @apiParam {string} tree tree ID (required if SUPERADMIN)
     * @apiParam {string} role role ID (required)
     */
    'POST /api/user/create': 'User.create',

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
     * @apiParam {boolean} add_branch Permission to add branch (required)
     * @apiParam {boolean} add_student Permission to add students to branch (required)
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
     * @api {get} /api/student/branches list student
     * @apiGroup Branch
     */
    'GET /api/student/branches': 'Branch.studentList',

    /**
     * @api {get} /api/branch/:id Branch data
     * @apiGroup Branch
     */
    'GET /api/branch/:id': 'Branch.show',

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
     * @apiParam {integer} branch parent Branch ID
     * @apiParam {integer} user Branch creator ID (superadmin)
     * @apiParam {integer} tree Tree ID (superadmin)
     */
    'POST /api/branch/update/:id': 'Branch.update',

    /**
     * @api {post} /api/branch/destroy/:id destroy
     * @apiGroup Branch
     */
    'POST /api/branch/destroy/:id': 'Branch.destroy',

    /**
     * @api {get} /api/branch/students/:id/:type get students
     * @apiGroup Branch
     *
     * @apiParam {string} type single/multiple branch levels
     */
    'GET /api/branch/students/:id/:type': 'Branch.getStudents',

    /**
     * @api {get} /api/branch/users/:id/:type get all users
     * @apiGroup Branch
     *
     * @apiParam {string} type single/multiple branch levels
     */
    'GET /api/branch/users/:id/:type': 'Branch.getUsers',

    //////////////////////////////////
    ////////// PERMISSSIONS //////////
    //////////////////////////////////
    /**
     * @api {post} /api/permission/add add
     * @apiGroup Permission
     *
     * @apiParam {integer} user User ID (required)
     * @apiParam {array} branches Branch IDs (required)
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
     * @api {post} /api/tree/destroy/:id destroy
     * @apiGroup Tree
     */
    'POST /api/tree/destroy/:id': 'Tree.destroy',

    /**
     * @api {post} /api/tree/update/:id update
     * @apiGroup Tree
     *
     * @apiParam {string} name Tree name
     */
    'POST /api/tree/update/:id': 'Tree.update',

    /**
     * @api {post} /api/tree/addLicence add Licence to Tree
     * @apiGroup Tree
     *
     * @apiParam {integer} tree Tree ID (required)
     * @apiParam {integer} licence Licence ID (required)
     */
    'POST /api/tree/addLicence': 'Tree.addLicence',

    /**
     * @api {get} /api/tree/show/:id show single Tree
     * @apiGroup Tree
     */
    'GET /api/tree/show/:id': 'Tree.show',

    /**
     * @api {get} /api/trees list
     * @apiGroup Tree
     */
    'GET /api/trees': 'Tree.list',

    /**
     * @api {get} /api/tree/users users list
     * @apiGroup Tree
     */
    'GET /api/tree/users': 'Tree.getAllUsers',

    ////////////////////////////////////
    ////////// MEDIA CATEGORY //////////
    ////////////////////////////////////
    /**
     * @api {get} /api/mediaCategories list
     * @apiGroup mediaCategories
     */
    'GET /api/mediaCategories': 'MediaCategory.list',

    /**
     * @api {post} /api/mediaCategory/create create
     * @apiGroup mediaCategories
     *
     * @apiParam {string} title mediaCategories title (required)
     */
    'POST /api/mediaCategory/create': 'MediaCategory.create',

    /**
     * @api {post} /api/mediaCategory/destroy/:id destroy
     * @apiGroup mediaCategories
     */
    'POST /api/mediaCategory/destroy/:id': 'MediaCategory.destroy',

    /**
     * @api {get} /api/mediaCategory/show/:id show
     * @apiGroup mediaCategories
     */
    'GET /api/mediaCategory/show/:id': 'MediaCategory.show',

    ///////////////////////////
    ////////// MEDIA //////////
    ///////////////////////////
    'POST /api/media/create': 'Media.create',

    /**
     * @api {post} /api/media/destroy/:id destroy
     * @apiGroup Media
     */
    'POST /api/media/destroy/:id': 'Media.destroy',

    /**
     * @api {post} /api/media/upload upload
     * @apiGroup Media
     *
     * @apiParam {string} title media title (required)
     * @apiParam {integer} tree Tree ID (required if superadmin)
     * @apiParam {array} branches Branches IDs
     * @apiParam {array} categories media categories (array of strings)
     * @apiParam {file} fileToUpload media to upload (required)
     */
    'POST /api/media/upload': 'Media.upload',

    /**
     * @api {get} /api/media/get/:id get one
     * @apiGroup Media
     */
    'GET /api/media/get/:id': 'Media.getOne',

    /**
     * @api {get} /api/media/getByBranch/:id get all Files in Branch
     * @apiGroup Media
     */
    'GET /api/media/getByBranch/:id': 'Media.getByBranch',

    /**
     * @api {get} /api/media/list?tree=testTreeId get all Files in Tree
     * @apiGroup Media
     */
    'GET /api/media/list': 'Media.list',

    /**
     * @api {post} /api/media/update update media
     * @apiGroup Media
     *
     * @apiParam {string} title media title
     * @apiParam {array} branches Branches IDs
     * @apiParam {array} categories media categories (array of strings)
     */
    'POST /api/media/update/:id': 'Media.update',


    ///////////////////////////
    ////////// EVENT //////////
    ///////////////////////////

    /**
     * @api {post} /api/event/create create
     * @apiGroup Event
     *
     * @apiParam {string} title Event title
     * @apiParam {date} fromDate event start (required)
     * @apiParam {date} toDate event end (required)
     * @apiParam {string} type eventType ID (required)
     * @apiParam {string} tree tree ID (required if SUPERADMIN)
     * @apiParam {array} media IDs of media to add
     * @apiParam {array} branches IDs of branches to add
     */
    'POST /api/event/create': 'Event.create',

    /**
     * @api {get} /api/events list
     * @apiGroup Event
     */
    'GET /api/events': 'Event.list',

    /**
     * @api {post} /api/event/destroy/:id list
     * @apiGroup Event
     */
    'POST /api/event/destroy/:id': 'Event.destroy',

    ////////////////////////////////
    ////////// EVENT TYPE //////////
    ////////////////////////////////

    /**
     * @api {post} /api/eventType/create create
     * @apiGroup EventType
     *
     * @apiParam {string} title Event Type title (required)
     * @apiParam {string} color hex color (required) (example: #ea4335)
     * @apiParam {string} tree treeID (required if superadmin)
     */
    'POST /api/eventType/create': 'EventType.create',

    /**
     * @api {post} /api/eventType/update update
     * @apiGroup EventType
     *
     * @apiParam {string} title Event Type title
     * @apiParam {string} color hex color (example: #ea4335)
     * @apiParam {string} tree treeID (superadmin)
     */
    'POST /api/eventType/update': 'EventType.update',

    /**
     * @api {post} /api/eventType/destroy destroy
     * @apiGroup EventType
     */
    'POST /api/eventType/destroy': 'EventType.destroy',

    /**
     * @api {get} /api/eventTypes list
     * @apiGroup EventType
     */
    'GET /api/eventTypes': 'EventType.list'

};
