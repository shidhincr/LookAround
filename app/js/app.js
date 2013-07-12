"use strict";

var lookAroundApp = angular.module("lookAroundApp", [] );


//Router Configurations
lookAroundApp.config(function ($routeProvider) {
	$routeProvider
	.when("/main/:pincode", {
		controller: "MainCtrl",
		templateUrl: "views/main.html"
	})
	.when("/", {
		controller: "zipCodeFrmCtrl",
		templateUrl: "views/zipcode-view.html"
	});
});