var Role = require('../proxy').Role;
var Permission = require('../proxy').Permission;
var tools = require('../common/tools');
var config = require('../config');
var cache = require('../common/cache');
var _ = require('lodash');
var Pager = require('../common/pager');
var Promise = require('bluebird');
var Sequelize = require('sequelize');

exports.index = function (req, res, next) {
  Role.getRolesByQuery(req.query).then(function(rs){
    res.render('roles/index', _.extend({}, {query: req.query}, rs));
  });
};

exports.add = function (req, res, next) {
  Permission.toMenuJson().then(function(array) { 
    res.render('roles/add', {array: JSON.stringify(array)});
  });
};

exports.create = function (req, res, next) {
  var name = tools.trim(req.body.name);
  var pids = tools.trim(req.body.sele_pids);
  if (_.isEmpty(name)) {
    Permission.toMenuJson().then(function(array) {
      return res.render('roles/add', _.extend({}, {ids: pids}, {array: JSON.stringify(array)},{errors: {name: {message: '角色名称不能为空'}}}));
    });
  }else{
    var loginer = req.session.user;
    if (!_.isEmpty(pids)) {
      var role = Role.buildRole({name: name, if_use: true});
      role.validate().then(function(err){ 
      if(!_.isEmpty(err)){
        // Department.getDeptById(department_id).then(function(dept){
        //   res.render('users/add', { user: user, dept: dept, errors: err.errors });
        // });
      }else{
        role.save().then(function(role){
          return role.setPermissions(pids.split(",")).then(function(permissions){
            res.redirect('/roles');
          });
        });
      }
    });
    }
  }
}

exports.edit = function (req, res, next) {
  var roleId = req.params.id;
  Role.getRoleById(roleId).then(function(role){
    return role.getPermissions().then(function(permissions){ return {role: role, permissions: permissions}});
  }).then(function (data) {
    var ids = [];
    _.forEach(data.permissions, function(permission){
      ids.push(permission.id);
    });
    Permission.toMenuJson().then(function(array) {
      res.render('roles/edit', { ids: ids.join(","), array: JSON.stringify(array), role: data.role });
    });
  });
}

exports.update = function (req, res, next) {
  var roleId = req.params.id;
  var name = req.body.name;
  var pids = tools.trim(req.body.sele_pids);
  Role.getRoleById(roleId).then(function(role){
    role.set({name: name});
    role.validate().then(function(err){ 
      if(!_.isEmpty(err)){
        // Department.getDeptById(department_id).then(function(dept){
        //   res.render('users/add', { user: user, dept: dept, errors: err.errors });
        // });
      }else{
        role.save().then(function(role){
          return role.setPermissions(pids.split(",")).then(function(permissions){
            res.redirect('/roles');
          });
        });
      }
    });
  });
}

exports.destroy = function (req, res, next) {
  var roleId = req.params.id;
  Role.getRoleById(roleId).then(function(role){
    role.set({if_use: false});
    role.validate().then(function(err){ 
      role.save().then(function(role){
        return role.setPermissions([]).then(function(permissions){
          res.redirect('/roles');
        });
      });
    });
  });
}