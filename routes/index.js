var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'User list with Express, Jade, MongoDb, NodeJs' });
});

module.exports = router;
