module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      build: {
        files: {
          'script.js': ['src/**/*.js']
        },
        options: {
          require: ['./src/main']
        }
      }
    },
    watch: {
      files: ['src/**/*.js'],
      tasks: [ 'browserify' ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  
  grunt.registerTask('default', ['watch']);
};