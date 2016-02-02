/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    login: function (req, res) {
        var email = req.param('email');
        var password = req.param('password');

        if (!email || !password) return res.customBadRequest('Missing Parameters.');

        User.findOneByEmail(email, function (err, user) {
            if (!user) return res.accessDenied('Invalid email or password');

            User.validPassword(password, user, function (err, valid) {
                if (err) return res.accessDenied();

                if (!valid) {
                    return res.accessDenied('invalid email or password');
                } else {
                    res.json({user: user, token: sailsTokenAuth.issueToken({userId: user.id, secret: user.secret})});
                }
            });
        })
    },


    register: function (req, res) {
        var params = req.params.all();

        //TODO: Do some validation on the input
        if (params.password !== params.confirmPassword) {
            return res.customBadRequest('Password doesn\'t match');
        }

        // Create tree
        Tree.create({name: 'Generic tree'}).then(function (tree) {
            // Find role "superprof"
            Role.findOne({name: 'superprof'}).then(function (role) {
                // Create user in tree && add role to him
                User.create({
                    role: role.id,
                    tree: tree.id,
                    email: params.email,
                    password: params.password
                }).then(function (user) {

                    var token = sailsTokenAuth.issueToken({userId: user.id, secret: user.secret});
                    return res.json({user: user, tree: tree, token: token});

                }).catch(function (error) {
                    tree.destroy(function (err) {
                        if (err) return res.negotiate(err);

                        return res.negotiate(error);
                    });

                });
            });
        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};

