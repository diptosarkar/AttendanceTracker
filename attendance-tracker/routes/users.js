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

/*Add new users using POST*/
router.post("/api/students/", (req, res, next) => {
    var errors=[]
    if (!req.body.id){
        errors.push("No id specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (!req.body.name){
      errors.push("No name specified");
  }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        name: req.body.name,
        email: req.body.email
    }
    var sql ='INSERT INTO student (id, name, email) VALUES (?,?,?)'
    var params =[data.id, data.name, data.email]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

//Update user using PATCH
router.patch("/api/students/:id", (req, res, next) => {
  var data = {
      name: req.body.name,
      email: req.body.email
  }
  db.run(
      `UPDATE student set 
         name = COALESCE(?,name), 
         email = COALESCE(?,email) 
         WHERE id = ?`,
      [data.name, data.email, req.params.id],
      function (err, result) {
          if (err){
              res.status(400).json({"error": res.message})
              return;
          }
          res.json({
              message: "success",
              data: data,
              changes: this.changes
          })
  });
})

//Delete user using DELETE
router.delete("/api/students/:id", (req, res, next) => {
  db.run(
      'DELETE FROM student WHERE id = ?',
      req.params.id,
      function (err, result) {
          if (err){
              res.status(400).json({"error": res.message})
              return;
          }
          res.json({"message":"deleted", changes: this.changes})
  });
})

//Mark attendance using GET
router.get("/api/attend/:id", (req, res, next) => {
  var now = new Date();
  var today = now.toISOString();
  var data = {
      id: req.params.id,
      date: today,
      attend: 'TRUE'
  }
  var sql ='INSERT INTO attendance (id, date, attendance) VALUES (?,?,?)'
  var params =[data.id, data.date, data.attend]
  db.run(sql, params, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return;
      }
      res.json({
          "message": "success",
          "data": data,
          "id" : this.lastID
      })
  });
});

module.exports = router;
