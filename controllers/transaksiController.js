const transaksiService = require('../services/transaksiService');

exports.createTransaksi = async (req, res) => {
    try {
        const result = await transaksiService.createTransaksi(req.body);
        
        // Emit socket event (handled in server.js/socket wrapper)
        if (req.io) {
            req.io.emit('new_transaction', { 
                transaksiId: result.transaksiId, 
                total_harga: result.total_harga 
            });
        }
        
        res.status(201).json({ message: "Transaction completed", transaksiId: result.transaksiId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTransaksiHistory = async (req, res) => {
    try {
        const results = await transaksiService.getTransaksiHistory();
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
