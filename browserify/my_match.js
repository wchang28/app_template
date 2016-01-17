(function(root, factory) {
	module.exports = factory();
})(this, function() {
	var React = require('react');

	var Row = React.createClass({
		render: function() {
			var createCell = (cellValue, columnIndex) => <td key={columnIndex}>{cellValue}</td>;
			return (
				<tr onClick={this.props.onRowClick}>{this.props.rowValues.map(createCell)}</tr>
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
		,getRowValues: function(datum) {
			return [datum.Id, this.props.query, datum.firstName];
		}
		,render: function() {
			var createRow = (datum) => <Row key={datum.Id} onRowClick={this.getRowClickHandler(datum)} rowValues={this.getRowValues(datum)} />
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
	return MyMatch;
});