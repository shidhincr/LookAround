'use strict';

/* Directives */


angular.module('lookAroundApp.directives', []).
  
  directive('ngGmap', ['googleMap', function( googleMap ) {
    return function(scope, elem, attrs) {
      googleMap.initializeMap( elem[0] ); 
    };
  }]);
