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
			<table className="w3-table w3-hoverable">
				<thead>
					<tr className="w3-light-grey">
						<th>First Name</th>
						<th>Last Name</th>
						<th>Points</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Jill</td>
						<td>{this.props.match}</td>
						<td>50</td>
					</tr>
					<tr>
						<td>Eve</td>
						<td>{this.props.match}</td>
						<td>94</td>
					</tr>
					<tr>
						<td>Adam</td>
						<td>{this.props.match}</td>
						<td>67</td>
					</tr>
				</tbody>
			</table>
		);
	}
});

module.exports = MyMatch;