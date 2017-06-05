/* global MiApp */

"use strict";
MiApp.controller("customerActionController",
        function ($scope, $http, $translate, $state, $stateParams, tabsService) {
//            console.log($stateParams);
//            console.log('customerActionController---');
            if (!$scope.$parent.appTabs.length) {
                $scope.showTabCustomer();
            }
            
            $scope.submitDataTab = function (tab) {
                console.log(tab);
            };
        });