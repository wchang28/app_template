var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
router.use(bodyParser.json({'limit': '100mb'}));

module.exports = router;