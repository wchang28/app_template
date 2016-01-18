(function(root, factory) {
	module.exports = factory();
})(this, function() {
	var React = require('react');
	/*
	properties:
		1. dropDownContentClass
		2. suggestionEngine
		3. onQueryChanged
	*/
	var TypeAhead = React.createClass({
		getInitialState: function() {
			return {value: '', dropDownVisible: false, datums:[]};
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
			this.notifyQueryChanged(value);
		}
		,notifyQueryChanged: function(value) {
			if (typeof this.props.onQueryChanged === 'function') this.props.onQueryChanged(value);
		}
		,getDropdownItemSelectedHandler: function () {
			return (selectedValue) => {
				this.setInputText(selectedValue);
			};
		}
		,handleInputChange: function (event) {
			var query = event.target.value;
			this.setInputText(query);
			var suggestionEngine = this.props.suggestionEngine;
			suggestionEngine.search(query, (datums) => {
				console.log('search result:');
				console.log(JSON.stringify(datums));
				this.setState({datums: datums});
			});
			if (query.length >= 3) {
				if (!this.state.dropDownVisible) this.showDropDown();
			} else {
				if (this.state.dropDownVisible) this.closeDropDown();
			}
		}
		,render: function() {
			var dropdownMenuStyle = (this.state.dropDownVisible ? {display: 'block', zIndex:'1'} : {display:'none',position:'absolute',margin:'0',padding:'0'});
			var dropdownContentElement = React.createElement(this.props.dropDownContentClass, {query: this.state.value, datums: this.state.datums, dropdownItemSelectedHandler: this.getDropdownItemSelectedHandler()});
			return (
				<div>
					<input className="w3-input w3-border" type="text" value={this.state.value} onChange={this.handleInputChange}/>
					<div style={dropdownMenuStyle} className="w3-card-2">
						{dropdownContentElement}
					</div>
				</div>
			);
		}
	});
	return TypeAhead;
});