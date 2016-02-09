
module.exports = {

    getTypeModels: function () {
        var availableModels = _.filter(Object.keys(sails.models), function (model) {
            return (/^customtype/).test(model);
        });

        return _.map(availableModels, function (model) {
            return model.substr(10);
        });
    }

};