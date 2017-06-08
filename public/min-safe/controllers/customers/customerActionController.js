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