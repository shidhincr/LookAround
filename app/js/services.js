/*globals angular, google*/

"use strict";

/* Services */

angular.module("lookAroundApp.services", [ ])

    .factory("googleMap", function ($rootScope) {
        var factory = {};

        factory._maps = google.maps;
        factory.markers = [ ];
        factory.selectedMarkerIdx = null;

        factory.initializeMap = function (elem, options) {
            options = options || {
                zoom: 4,
                center: new google.maps.LatLng(21.508742, -0.120850),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_BOTTOM
                },
                panControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_BOTTOM
                }
            };
            if (this.map) {
                delete this.map;
                this.selectedMarkerIdx = null;
            }
            var map = this.map = new google.maps.Map(elem, options);
            return map;
        };

        factory.getGeoCoder = function () {
            return new google.maps.Geocoder();
        };

        factory.initPlacesService = function (map) {
            this.placeService = new google.maps.places.PlacesService(map);
            return this.placeService;
        };
        factory.placeMarkers = function (data) {
            this.clearAllMarkers();
            var me = this,
                bounds = new google.maps.LatLngBounds();
            angular.forEach(data, function (item, key) {
                var latLng = new google.maps.LatLng(item.geometry.location.lat(), item.geometry.location.lng()),
                    currentMarker;
                me.markers.push(currentMarker = new google.maps.Marker({
                    map: me.map,
                    position: latLng
                }));
                bounds.extend(latLng);
                google.maps.event.addListener(currentMarker, "click", function () {
                    me.selectedMarkerIdx = key;
                    $rootScope.$apply();
                });
            });
            me.map.fitBounds(bounds);
        };
        factory.clearAllMarkers = function () {
            angular.forEach(this.markers, function (item, key) {
                item.setMap(null);
            });
            this.markers = [ ];
        };

        return factory;
    })
    .factory("scrollToElem", function ($window, $timeout) {
        return {
            scrollTo: function (elemId) {
                var elem = document.getElementById(elemId);
                if (!elem) {
                    $window.scrollTo(0, 0);
                    return;
                }
                $timeout(function () {
                    elem.scrollIntoView();
                }, 100);

            }
        };
    });
