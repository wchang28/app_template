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
		wrap: function (t, bold) {
			var style = (bold ? {fontWeight: 'bold'} : null);
			return <span style={style}>{t}</span>;
		}
		chop: function(v, i) {
			var
				regexp = new RegExp(i, 'i'),
				mark = v.search(regexp),
				len = i.length;
			if (mark === -1) {
				return [this.wrap(v)];
			} else {
				var ret = [];
				if (mark > 0) ret.push(this.wrap(v.substr(0, mark), false));
				ret.push(this.wrap(v.substr(mark, len), true));
				if (mark + len < v.length) ret.push(this.chop(v.substr(mark + len), i));
				return ret;
			}			
		}
		,render: function() {
			var createCell = (cellValue, columnIndex) => <td key={columnIndex}>{this.chop(cellValue, this.props.query)}</td>;
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
		getInitialState: function() {
			console.log('In MyMatch.getInitialState(' + this.props.query + ')');
			return {};
		}
		,componentWillReceiveProps: function(nextProps) {
			console.log('In MyMatch.componentWillReceiveProps(' + nextProps.query + ')');
		}
		,getRowClickHandler: function(datum) {
			return () => {
				var rowSelectedHandler = this.props.dropdownItemSelectedHandler;
				if (typeof rowSelectedHandler === 'function') rowSelectedHandler(datum.Id);
			};
		}
		,getRowValues: function(datum) {
			return [datum.Id, datum.lastName, datum.firstName];
		}
		,render: function() {
			var createRow = (datum) => <Row key={datum.Id} query={this.props.query} onRowClick={this.getRowClickHandler(datum)} rowValues={this.getRowValues(datum)} />
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