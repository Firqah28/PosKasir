const supplierService = require('../services/supplierService');

exports.getSupplier = async (req, res) => {
    try {
        const results = await supplierService.getAllSupplier();
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

exports.getSupplierById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await supplierService.getSupplierById(id);
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createSupplier = async (req, res) => {
    try {
        const id = await supplierService.createSupplier(req.body);
        res.status(201).json({ message: "Supplier created", id });
    } catch (err) {
        console.error("Error create supplier:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        await supplierService.updateSupplier(id, req.body);
        res.json({ message: "Supplier updated" });
    } catch (err) {
        console.error("Error update supplier:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        await supplierService.deleteSupplier(id);
        res.json({ message: "Supplier deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
