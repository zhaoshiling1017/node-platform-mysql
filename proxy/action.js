var Action = require('../models').Action;

exports.deleteAll = function(callback) {
    return Action.remove({}, callback);
}

exports.save = function(action) {
    return Action.create(action);
}