var User = require('../proxy').User;
var Role = require('../proxy').Role;
var Department = require('../proxy').Department;
var tools = require('../common/tools');
var config = require('../config');
var _ = require('lodash');
var Promise = require('bluebird');
var join = Promise.join;

exports.index = function (req, res, next) {
  var departmentId = req.query.department_id = req.query.department_id || 1;
  var rs = User.getUsersByQuery(req.query);
  var department = Department.getDeptById(departmentId);
  join(rs, department, function(rs, department){
    res.render('users/index', _.extend(rs,
      { department_name: department.name },
      { department_id: departmentId, query: req.query }
    ));
  });
};

exports.add = function (req, res, next) {
  var departmentId = req.query.departmentId || 1;
  var department = Department.getDeptById(departmentId);
  var roles = Role.getAllRoles();
  join(roles, department, function(roles, department){
    res.render('users/add', { roles: roles, dept: department });
  });
};

exports.create = function (req, res, next) {
  var userParams = req.body.user;
  var departmentId = req.body.department_id;
  var roles_body = req.body.roles;
  console.info(roles_body);
  var user = User.buildUser(userParams);
  user.validate().then(function(err){ 
    if(!_.isEmpty(err)){
      var roles = Role.getAllRoles();
      var department = Department.getDeptById(departmentId);
      join(roles, department, function(roles, department){
        res.render('users/add', { user: user, roles: roles, dept: department, errors: err.errors });
      });
    }else{
      var password = tools.bhash(user.password);
      join(password, function(password){
        user.password = password;
        user.save().then(function(user_tmp){
          console.info(roles_body);
          return user_tmp.setRoles(roles_body);
        }).then(function(){
          req.flash('success', '用户创建成功!');
          res.redirect('/users');
        });
      });
    }
  });
}

exports.edit = function (req, res, next) {
  var userId = req.params.id;
  var use = User.getUserById(userId);
  use.then(function(user){
    return user.getDepartment().then(function(dept){
      return { dept: dept, user: user }
    });
  }).then(function(data){
    res.render('users/edit', data);
  });
}

exports.update = function (req, res, next) {
  var userId = req.params.id;
  var editUser = req.body.user;
  if(_.isEmpty(editUser.activated)){
    editUser.activated = false;
  }
  User.getUserById(userId).then(function(user){
    user.set(editUser);
    user.validate().then(function(err){ 
      if(!_.isEmpty(err)){
        res.render('users/edit', { user: user, dept: user.department_id, errors: err.errors });
      }else{
        user.save().then(function(){
          res.redirect('/users');
        });
      }
    });
  });
}

exports.destroy = function (req, res, next) {
  var userId = req.params.id;
  User.destroyUser(userId).then(function(user){
    res.redirect('/users');
  });
}

exports.edit_password = function (req, res, next) {
  var userId = req.params.id;
  res.render('users/edit_passwd', { user_id: userId });
}

exports.update_password = function (req, res, next) {
  var userId = req.params.id;
  var passwd = req.body.password;
  var passwd_confirmation = req.body.password_confirmation;
  User.getUserById(userId).then(function(user){
    if(passwd==passwd_confirmation){
      tools.bhash(passwd).then(function(data){
        user.password = data;
        user.save().then(function(){
          res.redirect('/users');
        });
      });
    }
  });
}