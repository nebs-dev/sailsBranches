angular.module('app')
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, AccessLevels) {

        $stateProvider
            .state('anon', {
                abstract: true,
                template: '<ui-view/>',
                data: {
                    access: AccessLevels.anon
                }
            })
            .state('anon.home', {
                url: '/',
                templateUrl: 'templates/home.html'
            })
            .state('anon.login', {
                url: '/login',
                templateUrl: '../templates/auth/login.html',
                controller: 'LoginController'
            })
            .state('anon.register', {
                url: '/register',
                templateUrl: 'templates/auth/register.html',
                controller: 'RegisterController'
            });

        $stateProvider
            .state('user', {
                abstract: true,
                template: '<ui-view/>',
                data: {
                    access: AccessLevels.user
                }
            })
            .state('user.home', {
                url: '/',
                templateUrl: 'templates/home.html'
            })
            .state('user.show', {
                url: '/show/{id:int}',
                templateUrl: '../templates/user/show.html',
                controller: 'UserController'
            });

        $urlRouterProvider.otherwise('/');

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });