var http = require('http');
var https = require('https');
var express = require('express');
var path = require('path');
var app = express();

app.use('/public', express.static(path.join(__dirname, 'public')));

var server = http.createServer(app);

var secure_http = false;
var port = 80;
var host = '127.0.0.1';

server.listen(port, host, function() { 
	var host = server.address().address; 
	var port = server.address().port; 
	console.log('application listening at %s://%s:%s', (secure_http ? 'https' : 'http'), host, port); 
}); 
