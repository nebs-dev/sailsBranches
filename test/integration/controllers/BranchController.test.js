var request = require('supertest');
var url = 'http://localhost:1337';
var async = require('async');
var assert = require('assert');

describe('Branch', function(){
    it('should be able to consume /api/branches, api/branch/create, api/branch/update routes', function(done) {
        async.waterfall(
            [
                function login(next) {
                    request(url)
                        .post('/api/auth/login')
                        .send({ email: 'hrca@gmail.com', password: 'hrca123' })
                        .expect(200)
                        .end(function(err, res) {
                            if (err) JSON.parse(res.text)

                            var response = JSON.parse(res.text);
                            next(null, response.token);
                        });
                },
                function createBranch(token, next) {
                    request(url)
                        .post('/api/branch/create')
                        .send({name: 'Web'})
                        .set('Authorization', 'Bearer ' + token)
                        .expect(200)
                        .end(function(err, res) {
                            if (err) assert.equal(JSON.parse(res.text));

                            var response = JSON.parse(res.text);
                            next(null, token);
                        });
                },
                function createBranch(token, next) {
                    request(url)
                        .post('/api/branch/create')
                        .send({name: 'IOS'})
                        .set('Authorization', 'Bearer ' + token)
                        .expect(200)
                        .end(function(err, res) {
                            if (err) assert.equal(JSON.parse(res.text));

                            var response = JSON.parse(res.text);
                            next(null, token);
                        });
                },
                function createBranch(token, next) {
                    request(url)
                        .post('/api/branch/create')
                        .send({name: 'Android'})
                        .set('Authorization', 'Bearer ' + token)
                        .expect(200)
                        .end(function(err, res) {
                            if (err) assert.equal(JSON.parse(res.text));

                            var response = JSON.parse(res.text);
                            next(null, token, response);
                        });
                },
                function createBranchWithParent(token, branch, next) {
                    request(url)
                        .post('/api/branch/create')
                        .send({ name: 'testBranchHrca2', parent: branch.id })
                        .set('Authorization', 'Bearer ' + token)
                        .expect(403)
                        .end(function(err, res) {
                            if (err) assert.equal(JSON.parse(res.text));

                            var response = JSON.parse(res.text);
                            next(null, token, branch);
                        });
                },
                function updateBranch(token, branch, next) {
                    request(url)
                        .post('/api/branch/update/' + branch.id)
                        .send({ name: 'Android2' })
                        .set('Authorization', 'Bearer ' + token)
                        .expect(200)
                        .end(function(err, res) {
                            if (err) assert.equal(JSON.parse(res.text));

                            var response = JSON.parse(res.text);
                            next(null, token);
                        });
                },
                function getBranches(token, next) {
                    request(url)
                        .get('/api/branches')
                        .set('Authorization', 'Bearer ' + token)
                        .expect(200, done);
                }
            ],
            function finish(err, result) {
                done(err);
            }
        );
    });

    it('Get student and add permission for first branch', function(done) {
        async.waterfall(
            [
                function login(next) {
                    request(url)
                        .post('/api/auth/login')
                        .send({ email: 'hrca@gmail.com', password: 'hrca123' })
                        .expect(200)
                        .end(function(err, res) {
                            if (err) assert.equal(JSON.parse(res.text));

                            var response = JSON.parse(res.text);
                            next(null, response.token, response.user);
                        });
                },
                function findTreeUsers(token, user, next) {
                    request(url)
                        .get('/api/tree/users')
                        .set('Authorization', 'Bearer ' + token)
                        .expect(200)
                        .end(function(err, res) {
                            if (err) assert.equal(JSON.parse(res.text));

                            var response = JSON.parse(res.text);
                            next(null, token, user, response[0]);
                        });
                },
                function addPermissionStudent(token, user, student, next) {
                    request(url)
                        .post('/api/permission/add')
                        .send({ user: student.id, branch: user.branches[0].id })
                        .set('Authorization', 'Bearer ' + token)
                        .expect(200)
                        .end(function(err, res) {
                            if (err) assert.equal(JSON.parse(res.text));

                            var response = JSON.parse(res.text);
                            next(null, token, response);
                        });
                }
            ],
            function finish(err, result) {
                done(err);
            }
        );
    });

    it('Login student and try to access branch', function(done) {
        async.waterfall(
            [
                function login(next) {
                    request(url)
                        .post('/api/auth/login')
                        .send({ email: 'novoselac@gmail.com', password: '123' })
                        .expect(200)
                        .end(function(err, res) {
                            if (err) assert.equal(JSON.parse(res.text));

                            var response = JSON.parse(res.text);
                            next(null, response.token, response.user);
                        });
                },
                function getBranches(token, user, next) {
                    request(url)
                        .get('/api/branches/')
                        .set('Authorization', 'Bearer ' + token)
                        .expect(200)
                        .end(function(err, res) {
                            if (err) assert.equal(JSON.parse(res.text));

                            var response = JSON.parse(res.text);
                            next(null, token, user, response);
                        });
                },
                function accessBranch(token, user, branches, next) {
                    request(url)
                        .get('/api/branch/' + branches[0].id)
                        .set('Authorization', 'Bearer ' + token)
                        .expect(200)
                        .end(function(err, res) {
                            if (err) assert.equal(JSON.parse(res.text));

                            var response = JSON.parse(res.text);
                            next(null, token, response);
                        });
                }
            ],
            function finish(err, result) {
                done(err);
            }
        );
    });

});