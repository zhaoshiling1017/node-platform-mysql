var Permission = require('../models').Permission;
var Resource = require('../models').Resource;
var Sequelize = require('sequelize');
var _ = require('lodash');

exports.save = function(permission) {
  return Permission.create(permission);
}

exports.getAllPermissions = function() {
  return Permission.findAll();
}

exports.toMenuJson = function(){
  return Permission.findAll({
      order: 'resource_code ASC',
      include: [{ model: Resource, as: 'resource' }]
    }).then(function(permissions) {
      var array = [];
      var menusAndCodes = generateMenuCodeAndId(permissions);
      _.forEach(permissions, function(permission){
        if(permission.resource_code.length==3){
          array.push(generateMenuNode(permission, 0, 'root'));
        }else if(permission.resource_code.length==6){
          var pId = menusAndCodes[permission.resource_code.substr(0,3)];
          array.push(generateMenuNode(permission, pId, 'node'));
        }else if(permission.resource_code.length==9){
          var pId = menusAndCodes[permission.resource_code.substr(0,6)];
          array.push(generateMenuNode(permission, pId, 'node'));
        }
      });
      return array;
    });
}

var generateMenuNode = function(permission, pId, ptype){
  var menu = {};
  menu.id = permission.id;
  menu.pId = pId;
  menu.name = permission.resource.title;
  menu.ptype = ptype;
  menu.open = true;
  return menu;
}

var generateMenuCodeAndId = function(permissions){
  var menusCodes = {};
  _.forEach(permissions, function(permission){
    menusCodes[permission.resource_code] = permission.id;
  });
  return menusCodes;
}