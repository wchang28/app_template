(function(root, factory) {
	module.exports = factory();
})(this, function() {
	var React = require('react');
	var ReactDOM = require('react-dom');
	
	var events = require('events');
	var EventEmitter = (events.EventEmitter ? events.EventEmitter : events);
	
	function BufferChanges() {
		EventEmitter.call(this);
		var me = this;
		var lastValue = null;
		var currentValue = null;
		var interval = null;
		function callBack() {
			if (lastValue != currentValue) {
				lastValue = currentValue;
				me.emit('change', currentValue);
			}				
		}
		this.init = function() {
			interval = setInterval(callBack,500);
		};
		this.done = function() {
			if (interval) clearInterval(interval);
		};
		this.setValue = function(value) {
			currentValue = value;
			if (lastValue === null) {
				lastValue = currentValue;
				this.emit('change', currentValue);
			}
		};
	}
	var util = require('util');
	util.inherits(BufferChanges, EventEmitter);

	/*
	properties:
		1. dropDownContentClass
		2. suggestionEngine
		3. dropdownSameWidthAsInput
		4. onQueryChanged: (value, suggestionSelected) => {}
		5. minCharToSearch
		6. identity: (datum) => string
		7. placeholder
		8. roundSize (small,medium,large,xxlarge,jumbo)
	*/
	var TypeAhead = React.createClass({
		getInitialState: function() {
			return {value: '', dropDownVisible: false, datums:[], selectedIndex: -1, inputWidth:200};
		}
		,getMinCharToSearch: function() {
			return (this.props.minCharToSearch ? this.props.minCharToSearch : 1);
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
		,setInputText: function(value, suggestionSelected) {
			this.setState({value: value});
			this.notifyQueryChanged(value, suggestionSelected);
		}
		,notifyQueryChanged: function(value, suggestionSelected) {
			if (typeof this.props.onQueryChanged === 'function') this.props.onQueryChanged(value, suggestionSelected);
		}
		,getSuggestionSelectedHandler: function () {
			return (datum) => {
				this.setInputText(this.props.identity(datum), true);
			};
		}
		,doSearch: function(query) {
			if (query.length >= this.getMinCharToSearch()) {
				var suggestionEngine = this.props.suggestionEngine;
				suggestionEngine.search(query, (datums) => {
					//console.log('query='+query+',search result:');
					//console.log(JSON.stringify(datums));
					this.setState({datums: datums});
				});
			}
		}
		,calcInputControlWidth: function() {
			var inputWidth = ReactDOM.findDOMNode(this.refs.input).offsetWidth;
			//console.log('inputWidth=' + inputWidth);
			this.setState({inputWidth: inputWidth});
		}
		,handleWindowResize: function(event ) {
			this.calcInputControlWidth();
		}
		,changeBuffer: new BufferChanges()
		,componentDidMount: function() {
			//console.log('componentDidMount()');
			this.changeBuffer.init();
			this.changeBuffer.on('change', (query) => {this.doSearch(query);});
			window.addEventListener( "resize", this.handleWindowResize );
			this.calcInputControlWidth();
		}
		,componentWillUnmount: function() {
			this.changeBuffer.done();
			 window.removeEventListener( "resize", this.handleWindowResize );
		}
		,handleInputChange: function (event) {
			var query = event.target.value;
			this.setInputText(query, false);
			this.setState({datums: [], selectedIndex: -1});
			this.changeBuffer.setValue(query);
			//this.doSearch(query);
			if (query.length >= this.getMinCharToSearch()) {
				if (!this.state.dropDownVisible) this.showDropDown();
			} else {
				if (this.state.dropDownVisible) this.closeDropDown();
			}
		}
		,onInputKeyDown: function(e) {
			if (e.keyCode == 38) {	// up arrow key
				if (this.state.datums.length == 0)
					this.setState({selectedIndex: -1});
				else {
					var selectedIndex = this.state.selectedIndex;
					if (selectedIndex == -1 || selectedIndex == 0)
						selectedIndex = this.state.datums.length-1;
					else
						selectedIndex--;
					this.setState({selectedIndex: selectedIndex});
					if (selectedIndex>=0 && selectedIndex<this.state.datums.length)	this.setInputText(this.props.identity(this.state.datums[selectedIndex]), false);
				}
				e.preventDefault();
			}
			else if (e.keyCode == 40) {	// down arrow key
				if (this.state.datums.length == 0)
					this.setState({selectedIndex: -1});
				else {
					var selectedIndex = this.state.selectedIndex;
					if (selectedIndex == -1 || selectedIndex == this.state.datums.length-1)
						selectedIndex = 0;
					else
						selectedIndex++;
					this.setState({selectedIndex: selectedIndex});
					if (selectedIndex>=0 && selectedIndex<this.state.datums.length)	this.setInputText(this.props.identity(this.state.datums[selectedIndex]), false);
				}
				e.preventDefault();
			}
			else if (e.keyCode == 13) { // enter key
				if (this.state.dropDownVisible) this.closeDropDown();
				var selectedIndex = this.state.selectedIndex;
				if (selectedIndex>=0 && selectedIndex<this.state.datums.length)	this.setInputText(this.props.identity(this.state.datums[selectedIndex]), true);
				e.preventDefault();
			}
		}
		,render: function() {
			var styleParent = {position:'relative', width: '100%'};
			var roundSize = (this.props.roundSize ? this.props.roundSize : '');
			var classInput = "w3-input w3-border";
			var classSuggestionMenu = "w3-card-2";
			if (roundSize !== '') { 
				classInput += " w3-round-" + roundSize;
				classSuggestionMenu += " w3-round-" + roundSize;
			}
			var dropdownMenuStyle = {backgroundColor:'#fff', display:'none',position:'absolute',margin:'0',padding:'0'};
			if (this.state.dropDownVisible) {
				dropdownMenuStyle.display = 'block';
				dropdownMenuStyle.zIndex = '1';
				if (typeof this.props.dropdownSameWidthAsInput != "boolean" || this.props.dropdownSameWidthAsInput)
					dropdownMenuStyle.width = this.state.inputWidth.toString() + 'px';
			}
			var dropdownContentElement = React.createElement(this.props.dropDownContentClass, {query: this.state.value, datums: this.state.datums, selectedIndex: this.state.selectedIndex, suggestionSelectedHandler: this.getSuggestionSelectedHandler()});
			return (
				<div style={styleParent}>
					<input ref="input" className={classInput} type="text" placeholder={this.props.placeholder} value={this.state.value} onChange={this.handleInputChange} onKeyDown={this.onInputKeyDown}/>
					<div style={dropdownMenuStyle} className={classSuggestionMenu}>
						{dropdownContentElement}
					</div>
				</div>
			);
		}
	});
	return TypeAhead;
});