const mysql = require('mysql2');
const fs = require('fs');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  multipleStatements: true
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL!");
  
  const initSql = fs.readFileSync('db.sql', 'utf8');
  
  connection.query(initSql, (err, results) => {
    if (err) {
        console.error("Error executing db.sql", err);
    } else {
        console.log("Database and tables created successfully.");
    }
    connection.end();
  });
});
