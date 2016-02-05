(function(root, factory) {
	module.exports = factory();
})(this, function() {
	var React = require('react');
	var w3css = require('./w3css.js');
	/*
	properties:
		1. query - string
		2. suggestion - datum
		3. selected - true/false
		4. suggestionSelectedHandler(suggestion)
		5. index - row index
		6. suggestionToColumns - (suggestion) => [columns]
	*/
	return React.createClass({
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
		,createRowColumns: function () {
			var suggestion = this.props.suggestion;
			var rowValues = this.props.suggestionToColumns(suggestion);
			var createCell = (cellValue, columnIndex) => <td key={columnIndex} style={w3css.getTdStyle(columnIndex)}>{this.chop(cellValue.toString(), this.props.query, 0)}</td>;
			//var createCell = (cellValue, columnIndex) => <td key={columnIndex} style={w3css.getTdStyle(columnIndex)}>{cellValue.toString()}</td>;
			return rowValues.map(createCell);
		}
		,render: function() {
			var rowStyle = (this.props.selected || this.state.mouseInside ? {backgroundColor:'#f1f1f1'} : null);
			return (
				<tr style={rowStyle} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} onClick={(e) => {this.props.suggestionSelectedHandler(this.props.suggestion);}}>{this.createRowColumns()}</tr>
			);
		}
	});
});