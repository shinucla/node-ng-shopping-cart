'use strict';
angular.module('kzApp')
  .controller('kzHeaderNavbarController', function($scope,
                                                   $rootScope,
						   $location,
                                                   KzAuthService) {

    $scope.goHome = function() {
      console.log('go home button clicked');
    };

    $scope.login = function(username, password) {

    };

    $scope.signup = function(user) {

    };

    $scope.logoff = function() {
      KzAuthService.logout();
      $location.path('/user/login');
    };

  });


// https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec
