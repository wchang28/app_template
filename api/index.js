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

module.exports = router;