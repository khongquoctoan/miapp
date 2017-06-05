/* global MiApp */

MiApp.controller("customerController",
        function ($scope, $rootScope, $http, CustomersService) {
            var vm = this;
            vm.initCustomers = function () {
                var req = CustomersService.getCustomers({start: 0, limit: 10});
                req.then(function (response) {
                    vm.dataCustomers = response.data.data;
                });
            };

            vm.initCustomers();

            vm.checkAllCus = function ($event) {
                var checkbox = $event.target;
                if (checkbox.checked) {
                    vm.listCheckCus = vm.dataCustomers.map(function (item) {
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
        });