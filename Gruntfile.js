/**
 * @file Grunt配置文件, grunt使用npm -g 安装
 *  执行test task的例子: $ grunt test
 * @author r2space@gmail.com
 */

"use strict";

module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-contrib-clean");  // 清楚临时文件
  grunt.loadNpmTasks("grunt-contrib-copy");   // 复制文件
  grunt.initConfig({

    /**
     * 清除临时数据
     */
    clean: [
      "public/static/thirdparty/alertify/*",
      "public/static/thirdparty/moment/*",
      "public/static/thirdparty/jquery/*",
      "public/static/thirdparty/underscore/*",
      "public/static/thirdparty/underscore.string/*"
    ],

    /**
     * 拷贝js文件
     */
    copy: {
      main: {
        files: [{
          expand: true, cwd: "node_modules/", dest: "public/static/thirdparty", src: [
            "alertify/lib/alertify.min.js",
            "alertify/themes/*"
          ]
        }, {
          expand: true, cwd: "node_modules/", dest: "public/static/thirdparty/", src: [
            "moment/min/*.min.js"
          ]
        }, {
          expand: true, cwd: "node_modules/", dest: "public/static/thirdparty/", src: [
            "underscore.string/dist/underscore.string.min.js"
          ]
        }, {
          expand: true, cwd: "node_modules/", dest: "public/static/thirdparty/", src: [
            "underscore/underscore-min.js",
            "underscore/underscore-min.map"
          ]
        }, {
          expand: true, cwd: "node_modules/", dest: "public/static/thirdparty/", src: [
            "jquery/dist/jquery.min.js",
            "jquery/dist/jquery.min.map"
          ]
        }
        ]
      }
    }
  });

  grunt.registerTask("default", ["clean", "copy"]);
};
