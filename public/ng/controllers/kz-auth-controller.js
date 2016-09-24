'use strict';
angular.module('kzApp')

  .controller('kzAuthController', function($rootScope,
                                           $scope,
                                           $location,
                                           KzAuthService) {
    $scope.login = function(credential) {
      KzAuthService
        .login(credential)
        .then(function(jwt) { // defer.resolve
          KzAuthService.saveJWT(jwt, function(err) {
            alert('Your web browser does not support storing settings locally. '
                  + 'In Safari, the most common cause of  this is using "Private Browsing Mode"');
          });

          KzAuthService.loadUser();
          $location.path('#/');

        }, function(errMsg) { // defer.reject
          KzAuthService.clearJWT();
          credential.errMessage = errMsg;
        });
    };

    $scope.signup = function(userData) {
      KzAuthService
        .signup(userData)
        .then(function(jwt) { // defer.resolve
          KzAuthService.saveJWT(jwt);
          KzAuthService.loadUser();

          $location.path('#/');

        }, function(errMsg) { // defer.reject
          KzAuthService.clearJWT();
        });
    };

  })
;

// https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec
