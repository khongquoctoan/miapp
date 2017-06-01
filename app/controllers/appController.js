/* global MiApp, appTabs, appTabActive, limitAppTabs */
"use strict";
MiApp.controller("appController",
        function ($scope, $http, urls, $stateParams, $state, toastr, tabsService) {
            //Global -----------------------
            //module&type&action&anonymous&id
            $scope.appPModule = $stateParams.module;
            $scope.appPAction = $stateParams.action;
            $scope.appPAnonymous = $stateParams.anonymous;
            $scope.appPRecordId = $stateParams.id;

//            $scope.currentTimestamp = Math.round(new Date().getTime()/1000);

            ///Tabs
            $scope.appTabs = appTabs;
//            if (typeof $scope.appTabIsActive === 'undefined')
//                $scope.appTabIsActive = appTabActive;
            //End Global -------------------


            //Check get module
            var listModules = ['dashboard', 'customers', 'customer'];
            if (typeof $scope.appPModule === 'undefined' || listModules.indexOf($scope.appPModule) === -1) {
                $state.go('index', {module: 'dashboard'});
            }

            //Config tabs ----------------------------------------------
            $scope.showTabCustomer = function (action, id, type, infoDetail) {
                action = action || 'new';
                type = type || '';  //info: exist customer or blank: anonymous customer
                infoDetail = infoDetail || [];

                var setStateParams = {module: 'customer', action: action, id: '', anonymous: ''};
                var titleTabs = '';
                console.log('ID: '+id);
                if (type === 'info') {
                    id = id || 0;
                    titleTabs = 'Current customer';
                    setStateParams.id = id;
                } else {
                    id = id || (new Date().getTime() / 1000);
                    titleTabs = 'Anonymous ';
                    setStateParams.anonymous = id;
                }
                console.log(id);
                var checkTabExist = $scope.checkTabExist(id);
//                console.log(checkTabExist);
//                console.log(tabsService.currentActive);
                switch (checkTabExist.status) {
                    case - 1:   //Vuot qua gioi han Tabs
                        toastr.warning('Cho phép mở tối đa 5 tabs!');
//                        $scope.selectTab($scope.appTabs[checkTabExist.tabLength].index);
//                        $state.go('index', $scope.appTabs[checkTabExist.tabLength].params);
                        console.log($scope.appTabs[tabsService.currentActive]);
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
            };

            $scope.checkTabExist = function (index) {
                var currentTabs = $scope.appTabs;
                var response = {status: 0, tabLength: currentTabs.length - 1};
                currentTabs.forEach(function (tab) {
                    if (tab.index === index) {
                        response.status = 1;
                    }
                });

                if (currentTabs.length > (limitAppTabs - 1) && !response.status) {
                    response.status = -1;
                }
                return response;
            };
            
            $scope.removeTab = function(key) {
                $scope.appTabs.splice(key, 1);
                if(tabsService.currentActive === key){
                    tabsService.currentActive = $scope.appTabs.length-1;
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

        });