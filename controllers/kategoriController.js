const kategoriService = require('../services/kategoriService');

exports.getKategori = async (req, res) => {
    try {
        const results = await kategoriService.getAllKategori();
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

exports.getKategoriById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await kategoriService.getKategoriById(id);
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createKategori = async (req, res) => {
    try {
        const id = await kategoriService.createKategori(req.body);
        res.status(201).json({ message: "Kategori created", id });
    } catch (err) {
        console.error("Error create kategori:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.updateKategori = async (req, res) => {
    try {
        const { id } = req.params;
        await kategoriService.updateKategori(id, req.body);
        res.json({ message: "Kategori updated" });
    } catch (err) {
        console.error("Error update kategori:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteKategori = async (req, res) => {
    try {
        const { id } = req.params;
        await kategoriService.deleteKategori(id);
        res.json({ message: "Kategori deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
