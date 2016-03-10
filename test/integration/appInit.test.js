var request = require('supertest');
var url = 'http://localhost:1337';
var async = require('async');
var assert = require('assert');
var fs = require('fs-extra');

describe('App Init', function () {

    var testData = {};
    testData.branches = [];

    it('Login superprof user', function (done) {
        request(url)
            .post('/api/auth/login')
            .send({email: 'hrca@gmail.com', password: 'hrca123'})
            .expect(200)
            .end(function (err, res) {
                if (err) JSON.parse(res.text);

                var response = JSON.parse(res.text);
                testData.token = response.token;
                testData.superprof = response.user;
                done();
            });
    });

    it('Get all roles', function (done) {
        request(url)
            .get('/api/roles')
            .set('Authorization', 'Bearer ' + testData.token)
            .expect(200)
            .end(function (err, res) {
                if (err) assert.equal(JSON.parse(res.text));

                var response = JSON.parse(res.text);
                testData.roles = response;
                done();
            });
    });

    it('Create new student', function (done) {
        var studentRole = _.findWhere(testData.roles, function (role) {
            role.name === 'student';
        });

        request(url)
            .post('/api/user/create')
            .send({
                email: 'novoselac@gmail.com',
                password: '123',
                confirmPassword: '123',
                firstName: 'Novo',
                lastName: 'Selac',
                mobile: '2874568456',
                role: studentRole
            })
            .set('Authorization', 'Bearer ' + testData.token)
            .expect(200)
            .end(function (err, res) {
                if (err) assert.equal(JSON.parse(res.text));

                var response = JSON.parse(res.text);
                testData.student = response;
                done();
            });
    });

    it('Create branches', function (done) {
        request(url)
            .post('/api/branch/create')
            .send({name: 'Web'})
            .set('Authorization', 'Bearer ' + testData.token)
            .expect(200)
            .end(function (err, res) {
                if (err) assert.equal(JSON.parse(res.text));

                var response = JSON.parse(res.text);
                testData.branches.push(response);
            });

        request(url)
            .post('/api/branch/create')
            .send({name: 'IOS'})
            .set('Authorization', 'Bearer ' + testData.token)
            .expect(200)
            .end(function (err, res) {
                if (err) assert.equal(JSON.parse(res.text));

                var response = JSON.parse(res.text);
                testData.branches.push(response);
            });

        request(url)
            .post('/api/branch/create')
            .send({name: 'Android'})
            .set('Authorization', 'Bearer ' + testData.token)
            .expect(200)
            .end(function (err, res) {
                if (err) assert.equal(JSON.parse(res.text));

                var response = JSON.parse(res.text);
                testData.branches.push(response);
                done();
            });
    });

    it('Get student and add permission for first branch', function (done) {
        var branch = _.findWhere(testData.branches, {name: 'Android'});
        var branches = [branch.id];

        request(url)
            .post('/api/permission/add')
            .send({user: testData.student.id, branches: branches})
            .set('Authorization', 'Bearer ' + testData.token)
            .expect(200)
            .end(function (err, res) {
                if (err) assert.equal(JSON.parse(res.text));
                done();
            });
    });

    it('Upload test media', function (done) {
        request(url)
            .post('/api/media/upload')
            .set('Authorization', 'Bearer ' + testData.token)
            .field('title', 'testMedia')
            .attach('fileToUpload', 'uploads/test.jpg')
            .expect(200)
            .end(function (err, res) {
                if (err) assert.equal(JSON.parse(res.text));

                var url = JSON.parse(res.text).url.split('/').pop();
                var filePath = 'uploads/media/' + url;

                fs.remove(filePath, function (error) {
                    if (error) return assert.equal(JSON.parse(error));
                    done();
                });
            });
    });

});
