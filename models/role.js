"use strict";
var tools = require('../common/tools');

module.exports = function(sequelize, DataTypes) {
  var Role = sequelize.define("role", {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "角色不能为空"  
        }
      }
    },
    if_use: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    if_system: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        Role.belongsToMany(models.User, { through: 'users_roles' });
        Role.belongsToMany(models.Permission, { through: 'roles_permissions' });
      }
    },
    instanceMethods: {
      createdAt: function(){
        return tools.formatDate(this.created_at);
      }
    }
  });

  return Role;
};