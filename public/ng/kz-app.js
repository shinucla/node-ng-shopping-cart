'use strict';
angular.module('kzApp', ['ngCookies', 'ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/',
	    { templateUrl: '/ng/views/kz-home.html',
	      controller: 'kzHomeController' })
    
      .when('/home',
	    { templateUrl: '/ng/views/kz-home.html',
	      controller: 'kzHomeController' })
    
      .when('/user/login',
	    { templateUrl: '/ng/views/kz-user-login.html',
	      controller: 'kzAuthController' })
    
      .when('/user/signup',
	    { templateUrl: '/ng/views/kz-user-signup.html',
	      controller: 'kzAuthController' })

      .otherwise({redirectTo: '/'});
  }])

  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(['$q', '$window','$location', '$rootScope', function($q, $window, $location, $rootScope) {

      return {
        'request' : function (config) {
          config.headers = config.headers || {};
          config.headers.jwt = $window.localStorage['jwt'] || $rootScope.jwt;

          if (!config.headers.jwt
              && '/user/signup' !== $location.path()
              && '/user/login' !== $location.path()) {
            $location.path('/user/login');
          }

          return config;
        }
      };

    }]);
  }])

  .run(function($rootScope,
                $window,
                $cookies,         // service in module ngCookies
                $cookieStore,     // service in module ngCookies
                KzServerService,
                KzAuthService ) {

    // loading the remembered user
    KzAuthService.loadUser();

    //ServerService
    //  .exec('/serverservice/testexec', {data: 'this is the data'})
    //  .then(function(response) {
    //    console.log('promise chaining 1 ' + response.text);
    //  $cookieStore.put('resp', response.text);
    //  })
    //  .then(function() {
    //    console.log('promise chaining 2');
    //  })
    //  .then(function() {
    //    console.log('promise chaining 3');
    //  })
    //;

    //console.log($cookies.get('_me'));
    //console.log(JSON.stringify($cookies));
  })
;
