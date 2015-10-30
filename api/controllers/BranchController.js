/**
 * BranchController
 *
 * @description :: Server-side logic for managing branchs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    test: function (req, res) {
        Branch.findOne(1).then(function(branch1) {
            Branch.findOne(2).then(function(branch2) {

                branch1.children.add(branch2.id);

                branch1.save(function(err, branch){
                    return res.json(branch);
                });
            });

        }).catch(function (err) {
           return res.json(err);
        });
    },


    create: function (req, res) {
        var params = req.params.all();

        Branch.create(params).then(function (branch) {
           return res.json(branch);
        }).catch(function (err) {
            return res.json(err);
        });
    },


    list: function (req, res) {
        Branch.find().populateAll().then(function (branches) {
            return res.json(branches);
        }).catch(function (err) {
            return res.json(err);
        });
    }

};

