var http = require('http');
var url = require('url');
var _ = require('lodash');
var  logger = require('../common/logger').logger('http_client');

var HttpClient = function(urlStr) {
  this.urlStr = urlStr;
}

HttpClient.prototype.get = function(callback) {
  var parsedUrl = url.parse(this.urlStr, true); 
  var options = {host: null, port: -1, path: null, method: 'GET'};
  options.host = parsedUrl.hostname;
  options.port = parsedUrl.port;
  options.path = parsedUrl.pathname;
  if (parsedUrl.search) {
    options.path += parsedUrl.search;
  }
  var req = http.request(options, function(res){
    logger.info("[%s]: url<%s>, status<%>", "httpClient::get", options.path, res.statusCode);
    res.setEncoding('utf8');
    res.on('data', function(data){
      logger.info("[%s]: body<%s>", "httpClient::get", data);
      callback(null, data);
    });
    res.on('error', function(err){
      return callback(err);
    });
  });
  req.on('error', function(err){
    return callback(err);
  });
  req.end();
}

HttpClient.prototype.post = function(content, callback) {
  var parsedUrl = url.parse(this.urlStr, true);
  var options = {
    host: parsedUrl.hostname,
    path: parsedUrl.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': content.length
    }
  };
  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(data){
      logger.info("[%s]: body<%s>", "httpClient::post", data);
      callback(null, data);
    });
    res.on('error', function(err) {
      callback(err);
    });
  });
  req.on('error', function(err) {
    callback(err);
  });
  req.write(content);
  req.end();
}

module.exports = HttpClient;