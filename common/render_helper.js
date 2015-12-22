/*!
 * node-meeting - common/render-helper.js
 */
"use strict";

var _ = require('lodash');
var config = require('../config');
var uuid = require('uuid');

exports.staticFile = function (filePath) {
  if (filePath.indexOf('http') === 0 || filePath.indexOf('//') === 0) {
    return filePath;
  }
  return config.site_static_host + filePath;
};

exports.pagination = function (pager, setSize, url) {
    pager.setUrl(url);
    var totalPage = pager.totalPage<=0?1:pager.totalPage;
    var page = "<ul class=\"pagination\">";
    if(pager.pageNo > 1){
        page += "<li><a href=\""+ pager.getUrl(pager.firstPage) +"\">首页</a></li>";
    }
    var pageNum = pager.totalRow/pager.pageSize;
    var num = parseInt(pageNum);
    if((pager.totalRow%pager.pageSize)!=0){ num += 1 }
    for(var i=1; i < num+1; i++){
        if(pager.pageNo==i){
           page += "<li class=\"active\"><a href=\""+ pager.getUrl(i) +"\">"+ i +"</a></li>";
        }else{
           page += "<li><a href=\""+ pager.getUrl(i) +"\">"+ i +"</a></li>";
        }
    }
    if (pager.pageNo < totalPage) {
        page += "<li><a href=\""+ pager.getUrl(pager.lastPage) +"\">末页</a></li>";
    }
    page += "</ul>";
    return page;
}

// <span class="page gap">…</span>

exports._ = _;