module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //grunt task configuration will go here
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: {
                    './public/min-safe/controllers/customers/customerActionController.js': 
                            ['./app/controllers/customers/customerActionController.js'],
                    './public/min-safe/controllers/customers/customerController.js': 
                            ['./app/controllers/customers/customerController.js'],
                    './public/min-safe/controllers/dashboard/dashboardController.js': 
                            ['./app/controllers/dashboard/dashboardController.js'],
                    './public/min-safe/appController.js': 
                            ['./app/controllers/appController.js'],
                    './public/min-safe/loginController.js': 
                            ['./app/controllers/loginController.js'],
                    './public/min-safe/authService.js': 
                            ['./app/services/authService.js'],
                    './public/min-safe/crudService.js': 
                            ['./app/services/crudService.js'],
                    './public/min-safe/app.js': 
                            ['./app/app.js']
                }
            }
        },
        concat: {
            js: {//target
                src: [
                    './public/min-safe/authService.js',
                    './public/min-safe/crudService.js',
                    './public/min-safe/app.js',
                    './public/min-safe/appController.js',
                    './public/min-safe/loginController.js',
                    './public/min-safe/controllers/customers/*.js',
                    './public/min-safe/controllers/dashboard/*.js'
                ],
                dest: './public/js/miapp.js'
            }
        },
        uglify: {
            js: {//target
                src: ['./public/js/miapp.js'],
                dest: './public/js/app.min.js'
            }
        }
    });

    //load grunt tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate');

    //register grunt default task
    grunt.registerTask('default', ['ngAnnotate', 'concat', 'uglify']);
};