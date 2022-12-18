var express = require('express');
var router = express.Router();
var db = require("../database.js");
var users = ["dpt"];
var pass = ["pass"];

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
    //res.render("attend", "End points are");
    //res.render("attend", "//api//students// To get lisying of all students");
  });

/* GET student listings. Using ES6 arrow functions instead of the common ES5 notation for functions callbacks*/
router.get("/api/students/", (req, res, next) => {
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
    /*Password control*/
    const reject = () => {
      res.setHeader("www-authenticate", "Basic");
      res.sendStatus(401);
    };

    const authorization = req.headers.authorization;

    if (!authorization) {
      return reject();
    }

    const [username, password] = Buffer.from(
      authorization.replace("Basic ", ""),
      "base64"
    )
    .toString()
    .split(":");

    if (!(users.includes(username) && pass.includes(password))) {
      return reject();
    }
    /*Password end*/
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
            //res.status(400).json({"error": err.message})
            //return;  //Either these 2 lines or the lines after work
            const err = new Error("Attendace could not be marked");
            err.status = 404;
            return next(err);
        } 
        /*res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })*/
        
        res.render("attend", {"date": today});
    });
  });

  //Retrieve attendance data using GET
  router.get("/api/getAttendance",(req, res, next) => {
    /*Password control*/
    const reject = () => {
        res.setHeader("www-authenticate", "Basic");
        res.sendStatus(401);
      };
    
      const authorization = req.headers.authorization;
    
      if (!authorization) {
        return reject();
      }
    
      const [username, password] = Buffer.from(
        authorization.replace("Basic ", ""),
        "base64"
      )
        .toString()
        .split(":");
    
      if (!(users.includes(username) && pass.includes(password))) {
        return reject();
      }
      /*Password end*/

    var sql ='SELECT attendance.id, student.name, COUNT(*) AS TotalClassesAttended FROM attendance RIGHT OUTER JOIN student where student.id=attendance.id GROUP BY attendance.id'
    var params =[]
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
        /*
        if(err){
          return next(err);
        }
        //Successful So render
        res.render("show_attendace",{dt: rows});*/ //The view does not work yet
        
      });
      
  });
  
  module.exports = router;
  