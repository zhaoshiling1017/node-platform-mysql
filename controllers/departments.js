var Department = require('../proxy').Department;
var tools = require('../common/tools');
var config = require('../config');
var cache = require('../common/cache');
var _ = require('lodash');
var Pager = require('../common/pager');

exports.index = function (req, res, next) {
  Department.getAllAsTree().then(function(departments){
    res.json(departments);
  });
};

exports.add = function (req, res, next) {
  var department_id = req.query.department_id || 1;
  res.render('departments/add', { department_id: department_id });
}

exports.create = function (req, res, next){
  var department = req.body.department;
  var parent_id = req.body.parent_id;
  Department.createDepartment(parent_id, department).then(function(department){
    res.redirect("/users");
  });
}

exports.edit = function (req, res, next) {
    var deptId = req.params.id;
    Department.getDeptById(deptId).then(function(department){
      res.render('departments/edit', {department: department});
    });
}

exports.update = function (req, res, next) {
    var deptId = req.params.id;
    var new_department = req.body.department;
    Department.getDeptById(deptId).then(function(department){
      return department.update(new_department);
    }).then(function(department){
      res.redirect("/users");
    });
}
