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
			var suggestionToColumns = (suggestion) => [suggestion];
			var createRow = (suggestion, i) => <SuggestionRow key={i} index={i} selected={this.props.selectedIndex==parseInt(i)} query={this.props.query} suggestionSelectedHandler={this.props.suggestionSelectedHandler} suggestion={suggestion} suggestionToColumns={suggestionToColumns}/>
			return (
				<table style={w3css.tableStyle}>
					<tbody>{this.props.datums.map(createRow)}</tbody>
				</table>
			);
		}
	});
});