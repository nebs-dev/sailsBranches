var request = require('supertest');
var url = 'http://localhost:1337';
var async = require('async');
var assert = require('assert');

describe('Event', function () {

    var testData = {};

    it('Login superprof user and create event', function (done) {
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

    it('Get branch', function (done) {
        request(url)
            .get('/api/branches')
            .set('Authorization', 'Bearer ' + testData.token)
            .expect(200)
            .end(function (err, res) {
                if (err) assert.equal(JSON.parse(res.text));

                var response = JSON.parse(res.text);
                testData.branches = response;
                done();
            });
    });

    it('Create event type ', function (done) {
        request(url)
            .post('/api/eventType/create')
            .send({title: 'testEventType', color: '#ea4335'})
            .set('Authorization', 'Bearer ' + testData.token)
            .expect(200)
            .end(function (err, res) {
                if (err) assert.equal(JSON.parse(res.text));

                var response = JSON.parse(res.text);
                testData.eventType = response;
                done();
            });
    });

    it('Get media file', function (done) {
        request(url)
            .get('/api/media/list')
            .set('Authorization', 'Bearer ' + testData.token)
            .expect(200)
            .end(function (err, res) {
                if (err) assert.equal(JSON.parse(res.text));

                var response = JSON.parse(res.text);
                testData.media = response[0];
                done();
            });
    });

    it('Create event ', function (done) {
        var branch = _.findWhere(testData.branches, {name: 'Android'});

        request(url)
            .post('/api/event/create')
            .send({
                title: 'First Event',
                fromDate: '2016-05-15',
                toDate: '2016-05-20',
                type: testData.eventType.id,
                branches: [branch.id],
                media: [testData.media.id]
            })
            .set('Authorization', 'Bearer ' + testData.token)
            .expect(200)
            .end(function (err, res) {
                if (err) assert.equal(JSON.parse(res.text));

                var response = JSON.parse(res.text);
                done();
            });
    });
});