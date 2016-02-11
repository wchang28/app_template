var express = require('express');
var bodyParser = require('body-parser');
var sse = require('sse-express');

var router = express.Router();
router.use(bodyParser.json({'limit': '100mb'}));

router.use(function (req, res, next) {
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.header('Expires', '-1');
	res.header('Pragma', 'no-cache');
	next();
});

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