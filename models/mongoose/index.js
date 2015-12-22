var mongoose = require('mongoose');
var config = require('../../config');

mongoose.connect(config.db, { server: {poolSize: 10}}, function (err) {
  if (err) {
    console.error('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
});

require('./ivr_node');

exports.Node = mongoose.model('IvrNode');