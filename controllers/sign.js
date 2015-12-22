var validator = require('validator');
var config = require('../config');
var User = require('../proxy').User;
var tools = require('../common/tools');
var _ = require('lodash');

exports.showLogin = function (req, res) {
  if (req.session.user) {
    return res.redirect('/main');
  }
  res.render('sign/signin');
};

exports.login = function (req, res, next) {
  var phone = validator.trim(req.body.phone);
  var password = validator.trim(req.body.password);
  if (!phone || !password) {
    return res.render('sign/signin', { error: '手机号码或密码为空' , phone: phone});
  }
  User.getUserByPhone(phone).then(function (user) {
    if (!user) {
      return res.render('sign/signin', { error: '手机号码或密码错误', phone: phone });
    }
    var passhash = user.password;
    return tools.bcompare(password, passhash).then(function (bool) {
      if (!bool) {
        return res.render('sign/signin', { error: '手机号码或密码错误', phone: phone });
      }
      user.getRoles().then(function(roles){
        if(_.isEmpty(roles)){
          return res.render('sign/signin', { error: '该用户没有任何权限', phone: phone });
        }else{
          User.findResources(user).then(function(resources){
            req.session.resources = resources;
            tools.genSession(user, res);
            res.redirect('/');
          });
        }
      });
    });
  }).then(null, function(err) {
    return next(err);
  });
};

exports.signout = function (req, res, next) {
  req.session.destroy();
  res.clearCookie(config.auth_cookie_name, { path: '/' });
  res.redirect('/');
};