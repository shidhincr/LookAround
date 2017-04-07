/*global angular*/

"use strict";

var lookAroundApp = angular.module("lookAroundApp", [
    "lookAroundApp.services",
    "lookAroundApp.controllers",
    "lookAroundApp.filters",
    "lookAroundApp.directives",
    "ui.bootstrap",
    "ngRoute",
    "google.places"
]);

lookAroundApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when("/",
        {
            controller: "locFrmCtrl",
            templateUrl: "partials/location.html"
        })
        .when("/search/:loc/:place",
        {
            controller: "SearchCtrl",
            templateUrl: "partials/search.html"
        })
        .otherwise({ redirectTo: "/" });
    }
]);
