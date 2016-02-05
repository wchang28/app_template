(function(root, factory) {
	module.exports = factory();
})(this, function() {
	var React = require('react');
	var w3css = require('./w3css.js');
	var RowRenderMixin = require('./suggestionRowRenderMixin.js');
	
	/*
	properties:
		1. suggestion - datum
		2. selected - true/false
		3. suggestionSelectedHandler(suggestion)
		4. query - string
		5. suggestionToColumns - (suggestion) => [columns]
	*/
	return React.createClass({
		mixins: [RowRenderMixin] // Use the mixin
		,createRowContent: function () {
			var suggestion = this.props.suggestion;
			var rowValues = this.props.suggestionToColumns(suggestion);
			var createCell = (cellValue, columnIndex) => <td key={columnIndex} style={w3css.getTdStyle(columnIndex)}>{this.chop(cellValue.toString(), this.props.query, 0)}</td>;
			//var createCell = (cellValue, columnIndex) => <td key={columnIndex} style={w3css.getTdStyle(columnIndex)}>{cellValue.toString()}</td>;
			return rowValues.map(createCell);
		}
	});
});