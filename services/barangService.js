const db = require('../config/database');

exports.getAllBarang = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT b.*, k.nama_kategori, s.nama_supplier 
            FROM barang b
            LEFT JOIN kategori k ON b.kategori_id = k.id
            LEFT JOIN supplier s ON b.supplier_id = s.id
            ORDER BY b.nama_barang ASC
        `;
        db.query(query, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

exports.getBarangByBarcode = (barcode) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT b.*, k.nama_kategori, s.nama_supplier 
            FROM barang b
            LEFT JOIN kategori k ON b.kategori_id = k.id
            LEFT JOIN supplier s ON b.supplier_id = s.id
            WHERE b.barcode = ?
        `;
        db.query(query, [barcode], (err, results) => {
            if (err) reject(err);
            else resolve(results[0] || null);
        });
    });
};

exports.createBarang = (data) => {
    return new Promise((resolve, reject) => {
        let { barcode, nama_barang, kategori_id, supplier_id, harga_beli, harga_jual, stok, satuan } = data;
        barcode = barcode ? barcode.trim() : null;
        
        // Convert to null if empty strings
        kategori_id = kategori_id ? parseInt(kategori_id) : null;
        supplier_id = supplier_id ? parseInt(supplier_id) : null;

        const query = "INSERT INTO barang (barcode, nama_barang, kategori_id, supplier_id, harga_beli, harga_jual, stok, satuan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(query, [barcode, nama_barang, kategori_id, supplier_id, harga_beli, harga_jual, stok, satuan], (err, result) => {
            if (err) reject(err);
            else resolve(result.insertId);
        });
    });
};

exports.updateBarang = (id, data) => {
    return new Promise((resolve, reject) => {
        let { barcode, nama_barang, kategori_id, supplier_id, harga_beli, harga_jual, stok, satuan } = data;
        barcode = barcode ? barcode.trim() : null;
        
        // Convert to null if empty strings
        kategori_id = kategori_id ? parseInt(kategori_id) : null;
        supplier_id = supplier_id ? parseInt(supplier_id) : null;

        const query = "UPDATE barang SET barcode = ?, nama_barang = ?, kategori_id = ?, supplier_id = ?, harga_beli = ?, harga_jual = ?, stok = ?, satuan = ? WHERE id = ?";
        db.query(query, [barcode, nama_barang, kategori_id, supplier_id, harga_beli, harga_jual, stok, satuan, id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

exports.deleteBarang = (id) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM barang WHERE id = ?", [id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};
