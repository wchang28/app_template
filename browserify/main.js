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
	{"Id": 1, "lastNasme":"Chang", "firstName": "Wen"}
	,{"Id": 2, "lastNasme":"Ku", "firstName": "Elva"}
	,{"Id": 3, "lastNasme":"Chang", "firstName": "Winston"}
	,{"Id": 4, "lastNasme":"Chang", "firstName": "Evelyn"}
	,{"Id": 5, "lastNasme":"Chang", "firstName": "Juei"}
	,{"Id": 6, "lastNasme":"Chang", "firstName": "Zoey"}
	,{"Id": 7, "lastNasme":"Chang", "firstName": "Chung Hsia"}
	,{"Id": 8, "lastNasme":"Lui", "firstName": "Ling Chu"}
]
			
var engine = new Bloodhound({
	initialize: false,
	local: datums,
	identify: (obj) => obj.Id,
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	datumTokenizer: (dataum) => [dataum.Id, dataum.lastNasme, dataum.firstName]
});

var promise = engine.initialize();

promise.done(function() {
	console.log('ready to go!');
	ReactDOM.render(<TypeAhead dropDownContentClass={MyMatch} suggestionEngine={engine} onQueryChanged={onQueryChanged}/>, document.getElementById('test'));
}).fail(function() {
	console.log('err, something went wrong :('); 
});