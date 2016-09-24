'use strict';
angular.module('kzApp')
  .directive('kzHeaderNavbar', function() {

    return {
      templateUrl: '/ng/views/kz-header-navbar.html',
      restrict: 'E', // E = element, A = attribute, C = class, M = comment
      replace: true
    };

  });
