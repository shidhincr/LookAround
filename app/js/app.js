/*global angular*/

"use strict";

// cw: Because javascript really should have had one as a built-in by now.
// From http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format/4673436#4673436
// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

var lookAroundApp = angular.module("lookAroundApp", [
    "lookAroundApp.services",
    "lookAroundApp.controllers",
    "lookAroundApp.filters",
    "lookAroundApp.directives",
    "ui.bootstrap"
]);

lookAroundApp.config(function ($routeProvider) {
    $routeProvider
        .when("/",
        {
            controller: "ZipCodeFrmCtrl",
            templateUrl: "partials/zipcode.html"
        })
        .when("/search/:zipcode/:place",
        {
            controller: "SearchCtrl",
            templateUrl: "partials/search.html"
        })
        .otherwise({ redirectTo: "/" });
});