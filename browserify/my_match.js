var React = require('react');

var MyMatch = React.createClass({
	getInitialState: function() {
		console.log('In MyMatch.getInitialState(' + this.props.match + ')');
		return {matchedItems: []};
	}
	,componentWillReceiveProps: function(nextProps) {
		console.log('In MyMatch.componentWillReceiveProps(' + nextProps.match + ')');
	}
	,render: function() {
		return (
			<ul className="w3-ul">
				<li>Hawdy, searching for {this.props.match}</li>
				<li>Goodie, found {this.props.match}</li>
			</ul>
		);
	}
});

module.exports = MyMatch;