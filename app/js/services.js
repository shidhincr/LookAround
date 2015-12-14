/*globals angular, google*/

"use strict";

/* Services */

angular.module("lookAroundApp.services", [ ])

    .factory("googleMap", ['$rootScope', function ($rootScope) {
        var factory = {};

        factory._maps = google.maps;
        factory.markers = [ ];
        factory.selectedMarkerIdx = null;
        factory.icons = {};
        factory.iconNameTmpl = 'img/markers/number_{0}.png';
        factory.mapWidth = 0;
		factory.mapWidth = 0;
        
        /**
         * Initialise the map
         * 
         * @param  {[type]} elem - html element
         * @param  {[type]} options
         * @return {object} - map instance
         */
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
            // cw: This will fire off several times. We only want the time when we actually have data.
            if (elem.clientWidth > 0) {
                this.mapWidth = elem.clientWidth;
            }
            return map;
        };
        
        /**
         * [getGeoCoder - gets a new geoCoder object]
         * @return {[type]}
         */
        factory.getGeoCoder = function () {
            return new google.maps.Geocoder();
        };

        /**
         * [initPlacesService - initialise the place service on a given map object]
         * @param  {object} map
         * @return {object}
         */
        factory.initPlacesService = function (map) {
            this.placeService = new google.maps.places.PlacesService(map);
            return this.placeService;
        };

        /**
         * [getIcon - Return the icon object used by google.maps.Marker calls]
         * @param  {integer} num
         * @return {object}
         */
        factory.getIcon = function(num) {
            var i = this.icons['m' + num];
            if (typeof i === 'undefined' || i === null) {
                i = this.icons['m' + num] = {
                    url: factory.iconNameTmpl.format(num)
                };
            }
            return i;
        };

        /**
         * [placeMarkers description]
         * @param  {array} data
         * @return {void}
         */
        factory.placeMarkers = function (data) {
            this.clearAllMarkers();
            var me = this,
                bounds = new google.maps.LatLngBounds();
            var count = 1;
            angular.forEach(data, function (item, key) {
                var latLng = new google.maps.LatLng(item.geometry.location.lat(), item.geometry.location.lng()),
                    currentMarker;    
                me.markers.push(currentMarker =  new google.maps.Marker({
                    map: me.map,
                    position: latLng,
                    animation: google.maps.Animation.DROP,
                    icon: me.getIcon(count++)
                }));
                bounds.extend(latLng);
                google.maps.event.addListener(currentMarker, "click", function () {
                    me.selectedMarkerIdx = key;
                    $rootScope.$apply();
                });
            });
            me.map.fitBounds(bounds);
        };

        /**
         * [clearAllMarkers - clear all markers in the map]
         * @return {void}
         */
        factory.clearAllMarkers = function () {
            angular.forEach(this.markers, function (item, key) {
                item.setMap(null);
            });
            this.markers = [ ];
        };

        /**
         * [zoomToMarker - zoom to a marker on the map]
         * @param  {integer} marker index
         * @return {void}
         */
        factory.zoomToMarker = function(idx) {
            // Zoom to marker with proper zoom based on bounds.
            var p = this.markers[idx].getPosition();
            // cw: Would like to pan & zoom to this, but V3 API doesn't make this possible.
            this.map.setCenter(p);
            // cw: Zoom level determined by hand. Should be a better way.
            this.map.setZoom(16);
            // cw: Alternative -- find closest marker, add both points to bounds and zoom to 
            // that to show context.
        };

        /**
         * [bounceMarker - use the bounce animation on the marker]
         * @param  {[type]} idx [index of the marker in markers array]
         * @return {[type]}     [void]
         */
        factory.bounceMarker = function(idx){
            var marker  = this.markers[idx];
            angular.forEach(this.markers, function (item, key) {
                item.setAnimation(null);
            });
            marker && marker.setAnimation(google.maps.Animation.BOUNCE);
        };

        return factory;
    }])

    .factory("scrollToElem", ['$window', '$timeout', function ($window, $timeout) {
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
    }]);
