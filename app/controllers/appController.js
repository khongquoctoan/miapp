/* global MiApp, appTabs */
"use strict";
MiApp.controller("appController",
        function ($scope, $http, urls, $stateParams, $state) {
            //Global
            $scope.appTabs = appTabs;
            $scope.appModule = $stateParams.module;
            $scope.appAction = $stateParams.action;
            //Tabs
            $scope.appTabIsActive = 0;
            
            
            $scope.addTabs = function () {
                var count = $scope.appTabs.length;
                if(count>4) {
                    alert('Cho phép mở tối đa 5 tabs');
                    return;
                }
                $scope.appTabs.push({index: count, title: 'Title', active: false});
                $state.go('index', {module: 'customer', action: 'add', actionId: 'newId'});
//                console.log(count);
                $scope.selectTab(count);
            };

            $scope.selectTab = function (index) {
                $scope.appTabs.forEach(function (tab) {
                    if (tab.index === index) {
                        tab.active = true;
                        $state.go('index', {module: 'customer', action: 'add', actionId: 'newId'});
                    } else {
                        tab.active = false;
                    }
                });
                $scope.appTabIsActive = index;
            };

            $scope.isSelectedTab = function (index) {
                return $scope.appTabIsActive === index;
            };

        });