var React = require('react');

var Row = React.createClass({
	render: function() {
		var createColumn = function(column) {
			return <td>{column}</td>
		};
		return (
			<tr onClick={this.props.onRowClick}>this.columns.map(createColumn)</tr>
		);
	}
});

var MyMatch = React.createClass({
	getInitialState: function() {
		console.log('In MyMatch.getInitialState(' + this.props.match + ')');
		return {matchedItems: []};
	}
	,componentWillReceiveProps: function(nextProps) {
		console.log('In MyMatch.componentWillReceiveProps(' + nextProps.match + ')');
	}
	,getRowClickHandler: function(rowIndex) {
		var me = this;
		return (function() {
			var value = me.props.datums[rowIndex].Id;
			me.props.dropdownItemSelectedHandler(value);
		});
	}
	,getColumns: function(datum) {
		return [datum.Id, this.props.match, datum.firstName];
	}
	,render: function() {
		var me = this;
		var createRow = function(datum, i) {
			return <Row onRowClick={me.getRowClickHandler(i)} columns={me.getColumns(datum)} />
		};
		return (
			<table className="w3-table w3-hoverable">
				<thead>
					<tr className="w3-light-grey">
						<th>Id</th>
						<th>Last Name</th>
						<th>First Name</th>
					</tr>
				</thead>
				<tbody>{this.props.datums.map(createRow)}</tbody>
			</table>
		);
	}
});

module.exports = MyMatch;