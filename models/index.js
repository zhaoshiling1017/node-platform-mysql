"use strict";

var path = require("path");
var Sequelize = require("sequelize");
var config = require('../config');
var _ = require('lodash');
var glob = require("glob");

var sequelize = new Sequelize(config.pg.database, config.pg.username, config.pg.password, {
    host: config.pg.host,
    dialect: config.pg.dialect
});

var db = {};
var sequelizeModels = [
  ['*.js', ['index.js', 'mongo_index.js','mongoose/*.js']]
];

sequelizeModels.forEach(function(ele){
  var pattern = ele[0];
  var ignore = ele[1];
  var opt = {cwd: 'models' ,ignore: ignore, nodir: true, matchBase: true};
  var files = glob.sync(pattern, opt);
  _.forEach(files,function(file){
    var model = sequelize.import(path.join(__dirname, file));
    var arr_names = model.name.split("_");
    var rs_name = "";
    _.forEach(arr_names, function(name){
      rs_name += name.replace(/(\w)/,function(v){return v.toUpperCase()});
    });
    db[rs_name] = model;
  });
});

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;