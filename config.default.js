/**
 * config
 */
var path = require('path');

var config = {
  debug: true,

  // 是否启用静态文件的合并压缩
  get mini_assets() { 
    return !this.debug; 
  }, 

  name: 'node-enterprise',
  description: 'A Node.js enterprise project using Postgres',
  keywords: 'enterprise',

    // cdn host
  site_static_host: '', // 静态文件存储域名
  // 应用的域名
  host: '127.0.0.1',

  // mongodb 配置
  db: 'mongodb://10.11.253.111/enterprise',
  db_name: 'enterprise',


  // postgres 配置
  pg: {
    database: 'enterprise',
    username: 'postgres',
    password: '',
    host: '127.0.0.1',
    dialect: 'postgres'
  },

  // redis 配置，默认是本地
  redis_host: '10.11.253.111',
  redis_port: 6379,

  session_secret: 'node_enterprise_secret',
  auth_cookie_name: 'node_enterprise_secret',

  // 程序运行的端口
  port: 3000,

  default_page_size: 10,
  dic_prefix: 'DIC_',
  menu_dic_name: 'menu',
  project_title: 'E聆',
  dic_user_name: 'allUser',
  
  upload: {
    path: path.join(__dirname, 'public/upload/'),
    url: '/public/upload/'
  },
  log: {
    file_name: 'logs/node-enterprise.log',
    max_log_size: 10485760,
    backups: 7,
    level: 'INFO'
  },
  interface_prefix_path: '/interface',
  oneapm_license_key: 'BQEODgRRVwN4267TTV4QXg8VXE2df1FeWhsAVFcESfa0e1AASABRFQAF2c92AwMaAl1LA14='
};

module.exports = config;