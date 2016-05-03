module.exports = function ( grunt ) {

    /**
     * Load all Grunt plugins.
     */
    require( 'matchdep' ).filterDev( ['grunt-*', '!grunt-cli'] ).forEach( grunt.loadNpmTasks );

    grunt.initConfig( {
        pkg: grunt.file.readJSON( 'package.json' ),

        /**
         * Configurable paths.
         */
        globalConfig: {
            jsSrc: 'src/main/js',
            jsDest: 'target/update_www/scripts',
            jsTest: 'src/test/js',
            lessSrc: 'resources/styles/less',
            cssDest: 'resources/styles'
        },

        /**
         * Compile LESS stylesheets in `src` to CSS files in `target`.
         */
        less: {
            /**
             * Compile the master stylesheet only (imports all others).
             */
            development: {
                files: {
                    // result file : source file
                    '<%= globalConfig.cssDest %>/master_non_prefixed.css': '<%= globalConfig.lessSrc %>/master.less'
                },
                options: {
                    sourceMap: true
//                    compress: true
                }
            }
        },

        autoprefixer: {
            options: {
                // Task-specific options go here.
                browsers: ['last 2 version', '> 1%', 'ie 9', 'ie 10', 'ie 11', 'Android 4']
            },
            single_file: {
                src: '<%= globalConfig.cssDest %>/master_non_prefixed.css',
                dest: '<%= globalConfig.cssDest %>/master.css'
            },
            your_target: {
                // Target-specific file lists and/or options go here.
            }
        },

        /**
         * Watch files for changes and make updates.
         */
        watch: {

            /**
             * Watch imported files and the master stylesheet,
             * compile master stylesheet only.
             */
            imports: {
                files: [
                    '<%= globalConfig.lessSrc %>/*.less',
                    '<%= globalConfig.lessSrc %>/**/*.less'
                ],
                tasks: ['less', 'autoprefixer'],
                options: {
                    spawn: false
                }
            },

            /**
             * Scripts
             */
//            scripts: {
//                files: [
//                    '<%= globalConfig.jsSrc %>/*.js',
//                    '<%= globalConfig.jsSrc %>/**/*.js'
//                    // ,'src/test/js/*.js'
//                ],
//                tasks: ['copy'] //['karma:unit:run']
//            } //,

            /**
             * Watch the JS and compiled CSS folders, then push only the files
             * changed there to the livereload server (pushing changed
             * LESS files is pointless and will force the whole page to
             * reload).
             */
            /* livereload: {
             options: {
             livereload: true
             },
             files: [
             'src/main/webapp/js/*',
             'src/main/webapp/css/*'
             ]
             }*/
        },


        /**
         * Aggregate JavaScript files.
         */
        concat: {
            js: {
                src: [
                    '<%= globalConfig.jsSrc %>/app.js',
                    '<%= globalConfig.jsSrc %>/constants.js',
                    '<%= globalConfig.jsSrc %>/controllers.js',
                    '<%= globalConfig.jsSrc %>/directives.js',
                    '<%= globalConfig.jsSrc %>/filters.js',
                    '<%= globalConfig.jsSrc %>/rejitsuDirectives.js',
                    '<%= globalConfig.jsSrc %>/rejitsuHelpers.js',
                    '<%= globalConfig.jsSrc %>/routing.js',
                    '<%= globalConfig.jsSrc %>/services.js'
                ],
//                dest: '<%= globalConfig.jsSrc %>/<%= pkg.name %>-<%= pkg.version %>.js'
                dest: '<%= globalConfig.jsDest %>/jits-scripts.js',
                nonull: true // warn if files missing
            },
            options: {
                separator: ';',
                sourceMap: true
            }
        },

        /**
         * Minify JavaScript.
         */
        uglify: {
            minifyJS: {
                options: {
                    mangle: true // replace variable names to shorter ones
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= globalConfig.jsSrc %>',
                        src: ['**/*.js', '!**/*.min.js'], // Ignore already minified files
                        dest: '<%= globalConfig.jsDest %>'
                    }
                ]
            }
        },

        /**
         * Copy JavaScript files over to the `target` folder.
         */
        copy: {
            js: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= globalConfig.jsSrc %>',
                        src: ['**/*.js', '!**/refs/**'],
                        dest: '<%= globalConfig.jsDest %>'
                    }
                ]
            }
        },

        /**
         * Run Jasmine tests on aggregated JavaScript sources. ('concat' task must be
         * run first!! Task alias 'test-aggregated' provided for convenience.)
         */
        jasmine: {
            aggregated: {
                src: '<%= globalConfig.jsDest %>/<%= pkg.name %>-<%= pkg.version %>.js',
                options: {
                    specs: [
                        '<%= globalConfig.jsTest %>/**/*.js',
                        '!<%= globalConfig.jsTest %>/karma.conf.js'
                    ],
                    display: 'full'
                }
            }
        },

        /**
         * Run JavaScript tests via Karma.
         */
        karma: {
            options: {
                configFile: 'src/test/js/karma.conf.js'
            },
            unit: {
                background: true,
                singleRun: false
            },
            continuous: {
                singleRun: true
            }
        }
    } );

    /**
     * In watch mode, log that a file has changed.
     */
    grunt.event.on( 'watch', function ( action, filepath, target ) {
        grunt.log.writeln( target + ': ' + filepath + ' has ' + action );
    } );


    /**
     * Register a custom task for minifying JS and CSS resources.
     */
    grunt.registerTask( 'minify', 'Minifies JS and CSS files', function () {
        grunt.task.run( 'uglify' );
        grunt.config( 'less.compile.options.cleancss', true );
        grunt.task.run( 'less' );
        grunt.task.run( 'autoprefixer' );
    } );


    /**
     * Register our aliases.
     */
//    grunt.registerTask( 'test', ['karma:continuous'] );
//    grunt.registerTask( 'test-aggregated', ['concat', 'jasmine:aggregated'] );

//    grunt.registerTask( 'scripts', ['copy'] );
    grunt.registerTask( 'styles', ['less', 'autoprefixer'] );

//    grunt.registerTask( 'build', ['scripts', 'styles'] );
//    grunt.registerTask( 'dev', ['build', 'karma:unit:start', 'watch'] );
//    grunt.registerTask( 'default', ['build'] );
    grunt.registerTask( 'default', ['copy', 'less', 'autoprefixer'] );

};