var React = require('react');
var ReactDOM = require('react-dom');

var GoogleSearchSuggestion = require('./googleSearchSuggestion');

var AddressMatch = require('./addressMatch');
var TypeAhead = require('./typeahead');

function onQueryChanged(query, suggestionSelected) {
	console.log('onQueryChanged(' + query + ',' + suggestionSelected + ')');
}

var engine = new GoogleSearchSuggestion();

ReactDOM.render(<TypeAhead dropDownContentClass={AddressMatch} identity={(o) => o} suggestionEngine={engine} dropdownSameWidthAsInput={true} minCharToSearch={1} onQueryChanged={onQueryChanged} placeholder="Type an address here" roundSize="medium"/>, document.getElementById('test'));