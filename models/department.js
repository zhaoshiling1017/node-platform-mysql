"use strict";

module.exports = function(sequelize, DataTypes) {
  var Department = sequelize.define("department", {
     name: {
        type: DataTypes.STRING
      },
      code: {
        type: DataTypes.STRING
      }
  }, {
    underscored: true
  });

  return Department;
};