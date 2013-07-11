"use strict";

var lookAroundApp = angular.module("lookAroundApp", [] );

lookAroundApp.controller("zipCodeFrmCtrl", function( $scope, $location ){
    $scope.sendZip = function( zipcode ) {
        $location.path("/main").search({ "zipcode": zipcode });
    }
});