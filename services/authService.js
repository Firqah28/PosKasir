const db = require('../config/database');

exports.authenticateUser = (username, password) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, results) => {
            if (err) reject(err);
            else resolve(results.length > 0 ? results[0] : null);
        });
    });
};
