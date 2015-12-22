var config = require('../config');
var Redis = require('ioredis');
var client = new Redis(config.redis_port, config.redis_host);

exports = module.exports = client;