module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js'],
            options: {
                jshintrc: '.jshintrc',
                ignores: ['src/3rd/**/*.js']
            }
        },
        clean: {
            dist: ['dist']
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['styles/**'],
                        dest: 'dist/'
                    }
                ]
            }
        },
        requirejs: {
            dist: {
                options: {
                    baseUrl: 'src',
                    out: 'dist/js/main.js',
                    name: '3rd/almond/almond',
                    mainConfigFile: 'src/main.js',
                    include: ['app-init'],
                    insertRequire: ['app-init'],
                    optimize: 'uglify2',
                    wrap: false
                }
            }
        },
        replace: {
            dist: {
                options: {
                    patterns: [{
                        match: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                        replacement: '<script src="js/main.js"></script>',
                        expression: true
                    }]
                },
                files: [{
                    src: 'src/index.html',
                    dest: 'dist/index.html'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('build', ['clean', 'copy', 'requirejs', 'replace']);
    grunt.registerTask('test', ['jshint']);
};
