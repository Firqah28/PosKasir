const db = require('../config/database');

exports.getAllSupplier = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM supplier ORDER BY nama_supplier ASC", (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

exports.getSupplierById = (id) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM supplier WHERE id = ?", [id], (err, results) => {
            if (err) reject(err);
            else resolve(results[0] || null);
        });
    });
};

exports.createSupplier = (data) => {
    return new Promise((resolve, reject) => {
        const { nama_supplier, kontak, alamat } = data;
        const query = "INSERT INTO supplier (nama_supplier, kontak, alamat) VALUES (?, ?, ?)";
        db.query(query, [nama_supplier, kontak, alamat], (err, result) => {
            if (err) reject(err);
            else resolve(result.insertId);
        });
    });
};

exports.updateSupplier = (id, data) => {
    return new Promise((resolve, reject) => {
        const { nama_supplier, kontak, alamat } = data;
        const query = "UPDATE supplier SET nama_supplier = ?, kontak = ?, alamat = ? WHERE id = ?";
        db.query(query, [nama_supplier, kontak, alamat, id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

exports.deleteSupplier = (id) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM supplier WHERE id = ?", [id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};
