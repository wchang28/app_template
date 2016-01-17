var React = require('react');

var Row = React.createClass({
	render: function() {
		var createColumn = (column, i) => <td key={i}>{column}</td>;
		return (
			<tr onClick={this.props.onRowClick}>{this.props.columns.map(createColumn)}</tr>
		);
	}
});

var MyMatch = React.createClass({
	getInitialState: function() {
		console.log('In MyMatch.getInitialState(' + this.props.query + ')');
		return {};
	}
	,componentWillReceiveProps: function(nextProps) {
		console.log('In MyMatch.componentWillReceiveProps(' + nextProps.query + ')');
	}
	,getRowClickHandler: function(datum) {
		return () => {
			this.props.dropdownItemSelectedHandler(datum.Id)
		};
	}
	,getColumns: function(datum) {
		return [datum.Id, this.props.query, datum.firstName];
	}
	,render: function() {
		var createRow = (datum) => <Row key={datum.Id} onRowClick={this.getRowClickHandler(datum)} columns={this.getColumns(datum)} />
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