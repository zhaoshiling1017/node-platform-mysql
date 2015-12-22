var bcrypt = require('bcrypt');
var moment = require('moment');
var config = require('../config');
var _ = require('lodash');
var validator = require('validator');
moment.locale('zh-cn'); // 使用中文
var logger = require('./logger').logger('tools');
var Promise = require('bluebird');
Promise.promisifyAll(bcrypt);

// 格式化时间
var formatDate = function (date, friendly) {
  date = moment(date);
  if (friendly) {
    return date.fromNow();
  } else {
    return date.format('YYYY-MM-DD HH:mm:ss');
  }
};

exports.formatDate = formatDate;
//获取毫秒差
var getDateDiff = function (beginAt, endAt) {
  var date = moment(endAt);
  return date.diff(beginAt);
}
exports.dateDiff = getDateDiff;

//将毫秒转换成HH:mm:ss格式
var timeFomart = function (duration) {
  var hour = parseInt(duration/(1000*60*60));
  var time = duration - hour * (1000*60*60);
  var minute = parseInt(time/(1000*60));
  time = time - minute * (1000*60);
  var second = parseInt(time/1000);
  return leftJoin(hour, 2, '0') + ':' + leftJoin(minute, 2, '0') + ':' + leftJoin(second, 2, '0');
}
exports.timeFomart = timeFomart;

//字符串拼接
var leftJoin = function (str, scale, val) {
  var len = String(str).length;
  logger.info('leftJoin:: str<%s>, scale<%s>, val<%s>, len<%s>', str, scale, val, len);
  if (len < scale) {
    var diff = scale - len;
    var prefix = "";
    for (var i = 0; i < diff; i++) {
      prefix += val;
    }
      str = prefix + str;
  }     
  return str;
}
exports.leftJoin = leftJoin;

var validateId =  function (str) {
  return (/^[a-zA-Z0-9\-_]+$/i).test(str);
};

exports.validateId = validateId;

var validatePhone = function (str) {
  if (_.isEmpty(str)) {
    return true;
  }
  return (/^([0-9]{3,4}-?)?[0-9]{7,8}$/).test(str);
}

exports.validatePhone = validatePhone;

var validateMobile = function (str) {
  if (_.isEmpty(str)) {
    return true;
  }
  return (/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/).test(str);
}

exports.validateMobile = validateMobile;

exports.bhash = function (str) {
  return bcrypt.hashAsync(str, 10);
};

exports.bcompare = function (str, hash) {
  return bcrypt.compareAsync(str, hash);
};

exports.genSession = function(user, res) {
  var auth_token = user.id + '$$$$'; // 以后可能会存储更多信息，用 $$$$ 来分隔
  res.cookie(config.auth_cookie_name, auth_token,
    {path: '/', maxAge: 1000 * 60 * 60 * 24 * 30, signed: true, httpOnly: true}); //cookie 有效期30天
}

var filterEmptyKey = function (obj) {
  var other = {};
  var keys = _.keys(obj);
  for (var i=0; i<keys.length; i++) {
    var key = keys[i];
    obj[key] = validator.trim(obj[key]);
    if (!_.isEmpty(obj[key])) {
      other[key] = obj[key];
    }
  }
  return other;
}

exports.filterEmptyKey = filterEmptyKey;


var trim = function(str) {
  return validator.trim(str);
}

exports.trim = trim;

var trimOrDefault = function(str, defaultValue) {
  str = validator.trim(str);
  if (_.isEmpty(str)) {
    return defaultValue;
  }
  return str;
}

exports.trimOrDefault = trimOrDefault;

var trimObject = function (obj) {
  var keys = _.keys(obj);
  for (var i=0; i<keys.length; i++) {
    var key = keys[i];
    obj[key] = validator.trim(obj[key]);
  }
  return obj;
}

exports.trimObject = trimObject;

var validateUser = function (user) {
  var errors = {};
  if (_.isEmpty(user.user_name)) {
    errors.user_name = {message: '用户名不能为空'};
  }
  if (_.isEmpty(user.real_name)) {
    errors.real_name = {message: '姓名不能为空'};
  }
  if (_.isEmpty(user.job_code)) {
    errors.job_code = {message: '工号不能为空'};
  }
  if (_.has(user, 'password') && _.has(user, 'password_confirm')) {
    if (_.isEmpty(user.password)) {
      errors.password = {message: '密码不能为空'};
    }
    if (_.isEmpty(user.password_confirm)) {
      errors.password_confirm = {message: '确认密码不能为空'};
    }
    if (user.password_confirm && user.password && user.password_confirm != user.password) {
      errors.password_confirm = {message: '两次密码不一致'};
    }
  }
  return errors;
}

exports.validateUser = validateUser;

var getOrDefault = function(map, name, defaultValue) {
  if (_.has(map, name)) {
    return trim(map[name]);
  }
  return defaultValue;
}

exports.getOrDefault = getOrDefault;

var validateMeetingConfig = function (meeting_config) {
  var errors = {};
  if (_.isEmpty(meeting_config.name)) {
    errors.name = {message: '会议名称不能为空'};
  }
  if (_.isEmpty(meeting_config.room)) {
    errors.room = {message: '会议室不能为空'};
  }
  return errors;
}
exports.validateMeetingConfig = validateMeetingConfig;