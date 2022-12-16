var express = require('express');
var router = express.Router();
var db = require("../database.js");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET cool listing. */
router.get('/cool', function(req, res, next) {
  res.send('You are so cool!');
});

/* GET uncool listing. */
router.get('/uncool', function(req, res, next) {
  res.send('Why be unchill. Be hot!');
});


module.exports = router;
