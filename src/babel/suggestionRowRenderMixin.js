(function(root, factory) {
	module.exports = factory();
})(this, function() {
	var React = require('react');
	/*
	properties:
		1. suggestion - datum
		2. selected - true/false
		3. suggestionSelectedHandler(suggestion)
		
	derived class MUST implement:
		createRowContent()
	*/
	return {
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
		,render: function() {
			var rowStyle = (this.props.selected || this.state.mouseInside ? {backgroundColor:'#f1f1f1'} : null);
			return (
				<tr style={rowStyle} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} onClick={(e) => {this.props.suggestionSelectedHandler(this.props.suggestion);}}>{this.createRowContent()}</tr>
			);
		}
	};
});