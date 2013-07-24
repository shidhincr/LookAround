'use strict';

/* Services */

angular.module('lookAroundApp.services', [])

	.factory('googleMap', function(){
		var factory = {};
		
		factory._maps = google.maps;
		factory.markers = [];

		factory.initializeMap = function( elem ,options ) {
			options = options || {
				zoom: 4,
				center: new google.maps.LatLng(21.508742,-0.120850),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				zoomControlOptions: {
			        position: google.maps.ControlPosition.RIGHT_BOTTOM
			    },
			    panControlOptions: {
			        position: google.maps.ControlPosition.RIGHT_BOTTOM
			    }
			};
			var map = this.map  = new google.maps.Map( elem , options );
			return map;
		};

		factory.getGeoCoder = function() {
			return new google.maps.Geocoder();
		};

		factory.initPlacesService =  function( map ) {
			this.placeService =  new google.maps.places.PlacesService( map );
			return this.placeService;
		};
		factory.placeMarkers = function( data ) {
			this.clearAllMarkers();
			var me = this,
				bounds = new google.maps.LatLngBounds();
			angular.forEach( data , function(item, key){
				var latLng = new google.maps.LatLng( item.geometry.location.lat(),item.geometry.location.lng());
				me.markers.push( new google.maps.Marker({
					map: me.map,
					position: latLng
				}) );
				bounds.extend( latLng );
			});
			me.map.fitBounds( bounds );
		};
		factory.clearAllMarkers = function() {
			angular.forEach( this.markers , function(item, key){
				item.setMap(null);
			});
			this.markers = [];
		};

		return factory;
	})
