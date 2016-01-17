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
	,setInputText: function(value) {
		this.setState({value: value});
	}
	,getDropdownItemSelectedHandler: function () {
		var me = this;
		return (function(value) {
			alert("selected: " + value);
		});
	}
	,handleInputChange: function (event) {
		var query = event.target.value;
		this.setInputText(query);
		var suggestionEngine = this.props.suggestionEngine;
		suggestionEngine.search(query, function(datums) {
			console.log(JSON.stringify(datums));
		});
		if (query.length >= 3) {
			if (!this.state.dropDownVisible) this.showDropDown();
		} else {
			if (this.state.dropDownVisible) this.closeDropDown();
		}
	}
	,render: function() {
		var datums =
		[
			{"Id": 1, "firstName": "Wen"}
			,{"Id": 2, "firstName": "Elva"}
			,{"Id": 3, "firstName": "Winston"}
			,{"Id": 4, "firstName": "Evelyn"}
		]
		var dropdownMenuStyle = (this.state.dropDownVisible ? {display: 'block', zIndex:'1'} : {display:'none',position:'absolute',margin:'0',padding:'0'});
		var dropdownContentElement = React.createElement(this.props.matchClass, {match: this.state.value, datums: datums, dropdownItemSelectedHandler: this.getDropdownItemSelectedHandler()});
		var dropdownMenuElement = React.createElement('div', {style: dropdownMenuStyle, className: "w3-card-2"}, dropdownContentElement);
		return React.createElement(
			'div'
			,null
			,React.createElement('input', {className: "w3-input w3-border", type: "text", value: this.state.value, onChange: this.handleInputChange})
			,dropdownMenuElement
		);
	}
});

module.exports = TypeAhead;