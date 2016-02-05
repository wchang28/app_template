var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var BloodhoundFactory = require('bloodhound');
var Bloodhound = BloodhoundFactory($);
require('eventsource-polyfill');

/*
var source = new EventSource("/api/event_stream");
source.onmessage = function(event) {
	var o = JSON.parse(event.data);
	console.log('message: ' + JSON.stringify(o));
};
*/

var MyMatch = require('./my_match');
var TypeAhead = require('./typeahead');

function onQueryChanged(query, suggestionSelected) {
	console.log('onQueryChanged(' + query + ',' + suggestionSelected + ')');
}

var datums =
[
	{"Id": "1", "lastName":"Chang", "firstName": "Wen"}
	,{"Id": "2", "lastName":"Ku", "firstName": "Elva"}
	,{"Id": "3", "lastName":"Chang", "firstName": "Winston"}
	,{"Id": "4", "lastName":"Chang", "firstName": "Evelyn"}
	,{"Id": "5", "lastName":"Chang", "firstName": "Juei"}
	,{"Id": "6", "lastName":"Chang", "firstName": "Zoey"}
	,{"Id": "7", "lastName":"Chang", "firstName": "Chung Hsia"}
	,{"Id": "8", "lastName":"Liu", "firstName": "Ling Chu"}
	,{"Id": "9", "lastName":"Chen", "firstName": "Tiwei"}
	,{"Id": "10", "lastName":"Sun", "firstName": "James"}
	,{"Id": "11", "lastName":"Suciu", "firstName": "Nicolae"}
]
			
var engine = new Bloodhound({
	initialize: false,
	local: datums,
	identify: (obj) => obj.Id,
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	datumTokenizer: (datum) => [datum.Id, datum.lastName, datum.firstName]
});

var promise = engine.initialize();

promise.done(function() {
	console.log('ready to go!');
	ReactDOM.render(<TypeAhead dropDownContentClass={MyMatch} identity={(o) => o.Id} suggestionEngine={engine} dropdownSameWidthAsInput={true} minCharToSearch={2} onQueryChanged={onQueryChanged} placeholder="Type something" borderRadius={4}/>, document.getElementById('test'));
}).fail(function() {
	console.log('err, something went wrong :('); 
});