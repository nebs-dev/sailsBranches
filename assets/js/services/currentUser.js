angular.module('app')
    .factory('CurrentUser', function (LocalService) {
        return {
            user: function () {
                if (LocalService.get('auth_token')) {
                    var user = angular.fromJson(LocalService.get('auth_token')).user;
                    return user;
                } else {
                    return {};
                }
            }
        };
    });