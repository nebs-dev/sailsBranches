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
        //TODO: Do some validation on the input
        if (req.body.password !== req.body.confirmPassword) {
            return res.json(401, {err: 'Password doesn\'t match'});
        }

        User.create({email: req.body.email, password: req.body.password}).exec(function (err, user) {
            if (err) {
                res.json(err.status, {err: err});
                return;
            }
            if (user) {
                res.json({user: user, token: sailsTokenAuth.issueToken({userId: user.id, secret: user.secret})});
            }
        });
    }

};

