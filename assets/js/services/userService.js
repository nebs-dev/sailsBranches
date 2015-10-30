angular.module('app')
    .factory('User', function ($http, LocalService, AccessLevels) {
        return {
            getUserData: function (id) {
                return $http.post('/api/user/show/' + id).then(function(result){
                    console.log(result.data);
                    return result.data;
                });
            }
        }
    })