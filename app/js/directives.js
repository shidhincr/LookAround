/*globals angular*/

"use strict";

/* Directives */


angular.module( "lookAroundApp.directives", [ ] ).

directive( "gmap", [ "googleMap",
  function( googleMap ) {
    return {
      restrict: "EA",
      scope: {
        data: "=data"
      },
      link: function( scope, elem, attrs ) {
        var map = googleMap.initializeMap( elem[ 0 ] ),
          markers = [ ];
        googleMap.initPlacesService( map );

        var renderMap = function( mapData ) {
          if ( !mapData ) {
            return;
          }
          googleMap.placeMarkers( mapData );
        };
        scope.$watch( "data", function( newval ) {
          googleMap.initializeMap( elem[ 0 ] );
          renderMap( newval );
        } );

      }
    };
  } ] )

.directive( "loadingIndicator", [ "$rootScope",
  function( $rootScope ) {
    return {
      restrict: "CA",
      link: function( scope, elem, attr ) {
        //elem.addClass("hide");
        $rootScope.$on( "$routeChangeStart", function( ) {
          elem.removeClass( "hide" );
        } );
        $rootScope.$on( "$routeChangeSuccess", function( ) {
          setTimeout( function( ) {
            elem.addClass( "hide" );
          }, 1000 );
        } );
      }
    };
  } ] );
