const db = require('../config/database');

exports.getLaporanHarian = (startDate, endDate) => {
    return new Promise((resolve, reject) => {
        let whereClause = "";
        let params = [];
        if (startDate && endDate) {
            whereClause = "WHERE DATE(created_at) BETWEEN ? AND ?";
            params = [startDate, endDate, startDate, endDate];
        }

        const query = `
            SELECT 
                tanggal,
                SUM(total_transaksi) as total_transaksi,
                SUM(total_penjualan) as total_penjualan,
                SUM(total_pembelian) as total_pembelian,
                (SUM(total_penjualan) - SUM(total_pembelian)) as keuntungan
            FROM (
                SELECT DATE(created_at) as tanggal, COUNT(id) as total_transaksi, SUM(total_harga) as total_penjualan, 0 as total_pembelian
                FROM transaksi
                ${whereClause}
                GROUP BY DATE(created_at)
                UNION ALL
                SELECT DATE(created_at) as tanggal, 0 as total_transaksi, 0 as total_penjualan, SUM(total_harga) as total_pembelian
                FROM pembelian
                ${whereClause}
                GROUP BY DATE(created_at)
            ) as daily_summary
            GROUP BY tanggal
            ORDER BY tanggal DESC
        `;
        db.query(query, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

exports.getLaporanBarangTerjual = (startDate, endDate) => {
    return new Promise((resolve, reject) => {
        let whereClause = "";
        let params = [];
        if (startDate && endDate) {
            whereClause = "WHERE DATE(t.created_at) BETWEEN ? AND ?";
            params = [startDate, endDate];
        }

        const query = `
            SELECT b.nama_barang, SUM(dt.qty) as total_qty, SUM(dt.subtotal) as total_pendapatan
            FROM detail_transaksi dt
            JOIN barang b ON dt.barang_id = b.id
            JOIN transaksi t ON dt.transaksi_id = t.id
            ${whereClause}
            GROUP BY dt.barang_id
            ORDER BY total_qty DESC
        `;
        db.query(query, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

exports.getLaporanBulanan = (startDate, endDate) => {
    return new Promise((resolve, reject) => {
        let whereClause = "";
        let params = [];
        if (startDate && endDate) {
            whereClause = "WHERE DATE(created_at) BETWEEN ? AND ?";
            params = [startDate, endDate, startDate, endDate];
        }

        const query = `
            SELECT 
                bulan,
                SUM(total_transaksi) as total_transaksi,
                SUM(total_penjualan) as total_penjualan,
                SUM(total_pembelian) as total_pembelian,
                (SUM(total_penjualan) - SUM(total_pembelian)) as keuntungan
            FROM (
                SELECT DATE_FORMAT(created_at, '%Y-%m') as bulan, COUNT(id) as total_transaksi, SUM(total_harga) as total_penjualan, 0 as total_pembelian
                FROM transaksi
                ${whereClause}
                GROUP BY bulan
                UNION ALL
                SELECT DATE_FORMAT(created_at, '%Y-%m') as bulan, 0 as total_transaksi, 0 as total_penjualan, SUM(total_harga) as total_pembelian
                FROM pembelian
                ${whereClause}
                GROUP BY bulan
            ) as monthly_summary
            GROUP BY bulan
            ORDER BY bulan DESC
        `;
        db.query(query, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

exports.getLaporanTahunan = (startDate, endDate) => {
    return new Promise((resolve, reject) => {
        let whereClause = "";
        let params = [];
        if (startDate && endDate) {
            whereClause = "WHERE DATE(created_at) BETWEEN ? AND ?";
            params = [startDate, endDate, startDate, endDate];
        }

        const query = `
            SELECT 
                tahun,
                SUM(total_transaksi) as total_transaksi,
                SUM(total_penjualan) as total_penjualan,
                SUM(total_pembelian) as total_pembelian,
                (SUM(total_penjualan) - SUM(total_pembelian)) as keuntungan
            FROM (
                SELECT DATE_FORMAT(created_at, '%Y') as tahun, COUNT(id) as total_transaksi, SUM(total_harga) as total_penjualan, 0 as total_pembelian
                FROM transaksi
                ${whereClause}
                GROUP BY tahun
                UNION ALL
                SELECT DATE_FORMAT(created_at, '%Y') as tahun, 0 as total_transaksi, 0 as total_penjualan, SUM(total_harga) as total_pembelian
                FROM pembelian
                ${whereClause}
                GROUP BY tahun
            ) as yearly_summary
            GROUP BY tahun
            ORDER BY tahun DESC
        `;
        db.query(query, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

exports.getLaporanPerJam = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                DATE_FORMAT(tanggal_asli, '%Y-%m-%d %H:00:00') as jam,
                SUM(total_transaksi) as total_transaksi,
                SUM(total_penjualan) as total_penjualan,
                SUM(total_pembelian) as total_pembelian,
                (SUM(total_penjualan) - SUM(total_pembelian)) as keuntungan
            FROM (
                SELECT created_at as tanggal_asli, 1 as total_transaksi, total_harga as total_penjualan, 0 as total_pembelian
                FROM transaksi
                WHERE created_at >= NOW() - INTERVAL 24 HOUR
                UNION ALL
                SELECT created_at as tanggal_asli, 0 as total_transaksi, 0 as total_penjualan, total_harga as total_pembelian
                FROM pembelian
                WHERE created_at >= NOW() - INTERVAL 24 HOUR
            ) as hourly_summary
            GROUP BY jam
            ORDER BY jam ASC
        `;
        db.query(query, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

exports.getHistoryPembelian = (startDate, endDate) => {
    return new Promise((resolve, reject) => {
        let whereClause = "";
        let params = [];
        if (startDate && endDate) {
            whereClause = "WHERE DATE(p.created_at) BETWEEN ? AND ?";
            params = [startDate, endDate];
        }

        const query = `
            SELECT 
                p.id,
                p.total_harga,
                p.created_at,
                u.username as admin_name,
                s.nama_supplier
            FROM pembelian p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN supplier s ON p.supplier_id = s.id
            ${whereClause}
            ORDER BY p.created_at DESC
        `;
        db.query(query, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

exports.getDetailPembelian = (id) => {
    return new Promise((resolve, reject) => {
        const queryHeader = `
            SELECT 
                p.id,
                p.total_harga,
                p.created_at,
                u.username as admin_name,
                s.nama_supplier
            FROM pembelian p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN supplier s ON p.supplier_id = s.id
            WHERE p.id = ?
        `;
        
        const queryItems = `
            SELECT 
                dp.qty,
                dp.harga_beli,
                dp.subtotal,
                b.nama_barang
            FROM detail_pembelian dp
            LEFT JOIN barang b ON dp.barang_id = b.id
            WHERE dp.pembelian_id = ?
        `;

        db.query(queryHeader, [id], (err, headerResults) => {
            if (err) return reject(err);
            if (headerResults.length === 0) return resolve(null);

            db.query(queryItems, [id], (err, itemResults) => {
                if (err) return reject(err);
                
                resolve({
                    transaksi: headerResults[0],
                    items: itemResults
                });
            });
        });
    });
};

exports.getHistoryPenjualan = (startDate, endDate) => {
    return new Promise((resolve, reject) => {
        let whereClause = "";
        let params = [];
        if (startDate && endDate) {
            whereClause = "WHERE DATE(t.created_at) BETWEEN ? AND ?";
            params = [startDate, endDate];
        }

        const query = `
            SELECT 
                t.id,
                t.total_harga,
                t.bayar,
                t.kembalian,
                t.created_at,
                u.username as kasir_name
            FROM transaksi t
            LEFT JOIN users u ON t.user_id = u.id
            ${whereClause}
            ORDER BY t.created_at DESC
        `;
        db.query(query, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

exports.getDetailPenjualan = (id) => {
    return new Promise((resolve, reject) => {
        const queryHeader = `
            SELECT 
                t.id,
                t.total_harga,
                t.bayar,
                t.kembalian,
                t.created_at,
                u.username as kasir_name
            FROM transaksi t
            LEFT JOIN users u ON t.user_id = u.id
            WHERE t.id = ?
        `;
        
        const queryItems = `
            SELECT 
                dt.qty,
                dt.harga_jual as harga,
                dt.subtotal,
                b.nama_barang
            FROM detail_transaksi dt
            LEFT JOIN barang b ON dt.barang_id = b.id
            WHERE dt.transaksi_id = ?
        `;

        db.query(queryHeader, [id], (err, headerResults) => {
            if (err) return reject(err);
            if (headerResults.length === 0) return resolve(null);

            db.query(queryItems, [id], (err, itemResults) => {
                if (err) return reject(err);
                
                resolve({
                    transaksi: headerResults[0],
                    items: itemResults
                });
            });
        });
    });
};
