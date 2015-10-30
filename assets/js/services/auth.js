angular.module('app')
    .factory('Auth', function ($http, LocalService, AccessLevels) {
        return {
            authorize: function (access) {
                if (access === AccessLevels.user) {
                    return this.isAuthenticated();
                } else {
                    return true;
                }
            },
            isAuthenticated: function () {
                return LocalService.get('auth_token');
            },

            login: function (credentials) {
                return $http.post('/api/auth/login', credentials).then(function(result){
                    LocalService.set('auth_token', JSON.stringify(result.data));
                    return result.data;
                });
            },

            setLocal: function(result) {
                LocalService.set('auth_token', JSON.stringify(result));
            },

            logout: function () {
                // The backend doesn't care about logouts, delete the token and you're good to go.
                LocalService.unset('auth_token');
            },
            register: function (formData) {
                LocalService.unset('auth_token');
                var register = $http.post('/api/auth/register', formData);
                register.success(function (result) {
                    LocalService.set('auth_token', JSON.stringify(result));
                });
                return register;
            }
        }
    })
    .factory('AuthInterceptor', function ($q, $injector) {
        var LocalService = $injector.get('LocalService');

        return {
            request: function (config) {
                var token;
                if (LocalService.get('auth_token')) {
                    token = angular.fromJson(LocalService.get('auth_token')).token;
                }
                if (token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }
                return config;
            },
            responseError: function (response) {
                if (response.status === 401 || response.status === 403) {
                    LocalService.unset('auth_token');
                    $injector.get('$state').go('anon.login');
                }
                return $q.reject(response);
            }
        }
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    });