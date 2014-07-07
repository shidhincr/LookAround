/*globals angular, google*/

"use strict";

/* Services */

angular.module("lookAroundApp.services", [ ])

    .factory("googleMap", function ($rootScope) {
        var factory = {};

        factory._maps = google.maps;
        factory.markers = [ ];
        factory.selectedMarkerIdx = null;
		factory.icons = {};
		factory.iconNameTmpl = 'img/markers/number_{0}.png';
        
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

		// cw: Preload icons 1-9. Must be done after method definitions.
		for (var x = 1; x < 10; x++) { 
			factory.getIcon(x);
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
