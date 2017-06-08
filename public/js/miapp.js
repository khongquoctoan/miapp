var login = angular.module('AuthSrvc', [])
        .constant('BASE_API', 'https://api-popupcontact-02.mitek.vn:4431/api/v1/');

login.factory('Login', ['$http', '$localStorage', '$rootScope', 'BASE_API', function ($http, $localStorage, $rootScope, BASE_API) {

    function changeAuth(loginStatus, loginInfo, loginRole) {
        if (typeof $localStorage.user === 'undefined') {
            $localStorage.user = {
                isAuthenticated: loginStatus,
                infos: loginInfo,
                roles: loginRole
            };
        } else {
            $localStorage.user.isAuthenticated = loginStatus;
            $localStorage.user.infos = loginInfo;
            $localStorage.user.roles = loginRole;
        }
//        $rootScope.$broadcast('loginStatusChanged', loginStatus);
    }
    return{
        auth: function (credentials) {
            var req = $http.post(BASE_API + 'login', credentials);
            return req.then(
                    function (results) {
//                        console.log(results);
                        var loginStatus = results.data.status;
                        changeAuth(loginStatus.token, results.data.info, results.data.role);
                        return loginStatus;
                    },
                    function (error) {
//                        console.log(error);
                        var loginStatus = false;
                        changeAuth(loginStatus, null, null);
                        return loginStatus;
                    }
            );
        }
    };
}]);
var crud = angular.module('CRUDSrvc', [])
        .constant('BASE_API', 'https://api-popupcontact-02.mitek.vn:4431/api/v1/');

//Get data for customers
crud.factory("CustomersService", ['$http', 'BASE_API', function ($http, BASE_API) {
    return {
        //List
        getCustomers: function (pageNumber, data) {
            var request = $http.post(BASE_API + 'customers'+ '?page=' + pageNumber, data);
            return request;
        },//info
        getCustomerByID: function (id) {
            var request = $http.get(BASE_API + 'customer/' + id);
            return request;
        },//new and add note
        postCustomerAndNote: function (data) {
            var request = $http.post(BASE_API + 'postCustomerAndNote', data);
            return request;
        },//new
        postCustomer: function (data) { 
            var request = $http.post(BASE_API + 'postCustomer', data);
            return request;
        },//update
        putCustomer: function (rowId, data) {
            var request = $http.put(BASE_API + 'putCustomer/'+rowId, data);
            return request;
        },
        trashCustomer: function (rowId) {
            var request = $http.get(BASE_API + 'deleteCustomer/'+rowId);
            return request;
        },
        trashMultiCustomer: function (data) {
            var request = $http.post(BASE_API + 'deleteMultiCustomer', data);
            return request;
        },
        duplicateCustomer: function (rowId, data) {
            var request = $http.get(BASE_API + 'duplicateCustomer/'+rowId, data);
            return request;
        }
    };
}]);

crud.factory("noteService", ['$http', 'BASE_API', function ($http, BASE_API) {
    return {
        insertNote: function (customerId, note) {
            return $http.post(BASE_API + 'postNote/' + customerId, note);
        },
        getTags: function (typeTag) {
            typeTag = typeTag || '';
            return $http.get(BASE_API + 'getTags');
        }
    };
}]);

var MiApp = angular.module('MiApp',
        ['ui.router', 'ui.bootstrap', 'ngTagsInput', 'ngCookies',
            'CRUDSrvc', 'AuthSrvc', 'checklist-model', 'pascalprecht.translate',
            'ngStorage', 'ngSanitize', 'oc.lazyLoad', 'angularMoment',
            'cp.ngConfirm', 'toastr', 'gridshore.c3js.chart',
            '720kb.tooltips'//, 'angularUtils.directives.dirPagination'
        ]);
//var appTabs = [], limitAppTabs = 5, isCurrentAppTabsActive = '';

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
        appTabs: [],
        currentActive: '',
        limitAppTabs: 5
    };
});

//Set default focus input
MiApp.directive('focusMe', ['$timeout', '$parse', function ($timeout, $parse) {
        return {
            //scope: true,   // optionally create a child scope
            link: function (scope, element, attrs) {
                var model = $parse(attrs.focusMe);
                scope.$watch(model, function (value) {
                    if (value === true) {
                        $timeout(function () {
                            element[0].focus();
                        });
                    }
                });
                // to address @blesh's comment, set attribute value to 'false'
                element.bind('blur', function () {
//                    scope.$apply(model.assign(scope, false));
                });
            }
        };
    }]);

MiApp.config(['$stateProvider', '$urlRouterProvider', 'toastrConfig', '$translateProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, toastrConfig, $translateProvider, $httpProvider) {
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
            loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
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
                ]);
            }]
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
    $httpProvider.interceptors.push(['$q', '$state', '$localStorage', function ($q, $state, $localStorage) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if (typeof $localStorage.user !== 'undefined' && $localStorage.user.isAuthenticated) {
                        config.headers.Authorization = 'Bearer ' + $localStorage.user.isAuthenticated;
                    }
                    return config;
                },
                'responseError': function (response) {
                    console.log(response);
                    if (response.status === 401 || response.status === 403 || (response.status===400 && (['Bad Request'].indexOf(response.statusText) || response.data.error))) {
                        $state.go('login');
                    }
                    return $q.reject(response);
                }
            };
        }]);
}]);

//MiApp.run(['$rootScope', '$location', '$state', '$localStorage',
//    function ($rootScope, $location, $state, $localStorage) {
//        console.log('APP RUN ---');
//        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
//            console.log('$stateChangeStart ---');
//        });
//        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
//            console.log('dada');
//
//        });
//    }]);

/* global MiApp, appTabs, appTabActive, limitAppTabs */
"use strict";
MiApp.controller("appController",
        ['$rootScope', '$scope', '$translate', '$state', '$stateParams', 'toastr', '$http', 'tabsService', '$localStorage', 'CustomersService', 'noteService',
            function ($rootScope, $scope, $translate, $state, $stateParams, toastr, $http, tabsService, $localStorage, CustomersService, noteService) {
                //Global -----------------------
                //module&type&action&anonymous&id
                $scope.appPModule = $stateParams.module;
                $scope.appPAction = $stateParams.action;
                $scope.appPAnonymous = $stateParams.anonymous;
                $scope.appPRecordId = $stateParams.id;

//            $scope.currentTimestamp = Math.round(new Date().getTime()/1000);
                //Language
                $scope.changeLanguage = function (langKey) {
                    $translate.use(langKey);
                };

                ///Tabs
                $scope.appTabs = tabsService.appTabs;
                //End Global -------------------

                //Check permission and get module ------------
                if (typeof $localStorage.user === 'undefined' || !$localStorage.user.isAuthenticated) {
                    console.log('Redirect to login --');
                    $rootScope.$evalAsync(function () {
                        $state.go('login');
                    });
                }
                var listModules = ['dashboard', 'customers', 'customer', 'notes', 'monitor', 'reports', 'callhistory', 'users', 'help', 'feedback'];
                if (typeof $scope.appPModule === 'undefined' || listModules.indexOf($scope.appPModule) === -1) {
                    $state.go('index', {module: 'dashboard'});
                    $translate(['CONSOLE_STOP']).then(function (translations) {
                        console.log('%c'+translations.CONSOLE_STOP, 'background:red;color:yellow;font-size:35px');
                    });
                }
                $rootScope.pageTitle = $scope.appPModule.toUpperCase();
                //End check permission and get module --------
                
                
                //User logout
                $scope.logout = function () {
                    console.log('User logout ----------------');
                    var isAuthenticated = $localStorage.user.isAuthenticated;
                    if (isAuthenticated) { //logout 
                        $localStorage.$reset(); //Delete Everything
                    }
                    $state.go('login');
                };
                
                //Config tabs ----------------------------------------------
                $scope.showTabCustomer = function (action, id, type, infoDetail) {
                    $translate(['ANONYMOUS', 'INFO_CUSTOMER']).then(function (translations) {
                        action = action || 'new';
                        type = type || '';  //info: exist customer or blank: anonymous customer or 1tab: chi cho phep mo 1 tab
                        infoDetail = infoDetail || [];

                        var setStateParams = {module: 'customer', action: action, id: '', anonymous: ''};
                        var titleTabs = '';
                        if (type === 'info') {
                            id = id || 0;
                            titleTabs = (infoDetail.lastName || infoDetail.firstName) ? (infoDetail.lastName + " " + infoDetail.firstName) : translations.INFO_CUSTOMER;
                            setStateParams.id = id;
                        } else {
                            id = id || (new Date().getTime() / 1000);
                            titleTabs = translations.ANONYMOUS;//'Anonymous ';
                            setStateParams.anonymous = id;
                        }
                        var checkTabExist = $scope.checkTabExist(id, infoDetail);
                        switch (checkTabExist.status) {
                            case - 1:   //Vuot qua gioi han Tabs
                                toastr.warning('Cho phép mở tối đa 5 tabs!');
                                $scope.selectTab($scope.appTabs[tabsService.currentActive].index);
                                $state.go('index', $scope.appTabs[tabsService.currentActive].params);
                                break;
                            case 0: //Them moi
                                if (id && type === 'info') {
                                    var req = CustomersService.getCustomerByID(id);
                                    req.then(function (response) {
                                        infoDetail = response.data;
                                        //console.log(response.data);
                                        if (typeof infoDetail.info === 'undefined') {
                                            $scope.showTabCustomer();
                                            return;
                                        }
                                        titleTabs = (infoDetail.info.lastName || infoDetail.info.firstName) ? (infoDetail.info.lastName + " " + infoDetail.info.firstName) : translations.INFO_CUSTOMER;
                                        $scope.appTabs.push({
                                            index: id, title: titleTabs,
                                            active: true, type: type,
                                            params: setStateParams,
                                            customer: infoDetail
                                        });
                                        $state.go('index', setStateParams);
                                        $scope.selectTab(id);
                                    });
                                } else {
                                    var req = noteService.getTags();
                                    req.then(function (response) {
                                        $scope.appTabs.push({
                                            index: id, title: titleTabs,
                                            active: true, type: type,
                                            params: setStateParams,
                                            customer: {tags: response.data.list}
                                        });
                                        $state.go('index', setStateParams);
                                        $scope.selectTab(id);
                                    });
                                }

                                break;
                            case 1: //Da ton tai
                                $state.go('index', setStateParams);
                                $scope.selectTab(id);
                                break;
                            default:
                                break;
                        }
                    });
                };

                $scope.checkTabExist = function (index, infoDetail) {
                    var currentTabs = $scope.appTabs;
                    var response = {status: 0, tabLength: currentTabs.length - 1};
                    currentTabs.forEach(function (tab) {
                        if (tab.index === index) {
                            tab.title = (infoDetail.lastName || infoDetail.firstName) ? (infoDetail.lastName + " " + infoDetail.firstName) : tab.title;
                            response.status = 1;
                        }
                    });

                    if (currentTabs.length > (tabsService.limitAppTabs - 1) && !response.status) {
                        response.status = -1;
                    }
                    return response;
                };

                $scope.removeTab = function (key) {
                    $scope.appTabs.splice(key, 1);
                    if ($scope.appTabs.length) {
                        if (tabsService.currentActive === key) {
                            tabsService.currentActive = $scope.appTabs.length - 1;
                        }
                        console.log(tabsService.currentActive);
                        $scope.selectTab($scope.appTabs[tabsService.currentActive].index);
                    } else {
                        console.log('customers');
                        $state.go('index', {module: 'customers'});
                    }

                };

                $scope.selectTab = function (index) {
                    $scope.appTabs.forEach(function (tab, key) {
                        if (tab.index === index) {
                            tab.active = true;
                            tabsService.currentActive = key;
                        } else {
                            tab.active = false;
                        }
                    });
                    console.log("Select tab: " + tabsService.currentActive);
                };

                //End Config tabs ------------------------------------------
                //FIREBASE -------------------------------------------------
                //var ref = firebase.database().ref();
                //var obj = $firebaseObject(ref);
                // to take an action after the data loads, use the $loaded() promise
                //obj.$loaded().then(function () {
                //    console.log("loaded record:", obj.$id, obj.someOtherKeyInData);
                // To iterate the key/value pairs of the object, use angular.forEach()
                //    angular.forEach(obj, function (value, key) {
                //        console.log(key, value);
                //    });
                //});
                // To make the data available in the DOM, assign it to $scope
                //$scope.data = obj;
                // For three-way data bindings, bind it to the scope instead
                //obj.$bindTo($scope, "data");
                //END FIREBASE -------------------------------------------------

            }]);
/* global MiApp */

MiApp.controller("loginController",
        ['$scope', '$http', '$translate', 'Login', '$localStorage', '$location',
            function ($scope, $http, $translate, Login, $localStorage, $location) {
                $scope.login = {
                    lang: $translate.use() || 'vi',
                    email: 'khongquoctoan.it@gmail.com',
                    password: 'quoctoan123'
                };
                $scope.changeLanguage = function (langKey) {
                    $translate.use(langKey);
                };

                $scope.userLogin = function () {
//                    console.log($scope.login);
                    var req = Login.auth($scope.login).then(function (req) {
//                        console.log(req);
                        console.log($localStorage.user);
                        $location.path('/');
                    });
                };

            }]);
/* global MiApp */

"use strict";
MiApp.controller("customerActionController",
        ['$scope', '$http', '$translate', '$state', '$stateParams', 'toastr', 'tabsService', 'noteService', 'CustomersService',
            function ($scope, $http, $translate, $state, $stateParams, toastr, tabsService, noteService, CustomersService) {
//                console.log($stateParams);
//                console.log('customerActionController---');
                if (!$scope.$parent.appTabs.length) {
                    if ($stateParams.id) {
                        $scope.showTabCustomer('new', $stateParams.id, 'info');
                    } else {
                        $scope.showTabCustomer();
                    }
                }

                $scope.filteredNotes = function ($queryContent, $queryTags, notes) {
                    notes = notes || [];
                    return notes.filter(function (note) {
                        return note.content.toLowerCase().indexOf($queryContent ? $queryContent.toLowerCase() : '') !== -1 &&
                                ((note.note_tags && note.note_tags.toLowerCase().indexOf($queryTags ? $queryTags.toLowerCase() : '') !== -1) || !note.note_tags);

                    });
                };
                /*
                 vm.reloadPage = function () {
                 $state.go($state.current, {}, {reload: true});
                 };
                 
                 
                 vm.cusUpdateTags = function () {
                 if (vm.customer.id) {
                 console.log(vm.customer.tags_list);
                 customersService.updateCusTags(vm.customer).then(function (res) {
                 console.log(res);
                 });
                 }
                 
                 };*/

                $scope.addCusAndNote = function (tab) {
                    var req = CustomersService.postCustomerAndNote(tab);
                    req.then(function(res){
                        if (res.data.status) {
                            toastr.success('Đã thêm mới khách hàng!');
                            $scope.$parent.removeTab(tab.index);
                            $state.go('index', {module: 'customers'});
                        } else {
                            toastr.error('Xảy ra lỗi!');
                        }
                    });
                };
                
                $scope.updateOrAdd = function (event, tab) {
                    event.preventDefault();
                    console.log(tab);
                    if (tab.customer.info.id) {
                        var req = CustomersService.putCustomer(tab.customer.info.id, tab.customer.info);
                        req.then(function (res) {
                            console.log(res);
                            if (res.status) {
                                toastr.success('Đã cập nhật khách hàng thành công!');
                            } else {
                                toastr.error('Cập nhật không thành công!');
                            }
                        });
                    } else {
                        var req = CustomersService.postCustomer(tab.customer.info);
                        req.then(function (res) {
                            console.log(res);
                            if (res.status) {
                                toastr.success('Đã thêm khách hàng thành công!');
                                $scope.$parent.removeTab(tab.index);
                                $state.go('index', {module: 'customers'});
                            } else {
                                toastr.error('Không thể thêm mới thành công!');
                            }
                        });
                    }
                };


                $scope.loadTags = function ($query, tags) {
                    tags = tags || [];
                    return tags.filter(function (country) {
                        return country.tag_name.toLowerCase().indexOf($query.toLowerCase()) !== -1;
                    });
                };

                $scope.addNote = function (event, tab) {
                    event.preventDefault();
                    var cusId = tab.customer.info.id;
                    if (!cusId) {
                        toastr.warning('Thao tác lỗi!');
                        return;
                    }
                    var req = noteService.insertNote(cusId, tab.note);
                    req.then(function (res) {
                        if (res.data.status) {
                            tab.note = {};
                            if (tab.customer.notes) {
                                tab.customer.notes.splice(0, 0, res.data.list[0]);
                            } else {
                                tab.customer.notes = [res.data.list[0]];
                            }
                            toastr.success('Đã thêm mới ghi chú!');
                        } else {
                            toastr.error('Ghi chú chưa được lưu!');
                        }
                    });
                };

                $scope.submitDataTab = function (tab) {
                    console.log(tab);
                };
            }]);
/* global MiApp */

MiApp.controller("customerController",
        ['$scope', '$rootScope', '$http', 'CustomersService', '$ngConfirm', 'toastr', '$translate',
            function ($scope, $rootScope, $http, CustomersService, $ngConfirm, toastr, $translate) {
                var vm = this;
                vm.showSearchAdvanced = false;
                vm.listData = [];
                // data list course of page
                vm.getCustomers = function (pageNumber, setLimit) {
                    if (pageNumber === undefined) {
                        pageNumber = vm.listData.current_page ? vm.listData.current_page : '1';
                    }
                    setLimit = setLimit || (vm.listData.per_page ? vm.listData.per_page : 10);
                    var filterData = {filter: vm.filter, sortKey: vm.sortKey, sortType: vm.reverse, limit: setLimit};
                    var req = CustomersService.getCustomers(pageNumber, filterData);
                    req.then(function (response) {
                        vm.listData = response.data;
                        console.log(vm.listData);
                    });

                };
                //Da duoc goi trong view customer.html - select ng-change=""
                //vm.getCustomers();

                vm.sort = function (keyname) {
                    vm.sortKey = keyname;   //set the sortKey to the param passed
                    vm.reverse = !vm.reverse; //if true make it false and vice versa
                    vm.getCustomers();
                };

                //End Load all

                vm.checkAllCus = function ($event) {
                    var checkbox = $event.target;
                    if (checkbox.checked) {
                        vm.listCheckCus = vm.listData.data.map(function (item) {
                            return item.id;
                        });
                    } else {
                        vm.listCheckCus = [];
                    }
                };

                vm.checkCus = function ($event, rowId) {
                    var checkbox = $event.target;
                    if (checkbox.checked) {
                        if (typeof vm.listCheckCus === 'undefined') {
                            vm.listCheckCus = [rowId];
                        } else {
                            var existCheck = false;
                            vm.listCheckCus.forEach(function (val, key) {
                                if (val === rowId) {
                                    existCheck = true;
                                    return;
                                }
                            });
                            if (!existCheck) {
                                vm.listCheckCus.push(rowId);
                            }
                        }
                    } else {
                        vm.listCheckCus.forEach(function (val, key) {
                            if (val === rowId) {
                                vm.listCheckCus.splice(key, 1);
                                return;
                            }
                        });
                    }
                };

                vm.deleteCus = function (rowId) {
                    $scope.trashInfo = rowId;
                    $translate(['CONFIRM', 'DELETE', 'DELETE_SUCCESS', 'DELETE_FAIL', 'CANCEL']).then(function (translations) {
                        $ngConfirm({
                            title: translations.CONFIRM,
                            content: 'Bạn có chắc muốn xóa <strong>{{trashInfo}}</strong> ??',
                            autoClose: 'cancel|8000',
                            scope: $scope,
                            buttons: {
                                delete: {
                                    text: translations.DELETE,
                                    btnClass: 'btn-danger',
                                    action: function () {
                                        var req = CustomersService.trashCustomer(rowId);
                                        if (req) {
                                            toastr.success(translations.DELETE_SUCCESS);
                                            vm.getCustomers();
                                        } else {
                                            toastr.error(translations.DELETE_FAIL);
                                        }
                                    }
                                },
                                cancel: {
                                    text: translations.CANCEL
                                }
                            }
                        });
                    });
                };

                /*vm.duplicateCustomer = function () {
                    if (!vm.checkCus.length) {
                        return showMessageBottomRight('Chưa chọn khách hàng cần xóa!', 'error');
                    }
                    var id = vm.checkCus[0];
                    var cust = getCustomerById(id);
                    var custName = cust.lastName + ' ' + cust.firstName;
                    showMessageComfirm('Bạn muốn sao chép khách khách hàng "' + custName + '" ???',
                            function () {
                                CustomersService.duplicateCustomer(id).then(function (newId) {
                                    showMessageBottomRight('Đã sao chép thành công!', 'success');
                                }, function (error) {
                                    showMessageBottomRight('Không thể thực thi!', 'error');
                                });
                            },
                            function () {
                            }
                    );
                };*/

                vm.deleteMultiCustomer = function () {
                    if (typeof vm.listCheckCus === 'undefined' || !vm.listCheckCus.length) {
                        return toastr.error('Chưa chọn khách hàng!');
                    }
                    $translate(['CONFIRM', 'DELETE', 'DELETE_SUCCESS', 'DELETE_FAIL', 'CANCEL']).then(function (translations) {
                        $ngConfirm({
                            title: translations.CONFIRM,
                            content: 'Bạn có chắc muốn xóa <strong>'+(vm.listCheckCus.length)+'</strong> khách hàng đã chọn??',
                            autoClose: 'cancel|8000',
                            scope: $scope,
                            buttons: {
                                delete: {
                                    text: translations.DELETE,
                                    btnClass: 'btn-danger',
                                    action: function () {
                                        CustomersService.trashMultiCustomer({list:vm.listCheckCus}).then(function () {
                                            toastr.success('Khách hàng được chọn đã xóa khỏi hệ thống!');
                                            vm.listCheckCus = [];
                                            vm.getCustomers();
                                        }, function (error) {
                                            toastr.error('Không thể thực thi!');
                                        });
                                    }
                                },
                                cancel: {
                                    text: translations.CANCEL
                                }
                            }
                        });
                    });
                };


            }]);
MiApp.controller("dashboardController",
        ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
//            var vms = this;
            $scope.dbParams = '-------Content--------';
        }]);