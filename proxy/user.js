var User = require('../models').User;
var Department = require('../models').Department;
var _ = require('lodash');
var Promise = require('bluebird'); 
var config = require('../config');
var Pager = require('../common/pager');
var Bluebird = require('bluebird');
var Sequelize = require("sequelize");

var sequelize = new Sequelize(config.pg.database, config.pg.username, config.pg.password, {
  host: config.pg.host,
  dialect: config.pg.dialect
});

exports.createUser = function(user) {
  return User.create(user);
}

exports.buildUser = function(user) {
  return User.build(user);
}

exports.findOne = function(query) {
  return User.findOne(query);
}

exports.destroyUser = function (id, callback) {
  return User.findById(id).then(function(user){
    return user.update({deleted: true});
  });
}

exports.getUserById = function(id) {
  return User.findById(id);
}

exports.getUserByPhone = function(phone) {
  return User.findOne({ where: {phone: phone}});
}

exports.getAllUsers = function() {
  return User.findAll({deleted: false});
}

exports.findResources = function(user) { 
  return sequelize.query("SELECT resource_code FROM permissions where id in (SELECT permission_id FROM roles_permissions where role_id in (SELECT role_id FROM users_roles where user_id = :user_id))", { replacements: { user_id: user.id} , type: sequelize.QueryTypes.SELECT} ).then(function(resourceCodes) {
    var codes = [];
    _.forEach(resourceCodes, function(code) {
      if(!_.isEmpty(code.resource_code)){codes.push(code.resource_code);}
    });
    return codes;
  });
}

exports.getUsersByQuery = function(query){
  var page = Pager.getPageNo(query.page);
  var pageSize = Pager.getPageSize(query.pageSize);
  var options = { offset: (page - 1) * pageSize, limit: pageSize, order: 'created_at DESC'};
  var db_query = { deleted: false };
  if (_.has(query, 'search')) {
    db_query.name = {$like: '%' + query.search + '%'};
  }
  return Department.findById(query.department_id).then(function(dept){
    var code = dept.code;
    return getIdsByCode(code);
  }).then(function(depts){
    var ids = [];
    for(index in depts){
      ids.push(depts[index].id);
    }
    db_query.department_id = { $in: ids };
    db_query.$or = [
      {phone: {$like: '%'+ (_.isEmpty(query.search ) ? '' : query.search) +'%'}},
      {name: {$like: '%'+ (_.isEmpty(query.search ) ? '' : query.search) +'%'}}
    ];
    return Bluebird.all([
      User.count(_.extend({}, { where:  db_query }, options)),
      User.findAll(_.extend({}, { where: db_query }, options))
    ]).then(function(data){
      var pager = new Pager(data[0], page, pageSize, query);
      return {users: data[1], pager: pager};
    });
  });
}

var getIdsByCode = function(code){
  return Department.findAll({
    attributes: ['id'],
    where: {
      code: { $like: code + '%'}
    }
  });
}