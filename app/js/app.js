"use strict";

var lookAround = angular.module("lookAround", [] );

lookAround.config(function($routeProvider){
	$routeProvider
		.when('/',
			{
				controller: 'zipcodeController',
				templateUrl: 'views/zipcode.html'
			})
		.when('/search/:zipcode',
			{
				controller: 'searchController',
				templateUrl: 'views/search.html'
			})
		.otherwise({ redirectTo: '/' });
});


lookAround.controller('zipcodeController',function($scope, $location){
	$scope.sendZip = function( zipcode ) {
		$location.path("/search/" + zipcode );
	}
});

lookAround.controller('searchController',function($scope, $routeParams){
	$scope.searchZipcode = $routeParams.zipcode;
});