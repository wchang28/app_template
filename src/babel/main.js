var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var BloodhoundFactory = require('bloodhound');
var Bloodhound = BloodhoundFactory($);
var GoogleSearchSuggestion = require('./googleSearchSuggestion');
require('eventsource-polyfill');

var source = new EventSource("/api/event_stream");
source.onmessage = function(event) {
	var o = JSON.parse(event.data);
	console.log('message: ' + JSON.stringify(o));
};

var TypeAhead = require('react-typeahead');
var MyMatch = require('./my_match');
var AddressMatch = require('./addressMatch');
var Login = require('./login');

var engineGoogle = new GoogleSearchSuggestion();

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
			
var engineBloodhound = new Bloodhound({
	initialize: false,
	local: datums,
	identify: (obj) => obj.Id,
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	datumTokenizer: (datum) => [datum.Id, datum.lastName, datum.firstName]
});

var TestApp = React.createClass({
	getInitialState: () => ({value: 'Bloodhound'})
	,onChange: function(e) {
		this.setState({value: e.target.value});
	}
	,render: function() {
		var type = this.state.value;
		var dropDownContentClass = (type === 'Bloodhound' ? MyMatch : AddressMatch);
		var identity = (type === 'Bloodhound' ? (o) => o.Id : (o) => o);
		var engine = (type === 'Bloodhound' ? engineBloodhound : engineGoogle);
		var search = $.proxy(engine.search, engine);
		var minCharToSearch = (type === 'Bloodhound' ? 2 : 1);
		var placeHolder = (type === 'Bloodhound' ? 'Type something' : 'Type an address here');
		return (
			<div>
				<select className="w3-select w3-border" name="option" onChange={this.onChange} value={this.state.value}>
				  <option value="Bloodhound">Bloodhound</option>
				  <option value="Google">Google</option>
				</select>
				<p></p>
				<TypeAhead dropDownContentClass={dropDownContentClass} identity={identity} search={search} dropdownSameWidthAsInput={true} minCharToSearch={minCharToSearch} onQueryChanged={onQueryChanged} placeholder={placeHolder} borderRadius={4}/>
				<p></p>
				<Login/>
			</div>
		);
	}
});

var promise = engineBloodhound.initialize();

promise.done(function() {
	console.log('ready to go!');
	ReactDOM.render(<TestApp/>, document.getElementById('test'));
}).fail(function() {
	console.log('err, something went wrong :('); 
});