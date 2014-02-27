var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    grunt.initConfig({
        connect: {
            options: {
                port: 9000,
                hostname: 'localhost'
            },
            server: {
                options: {
                    base: "src"
                }
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, "src")
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>/index.html'
            }
        },
        watch: {
            scripts: {
                files: [
                    'src/**/*.js',
                    'src/**/*.html',
                    'src/**/*.css',
                ],
                options: {
                    livereload: LIVERELOAD_PORT
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-open');

    grunt.registerTask('server', [
        'connect:livereload',
        'open',
        'watch'
    ]);
};
