/**
 * BranchController
 *
 * @description :: Server-side logic for managing branchs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    /**
     * List all branches
     * @param req
     * @param res
     */
    list: function (req, res) {
        Branch.find().then(function (branches) {
            return res.json(branches);
        }).catch(function (err) {
            return res.json(err);
        });
    },

    /**
     * Create new branch
     * @param req
     * @param res
     */
    create: function (req, res) {
        var params = req.params.all();

        Branch.create(params).then(function (branch) {
            return res.json(branch);
        }).catch(function (err) {
            return res.json(err);
        });
    },

    /**
     * Update branch
     * @param req
     * @param res
     */
    update: function (req, res) {
        var params = req.params.all();

        Branch.update(req.params.id, params).then(function (branch) {
            return res.json(branch);
        }).catch(function (err) {
           return res.negotiate(err);
        });
    },

    /**
     * View branch
     * @param req
     * @param res
     */
    view: function (req, res) {
      Branch.findOne(req.params.id).then(function (branch) {
          return res.json(branch);
      }).catch(function (err) {
         return res.negotiate(err);
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

