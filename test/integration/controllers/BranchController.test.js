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
                            if (err) assert.equal(JSON.parse(res.text));

                            var response = JSON.parse(res.text);
                            next(null, response.token);
                        });
                },
                function getBranches(token, next) {
                    request(url)
                        .get('/api/branches')
                        .set('Authorization', 'Bearer ' + token)
                        .expect(200)
                        .end(function(err, res) {
                            if (err) assert.equal(JSON.parse(res.text));

                            var response = JSON.parse(res.text);
                            next(null, token, response);
                        });
                },
                function createBranchWithParent(token, branches, next) {
                    var branch = _.findWhere(branches, {name: 'Android'});

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
                        .send({ name: 'Android' })
                        .set('Authorization', 'Bearer ' + token)
                        .expect(200)
                        .end(function(err, res) {
                            if (err) assert.equal(JSON.parse(res.text));

                            var response = JSON.parse(res.text);
                            next(null, token);
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