angular.module('app')
    .controller('LoginController', function($scope, $state, Auth) {
        $scope.errors = [];

        $scope.login = function() {
            $scope.errors = [];
            Auth.login($scope.user).then(function(result) {
                $state.go('anon.home');
            }).catch(function(err) {
                $scope.errors.push(err);
                $state.go('anon.login');
            });
        }
    });