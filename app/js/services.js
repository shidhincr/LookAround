'use strict';

/* Services */

angular.module('lookAroundApp.services', [])

	.factory('googleMap',function(){
		var factory = {};

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
			
			return new google.maps.Map( elem , options );
		}

		return factory;
	});
