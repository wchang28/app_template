(function(root, factory) {
	module.exports = factory();
})(this, function() {
	var React = require('react');
	var w3css = require('./w3css.js');
	var SuggestionRow = require('./suggestionRow.js');
	
	/*
	properties:
		1. query
		2. datums
		3. selectedIndex
		4. suggestionSelectedHandler(value)
	*/
	return React.createClass({
		render: function() {
			var styleTableHeaderRow = {color:'#000', backgroundColor:'#f1f1f1'};
			var headers = ['Id','Last Name','First Name'];
			var suggestionToColumns = (suggestion) => [suggestion.Id, suggestion.lastName, suggestion.firstName];
			var createHeader = (header, columnIndex) => <th key={columnIndex} style={w3css.getTdStyle(columnIndex)}>{header}</th>
			var createRow = (suggestion, i) => <SuggestionRow key={i} index={i} selected={this.props.selectedIndex==parseInt(i)} query={this.props.query} suggestionSelectedHandler={this.props.suggestionSelectedHandler} suggestion={suggestion} suggestionToColumns={suggestionToColumns}/>
			return (
				<table style={w3css.tableStyle}>
					<thead><tr style={styleTableHeaderRow}>{headers.map(createHeader)}</tr></thead>
					<tbody>{this.props.datums.map(createRow)}</tbody>
				</table>
			);
		}
	});
});