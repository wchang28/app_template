(function(root, factory) {
	module.exports = factory();
})(this, function() {
	var $ = require('jquery');
	var ret = {};
	ret.tableStyle = {borderCollapse: 'collapse', borderSpacing: '0'};
	var tdStyle = {border:'none', paddingLeft: '8px', paddingTop: '6px', paddingBottom: '6px', paddingRight: '8px', display:'table-cell',textAlign:'left', verticalAlign:'top'};
	var firstTdStyle = $.extend(true, {}, tdStyle);
	firstTdStyle.paddingLeft = '16px';
	ret.getTdStyle = function(columnIndex) {return (columnIndex == 0 ? firstTdStyle : tdStyle);};
	return ret;
});