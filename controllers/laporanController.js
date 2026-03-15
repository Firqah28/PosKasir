const laporanService = require('../services/laporanService');

exports.getLaporanHarian = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const results = await laporanService.getLaporanHarian(startDate, endDate);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getLaporanBarangTerjual = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const results = await laporanService.getLaporanBarangTerjual(startDate, endDate);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getLaporanBulanan = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const results = await laporanService.getLaporanBulanan(startDate, endDate);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getLaporanTahunan = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const results = await laporanService.getLaporanTahunan(startDate, endDate);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getLaporanPerJam = async (req, res) => {
    try {
        const { date } = req.query;
        const results = await laporanService.getLaporanPerJam(date);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getHistoryPembelian = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const results = await laporanService.getHistoryPembelian(startDate, endDate);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDetailPembelian = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await laporanService.getDetailPembelian(id);
        if(!result) return res.status(404).json({ error: "Pembelian not found" });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getHistoryPenjualan = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const results = await laporanService.getHistoryPenjualan(startDate, endDate);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDetailPenjualan = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await laporanService.getDetailPenjualan(id);
        if(!result) return res.status(404).json({ error: "Penjualan not found" });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
