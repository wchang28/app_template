var React = require('react');
var ReactDOM = require('react-dom');

var GoogleSearchSuggestion = require('./googleSearchSuggestion');

var AddressMatch = require('./addressMatch');
var TypeAhead = require('./typeahead');

function onQueryChanged(query) {
	console.log('onQueryChanged(' + query + ')');
}

var engine = new GoogleSearchSuggestion();

ReactDOM.render(<TypeAhead dropDownContentClass={AddressMatch} identity={(o) => o} suggestionEngine={engine} minCharToSearch={1} onQueryChanged={onQueryChanged}/>, document.getElementById('test'));