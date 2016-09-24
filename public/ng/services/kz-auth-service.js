'use strict';
angular.module('kzApp')

  .factory('KzAuthService', function($rootScope,
                                     $http,
                                     $q,
                                     $cookieStore,
                                     $window,
                                     $location,
				     KzServerService) {


    //service.handleError = function(response) {
    //  switch (response.code) {
    //  case 'NOT_AUTHORIZED':
    //	delete $window.localStorage['jwt'];
    //	delete $rootScope.user;
    //	$cookieStore.remove('user');
    //
    //	$route.reload();
    //	$location.path('/user/login');
    //	$location.replace();
    //
    //    break;
    //
    //  case 'HTTP_BAD_CODE':
    //    break;
    //  }
    //};

    


    function login(credential) {
      var defer = $q.defer();

      KzServerService
        .exec('/user/api/login', credential)
        .then(function(result) {
          if (!!result && !!result.jwt) {
            defer.resolve(result.jwt);

          } else {
            defer.reject((!!result && !!result.errMsg
                          ? result.errMsg
                          : 'cannot login, please try again later'));
          }
        });

      return defer.promise;
    }

    function signup(profile) {
      var defer = $q.defer();

      KzServerService
        .exec('/user/api/signup', profile)
        .then(function(result) {
          if (!!result && !!result.jwt) {
            defer.resolve(result.jwt);

          } else {
            defer.reject((!!result && !!result.errMsg
                          ? result.errMsg
                          : 'cannot login, please try again later'));
          }
        });

      return defer.promise;
    }

    function logout() {
      delete $window.localStorage['jwt'];
      delete $rootScope.user;
      $cookieStore.remove('user');
    }

    function saveJWT(jwt, callback) {
      $rootScope.jwt = jwt;

      try {
        $window.localStorage['jwt'] = jwt;
      } catch(e) {
        callback(e);
      }
    }

    function clearJWT() {
      delete $window.localStorage['jwt'];
    }

    function getJWT() {
      return $window.localStorage['jwt'] || $rootScope.jwt;
    }

    function loadUser() {
      try {
        var jwt = $window.localStorage['jwt'] || $rootScope.jwt;

        if (!!jwt && 0 < jwt.indexOf('.')) {
          var base64Url = jwt.split('.')[1];
          var base64 = base64Url.replace('-', '+').replace('_', '/');

          $rootScope.user = JSON.parse($window.atob(base64))._doc;
        }
      } catch (e) {
        try { delete $window.localStorage['jwt']; } catch(e) {}
      }
    }

    function loadUserExtension(forcedToLoad) {
      if (!$rootScope.user
          || (!forcedToLoad
              && $rootScope.userExtension
              && $rootScope.userExtension.userId
              && $rootScope.userExtension.userId.toString() === $rootScope.user._id.toString())) {
        console.log('cached');
        return;
      }

      KzServerService
        .get('/user/api/extension')
        .then(function(extension) {
          $rootScope.userExtension = extension;
        });
    }

    return { login: login,
             signup: signup,
             logout: logout,
             saveJWT: saveJWT,
             clearJWT: clearJWT,
             getJWT: getJWT,
             loadUser: loadUser,
             loadUserExtension: loadUserExtension
           };
  })
;
