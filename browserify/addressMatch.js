(function(root, factory) {
	module.exports = factory();
})(this, function() {
	var React = require('react');
	/*
	properties:
		1. query
		2. suggestion - string
		3. selected
		3. onRowClick()
	*/
	var Row = React.createClass({
		getInitialState: function() {
			return {mouseInside: false};
		}		
		,chop: function(v, keyword, index) {
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
		,onMouseEnter: function() {
			this.setState({mouseInside: true});
		}
		,onMouseLeave: function() {
			this.setState({mouseInside: false});
		}
		,createRowColumns: function() {
			var suggestion = this.props.suggestion;
			var rowValues = [suggestion];
			var createCell = (cellValue, columnIndex) => <td key={columnIndex}>{this.chop(cellValue.toString(), this.props.query, 0)}</td>;
			//var createCell = (cellValue, columnIndex) => <td key={columnIndex}>{cellValue.toString()}</td>;
			return rowValues.map(createCell);
		}
		,render: function() {
			var rowStyle = (this.props.selected || this.state.mouseInside ? {backgroundColor:'#f1f1f1'} : null);
			return (
				<tr style={rowStyle} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} onClick={this.props.onRowClick}>{this.createRowColumns()}</tr>
			);
		}
	});
	/*
	properties:
		1. query
		2. datums
		3. selectedIndex
		4. dropdownItemSelectedHandler(value)
	*/
	var MatchContent = React.createClass({
		getRowClickHandler: function(suggestion) {
			return () => {
				var rowSelectedHandler = this.props.dropdownItemSelectedHandler;
				if (typeof rowSelectedHandler === 'function') rowSelectedHandler(suggestion);
			};
		}
		,render: function() {
		var createRow = (suggestion, i) => <Row key={i} index={i} selected={this.props.selectedIndex==parseInt(i)} query={this.props.query} onRowClick={this.getRowClickHandler(suggestion)} suggestion={suggestion} />
			return (
				<table className="w3-table">
					<tbody>{this.props.datums.map(createRow)}</tbody>
				</table>
			);
		}
	});
	return MatchContent;
});