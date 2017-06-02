var login = angular.module('AuthSrvc', []);

login.factory('Login', function ($http, $localStorage) {
    return{
        
        auth: function (credentials) {
            var authUser = $http({method: 'POST', url: '/api/login/auth', data: credentials});
            return authUser;
        },
        destroy: function () {
            var logoutUser = $http.get('/api/login/destroy');
            logoutUser.success(function () {
                SessionService.unset('session');
            });
            return logoutUser;
        },
        checkLoginStatus: function () {
            //return SessionService.get('auth') ? true : false;
            var check = $http.get('/api/login/check');
            return check;
        },
        forgetPassword: function (data) {
            var req = $http({method: 'POST', url: '/api/forgetPassword', data: data});
            return req;
        }
    };
});