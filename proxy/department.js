var Department = require('../models').Department;
var Sequelize = require('sequelize');
var _ = require('lodash');

exports.getIdsByCode = function(code){
  return Department.findAll({
    where: {
      code: { $like: code + '%' }
    },
    attributes: ['id']
  });
}

exports.createDepartment = function(parent_id, department) {
  return findChildrenNextCode(parent_id).then(function(code){
    department.code = code;
    return Department.create(department);
  });
}

var findChildrenNextCode = function(parent_id){
  return Department.findById(parent_id).then(function(dept) {
    if(!_.isEmpty(dept)){
      return Department.findOne({ 
        order: 'code DESC',
        where: {
          code: { $like: dept.code+'%' },
          $and: Sequelize.where(Sequelize.fn('CHAR_LENGTH', Sequelize.col('code')), '=', dept.code.length+2),
        }
      }).then(function(data){ return {code: dept.code, dept:data} });
    }else{
      return { code: "" };
    }
  }).then(function(data){
    var code = data.code + "01";
    if(!_.isEmpty(data.dept)){
      code = (Number(data.dept.code)+1).toString();
    }
    if(code.length%2!=0){
      code = "0" + code;
    }
    return code;
  });
}

var getAllDepartments = function() {
  return Department.findAll();
}

exports.getAllDepartments = getAllDepartments;

exports.getAllAsTree = function(){
  return getAllDepartments().then(function(departments){
    var depts = tree_depts(departments, 1, "") || [];
    return depts;
  });
}

exports.getDeptById = function(id){
  return Department.findById(id);
}

var tree_depts = function(departments, level, code){
  var level_departments = [];
  for(index in departments){
    var dept = departments[index];
    if(!_.isEmpty(dept) && dept.code.length==level*2 && dept.code.indexOf(code)==0){
      level_departments.push({
        label: dept.name,
        id: dept.id,
        children: tree_depts(departments, level+1, dept.code)
      });
    }
  }
  return level_departments;
}