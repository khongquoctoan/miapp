/* global MiApp, appTabs, appTabActive, limitAppTabs */
"use strict";
MiApp.controller("appController",
        function ($rootScope, $scope, $translate, $state, $stateParams, toastr, $http, tabsService) {
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

            //Check get module
            var listModules = ['dashboard', 'customers', 'customer', 'notes', 'monitor', 'reports', 'callhistory', 'users', 'help', 'feedback'];
            if (typeof $scope.appPModule === 'undefined' || listModules.indexOf($scope.appPModule) === -1) {
                $state.go('index', {module: 'dashboard'});
            }

            $rootScope.pageTitle = $scope.appPModule.toUpperCase();

            //Config tabs ----------------------------------------------
            $scope.showTabCustomer = function (action, id, type, infoDetail) {

                $translate(['ANONYMOUS', 'INFO_CUSTOMER']).then(function (translations) {
                    action = action || 'new';
                    type = type || '';  //info: exist customer or blank: anonymous customer
                    infoDetail = infoDetail || [];

                    var setStateParams = {module: 'customer', action: action, id: '', anonymous: ''};
                    var titleTabs = '';
                    if (type === 'info') {
                        id = id || 0;
                        titleTabs = translations.INFO_CUSTOMER;
                        setStateParams.id = id;
                    } else {
                        id = id || (new Date().getTime() / 1000);
                        titleTabs = translations.ANONYMOUS;//'Anonymous ';
                        setStateParams.anonymous = id;
                    }
                    var checkTabExist = $scope.checkTabExist(id);
                    switch (checkTabExist.status) {
                        case - 1:   //Vuot qua gioi han Tabs
                            toastr.warning('Cho phép mở tối đa 5 tabs!');
                            $scope.selectTab($scope.appTabs[tabsService.currentActive].index);
                            $state.go('index', $scope.appTabs[tabsService.currentActive].params);
                            break;
                        case 0: //Them moi
                            $scope.appTabs.push({
                                index: id, title: titleTabs,
                                active: true, type: type,
                                params: setStateParams
                            });
                            $state.go('index', setStateParams);
                            $scope.selectTab(id);
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

            $scope.checkTabExist = function (index) {
                var currentTabs = $scope.appTabs;
                var response = {status: 0, tabLength: currentTabs.length - 1};
                currentTabs.forEach(function (tab) {
                    if (tab.index === index) {
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

        });