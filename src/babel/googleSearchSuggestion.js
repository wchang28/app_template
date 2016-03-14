var $ = require('jquery');

function GoogleSearchSuggestion() {
	function position2JSON(position) {
		var pos = {
			coords: {
				latitude: position.coords.latitude
				,longitude: position.coords.longitude
				,accuracy: position.coords.accuracy
			}
		};
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
	/*
	function getGeolocation(onDone) {
		var pos = {
			coords: {
				latitude: 34.1197226
				,longitude: -118.0735079
				,accuracy: 69
			}
		};
		if (typeof onDone === 'function') onDone(pos);
	}
	*/
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
					//console.log('I am here suggestions=' + JSON.stringify(suggestions));
					if (typeof onSuggestion === 'function') onSuggestion(suggestions);
				}).fail(function(err){
					if (typeof onSuggestion === 'function') onSuggestion([]);
				});				
			});
		}
	};
}

module.exports = GoogleSearchSuggestion;