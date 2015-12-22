var Redis = require('ioredis');

var client = new Redis(6379, '127.0.0.1');

client.hmset('dic_enterprise_hmset', "name", "lenzhao");
