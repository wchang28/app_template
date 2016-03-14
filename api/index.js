var router = require('json-api-router')();
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

router.post('/get_suggestion', function(req, res) {
	var data = req.body;
	console.log(JSON.stringify(data));
	$.ajax({
		type: "POST",
		url: 'http://127.0.0.1/client/query/',
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		dataType: "json"
	}).done(function(data) {
		console.log('I am here ' + JSON.stringify(data));
		res.jsonp(data);
	}).fail(function(err){
		res.jsonp([]);
	});
});

module.exports = router;