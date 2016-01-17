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

var engine = new Bloodhound({
	initialize: false,
	local: ['dog', 'pig', 'moose'],
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	datumTokenizer: Bloodhound.tokenizers.whitespace
});

var promise = engine.initialize();

promise.done(function() {
	console.log('ready to go!');
	ReactDOM.render(<TypeAhead dropDownContentClass={MyMatch} suggestionEngine={engine} onQueryChanged={onQueryChanged}/>, document.getElementById('test'));
}).fail(function() {
	console.log('err, something went wrong :('); 
});