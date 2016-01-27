(function(root, factory) {
	module.exports = factory();
})(this, function() {
	var React = require('react');
	/*
	properties:
		1. query
		2. rowValues - array
		3. onRowClick()
	*/
	var Row = React.createClass({
		chop: function(v, keyword, index) {
			var wrap = (t, index, bold) => <span key={index} style={bold?{fontWeight: 'bold'}:null}>{t}</span>
			if (v === '') return [wrap(v, index)];
			var	regexp = new RegExp(keyword, 'i');
			var mark = v.search(regexp);
			var len = keyword.length;
			if (mark === -1) {
				return [wrap(v, index)];
			} else {
				return [].concat(
					wrap(v.substr(0, mark), index, false),
					wrap(v.substr(mark, len), index+1, true),
					this.chop(v.substr(mark + len), keyword, index+2)
				);
			}			
		}
		,render: function() {
			var createCell = (cellValue, columnIndex) => <td key={columnIndex}>{this.chop(cellValue, this.props.query, 0)}</td>;
			//var createCell = (cellValue, columnIndex) => <td key={columnIndex}>{cellValue}</td>;
			return (
				<tr onClick={this.props.onRowClick}>{this.props.rowValues.map(createCell)}</tr>
			);
		}
	});
	/*
	properties:
		1. query
		2. datums
		3. dropdownItemSelectedHandler(value)
	*/
	var MyMatch = React.createClass({
		getRowClickHandler: function(datum) {
			return () => {
				var rowSelectedHandler = this.props.dropdownItemSelectedHandler;
				if (typeof rowSelectedHandler === 'function') rowSelectedHandler(datum.Id);
			};
		}
		,getRowValues: function(datum) {
			return [datum.Id, datum.lastName, datum.firstName];
		}
		,render: function() {
			var createRow = (datum, i) => <Row key={i} query={this.props.query} onRowClick={this.getRowClickHandler(datum)} rowValues={this.getRowValues(datum)} />
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