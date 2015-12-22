var TrunkNumber = require('../models').TrunkNumber;
var _ = require('lodash');
var config = require('../config');
var Sequelize = require('sequelize');
var Pager = require('../common/pager');
var Bluebird = require('bluebird');

exports.buildTrunkNumber = function(trunkNumber) {
  return TrunkNumber.build(trunkNumber);
}

exports.getTrunkNumberById = function(id) {
  return TrunkNumber.findById(id);
}

exports.getAllTrunkNumbers = function(){
  return TrunkNumber.findAll();
}

exports.destroyTrunkNumber = function (id) {
  return TrunkNumber.findById(id).then(function(trunkNumber){
    return trunkNumber.update({deleted: true});
  });
}

exports.getTrunkNumbersByQuery = function (query) {
  var page = Pager.getPageNo(query.page);
  var pageSize = Pager.getPageSize(query.pageSize);
  var options = { offset: (page - 1) * pageSize, limit: pageSize, order: 'created_at DESC'};
  var db_query = { deleted: false };
  if (_.has(query, 'search')) {
    db_query.number = {$like: '%' + query.search + '%'};
  }
  return Bluebird.all([
    TrunkNumber.count(_.extend({}, { where:  db_query }, options)),
    TrunkNumber.findAll(_.extend({}, { where: db_query }, options))
  ]).then(function(data){
    var pager = new Pager(data[0], page, pageSize, query);
    return {trunk_numbers: data[1], pager: pager};
  });
};

exports.save = function (doc) {
  return TrunkNumber.create(_.extend({},doc));
}
