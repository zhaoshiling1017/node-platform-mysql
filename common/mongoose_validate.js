var config = require('../config');
var _ = require('lodash');
var logger = require('./logger').logger('tools');

//日程验证
var schedule = function (schedule) {
  var errors = {};
  if (_.isEmpty(schedule.name)) {
    errors.name = {message: '名称不能为空'};
  }
  return errors;
}
exports.schedule = schedule;
