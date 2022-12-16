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

/* GET student listings. Using ES6 arrow functions instead of the common ES5 notation for functions callbacks*/
router.get("/api/students", (req, res, next) => {
  var sql = "select * from student"
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows,
          "count": rows.length
      })
    });
});


module.exports = router;
