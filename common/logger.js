var log4js = require('log4js');
var config = require('../config');

log4js.configure({
  appenders: [
    { type: 'console' },
    {
      type: 'file',
      filename: config.log.file_name,
      maxLogSize: config.log.max_log_size,
      backups:config.log.backups
    }
  ],
  replaceConsole: true
});

exports.logger=function(name){
  var logger = log4js.getLogger(name);
  logger.setLevel(config.log.level);
  return logger;
}
