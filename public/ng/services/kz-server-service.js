'use strict';
// ================================================================
//
// https://github.com/kriskowal/q
// $q is a service in module ng
// A service that helps you run functions asynchronously,
// and use their return values (or exceptions) when they
// are done processing.
//
// ================================================================
//
// Responses from backend are assumpted to have this format:
//    { status: xxx,
//      error: xxx,
//      result: {}/[]/xxx
//    }
//
// ================================================================
//
// $http.get(url,    [conf]).then(successCallBack, errCallBack);
// $http.delete(url, [conf]).then(successCallBack, errCallBack);
// $http.head(url,   [conf]).then(successCallBack, errCallBack);
// $http.jsonp(url,  [conf]).then(successCallBack, errCallBack);
//
// $http.post(url,   data, [conf]).then(successCallBack, errCallBack);
// $http.put(url,    data, [conf]).then(successCallBack, errCallBack);
// $http.patch(url,  data, [conf]).then(successCallBack, errCallBack);
//
// ================================================================
//
// To pass data in get, delete, head, jsonp, just extend the cong to include 'params':
//
// _.extend({ params: data }, conf) ==> { params: data, conf1: ..., conf2: ... }
//

angular.module('kzApp')
  .factory('KzServerService', function($rootScope,
                                       $window,
                                       $http,
                                       $q,
                                       $cacheFactory,
                                       $timeout,
                                       $document) {
    var server = {};

    function promiseByStatus(response, status, defer) {
      if (response.error) {
        //KzAuthService.handleError(response.error);
        defer.reject({ code: 'HTTP_BAD_CODE', text: 'http bad code' });

      } else {
        defer.resolve(response.result);
      }
    }

    function get(url, query, conf, defer) {
      if (!angular.isDefined(defer)) {
        defer = $q.defer();
      }

      $http
        .get(url, _.extend({ params: query }, conf))
        .success(function(response, status, headers, configuration) {
          promiseByStatus(response, status, defer);
        })
        .error(function(response, status, headers, configuration) {
          defer.reject({ code: 'HTTP_REQUEST_FAILED', text: 'http request failed' });
        });

      return defer.promise;
    }

    function put(url, data, conf, defer) {
      if (!angular.isDefined(defer)) {
        defer = $q.defer();
      }

      $http
        .put(url, data, conf)
        .success(function(response, status, headers, configuration) {
          promiseByStatus(response, status, defer);
        })
        .error(function(response, status, headers, configuration) {
          defer.reject({ code: 'HTTP_REQUEST_FAILED', text: 'http request failed' });
        });

      return defer.promise;
    }

    function post(url, data, conf, defer) {
      if (!angular.isDefined(defer)) {
        defer = $q.defer();
      }

      $http
        .post(url, data, conf)
        .success(function(response, status, headers, configuration) {
          if (response.error) {
            //KzAuthService.handleError(response.error);
            defer.reject({ code: 'HTTP_BAD_CODE', text: 'http bad code' });

          } else {
            defer.resolve(conf && conf.transformResponse
                          ? conf.transformResponse(response.result)
                          : response.result);
          }
        })
        .error(function(response, status, headers, configuration) {
          defer.reject({ code: 'HTTP_REQUEST_FAILED', text: 'http request failed' });
        });

      return defer.promise;
    }

    function del(url, query, conf, defer) {
      if (!angular.isDefined(defer)) {
        defer = $q.defer();
      }

      $http
        .delete(url, _.extend({ params: query }, conf))
        .success(function(response, status, headers, configuration) {
          promiseByStatus(response, status, defer);
        })
        .error(function(response, status, headers, configuration) {
          defer.reject({ code: 'HTTP_REQUEST_FAILED', text: 'http request failed' });
        });

      return defer.promise;
    }

    function execWithCache(url, data, conf) {
      var defer = $q.defer();

      // todo: xxx

      return defer.promise;
    }

    function exec(url, data, conf) {
      return (conf && conf.cache
              ? execWithCache(url, data, conf)
              : post(url, data, conf));
    }

    function resolve(url, conf) { // so smart: KzServerService.resolve('www.aa.com')({data: 'test'});
      return function(data) {
        return exec(url, data, conf);
      }
    }

    return {
      get: get,
      put: put,
      post: post,
      del: del,
      execWithCache: execWithCache,
      exec: exec,
      resolve: resolve
    };

  })
;
