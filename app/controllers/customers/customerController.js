/* global MiApp */

MiApp.controller("customerController",
        function ($scope, $rootScope, $http, CustomersService) {
            console.log('load customerController');

            $scope.initCustomers = function () {
                console.log('Call initCustomers ---');
                var req = CustomersService.getCustomers({start: 0, limit: 10});
                req.then(function (response) {
                    $scope.dataCustomers = response.data.data;
                });
            };

            $scope.initCustomers();

            $scope.checkAllCus = function ($event) {
                var checkbox = $event.target;
                if (checkbox.checked) {
                    $scope.checkCus123 = $scope.dataCustomers.map(function (item) {
                        return item.id;
                    });
                } else {
                    $scope.checkCus123 = [];
                    console.log('Call----');
                }
                console.log($scope.checkCus123);
            };

        });