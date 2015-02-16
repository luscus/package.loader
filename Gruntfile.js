module.exports = function(grunt) {

  // load all grunt tasks matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'mochaTest', 'grunt-license-report']);
  grunt.registerTask('test', ['mochaTest']);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['package.json', 'Gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
    },
    mochaTest: {
      test: {
        options: {
          bail: true,
          "no-exit": true,
          reporter: 'dot'
        },
        src: ['test/**/*.spec.js']
      }
    },
    "grunt-license-report": {
      output: {
        path: './report/licenses',
        format:'html'
      }
    }
  });
};
