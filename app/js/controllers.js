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
		// $scope.placeService = googleMap.placeService;
		$scope.places = [
			{
				title: "Bars",
				url: "/bars"
			},
			{
				title: "Hotels",
				url: "/hotels"
			},
			{
				title: "Gas stations",
				url: "/gas-stations"
			},
			{
				title: "ATM",
				url: "/atm"
			},
			{
				title: "PUB",
				url: "/pub"
			},
			{
				title: "Internet Cafes",
				url: "/Internet-cafes"
			}
		];
		$scope.getUrl = function( placeurl ) {
			return "#/search/" + $scope.zipCode + placeurl ;
		};

		googleMap.getGeoCoder().geocode( { address: $scope.zipCode }, function( results, status ) {
			var lat = results[0].geometry.location.lat(),
	        	lng = results[0].geometry.location.lng();

	       	googleMap.placeService.textSearch( {
	       		query: $scope.place,
	       		location: new googleMap._maps.LatLng( lat, lng ),
	       		radius: 50
	       	}, function( data ) {
	       		$scope.$apply(function(){
	       			$scope.data = data;
	       		});
	       	});
		});
		
	})

	.controller( "MainCtrl", function( $scope, $routeParams ){
		$scope.applied = function(){
			return !!$routeParams.zipcode;
		}
	});