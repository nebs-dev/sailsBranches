angular.module('app')
    .controller('UserController', function($scope, $state, User, CurrentUser, $stateParams) {
        $scope.errors = [];

        //console.log('ID:', CurrentUser.user().id);
        User.getUserData($stateParams.id).then(function(user){
            console.log(user);
        }).catch(function(err){
            console.log(err);
        });
    });