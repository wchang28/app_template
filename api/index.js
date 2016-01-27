var express = require('express');
var bodyParser = require('body-parser');
var sse = require('sse-express');

var router = express.Router();
router.use(bodyParser.json({'limit': '100mb'}));

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
var url = require('url');

router.get('/get_suggestion', function(req, res) {
	var url_parts = url.parse(req.url, true);
	var queryString = url_parts.query.queryString;
	console.log('queryString='+queryString);
	$.get('http://127.0.0.1/client/query/?queryString='+encodeURIComponent(queryString), function(data){
		res.jsonp(JSON.parse(data));
	});
});

module.exports = router;