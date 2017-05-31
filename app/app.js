var MiApp = angular.module('MiApp', ['ui.router', 'ui.bootstrap', 'ngTagsInput', 'ngStorage', 'ngSanitize','oc.lazyLoad']); //
var appTabs = [];

MiApp.constant('urls', {
    BASE: 'http://contact-popup.dev/',
    BASE_API: 'http://api.mitek-popup.dev/api/v1/'
});

MiApp.config(function ($stateProvider, $urlRouterProvider) {
    var helloState = {
        name: 'hello',
        url: '/hello',
        template: '<h3>hello world!</h3>'
    };
    var aboutState = {
        name: 'about',
        url: '/about',
        template: '<h3>Its the UI-Router hello world app!</h3>'
    };

    var loginState = {
        name: 'login',
        url: '/login',
        templateUrl: 'app/views/login.html',
        controller: 'loginController',
        controllerAs: 'vm'
    };

    $stateProvider.state(helloState);
    $stateProvider.state(aboutState);
    $stateProvider.state(loginState);
    //Module: ten module
    //Action: add/update/delete/duplicate
    $stateProvider.state('index', {
//        name: 'index',
        url: '/index?module&type&action',
        views: {
            '@': {
                templateUrl: 'app/views/index.html',
                controller: 'appController',
                controllerAs: 'vm'
            },
            'header@index': {templateUrl: 'app/partials/header.html'},
            'sidebar@index': {templateUrl: 'app/partials/sidebar.html'},
            'footer@index': {templateUrl: 'app/partials/footer.html'}
        },
        resolve: {
            loadPlugin: function($ocLazyLoad) {
                return $ocLazyLoad.load ([
//                    {
//                        name: 'css',
//                        insertBefore: '#app-level',
//                        files: [
//                            'vendors/bower_components/fullcalendar/dist/fullcalendar.min.css',
//                        ]
//                    },
//                    {
//                        name: 'vendors',
//                        insertBefore: '#app-level-js',
//                        files: [
//                            'public/js/materialize.min.js',
//                            'public/js/plugins/perfect-scrollbar/perfect-scrollbar.min.js',
//                            'public/js/plugins.min.js'
//                        ]
//                    }
                ])
            }
        },
        data: {requireLogin: true}
    });

    $urlRouterProvider.otherwise("/index?module=dashboard");
});

MiApp.run(function($rootScope, $state, $localStorage, $stateParams, $location, urls){
    $rootScope.urls = urls;
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
        
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        //console.log();
    });
});
