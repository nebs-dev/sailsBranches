var request = require('supertest');
var url = 'http://localhost:1337';
var async = require('async');

describe('Auth', function(){
    it('should be able to register/login new user', function(done) {
        async.waterfall(
            [
                function register(next) {
                    request(url)
                        .post('/api/auth/register')
                        .send({ email: 'hrca@gmail.com', password: 'hrca123', confirmPassword: 'hrca123', firstName: 'Hrvoje', lastName: 'Lozancic', mobile: '2874568456' })
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end(function(err, res) {
                            if (err) return next(err);

                            var response = JSON.parse(res.text);
                            next(null, response.user);
                        });
                },

                function login(user, next) {
                    request(url)
                        .post('/api/auth/login')
                        .send({ email: user.email, password: 'hrca123' })
                        .expect(200)
                        .end(function(err, res) {
                            if (err) return next(err);

                            var response = JSON.parse(res.text);
                            next(null, response.token);
                        });
                }
            ],
            function finish(err, result) {
                done(err);
            }
        );

    });
});