module.exports = {

    /**
     * Add branches to media object
     * @param media
     * @param branches
     * @param cb
     * @returns {*}
     */
    saveBranches: function (media, branches, cb) {
        if (!branches || !branches.length) return cb();

        //media.branches.add(branches[0]);
        media.save(function (err) {
            console.log(err);
            if (err) return cb(err);

            return cb(null, media);
        });
    }

};