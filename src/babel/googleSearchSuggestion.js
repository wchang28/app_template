var $ = require('jquery');

function GoogleSearchSuggestion() {
	this.search = function(query, onSuggestion) {
		if (query === '')
			return [];
		else {
			$.getJSON('/api/get_suggestion/', {q: query}, function(suggestions){
				if (typeof onSuggestion === 'function') onSuggestion(suggestions);
			});
		}
	};
}

module.exports = GoogleSearchSuggestion;