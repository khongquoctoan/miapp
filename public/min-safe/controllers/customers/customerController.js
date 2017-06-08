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