var _ = require('lodash');
var menus = require('../resources/menus.json');
var Resource = require('../proxy').Resource;
var Permission = require('../proxy').Permission;
var Role = require('../proxy').Role;
var tools = require('../common/tools');
var Promise = require('bluebird');

/*var initMenus = function() {
  cache.set(config.menu_dic_name, menus).then(function() {
    process.exit(0);
  });
}*/

var initMenus = function() {
    Resource.deleteAll().then(function() {
        if (!_.isEmpty(menus)) {
            var resource_tasks = [];
            _.forEach(menus, function(resource) {
                var _name = tools.getOrDefault(resource, 'name', '');
                var _code = tools.getOrDefault(resource, 'code', '');
                var _title = tools.getOrDefault(resource, 'title', '');
                var _class = tools.getOrDefault(resource, 'class', '');
                var _url =  tools.getOrDefault(resource, 'url', '');
                var _type =  tools.getOrDefault(resource, 'type', '');
                var root = {name: _name, code: _code, title: _title, class: _class, url: _url, type: _type};
                resource_tasks.push(Resource.save(root));
                var nodes = resource.resources || [];
                _.forEach(nodes, function(node) {
                    var _nodeName = tools.getOrDefault(node, 'name', '');
                    var _nodeCode = tools.getOrDefault(node, 'code', '');
                    var _nodeTitle = tools.getOrDefault(node, 'title', '');
                    var _nodeClass = tools.getOrDefault(node, 'class', '');
                    var _nodeUrl =  tools.getOrDefault(node, 'url', '');
                    var _nodeType =  tools.getOrDefault(node, 'type', '');
                    var nodeRes = {name: _nodeName, code: _nodeCode, title: _nodeTitle, class: _nodeClass, url: _nodeUrl, type: _nodeType};
                    resource_tasks.push(Resource.save(nodeRes));
                    var childs = node.resources || [];
                    _.forEach(childs, function(child) {
                        var _childName = tools.getOrDefault(child, 'name', '');
                        var _childCode = tools.getOrDefault(child, 'code', '');
                        var _childTitle = tools.getOrDefault(child, 'title', '');
                        var _childClass = tools.getOrDefault(child, 'class', '');
                        var _childUrl =  tools.getOrDefault(child, 'url', '');
                        var _childType =  tools.getOrDefault(child, 'type', '');
                        var childRes = {name: _childName, code: _childCode, title: _childTitle, class: _childClass, url: _childUrl, type: _childType};
                        resource_tasks.push(Resource.save(childRes));
                    });
                });
            });
            Promise.all(resource_tasks).then(function(results) {
                _.forEach(results, function(v) {
                    var permission = {resource_code: v.code, action_code: '', permission_type: 'resource'};
                    Permission.save(permission).then(function(per) {
                        per.setResource(v);
                    });
                });
            }).then(function() {
                Role.save({name: '超级管理员', if_use: true, if_system: 1}).then(function(role) {
                    Permission.getAllPermissions().then(function(pers) {
                        role.setPermissions(pers);
                    });
                });
            });
        }
    });
}

initMenus();