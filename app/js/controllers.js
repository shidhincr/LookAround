/*globals angular*/
"use strict";


angular.module( "lookAroundApp.controllers", [ ] )

.controller( "ZipCodeFrmCtrl", function( $scope, $location, $routeParams ) {
  var placeurl = $routeParams.place || "";
  $scope.sendZip = function( zipcode ) {
    $location.path( "/search/" + zipcode + "/" + placeurl );
  };
} )

.controller( "SearchCtrl", function( $scope, $routeParams, $location, googleMap, $http, $filter ) {
  $scope.zipCode = $routeParams.zipcode;
  $scope.place = $routeParams.place;
  if ( !$scope.zipCode ) {
    $location.path( "/" );
  }
  $http.get( "data/places.json" ).success( function( results ) {
    $scope.places = results.data;
  } );
  $scope.getUrl = function( placeurl ) {
    return "#/search/" + $scope.zipCode + placeurl;
  };
  $scope.activeClass = function( place ) {
    return place.url.slice( 1 ).toLowerCase( ) === $scope.place ? "active" : "";
  };
  $scope.getLocation = function( details ) {
    var location = ( details && details.geometry && details.geometry.location ),
      out = [ ];
    if ( !location ) {
      return "location not available";
    } else {
      angular.forEach( location, function( value, key ) {
        this.push( $filter( "number" )( value, 4 ) );
      }, out );
      return out.join( ", " );
    }
  };
  if ( !$scope.place ) {
    $location.path( $scope.getUrl( "/atm" ).slice( 1 ) );
  } else {
    googleMap.getGeoCoder( ).geocode( {
      address: $scope.zipCode
    }, function( results, status ) {
      var lat = results[ 0 ].geometry.location.lat( ),
        lng = results[ 0 ].geometry.location.lng( );

      $scope.$apply(function(){
        $scope.searchplace = results[ 0 ] && results[ 0 ].formatted_address;
      });  

      googleMap.placeService.textSearch( {
        query: $scope.place,
        type: $scope.place,
        location: new googleMap._maps.LatLng( lat, lng ),
        radius: 50
      }, function( data ) {
        $scope.$apply( function( ) {
          $scope.data = data;
        } );
      } );
    } );
  }

} )
  .controller( "ResultsTabCtrl", function( $scope, $routeParams, $location, googleMap, scrollToElem ) {
    $scope.tabs = {
      "map": false,
      "list": true
    };
    $scope.selectedMarker = 0;
    $scope.listView = function( ) {
      $scope.tabs = {
        "map": false,
        "list": true
      };
    };
    $scope.mapView = function( ) {
      $scope.tabs = {
        "map": true,
        "list": false
      };
    };
    $scope.$watch( function( ) {
      return googleMap.selectedMarkerIdx;
    }, function( newVal ) {
      var fn = function( ) {
        $scope.selectedMarker = newVal;
        if ( newVal !== null ) {
          $scope.listView( );
          scrollToElem.scrollTo( "listItem" + newVal );
        }
      };
      fn( );
    } );
  } )
  .controller( "MainCtrl", function( $scope, $routeParams, $location, $window ) {
    $scope.applied = function( ) {
      return !!$routeParams.zipcode;
    };
    $scope.$on( "$viewContentLoaded", function( event ) {
      $window.ga( "send", "pageview", {
        "page": $location.path( )
      } );
    } );
  } )
  .controller( "AboutDialogCtrl", function( $scope, $window ) {
    $scope.opened = false;
    $scope.open = function( ) {
      $scope.opened = true;
      $window.ga( "send", "pageview", {
        "page": "about.html"
      } );
    };

    $scope.close = function( ) {
      $scope.opened = false;
    };

    $scope.opts = {
      backdropFade: true,
      dialogFade: true
    };
  } );
