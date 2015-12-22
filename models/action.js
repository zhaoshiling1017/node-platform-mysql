"use strict";

module.exports = function(sequelize, DataTypes) {
  var Action = sequelize.define("action", {
    code: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    type_code: {
      type: DataTypes.STRING
    },
    type_name: {
      type: DataTypes.STRING
    }
  }, {
    underscored: true
  });

  return Action;
};