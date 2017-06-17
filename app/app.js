var droneCafe = angular.module('droneCafe', ['ngRoute', 'ngResource', 'ngMessages'])

    .config(['$routeProvider',
        function config($routeProvider) {

            $routeProvider
                .when('/', {
                    templateUrl:'client/client.html',
                    controller:'clientCtrl'
                })
                .when('/kitchen', {
                    templateUrl:'chef/chef.html',
                    controller:'chefCtrl'
                })
                .otherwise({
                    redirectTo: '/'
                })
        }
    ]);
