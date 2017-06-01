/* global MiApp */

"use strict";
MiApp.controller("customerActionController",
        function ($scope, $http, urls, $stateParams) {
            console.log($stateParams);
            console.log('customerActionController---');
            if (!$scope.appTabs.length) {
                console.log('Add new customer ----');
                $scope.showTabCustomer();
//                $scope.appTabs.push({index: 0, title: 'Anonymous', active: false});
//                $scope.selectTab(0);
            }
            
            $scope.submitDataTab = function (tab) {
                console.log(tab);
            };
        });