/**
 * Item.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    schema: true,

    attributes: {
        name: {
            type: 'string',
            required: true
        },

        level: {
            type: 'integer',
            defaultsTo: 0
        },

        children: {
            collection: 'branch',
            via: 'parent'
        },

        parents: {
            type: 'array',
            defaultsTo: []
        },

        parent: {
            model: 'branch'
        },

        user: {
            model: 'user'
        },

        permissions: {
            collection: 'permission',
            via: 'branch'
        }
    },


    /**
     * Set parents for created branch
     * @param values
     * @param cb
     */
    beforeCreate: function (values, cb) {
        // get parent object
        Branch.findOne(values.parent).then(function (parent) {

            // if parent level is 0
            parent = parent || {};

            // Update this child with its parent parents and add current parent to that
            values.parents = parent.parents ? _.clone(parent.parents) : [];
            if(parent.id) {
                values.parents.push(parent.id);
            }

            // Calculate level
            values.level = values.parents.length;

            cb();

        }).catch(function (err) {
            cb(err);
        });
    },

    /**
     * Before update set parents for updated branch and all its children
     * @param valuesToBeUpdated
     * @param cb
     */
    beforeUpdate: function (valuesToBeUpdated, cb) {
        // Get this child values before update ( to get its children )
        Branch.findOne(valuesToBeUpdated.id).populateAll().then(function (updatedChild) {

            // If parent didn't change return
            if (valuesToBeUpdated.parent == updatedChild.parent) return cb();

            // Get future parent of this updated child
            Branch.findOne(valuesToBeUpdated.parent).then(function (parent) {

                // if parent level is 0
                parent = parent || {};

                // Update this child with its parent parents and add current parent to that
                valuesToBeUpdated.parents = parent.parents ? _.clone(parent.parents) : [];
                if(parent.id) {
                    valuesToBeUpdated.parents.push(parent.id);
                }

                // Calculate level
                valuesToBeUpdated.level = valuesToBeUpdated.parents.length;

                // add Parents for updatedChild children ( valuesToBeUpdated.parents + valuesToBeUpdated.id )
                var parents = _.clone(valuesToBeUpdated.parents);
                parents.push(valuesToBeUpdated.id);

                // Update parents of every updatedChild children
                _.each(updatedChild.children, function (child) {
                    child.parents = parents;

                    // Calculate level
                    child.level = child.parents.length;

                    child.save();
                });

                cb();
            });

        }).catch(function (err) {
            cb(err);
        });
    }

};
