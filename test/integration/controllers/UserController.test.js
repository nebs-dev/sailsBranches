var request = require('supertest');
var url = 'http://localhost:1337';
var async = require('async');
var assert = require('assert');

describe('User', function(){
    it('Create new user(student) && add permission for first branch', function(done) {
        async.waterfall(
            [
                function login(next) {
                    request(url)
                        .post('/api/auth/login')
                        .send({ email: 'hrca@gmail.com', password: 'hrca123' })
                        .expect(200)
                        .end(function(err, res) {
                            if (err) JSON.parse(res.text);

                            var response = JSON.parse(res.text);
                            next(null, response.token, response.user.branches);
                        });
                },
                function getRoles(token, branches, next) {
                    request(url)
                        .get('/api/roles')
                        .set('Authorization', 'Bearer ' + token)
                        .expect(200)
                        .end(function(err, res) {
                            if (err) assert.equal(JSON.parse(res.text));

                            var response = JSON.parse(res.text);
                            next(null, token, branches, response);
                        });
                },
                function createStudent(token, branches, roles, next) {
                    var studentRole = _.findWhere(roles, function (role) { role.name === 'student'; });

                    request(url)
                        .post('/api/user/create')
                        .send({ email: 'novoselac@gmail.com', password: '123', confirmPassword: '123', firstName: 'Novo', lastName: 'Selac', mobile: '2874568456', role: studentRole })
                        .set('Authorization', 'Bearer ' + token)
                        .expect(200)
                        .end(function(err, res) {
                            if (err) assert.equal(JSON.parse(res.text));

                            var response = JSON.parse(res.text);
                            next(null, token, branches, response);
                        });
                }
            ],
            function finish(err, result) {
                done(err);
            }
        );

    });
});