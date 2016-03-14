var $ = require('jquery');

function GoogleSearchSuggestion() {
	function position2JSON(position) {
		var pos = {
			coords: {}
			timestamp: position.timestamp
		};
		pos.coords.latitude = position.coords.latitude;
		pos.coords.longitude = position.coords.longitude;
		pos.coords.accuracy = position.coords.accuracy;
		if (typeof position.coords.altitude === 'number') pos.coords.altitude = position.coords.altitude;
		if (typeof position.coords.altitudeAccuracy === 'number') pos.coords.altitudeAccuracy = position.coords.altitudeAccuracy;
		if (typeof position.coords.heading === 'number') pos.coords.heading = position.coords.heading;
		if (typeof position.coords.speed === 'number') pos.coords.speed = position.coords.speed;
		return pos;
	}
	function getGeolocation(onDone) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var pos = position2JSON(position);
				console.log('position='+JSON.stringify(pos));
				if (typeof onDone === 'function') onDone(pos);
			});
		} else {
			if (typeof onDone === 'function') onDone(null);
		}		
	}
	this.search = function(query, onSuggestion) {
		if (query === '') {
			if (typeof onSuggestion === 'function') onSuggestion([]);
		} else {
			getGeolocation(function(position) {
				var data = {
					q: query
					,position: position
				};
				$.ajax({
					type: "POST",
					url: '/api/get_suggestion/',
					data: JSON.stringify(data),
					contentType: "application/json; charset=utf-8",
					dataType: "json"
				}).done(function(suggestions) {
					if (typeof onSuggestion === 'function') onSuggestion(suggestions);
				}).fail(function(err){
					if (typeof onSuggestion === 'function') onSuggestion([]);
				});				
			});
		}
	};
}

module.exports = GoogleSearchSuggestion;