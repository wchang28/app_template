(function(root, factory) {
	module.exports = factory();
})(this, function() {
	var React = require('react');
	var ReactDOM = require('react-dom');
	
	var Button = React.createClass({
		getInitialState: () => ({focus: false})
		,onBlur: function(e) {
			console.log('leave focus');
			this.setState({focus: false});
			if (typeof this.props.onBlur === 'function') this.props.onBlur(e);
		}
		,onFocus: function() {
			console.log('enter focus');
			this.setState({focus: true});
			if (typeof this.props.onFocus === 'function') this.props.onFocus(e);
		}
		,render: function() {
			var color = (this.state.focus ? '#87CEEB' : '#ccc');
			var borderWidth = (this.state.focus ? 2 : 1);
			var style = {border: borderWidth.toString() + 'px solid ' + color};
			return (
				<button className='w3-btn w3-white w3-round-medium' style={style} onBlur={this.onBlur} onFocus={this.onFocus} onKeyDown={this.props.onKeyDown} onClick={this.props.onClick}>{this.props.text}</button>
			);
		}
	});
	return React.createClass({
		getInitialState: () => ({username: '', password: '', errorMsg: null})
		,userNameChangeHandler: function(e) {this.setState({username: e.target.value, errorMsg: null});}
		,passwordChangeHandler: function(e) {this.setState({password: e.target.value, errorMsg: null});}
		,triggerLogin: function() {if (typeof this.props.onLogin == 'function') this.props.onLogin(this.state.username, this.state.password);}
		,validateInputs: function() {
			if (this.state.username === '') {
				this.setState({errorMsg: 'Bad user name !'});
				if (this._usernameCtrl) this._usernameCtrl.focus();
			}
			else if (this.state.password === '') {
				this.setState({errorMsg: 'Bad password !'});
				if (this._passwordCtrl) this._passwordCtrl.focus();
			} else
				this.triggerLogin();
		}
		,onKeyDown: function (e) {
			if (e.keyCode == 13)
				this.validateInputs();
		}
		,render: function() {
			var errorBoxStyle = {display: (this.state.errorMsg ? 'block' : 'none'), border:'1px solid #f44336', color:'#f44336'};
			var containerStyle = {paddingBottom:'8px'};
			return (
				<div style={{width:'400px'}}>
					<div className="w3-border w3-round-medium">
						<div className="w3-container w3-border-bottom"><h6><span style={{fontWeight: 'bold'}}>Login</span></h6></div>
						<div className="w3-container" style={containerStyle}>
							<p><input className="w3-input w3-border w3-round-medium" ref={(c) => this._usernameCtrl = c} type="text" placeholder="Type user name here" value={this.state.username} onKeyDown={this.onKeyDown} onChange={this.userNameChangeHandler}/></p>
							<p><input className="w3-input w3-border w3-round-medium" ref={(c) => this._passwordCtrl = c} type="password" placeholder="Type password here" value={this.state.password} onKeyDown={this.onKeyDown} onChange={this.passwordChangeHandler}/></p>
							<p><div className="w3-container w3-round-medium w3-padding-8" style={errorBoxStyle}>{this.state.errorMsg}</div></p>
							<p><div className="w3-right"><Button onKeyDown={this.onKeyDown} onClick={this.validateInputs} text="Login"/></div></p>
						</div>
					</div>
				</div>
			);
		}
	});
});
