module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    execute: {
        initTables: {
          src: ['test/init_tables.js']
        },
        initDic: {
          src: ['test/init_dic.js']
        },
        initMenus: {
          src: ['test/init_menus.js']
        },
        initUser: {
          src: ['test/init_user.js']
        }
    }
  });

  grunt.registerTask("initTables", ['execute:initTables']);
  grunt.registerTask("initDic", ['execute:initDic']);
  grunt.registerTask("initMenus", ['execute:initMenus']);
  grunt.registerTask("initUser", ['execute:initUser']);
  grunt.registerTask('init', ['initTables' ,'initDic','initMenus','initUser']);
  
}
