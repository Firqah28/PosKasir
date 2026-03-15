const db = require('../config/database');

exports.createTransaksi = (data) => {
    return new Promise((resolve, reject) => {
        const { user_id, total_harga, bayar, kembalian, items } = data;
        
        db.beginTransaction((err) => {
            if (err) return reject(err);

            const queryTransaksi = "INSERT INTO transaksi (user_id, total_harga, bayar, kembalian) VALUES (?, ?, ?, ?)";
            db.query(queryTransaksi, [user_id, total_harga, bayar, kembalian], (err, result) => {
                if (err) {
                    return db.rollback(() => reject(err));
                }

                const transaksiId = result.insertId;
                const detailValues = items.map(item => [transaksiId, item.barang_id, item.qty, item.harga_jual, item.subtotal]);
                
                const queryDetail = "INSERT INTO detail_transaksi (transaksi_id, barang_id, qty, harga_jual, subtotal) VALUES ?";
                db.query(queryDetail, [detailValues], (err) => {
                    if (err) {
                        return db.rollback(() => reject(err));
                    }

                    // Update stock for each item
                    let processed = 0;
                    items.forEach(item => {
                        const queryStock = "UPDATE barang SET stok = stok - ? WHERE id = ?";
                        db.query(queryStock, [item.qty, item.barang_id], (err) => {
                            if (err) {
                                return db.rollback(() => reject(err));
                            }
                            processed++;
                            if (processed === items.length) {
                                db.commit((err) => {
                                    if (err) {
                                        return db.rollback(() => reject(err));
                                    }
                                    resolve({ transaksiId, total_harga });
                                });
                            }
                        });
                    });
                });
            });
        });
    });
};

exports.getTransaksiHistory = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM transaksi ORDER BY created_at DESC", (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};
