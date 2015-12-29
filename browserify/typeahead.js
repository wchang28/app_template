var React = require('react');

var TypeAhead = React.createClass({
	getInitialState: function() {
		return {value: '', dropDownVisible: false};
	}
	,onDocumentClickHook: function() {this.closeDropDown();}
	,showDropDown: function() {
		this.setState({dropDownVisible: true});
		document.addEventListener('click', this.onDocumentClickHook);
	}
	,closeDropDown: function() {
		this.setState({dropDownVisible: false});
		document.removeEventListener('click', this.onDocumentClickHook);
	}
	,handleInputChange: function (event) {
		this.setState({value: event.target.value});
		if (event.target.value.length >= 3) {
			if (!this.state.dropDownVisible) this.showDropDown();
		} else {
			if (this.state.dropDownVisible) this.closeDropDown();
		}
	}
	,render: function() {
		var dropdownMenuStyle = (this.state.dropDownVisible ? {display: 'block', zIndex:'1'} : {display:'none',position:'absolute',margin:'0',padding:'0'});
		return React.createElement(
			'div'
			,null
			,React.createElement('input', {className: "w3-input w3-border", type: "text", value: this.state.value, onChange: this.handleInputChange})
			,React.createElement('div', {style: dropdownMenuStyle, className: "w3-card-2"}, React.createElement(this.props.matchClass, {match: this.state.value}))
		);
		/*
		return (
			<div>
				<input className="w3-input w3-border" type="text" value={this.state.value} onChange={this.handleInputChange}/>
				<div style={dropdownMenuStyle} className="w3-card-4">
					<p>Hi, This is Wen</p>
				</div>
			</div>
		);
		*/
	}
});

module.exports = TypeAhead;