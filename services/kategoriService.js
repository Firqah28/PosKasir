const db = require('../config/database');

exports.getAllKategori = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM kategori ORDER BY nama_kategori ASC", (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

exports.getKategoriById = (id) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM kategori WHERE id = ?", [id], (err, results) => {
            if (err) reject(err);
            else resolve(results[0] || null);
        });
    });
};

exports.createKategori = (data) => {
    return new Promise((resolve, reject) => {
        const { nama_kategori } = data;
        const query = "INSERT INTO kategori (nama_kategori) VALUES (?)";
        db.query(query, [nama_kategori], (err, result) => {
            if (err) reject(err);
            else resolve(result.insertId);
        });
    });
};

exports.updateKategori = (id, data) => {
    return new Promise((resolve, reject) => {
        const { nama_kategori } = data;
        const query = "UPDATE kategori SET nama_kategori = ? WHERE id = ?";
        db.query(query, [nama_kategori, id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

exports.deleteKategori = (id) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM kategori WHERE id = ?", [id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};
