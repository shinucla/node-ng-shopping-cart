'use strict';
angular.module('kzApp')

  .controller('kzHomeController', function($scope,
                                           $location) {
    $scope.test = function() {
      console.log('hellllllo');
    };

  });
