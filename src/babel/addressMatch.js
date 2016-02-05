(function(root, factory) {
	module.exports = factory();
})(this, function() {
	var React = require('react');
	
	var tdStyle = {border:'none', paddingLeft: '8px', paddingTop: '6px', paddingBottom: '6px', paddingRight: '8px', display:'table-cell',textAlign:'left', verticalAlign:'top'};
	var firstTdStyle = {};
	for (var i in tdStyle)
		firstTdStyle[i] = tdStyle[i];
	firstTdStyle.paddingLeft = '16px';
	
	/*
	properties:
		1. query - string
		2. suggestion - string
		3. selected -true/false
		4. suggestionSelectedHandler(suggestion)
		5. index - row index
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
			var createCell = (cellValue, columnIndex) => <td key={columnIndex} style={columnIndex==0 ? firstTdStyle : tdStyle}>{this.chop(cellValue.toString(), this.props.query, 0)}</td>;
			//var createCell = (cellValue, columnIndex) => <td key={columnIndex}>{cellValue.toString()}</td>;
			return rowValues.map(createCell);
		}
		,render: function() {
			var rowStyle = (this.props.selected || this.state.mouseInside ? {backgroundColor:'#f1f1f1'} : null);
			return (
				<tr style={rowStyle} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} onClick={(e) => {this.props.suggestionSelectedHandler(this.props.suggestion);}}>{this.createRowColumns()}</tr>
			);
		}
	});
	/*
	properties:
		1. query
		2. datums
		3. selectedIndex
		4. suggestionSelectedHandler(value)
	*/
	var MatchContent = React.createClass({
		render: function() {
			var tableStyle = {borderCollapse: 'collapse', borderSpacing: '0'};
			var createRow = (suggestion, i) => <Row key={i} index={i} selected={this.props.selectedIndex==parseInt(i)} query={this.props.query} suggestionSelectedHandler={this.props.suggestionSelectedHandler} suggestion={suggestion} />
			return (
				<table style={tableStyle}>
					<tbody>{this.props.datums.map(createRow)}</tbody>
				</table>
			);
		}
	});
	return MatchContent;
});