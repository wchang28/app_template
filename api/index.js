var router = require('json-api-router');
var sse = require('sse-express');

// server side events streaming
router.get('/event_stream', sse(function(req, res) {
	var interval = setInterval(function() {
		res.sseSend({'event': 'ERROR', 'content': {'exception':'something is wrong'}});
	}, 3000);
	return interval;
}, function(req, res, interval) {
	clearInterval(interval);
	console.log('client closes sse streaming connection');
}));

var $ = require('jquery-no-dom');

router.get('/get_suggestion', function(req, res) {
	var queryString = req.query.q;
	console.log('queryString='+queryString);
	$.getJSON('http://127.0.0.1/client/query/',{q: queryString}, function(data){
		res.jsonp(data);
	});
});

module.exports = router;