"use strict";

module.exports = function(sequelize, DataTypes) {
  var Resource = sequelize.define("resource", {
    title: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    code: {
      type: DataTypes.STRING
    },
    class: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.STRING
    },
    url: {
      type: DataTypes.STRING
    }
  }, {
    underscored: true
  });

  return Resource;
};