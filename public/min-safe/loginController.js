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