var User = require("../proxy").User;
var Department = require('../proxy').Department;
var Role = require('../proxy').Role;
var tools = require('../common/tools');

var initUser = function() {
  var account = [
    {field_name: "subdomain", field_value: "admin"},
    {field_name: "no", field_value: 1},
    {field_name: "company", field_value: "admin"},
    {field_name: "phone", field_value: "18610889767"},
    {field_name: "contactor", field_value: "admin"},
    {field_name: "address", field_value: "admin"},
    {field_name: "event_server", field_value: "10.0.0.242:4000"},
    {field_name: "cti_server", field_value: "10.0.0.242:8002"},
    {field_name: "ws_server", field_value: "10.0.0.242:8002"},
    {field_name: "default_number", field_value: "61958148"},
    {field_name: "sip_proxy", field_value: "10.0.0.242"},
    {field_name: "enabled", field_value: true}
  ]
  var department = {
    name: '我的公司',
    code: '01'
  }
  var user = {
    name: 'admin',
    phone: '18610889767',
    email: 'lenzhao@yahoo.com',
    job_code: '8000',
    password: '18610889767'
  };
  Department.createDepartment(0, department).then(function(department){
    tools.bhash(user.password).then(function(data) {
      user.password = data;
      user.department_id = department.id;
      User.createUser(user).then(function(user) {
        Role.findOne().then(function(role) {
          user.addRole(role);
        });
      });
    });
  });
}

initUser();
