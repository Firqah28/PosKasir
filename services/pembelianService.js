const db = require('../config/database');

exports.createPembelian = (data) => {
    return new Promise((resolve, reject) => {
        const { user_id, supplier_id, total_harga, items } = data;
        
        db.beginTransaction((err) => {
            if (err) return reject(err);

            // 1. Insert into pembelian header
            const queryPembelian = "INSERT INTO pembelian (user_id, supplier_id, total_harga) VALUES (?, ?, ?)";
            db.query(queryPembelian, [user_id, supplier_id, total_harga], (err, result) => {
                if (err) {
                    return db.rollback(() => reject(err));
                }

                const pembelianId = result.insertId;
                
                // 2. Insert into detail_pembelian
                // Ensure array shape matches VALUES (?,?,?,?,?)
                const detailValues = items.map(item => [pembelianId, item.barang_id, item.harga_beli, item.qty, item.subtotal]);
                
                const queryDetail = "INSERT INTO detail_pembelian (pembelian_id, barang_id, harga_beli, qty, subtotal) VALUES ?";
                db.query(queryDetail, [detailValues], (err) => {
                    if (err) {
                        return db.rollback(() => reject(err));
                    }

                    // 3. Update stok for each item in barang table
                    let processed = 0;
                    items.forEach(item => {
                        const queryStock = "UPDATE barang SET stok = stok + ?, harga_beli = ? WHERE id = ?";
                        db.query(queryStock, [item.qty, item.harga_beli, item.barang_id], (err) => {
                            if (err) {
                                return db.rollback(() => reject(err));
                            }
                            processed++;
                            if (processed === items.length) {
                                // All stock updated, commit transaction
                                db.commit((err) => {
                                    if (err) {
                                        return db.rollback(() => reject(err));
                                    }
                                    resolve({ pembelianId, total_harga });
                                });
                            }
                        });
                    });
                });
            });
        });
    });
};

exports.getPembelianHistory = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT p.*, u.username, s.nama_supplier
            FROM pembelian p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN supplier s ON p.supplier_id = s.id
            ORDER BY p.created_at DESC
        `;
        db.query(query, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

exports.getPembelianDetail = (pembelianId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT dp.*, b.nama_barang
            FROM detail_pembelian dp
            LEFT JOIN barang b ON dp.barang_id = b.id
            WHERE dp.pembelian_id = ?
        `;
        db.query(query, [pembelianId], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};
