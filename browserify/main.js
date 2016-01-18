var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var BloodhoundFactory = require('bloodhound');
var Bloodhound = BloodhoundFactory($);

var MyMatch = require('./my_match');
var TypeAhead = require('./typeahead');

function onQueryChanged(query) {
	console.log('onQueryChanged(' + query + ')');
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
	,{"Id": "8", "lastName":"Lui", "firstName": "Ling Chu"}
]
			
var engine = new Bloodhound({
	initialize: false,
	local: datums,
	identify: (obj) => obj.Id,
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	datumTokenizer: (datum) => [datum.Id, datum.lastNasme, datum.firstName]
});

var promise = engine.initialize();

promise.done(function() {
	console.log('ready to go!');
	ReactDOM.render(<TypeAhead dropDownContentClass={MyMatch} suggestionEngine={engine} onQueryChanged={onQueryChanged}/>, document.getElementById('test'));
}).fail(function() {
	console.log('err, something went wrong :('); 
});