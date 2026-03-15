const mysql = require('mysql2');

// membuat koneksi database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pos_db'
});

// cek koneksi
db.connect((err) => {
    if (err) {
        console.log('Database connection failed:', err);
        return;
    }
    console.log('Database connected');
});

module.exports = db;