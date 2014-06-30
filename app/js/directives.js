/*globals angular*/

"use strict";

/* Directives */


angular.module("lookAroundApp.directives", [ ]).

    directive("gmap", [ "googleMap",
        function (googleMap) {
            return {
                restrict: "EA",
                scope: {
                    data: "=data"
                },
                link: function (scope, elem, attrs) {
                    var map = googleMap.initializeMap(elem[ 0 ]),
                        markers = [ ];
                    googleMap.initPlacesService(map);

                    /**
                     * [renderMap - place the markers in the map ]
                     * @param  {[type]} mapData
                     * @return {[type]}
                     */
                    var renderMap = function (mapData) {
                        if (!mapData) {
                            return;
                        }
                        googleMap.placeMarkers(mapData);
                    };
                    
                    /*
                    Keep watching the data and update the map
                     */
                    scope.$watch("data", function (newval) {
                        googleMap.initializeMap(elem[ 0 ]);
                        renderMap(newval);
                    });

                }
            };
        } ])

    .directive("loadingIndicator", [ "$rootScope",
        function ($rootScope) {
            return {
                restrict: "CA",
                link: function (scope, elem, attr) {
                    
                    /*Listen for the route change event and show the loading indicator*/
                    $rootScope.$on("$routeChangeStart", function () {
                        elem.removeClass("hide");
                    });

                    /*remove the loading indicator when the routechange is successfull*/
                    $rootScope.$on("$routeChangeSuccess", function () {
                        setTimeout(function () {
                            elem.addClass("hide");
                        }, 1000);
                    });
                }
            };
        } ]);
