var config = require('../config');
var cache = require('../common/cache');
var UserProxy = require('../proxy').User;
var _ = require('lodash');
var Promise = require('bluebird');
var menus = require('../resources/menus.json');

var notAuth = [
  '/signin'
];

// 验证用户是否登录
exports.authUser = function (req, res, next) {
  if (req.path.indexOf(config.interface_prefix_path) != -1) {
    return next();
  }
  for (var i=0; i<notAuth.length; i++) {
    if (notAuth[i] == req.path) {
      return next();
    }
  }
  delete req.session.user;
  Promise.resolve(req.session.user).then(function(ses_user) {
    if (ses_user) {
      return ses_user;
    }
    var auth_token = req.signedCookies[config.auth_cookie_name];
    if (!auth_token) {
      throw new Error('请先登录');
    }
    var auth = auth_token.split('$$$$');
    var user_id = auth[0];
    return UserProxy.getUserById(user_id).then(function(rs) {
      if (_.isEmpty(rs)) {
        throw new Error('请先登录');
      }
      return rs;
    });
  }).then(function(user) {
    var current_menus = menus;
    res.locals.current_user = req.session.user = user;
    if(!_.isEmpty(req.session.menus)){
      res.locals.menus = req.session.menus;
    }else{
      res.locals.menus = [];
    }
    res.locals.title = config.project_title;
    next();
  }, function(err) {
    return res.render('sign/signin', {error: err.message});
  });
};