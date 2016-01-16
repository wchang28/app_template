var React = require('react');
var ReactDOM = require('react-dom');
var MyMatch = require('./my_match');
var TypeAhead = require('./typeahead');
var $ = require('jquery');
var BloodhoundFactory = require('bloodhound');
var Bloodhound = BloodhoundFactory($);

ReactDOM.render(<TypeAhead matchClass={MyMatch}/>, document.getElementById('test'));