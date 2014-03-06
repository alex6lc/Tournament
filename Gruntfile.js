var LIVERELOAD_PORT = 35729;

module.exports = function (grunt) {
    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 9000,
                    hostname: 'localhost',
                    base: "src",
                    livereload: LIVERELOAD_PORT
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= connect.server.options.port %>/index.html'
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
        },
        copy: {
            dev: {
                src: 'src/main.js',
                dest: 'src/dest/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-open');

    grunt.registerTask('server', [
        'connect',
        'open',
        'watch'
    ]);

    grunt.registerTask('dev', ['copy:dev']);
};
