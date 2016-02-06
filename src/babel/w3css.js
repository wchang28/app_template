(function(root, factory) {
	module.exports = factory();
})(this, function() {
	var $ = require('jquery');
	function addStyle(srcStyle, newStyle) {return $.extend(true, {}, srcStyle, newStyle);}
	var ret = {};
	var baseStyle = {boxSizing:'border-box'};
	ret.tableStyle = addStyle(baseStyle, {display:'table',borderCollapse:'collapse',borderSpacing:'0',width:'100%'});
	var tdStyle = addStyle(baseStyle, {display:'table-cell',border:'none',paddingLeft:'8px',paddingTop:'6px',paddingBottom:'6px',paddingRight:'8px',textAlign:'left', verticalAlign:'top'});
	var firstTdStyle = addStyle(tdStyle, {paddingLeft:'16px'});
	ret.getTdStyle = function(columnIndex) {return (columnIndex == 0 ? firstTdStyle : tdStyle);};
	
	return ret;
});