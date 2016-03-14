var $ = require('jquery');

function GoogleSearchSuggestion() {
	function getGeolocation(onDone) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				console.log('latitude='+position.coords.latitude);
				console.log('longitude='+position.coords.longitude);
				if (typeof onDone === 'function') onDone(position);
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