var MiApp = angular.module('MiApp',
        ['ui.router', 'ui.bootstrap', 'ngTagsInput', 'ngCookies', 'CRUDSrvc',
            'ngStorage', 'ngSanitize', 'oc.lazyLoad', 'angularMoment',
            'cp.ngConfirm', 'toastr', 'gridshore.c3js.chart', 'checklist-model',
            'pascalprecht.translate', '720kb.tooltips'
        ]
        ); //
var appTabs = [], appTabActive = 0, limitAppTabs = 5, isCurrentAppTabsActive = '';

//var translationsVN = {
//Khai báo biến trong ngôn ngữ
//"TRANSLATION_ID": "{{username}} is logged in."
//---
//Cách gọi và gán biến ---
//$scope.translationData = {
//    username: 'PascalPrecht'
//};
//Trong view
//{{ 'TRANSLATION_ID' | translate:translationData }}
//};

MiApp.factory('tabsService', function () {
    return {
        currentActive: ''
    };
});

//MiApp.constant('urls', {
//    BASE: 'http://contact-popup.dev/',
//    BASE_API: 'http://api.mitek-popup.dev/api/v1/'
//});

MiApp.directive('focusMe', ['$timeout', '$parse', function ($timeout, $parse) {
        return {
            //scope: true,   // optionally create a child scope
            link: function (scope, element, attrs) {
                var model = $parse(attrs.focusMe);
                scope.$watch(model, function (value) {
//                    console.log('value=', value);
                    if (value === true) {
                        $timeout(function () {
                            element[0].focus();
                        });
                    }
                });
                // to address @blesh's comment, set attribute value to 'false'
                // on blur event:
                element.bind('blur', function () {
//                    console.log('blur');
//                    scope.$apply(model.assign(scope, false));
                });
            }
        };
    }]);

MiApp.config(function ($stateProvider, $urlRouterProvider, toastrConfig, $translateProvider, $httpProvider) {
    //Load file language
    $translateProvider.useStaticFilesLoader({
        prefix: 'app/languages/locale-',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('vi'); //Default language
    //Nếu biến ngôn ngữ ko tồn tại thì load ngôn ngữ này làm mặc định (ngôn ngữ dự phòng)
    $translateProvider.fallbackLanguage('vi');
    // Enable escaping of HTML
    $translateProvider.useSanitizeValueStrategy('escape');
//    $translateProvider.useSanitizeValueStrategy('escapeParameters');
//    $translateProvider.useSanitizeValueStrategy('sanitize');
    // remember language
    $translateProvider.useLocalStorage();

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
    //anonymous = id (chua dinh danh khach hang: id random)
    //
    //Khach hang moi (module)
    //?module=customer&action=new&anonymous=123
    //Xem chi tiet khach hang (module)
    //?module=customer&action=new&id=123
    //
    $stateProvider.state('index', {
//        name: 'index',
        url: '/index?module&type&action&anonymous&id',
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
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
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


    //CONFIG PLUGINS ------------------------------------
    angular.extend(toastrConfig, {
        closeButton: true,
        allowHtml: true,
        autoDismiss: false,
        timeOut: 5000,
        progressBar: true,
        maxOpened: 0,
        newestOnTop: true,
        positionClass: 'toast-bottom-right',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        target: 'body'
    });
    //END CONFIG PLUGINS --------------------------------
//    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
//            return {
//                'request': function (config) {
//                    config.headers = config.headers || {};
//                    if (typeof $localStorage.user != 'undefined' && $localStorage.user.isAuthenticated) {
//                        config.headers.Authorization = 'Bearer ' + $localStorage.user.isAuthenticated;
//                    }
//                    return config;
//                },
//                'responseError': function (response) {
//                    if (response.status === 401 || response.status === 403) {
//                        $location.path('/login');
//                    }
//                    return $q.reject(response);
//                }
//            };
//        }]);
});

MiApp.run(function ($rootScope, $state, $localStorage, $stateParams, $location, $translate) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
        console.log('dada');
    });
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        console.log('dada');

    });
    //
    //    $rootScope.$on('$translatePartialLoaderStructureChanged', function () {
    //        console.log('call-----:))');
    //        $translate.refresh();
    //    });
});
