/**
 * BranchController
 *
 * @description :: Server-side logic for managing branchs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    list: function (req, res) {
        Branch.find().populateAll().then(function (branches) {
            return res.json(branches);
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

    test: function (req, res) {
        var newParent = req.param('parent');

        Branch.findOne(newParent).then(function (parent) {
            var parentId = parent ? parent.id : 0;

            Branch.findOne(3).then(function (child) {

                if (child.parent != parentId) {

                    child.parent = parentId;
                    child.save(function (err, child) {
                        if (err) return res.json(err);

                        return res.json(child);
                    });

                } else {
                    return res.json(child);
                }
            });

        }).catch(function (err) {
            return res.json(err);
        });
    }

};

