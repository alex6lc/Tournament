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
        usemin: {
            html: 'dist/index.html'
        },
        concat: {
            css: {
                src: ['src/3rd/semantic/build/packaged/css/semantic.css', 'src/styles/*.css'],
                dest: 'dist/styles/main.css'
            }
        },
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            minify: {
                src: 'dist/styles/main.css',
                dest: 'dist/styles/main.css'
            }
        },
        copy: {
            dist: {
                files: [
                    { expand: true, cwd: 'src/3rd/semantic/build/packaged/fonts/', src: ['**'], dest: 'dist/fonts' },
                    { expand: true, cwd: 'src/3rd/semantic/build/packaged/images/', src: ['**'], dest: 'dist/images' }
                ]
            }
        },
        requirejs: {
            dist: {
                options: {
                    baseUrl: 'src/scripts',
                    out: 'dist/scripts/main.js',
                    name: '../3rd/almond/almond',
                    mainConfigFile: 'src/scripts/main.js',
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
                        replacement: '<script src="/scripts/main.js"></script>',
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

    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('build', ['clean', 'copy', 'requirejs', 'concat', 'cssmin', 'replace', 'usemin']);
    grunt.registerTask('test', ['jshint']);
};
