var redis = require('./redis');
var _ = require('lodash');
var config = require('../config');

var prefix = function (key) {
  if (config.dic_prefix) {
    return config.dic_prefix + key;
  }
  return key;
}

var get = function (key) {
  var _key = prefix(key);
  return redis.get(_key).then(function(data) {
      if (!data) {
        return null;
      } 
      return JSON.parse(data);
  });
};

exports.get = get;

var set = function (key, value) {
  var _key = prefix(key);
  value = JSON.stringify(value);
  return redis.set(_key, value);
};

exports.set = set;

//删除cache
var del = function (key) {
  var _key = prefix(key);
  return redis.del(_key);
}

exports.del = del;

var hmset = function (key, obj) {
  var _key = prefix(key);
  return redis.hmset(_key, obj);
}
exports.hmset = hmset;

var hgetall = function (key) {
  var _key = prefix(key);
  return redis.hgetall(_key);
}

exports.hgetall = hgetall;

var hget = function (key, field) {
  var _key = prefix(key);
  return redis.hget(_key, field).then(function(data) {
    if (_.isEmpty(data)) {
      return null;
    }
    return JSON.parse(data);
  });
}

exports.hget = hget;

var hdel = function(key, field) {
  var _key = prefix(key);
  return redis.hdel(_key, field);
}

exports.hdel = hdel;

var hset = function(key, field, value) {
  var _key = prefix(key);
  value = JSON.stringify(value);
  return redis.hset(_key, field, value);
}

exports.hset = hset;