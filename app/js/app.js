"use strict";

var lookAroundApp = angular.module("lookAroundApp", ["lookAroundApp.services","lookAroundApp.controllers","lookAroundApp.filters","lookAroundApp.directives"] );

lookAroundApp.config(function($routeProvider){
	$routeProvider
		.when('/',
			{
				controller: 'ZipCodeFrmCtrl',
				templateUrl: 'partials/zipcode.html'
			})
		.when('/search/:zipcode',
			{
				controller: 'SearchCtrl',
				templateUrl: 'partials/search.html'
			})
		.otherwise({ redirectTo: '/' });
});