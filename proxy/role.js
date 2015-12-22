var Role = require('../models').Role;
var _ = require('lodash');
var config = require('../config');
var Sequelize = require('sequelize');
var Pager = require('../common/pager');
var Bluebird = require('bluebird');

exports.buildRole = function(role) {
    return Role.build(role);
}

exports.findOne = function(){
  return Role.findOne();
}

exports.getRoleById = function(id) {
  return Role.findById(id);
}

exports.getAllRoles = function(){
   return Role.findAll({ if_use: true });
}

exports.getRolesByQuery = function (query) {
  var page = Pager.getPageNo(query.page);
  var pageSize = Pager.getPageSize(query.pageSize);
  var options = { offset: (page - 1) * pageSize, limit: pageSize, order: 'created_at DESC'};
  var db_query = { if_use: true };
  if (_.has(query, 'search')) {
    db_query.name = {$like: '%' + query.search + '%'};
  }
  return Bluebird.all([
    Role.count(_.extend({}, { where:  db_query }, options)),
    Role.findAll(_.extend({}, { where: db_query }, options))
  ]).then(function(data){
    var pager = new Pager(data[0], page, pageSize, query);
    return {roles: data[1], pager: pager};
  });
};

exports.save = function (doc) {
  return Role.create(_.extend({},doc, {if_use: true}));
}
