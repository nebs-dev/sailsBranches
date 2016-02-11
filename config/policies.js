/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

    /***************************************************************************
     *                                                                          *
     * Default policy for all controllers and actions (`true` allows public     *
     * access)                                                                  *
     *                                                                          *
     ***************************************************************************/

    '*': true,

    AuthController: {
        'register': true
    },

    'UserController': {
        'show': ['tokenAuth', 'ownUser'],
        'update': ['tokenAuth', 'ownUser', 'userUpdate'],
        'create': ['tokenAuth', 'userCreate', 'isSuperprof'],
        'destroy': ['tokenAuth', 'isSuperprof'],
        'addRole': ['tokenAuth', 'isSuperadmin'],
        'addTree': ['tokenAuth', 'isSuperadmin'],
        'list': ['tokenAuth', 'isSuperadmin'],
        '*': false
    },

    'RoleController': {
        'list': ['tokenAuth', 'isSuperprof'],
        '*': ['tokenAuth', 'isSuperadmin']
    },

    'BranchController': {
        'show': ['tokenAuth', 'branchAccess'],
        'create': ['tokenAuth', 'branchCreate'],
        'update': ['tokenAuth', 'isSuperprof'],
        'destroy': ['tokenAuth', 'branchDestroy'],
        'list': ['tokenAuth'],
        'getStudents': ['tokenAuth', 'branchAccess'],
        'getUsers': ['tokenAuth', 'branchAccess', 'isSuperprof'],
        '*': false
    },

    'PermissionController': {
        'add': ['tokenAuth', 'branchActions'],
        'remove': ['tokenAuth', 'branchActions'],
        '*': true
    },

    'LicenceController': {
        '*': ['tokenAuth', 'isSuperadmin']
    },

    'TreeController': {
        'getAllUsers': ['tokenAuth', 'isSuperprof'],
        '*': ['tokenAuth', 'isSuperadmin']
    },

    'MediaController': {
        'getOne': ['tokenAuth', 'mediaAccess'],
        '*': true
    },

    'MediaCategoryController': {
        '*': ['tokenAuth', 'isSuperadmin']
    },

    'EventController': {
        '*': ['tokenAuth']
    }

    /***************************************************************************
     *                                                                          *
     * Here's an example of mapping some policies to run before a controller    *
     * and its actions                                                          *
     *                                                                          *
     ***************************************************************************/
    // RabbitController: {

    // Apply the `false` policy as the default for all of RabbitController's actions
    // (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
    // '*': false,

    // For the action `nurture`, apply the 'isRabbitMother' policy
    // (this overrides `false` above)
    // nurture	: 'isRabbitMother',

    // Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
    // before letting any users feed our rabbits
    // feed : ['isNiceToAnimals', 'hasRabbitFood']
    // }
};
