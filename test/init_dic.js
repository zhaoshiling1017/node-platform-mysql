var Redis = require('ioredis');
var _ = require('lodash');
var config = require('../config');
var dict = require('../resources/dic/data.json');
var client = new Redis(config.redis_port, config.redis_host);
var Promise = require('bluebird');

var set = function (key, value) {
  var prefix = config.dic_prefix;
  if (prefix) {
    key = prefix + key;
  }
  value = JSON.stringify(value);
  return client.set(key, value);
};

var dicKeys = _.keys(dict);
var promises = [];

for (var i=0; i<dicKeys.length; i++) {
  var key = dicKeys[i];
  promises.push(set(key, dict[key]));
}

Promise.all(promises).then(function() {
  client.end();
  process.exit(0);
}, function(err) {
  client.end();
  process.exit(1);
});
