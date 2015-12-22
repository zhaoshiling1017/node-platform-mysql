var _ = require('lodash');
var qs = require('querystring');
var config = require('../config');

var Pager = function (totalRow, pageNo, pageSize, query) {
    this.totalRow = totalRow;
    this.pageNo = pageNo;
    this.firstPage=1;       
    this.totalPage = parseInt((totalRow+pageSize-1)/pageSize);
    this.lastPage = this.totalPage;
    this.prePage = pageNo-1<1?1:(pageNo-1);
    this.nextPage = pageNo+1>=this.totalPage?this.totalPage:(pageNo+1);
    this.pageSize = pageSize;
    this.query = qs.stringify(query);
}

Pager.prototype.getUrl = function(pageNum) {
    var params = this.allParams();
    console.info(params);
    var url = "";
    if(params.hasOwnProperty("page")){
      delete params['page'];
    }
    url += this.path + '?' + "page=" + pageNum;
    for(var param in params){
      url += "&" + param + "=" + params[param];
    };
    return url;
}

Pager.prototype.setUrl = function(path) {
    this.path = path;
}

Pager.prototype.allParams = function() {
    var queryString = this.query.replace("?","");
    var params = {};
    var parameters = queryString.split("&");
    if (!_.isEmpty(parameters)) {
        parameters.forEach(function(element) {
            if (element != "pageSize"&& element != '') {
                var vals = element.split("=");
                var value="";
                if(vals.length>1){
                    value = vals[1];
                }
                params[vals[0]] = value;
            }
        });
    }
    return params;
}

Pager.getPageNo = function (pageNo) {
    return pageNo==null?1:parseInt(pageNo);
}

Pager.getPageSize = function(pageSize) {
    return _.isEmpty(pageSize)?config.default_page_size:parseInt(pageSize);
}

module.exports = Pager;