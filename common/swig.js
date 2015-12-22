var swig = require('swig');

//设置swit过滤器判断是否是数字类型
swig.setFilter('isNumber', function (element) {
  return typeof element == "number";
});

module.exports = swig;