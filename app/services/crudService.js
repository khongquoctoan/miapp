var crud = angular.module('CRUDSrvc', [])
        .constant('BASE_API', 'http://api.mitek-popup.dev/api/v1/');

//Get data for customers
crud.factory("CustomersService", function ($http, BASE_API) {
    return {
        getCustomers: function (data) {
            //data: {start: 0, limit:10}
            var request = $http.get(BASE_API + 'customers'+'?$top=' + data.limit + '&$skip=' + (data.start * data.limit), data);
//            var request = $http({method: 'POST', url: BASE_API+'customers', params: data});
            return request;
        }/*, getDashboardInfo: function () {
         var req = $http({method: 'GET', url: BASE_API+'/'});
         return req;
         }*/
    };
});
