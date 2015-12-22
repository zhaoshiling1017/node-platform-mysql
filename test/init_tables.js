var models = require('../models');

models.sequelize.sync({force: true}).then(function() {
    console.log("数据库表结构已重建完毕！");
});