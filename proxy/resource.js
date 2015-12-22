var Resource = require('../models').Resource;

exports.deleteAll = function() {
    return Resource.destroy({where: {}});
}

exports.save = function(resource) {
    return Resource.create(resource);
}

exports.getRootResByIds = function(ids) {
    return Resource.findAll({where: { _id: {in: ids}, code: {like: '___'}}, order: 'code'});
}

exports.getNodeResByIds = function(ids, code) {
    return Resource.findAll({where: {_id: {in: ids}, code: {like: code+'___'}}, order: 'code'});
}