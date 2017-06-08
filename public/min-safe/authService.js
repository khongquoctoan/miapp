var login = angular.module('AuthSrvc', [])
        .constant('BASE_API', 'https://api-popupcontact-02.mitek.vn:4431/api/v1/');

login.factory('Login', ['$http', '$localStorage', '$rootScope', 'BASE_API', function ($http, $localStorage, $rootScope, BASE_API) {

    function changeAuth(loginStatus, loginInfo, loginRole) {
        if (typeof $localStorage.user === 'undefined') {
            $localStorage.user = {
                isAuthenticated: loginStatus,
                infos: loginInfo,
                roles: loginRole
            };
        } else {
            $localStorage.user.isAuthenticated = loginStatus;
            $localStorage.user.infos = loginInfo;
            $localStorage.user.roles = loginRole;
        }
//        $rootScope.$broadcast('loginStatusChanged', loginStatus);
    }
    return{
        auth: function (credentials) {
            var req = $http.post(BASE_API + 'login', credentials);
            return req.then(
                    function (results) {
//                        console.log(results);
                        var loginStatus = results.data.status;
                        changeAuth(loginStatus.token, results.data.info, results.data.role);
                        return loginStatus;
                    },
                    function (error) {
//                        console.log(error);
                        var loginStatus = false;
                        changeAuth(loginStatus, null, null);
                        return loginStatus;
                    }
            );
        }
    };
}]);