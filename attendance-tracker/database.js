var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "geom3003attendance";


//Table creation and data entry is done only once
let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE student (
            id INTEGER PRIMARY KEY,
            name text, 
            email text UNIQUE,
            CONSTRAINT email_unique UNIQUE (email)
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                console.log('Student table created.');
                // Table just created, creating some rows
                var insert = 'INSERT INTO student (id, name, email) VALUES (?,?,?)'
                db.run(insert, [1, "admin","admin@example.com"])
                db.run(insert, [2, "Dipto Sarkar","dipto.sarkar@carleton.ca"])
            }
        });  
        //Add table for attendance
        db.run(`CREATE TABLE attendance (
            id INTEGER NOT NULL,
            date text, 
            attendance Boolean DEFAULT TRUE,
            FOREIGN KEY(id) REFERENCES student(id)
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created
                console.log('Attendance table created.');
            }
        });  
    }
});


module.exports = db