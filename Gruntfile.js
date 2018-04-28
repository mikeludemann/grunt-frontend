var browserSync = require("browser-sync"),
    path = require('path');

module.exports = function (grunt) {

    require('load-grunt-config')(grunt, {

        init: true,

        loadGruntTasks: {
            pattern: ['grunt-*', '@*/grunt-*'],
            config: require('package.json'),
            scope: 'dependencies'
        }
    });

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: ';'
            },
            coffee: {
                src: ['src/scripts/coffee/*.coffee'],
                dest: 'src/scripts/coffee/_script.coffee'
            },
            js: {
                src: ['src/scripts/*.js'],
                dest: 'src/scripts/all.js'
            },
            css: {
                src: ['src/styles/*.css'],
                dest: 'src/styles/styles.css'
            },
            sass: {
                src: ['src/styles/sass/*.scss', '!src/styles/sass/_styles.scss'],
                dest: 'src/styles/sass/_styles.scss'
            },
            less: {
                src: ['src/styles/less/*.less', '!src/styles/less/_styles.less'],
                dest: 'src/styles/less/_styles.less'
            },
            stylus: {
                src: ['src/styles/stylus/*.styl', '!src/styles/stylus/_styles.styl'],
                dest: 'src/styles/stylus/_styles.styl'
            }
        },
        coffee: {
            glob_to_multiple: {
                expand: true,
                flatten: true,
                cwd: 'src/scripts/coffee/',
                src: ['_script.coffee'],
                dest: 'src/scripts/',
                ext: '.js'
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    expand: true,
                    cwd: 'src/styles/sass',
                    src: '_style.scss',
                    dest: 'src/styles',
                    ext: '.css'
                }
            }
        },
        less: {
            dist: {
                options: {
                    compressed: true,
                    sourcemap: false
                },
                files: [{
                    expand: true,
                    cwd: 'src/styles/less',
                    src: '_style.less',
                    dest: 'src/styles',
                    ext: '.css'
                }]
            }
        },
        stylus: {
            dist: {
                options: {
                    compressed: true,
                    sourcemap: false
                },
                files: [{
                    expand: true,
                    cwd: 'src/styles/stylus/',
                    src: '_style.styl',
                    dest: 'src/styles',
                    ext: '.css'
                }]
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                sourcemap: false
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/scripts/',
                    src: '**/*.js',
                    dest: 'scripts/',
                    ext: '.min.js'
                }]
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: [{
                    expand: true,
                    cwd: 'src/styles',
                    src: ['styles.css', '!*.min.css'],
                    dest: 'styles',
                    ext: '.min.css'
                }]
            }
        },
        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true
            },
            files: {
                expand: true,
                cwd: '',
                src: ['*.html'],
                dest: 'min/html'
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'src/scripts/*.js', 'tests/*.js'],
            options: {
                jshintrc: 'src/scripts/.jshintrc',
                verbose: true,
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        csslint: {
            options: {
                csslintrc: 'src/styles/.csslintrc'
            },
            strict: {
                options: {
                    import: 2
                },
                src: ['src/styles/*.css']
            }
        },
        watch: {
            scripts: {
                files: 'src/scripts/*.js',
                tasks: 'jshint',
            },
            css: {
                files: 'src/styles/*.css',
                tasks: 'csslint',
            },
        },
        imagemin: {
            options: {
                optimizationLevel: 3,
                svgoPlugins: [{ removeViewBox: false }]
            },
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src/images/',
                    src: ['**/*.{png,jpg,gif,jpeg}'],
                    dest: 'src/images/min/'
                }]
            }
        },
        autoprefixer: {
            options: {
                browsers: 'last 2 versions'
            }
        }

    });

    grunt.registerTask('default', 'Default task');

    grunt.registerTask('checking', 'Checking DB by Can I Use', ['autoprefixer']);

    grunt.registerTask('validation', 'All linter and hinter tasks', ['jshint', 'csslint']);
    grunt.registerTask('watching', 'Watching all CSS ans JS files', ['watch']);
    grunt.registerTask('precompile', 'Concatenate files and compile all preprocessor', ['concat', 'coffee', 'sass', 'less', 'stylus']);
    grunt.registerTask('minify', 'Minifies all file formats', ['imagemin', 'htmlmin', 'uglify', 'cssmin']);

    grunt.registerTask("bs-init", function () {
        var done = this.async();
        browserSync({
            open: "ui",
            logLevel: 'debug',
            timestamps: false,
            server: {
                baseDir: "/"
            }
        }, function (err, bs) {
            done();
        });
    });

    grunt.registerTask("bs-inject", function () {
        browserSync.reload([
            'src/styles/*.css',
            'src/styles/scss/**/*.scss',
            'src/styles/less/**/*.less',
            'src/styles/stylus/**/*.styl',
            'src/scripts/coffee/*.coffee',
            'src/scripts/*.js',
            '*.html',
        ]);
    });

    grunt.registerTask('bs-complete', 'BrowserSync start and reload', ['bs-init', 'bs-inject']);

}