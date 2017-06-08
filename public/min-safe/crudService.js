var crud = angular.module('CRUDSrvc', [])
        .constant('BASE_API', 'https://api-popupcontact-02.mitek.vn:4431/api/v1/');

//Get data for customers
crud.factory("CustomersService", ['$http', 'BASE_API', function ($http, BASE_API) {
    return {
        //List
        getCustomers: function (pageNumber, data) {
            var request = $http.post(BASE_API + 'customers'+ '?page=' + pageNumber, data);
            return request;
        },//info
        getCustomerByID: function (id) {
            var request = $http.get(BASE_API + 'customer/' + id);
            return request;
        },//new and add note
        postCustomerAndNote: function (data) {
            var request = $http.post(BASE_API + 'postCustomerAndNote', data);
            return request;
        },//new
        postCustomer: function (data) { 
            var request = $http.post(BASE_API + 'postCustomer', data);
            return request;
        },//update
        putCustomer: function (rowId, data) {
            var request = $http.put(BASE_API + 'putCustomer/'+rowId, data);
            return request;
        },
        trashCustomer: function (rowId) {
            var request = $http.get(BASE_API + 'deleteCustomer/'+rowId);
            return request;
        },
        trashMultiCustomer: function (data) {
            var request = $http.post(BASE_API + 'deleteMultiCustomer', data);
            return request;
        },
        duplicateCustomer: function (rowId, data) {
            var request = $http.get(BASE_API + 'duplicateCustomer/'+rowId, data);
            return request;
        }
    };
}]);

crud.factory("noteService", ['$http', 'BASE_API', function ($http, BASE_API) {
    return {
        insertNote: function (customerId, note) {
            return $http.post(BASE_API + 'postNote/' + customerId, note);
        },
        getTags: function (typeTag) {
            typeTag = typeTag || '';
            return $http.get(BASE_API + 'getTags');
        }
    };
}]);
