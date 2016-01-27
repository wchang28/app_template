(function(root, factory) {
	module.exports = factory();
})(this, function() {
	var React = require('react');
	/*
	properties:
		1. query
		2. datum - string
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
			return (
				<tr onClick={this.props.onRowClick}><td>{this.chop(this.props.suggestion, this.props.query, 0)}</td></tr>
			);
		}
	});
	/*
	properties:
		1. query
		2. datums
		3. dropdownItemSelectedHandler(value)
	*/
	var AddressMatch = React.createClass({
		getRowClickHandler: function(suggestion) {
			return () => {
				var rowSelectedHandler = this.props.dropdownItemSelectedHandler;
				if (typeof rowSelectedHandler === 'function') rowSelectedHandler(suggestion);
			};
		}
		,render: function() {
			var createRow = (suggestion, i) => <Row key={i} query={this.props.query} onRowClick={this.getRowClickHandler(suggestion)} suggestion={suggestion} />
			return (
				<table className="w3-table w3-hoverable">
					<tbody>{this.props.datums.map(createRow)}</tbody>
				</table>
			);
		}
	});
	return AddressMatch;
});