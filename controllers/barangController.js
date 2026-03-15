const barangService = require('../services/barangService');

exports.getBarang = async (req, res) => {
    try {
        const results = await barangService.getAllBarang();
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

exports.getBarangByBarcode = async (req, res) => {
    try {
        const { barcode } = req.params;
        const result = await barangService.getBarangByBarcode(barcode);
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createBarang = async (req, res) => {
    try {
        const id = await barangService.createBarang(req.body);
        res.status(201).json({ message: "Barang created", id });
    } catch (err) {
        console.error("Error create barang:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.updateBarang = async (req, res) => {
    try {
        const { id } = req.params;
        await barangService.updateBarang(id, req.body);
        res.json({ message: "Barang updated" });
    } catch (err) {
        console.error("Error update barang:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteBarang = async (req, res) => {
    try {
        const { id } = req.params;
        await barangService.deleteBarang(id);
        res.json({ message: "Barang deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};