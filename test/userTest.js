var Role  = require('../models').Role;

/*Role.save({name: '超级管理员', if_use: true, if_system: 1}).then(function(role) {
    User.findOne({}).then(function(user) {
        user.addRole(role);
    });
});*/

Role.update({name: '企业管理员'}, {where: {id: 1}}).then(function(results) {
    console.log(results);
})
