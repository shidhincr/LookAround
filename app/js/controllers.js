"use strict";


angular.module("lookAroundApp.controllers",[])

	.controller( "ZipCodeFrmCtrl", function( $scope, $location, $routeParams ){
		var placeurl = $routeParams.place || '';
		$scope.sendZip = function( zipcode ) {
			$location.path("/search/" + zipcode + "/" + placeurl);
		}
	})

	.controller( "SearchCtrl", function( $scope, $routeParams, $location ){
		$scope.zipCode = $routeParams.zipcode;
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
	})

	.controller( "MainCtrl", function( $scope, $routeParams ){
		$scope.applied = function(){
			return !!$routeParams.zipcode;
		}
	});