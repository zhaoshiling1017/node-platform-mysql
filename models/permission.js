"use strict";

module.exports = function(sequelize, DataTypes) {
  var Permission = sequelize.define("permission", {
    resource_code: {
      type: DataTypes.STRING
    },
    action_code: {
      type: DataTypes.STRING
    },
    permission_type: {
      type: DataTypes.STRING
    }
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        Permission.belongsTo(models.Resource, { as: 'resource', constraints: false });
        Permission.belongsTo(models.Action);
        Permission.belongsToMany(models.Role, { through: 'roles_permissions' });
      }
    }
  });

  return Permission;
};