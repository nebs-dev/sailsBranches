angular.module('app', ['ui.router'])
    .run(function($rootScope, $state, Auth, User) {

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if (!Auth.authorize(toState.data.access)) {
                event.preventDefault();

                $state.go('anon.login');
            }
        });
    });