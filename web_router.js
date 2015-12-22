var express = require('express');
var config = require('./config');
var home = require('./controllers/home');
var sign = require('./controllers/sign');
var users = require('./controllers/users');
var roles = require('./controllers/roles');
var departments = require('./controllers/departments');
var path = require('path');
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.upload.path)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.split(".")[0] + '-' + Date.now() + path.extname(file.originalname));
  }
})
var upload_voice = multer({
  storage: storage,
  fileFilter: function(req, file, cb){
    if(file.mimetype!=='audio/wav'){
      cb(null, false)
    }else{
      cb(null, true)
    }
  }
});

var router = express.Router();

router.get('/', home.index);
router.get('/home/call_records', home.call_records);
router.get('/call_records', home.call_records);
router.get('/signout', sign.signout);
router.get('/signin', sign.showLogin);
router.post('/signin', sign.login);
router.get('/signout', sign.signout);

//用户管理
router.get('/system', home.system);
router.get('/users', users.index);
router.get('/users/add', users.add);
router.post('/users', users.create);
router.get('/users/:id/edit', users.edit);
router.put('/users/:id', users.update);
router.get('/users/:id/edit_password', users.edit_password);
router.post('/users/:id/update_password', users.update_password);
router.delete('/users/:id/delete', users.destroy);

//角色管理
router.get('/roles', roles.index);
router.get('/roles/add', roles.add);
router.post('/roles', roles.create);
router.get('/roles/:id/edit', roles.edit);
router.put('/roles/:id', roles.update);
router.delete('/roles/:id/delete', roles.destroy);

//部门管理
router.get('/departments', departments.index);
router.get('/departments/add', departments.add);
router.get('/departments/:id/edit', departments.edit);
router.put('/departments/:id', departments.update);
router.post('/departments', departments.create);

module.exports = router;
