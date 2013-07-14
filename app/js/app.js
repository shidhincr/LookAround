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

lookAround.controller('searchController',function($scope, $routeParams, mapFactory){
	$scope.searchZipcode = $routeParams.zipcode;
	mapFactory.initializeMap();
});

lookAround.factory('mapFactory',function(){
	var factory = {};

	factory.initializeMap = function(){
		var myOptions = {
			zoom: 5,
			center: new google.maps.LatLng(21.508742,-0.120850),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		return new google.maps.Map( document.getElementById('mapContainer'), myOptions );
	}

	return factory;
});