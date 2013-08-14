"use strict";


angular.module("lookAroundApp.controllers",[])

	.controller( "ZipCodeFrmCtrl", function( $scope, $location, $routeParams ){
		var placeurl = $routeParams.place || '';
		$scope.sendZip = function( zipcode ) {
			$location.path("/search/" + zipcode + "/" + placeurl);
		}
	})

	.controller( "SearchCtrl", function( $scope, $routeParams, $location, googleMap, $http ){
		$scope.zipCode = $routeParams.zipcode;
		$scope.place = $routeParams.place;

		if(!$scope.zipCode){
			$location.path("/");
		}
		$http.get("data/places.json").success( function( results ){
			$scope.places = results.data;
		});
		$scope.getUrl = function( placeurl ) {
			return "#/search/" + $scope.zipCode + placeurl ;
		};
		$scope.activeClass = function( place ) {
			return place.url.slice(1).toLowerCase() === $scope.place ? 'active':'';
		}
		if( $scope.place ) {
			googleMap.getGeoCoder().geocode( { address: $scope.zipCode }, function( results, status ) {
				var lat = results[0].geometry.location.lat(),
		        	lng = results[0].geometry.location.lng();

		       	googleMap.placeService.textSearch( {
		       		query: $scope.place,
		       		type: $scope.place,
		       		location: new googleMap._maps.LatLng( lat, lng ),
		       		radius: 50
		       	}, function( data ) {
		       		$scope.$apply(function(){
		       			$scope.data = data;
		       		});
		       	});
			});
		}
		
	})
	.controller( "ResultsTabCtrl", function( $scope, $routeParams, $location, googleMap ){
		$scope.tabs = {
			"map" : false,
			"list": true
		};
		$scope.selectedMarker = 0;
		$scope.listView = function(){
			$scope.tabs = {
				"map" : false,
				"list": true
			};
		};
		$scope.mapView = function(){
			$scope.tabs = {
				"map" : true,
				"list": false
			};
		};
		$scope.$watch(function(){
			return googleMap.selectedMarkerIdx;
		}, function(newVal){
			var fn = function(){
				$scope.selectedMarker = newVal;
				//$scope.listView();
			}
			fn();
		});
	})
	.controller( "MainCtrl", function( $scope, $routeParams ){
		$scope.applied = function(){
			return !!$routeParams.zipcode;
		}
	});
