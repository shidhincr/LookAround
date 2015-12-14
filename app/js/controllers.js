/*globals angular*/
"use strict";


angular.module("lookAroundApp.controllers", [ ])
    
    /**
     * [ZipCodeFrmCtrl]
     * Responsible for updating the route whenever zipcode is changed
     * appears in the first page,  and the header
     *
     * - default placeurl in route parameters is 'atm'
     * 
     * @param  {[type]} $scope
     * @param  {[type]} $location
     * @param  {[type]} $routeParams
     * @return {[type]}
     */
    .controller("ZipCodeFrmCtrl", ['$scope', '$location', '$routeParams',
        function ($scope, $location, $routeParams) {
            var placeurl = $routeParams.place || "atm";
            $scope.sendZip = function (zipcode) {
                $location.path("/search/" + zipcode + "/" + placeurl);
            };

            // Currently displaying Result near ...
            // Display filtered item(like Atm, Bank, Zoo..)  instead of static string "Result"
            $scope.resultTitle = function(place) {
                var  placeTitle = "";
                angular.forEach($scope.places, function(result){
                    if(result.url === "/" + place){
                        placeTitle = result.title;
                    }
                });
                return placeTitle;
            }
        }
    ])

    /**
     * [SearchCtrl]
     * This controller is responsible for the main search in the view
     * 
     * - It first gets the zip code from the route params and check for the place data
     * - it then gets the map latitude and longitude from the zipcode ( using Google GeoCoder )
     * - using the places Api, it will fetch the data for the given place type ( 'atm|bar|bus-station' ..etc)
     * - and renders the map using this data
     * 
     * @param  {[type]} $scope
     * @param  {[type]} $routeParams
     * @param  {[type]} $location
     * @param  {[type]} googleMap
     * @param  {[type]} $http
     * @param  {[type]} $filter
     * @return {[type]}
     */
    .controller("SearchCtrl",
        ['$scope', '$routeParams', '$location', 'googleMap', '$http', '$filter',
            function ($scope, $routeParams, $location, googleMap, $http, $filter) {
                $scope.zipCode = $routeParams.zipcode;
                $scope.place = $routeParams.place;

                /* redirect to the home page if there's no zipcode */
                if (!$scope.zipCode) {
                    $location.path("/");
                }

                /*
                Gets the default place types
                @TODO: this should go to a resolve object
                */
                $http.get("data/places.json").success(function (results) {
                    $scope.places = results.data;
                });

                /**
                 * [getUrl get the url for different type of places ]
                 * @param  {string} placeurl
                 * @return {string}
                 */
                $scope.getUrl = function (placeurl) {
                    return "#/search/" + $scope.zipCode + placeurl;
                };

                /*
                Simple utility method to set the active class
                 */
                $scope.activeClass = function (place) {
                    return place.url.slice(1).toLowerCase() === $scope.place ? "active" : "";
                };

                /**
                 * Method for finding out the place name for the search results
                 * Used to show in the header
                 *
                 * @param  {[type]} details
                 * @return {[type]}
                 */
                $scope.getLocation = function (details) {
                    var location = ( details && details.geometry && details.geometry.location ),
                        out = [ ];
                    if (!location) {
                        return "location not available";
                    } else {
                        angular.forEach(location, function (value, key) {
                            this.push($filter("number")(value, 4));
                        }, out);
                        return out.join(", ");
                    }
                };


                /*
                start the Geocoding to get the latitude and longitude from the
                zipcode proviced. This lat/long will be served to the places api to fetch the places details
                */
                googleMap.getGeoCoder().geocode({
                    address: $scope.zipCode
                }, function (results, status) {
                    var lat = results[ 0 ].geometry.location.lat(),
                        lng = results[ 0 ].geometry.location.lng();

                    /* $scope.$apply is required as this function will be executed inside the GeoCoder context */
                    $scope.$apply(function () {
                        $scope.searchplace = results[ 0 ] && results[ 0 ].formatted_address;
                    });

                    /* Do a text search and find all the places for the given query ( place type ) */
                    googleMap.placeService.textSearch({
                        query: $scope.place,
                        type: $scope.place,
                        location: new googleMap._maps.LatLng(lat, lng),
                        radius: 50
                    }, function (data) {
                        /*
                        Once getting the data, set it to the controller scope.
                        $scope.$apply is required because this function will be executed in the googleMap object scope
                        */
                        $scope.$apply(function () {
                            $scope.data = data;
                        });
                    });
                });
            }
        ]
    )
    
    /**
     * [ResultsTabCtrl]
     * Controller resposible for the map view and list view tabs.
     * 
     * @param  {[type]} $scope
     * @param  {[type]} $routeParams
     * @param  {[type]} $location
     * @param  {[type]} googleMap
     * @param  {[type]} scrollToElem
     * @return {[type]}
     */
    .controller("ResultsTabCtrl",
        ['$scope', '$routeParams', '$location', 'googleMap', 'scrollToElem',
            function ($scope, $routeParams, $location, googleMap, scrollToElem) {
                $scope.tabs = {
                    "map": false,
                    "list": true
                };
                $scope.selectedMarker = 0;

                $scope.listView = function () {
                    $scope.tabs = {
                        "map": false,
                        "list": true
                    };
                };

                $scope.mapView = function () {
                    $scope.tabs = {
                        "map": true,
                        "list": false
                    };
                };

                $scope.selectFromList = function(num) {
                    $scope.mapView();
                    $scope.selectedMarker = num;
                    // need to get better user experience
                    googleMap.zoomToMarker(num);
                    googleMap.bounceMarker(num);
                }

                /*
                Watches for any click inside the map markers, and switches to the list view.
                Also scroll down the details of the selected marker in the list.
                 */
                $scope.$watch(function () {
                    return googleMap.selectedMarkerIdx;
                }, function (newVal) {
                    var fn = function () {
                        $scope.selectedMarker = newVal;
                        if (newVal !== null) {
                            $scope.listView();
                            // need to get better user experience
                            googleMap.zoomToMarker(newVal);
                            googleMap.bounceMarker(newVal);
                            scrollToElem.scrollTo("listItem" + newVal);
                        }
                    };
                    fn();
                });
            }
        ]
    )

    /**
     * [MainCtrl]
     * @param  {[type]} $scope
     * @param  {[type]} $routeParams
     * @param  {[type]} $location
     * @param  {[type]} $window
     * @return {[type]}
     */
    .controller("MainCtrl", ['$scope', '$routeParams', '$location', '$window',
        function ($scope, $routeParams, $location, $window) {
            // checks if the url contains any valid zipcode
            $scope.applied = function () {
                return !!$routeParams.zipcode;
            };
            // some Google analytics
            $scope.$on("$viewContentLoaded", function (event) {
                $window.ga("send", "pageview", {
                    "page": $location.path()
                });
            });
        }
    ])

    // Just shows something about me and how I did this.
    .controller("AboutDialogCtrl", ['$scope', '$window', function ($scope, $window) {
        $scope.opened = false;
        $scope.open = function () {
            $scope.opened = true;
            $window.ga("send", "pageview", {
                "page": "about.html"
            });
        };

        $scope.close = function () {
            $scope.opened = false;
        };

        /* For the twitter bootstrap plugins */
        $scope.opts = {
            backdropFade: true,
            dialogFade: true
        };
    }]);
