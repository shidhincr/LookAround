"use strict";


angular.module("lookAroundApp.controllers",[])

	.controller( "ZipCodeFrmCtrl", function( $scope, $location ){
		$scope.sendZip = function( zipcode ) {
			$location.path("/search/" + zipcode );
		}
	})

	.controller( "SearchCtrl", function( $scope, $routeParams ){
		$scope.zipCode = $routeParams.zipcode;
	})

	.controller( "MainCtrl", function( $scope ){

	});