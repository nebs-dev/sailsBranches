var sails = require('sails'),
    sails;

before(function (done) {


    sails.lift({
        connections: {
            mongoDb: {
                database: 'obris_test'
            }
        },
        models     : {
            migrate: 'drop'
        }
    }, function (err, server) {
        sails = server;
        if (err) return done(err);
        console.log(err);

        done();
    });
});

after(function (done) {
    // here you can clear fixtures, etc.
    sails.lower(done);
});