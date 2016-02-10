/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

var grunt = require('grunt');
module.exports.bootstrap = function (cb) {

    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

    grunt.tasks('default', {}, function () {
        var rolesArray = ['superadmin', 'superprof', 'prof', 'student'];
        Role.find({name: rolesArray}).then(function (roles) {
            // Find missing roles
            var rolesToCreate = _.difference(rolesArray, _.pluck(roles, 'name'));
            var newRoles = [];

            // superadmin
            if (_.contains(rolesToCreate, 'superadmin')) {
                var obj = {'name': 'superadmin', 'add_branch': true, 'add_student': true};
                newRoles.push(obj);
            }
            // superprof
            if (_.contains(rolesToCreate, 'superprof')) {
                var obj = {'name': 'superprof', 'add_branch': true, 'add_student': true};
                newRoles.push(obj);
            }
            // prof
            if (_.contains(rolesToCreate, 'prof')) {
                var obj = {'name': 'prof', 'add_branch': false, 'add_student': true};
                newRoles.push(obj);
            }
            // student
            if (_.contains(rolesToCreate, 'student')) {
                var obj = {'name': 'student', 'add_branch': false, 'add_student': false};
                newRoles.push(obj);
            }

            // Create missing roles
            Role.create(newRoles).then(function (roles) {
                User.findOne({'email': 'nebs@gmail.com'}).populate('role').then(function (user) {
                    if (user) return cb();

                    Role.findOne({'name': 'superadmin'}).then(function (superadminRole) {
                        if (!role) return res.notFound('Superadmin role not found');

                        var userParams = {
                            'email': 'nebs@gmail.com',
                            'password': 'nebs123',
                            'firstName': 'Nebojsa',
                            'lastName': 'Stojanovic',
                            'mobile': '095 468 4768',
                            'role': superadminRole.id
                        };

                        User.create(userParams).then(function (user) {
                            grunt.tasks('default', {}, function () {
                                return cb();
                            });
                        });
                    });
                });
            });

        }).catch(function (err) {
            return res.negotiate(err);
        });
    });
};
