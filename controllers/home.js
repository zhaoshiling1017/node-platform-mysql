var config = require('../config');
var tools = require('../common/tools');
var User = require('../proxy/user');

exports.oriSignin = function (req, res, next) {
  res.render('home/signin', {});
};

exports.index = function (req, res, next) {
  res.render('home/index', {});
};

exports.call_records = function (req, res, next) {
  res.render('home/call_records', {});
};

exports.system = function(req, res, next){
  res.render('home/system', {});
}