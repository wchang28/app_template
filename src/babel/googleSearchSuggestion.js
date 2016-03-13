var $ = require('jquery');

function GoogleSearchSuggestion() {
	var me = this;
	this.position = null;
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			me.position = position;
		});
	}
	this.search = function(query, onSuggestion) {
		if (query === '') {
			if (typeof onSuggestion === 'function') onSuggestion([]);
		} else {
			var data = {
				q: query
				,position: me.position
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
		}
	};
}

module.exports = GoogleSearchSuggestion;