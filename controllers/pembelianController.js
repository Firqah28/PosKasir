const pembelianService = require('../services/pembelianService');

exports.createPembelian = async (req, res) => {
    try {
        // Using optional chaining and fallback to 1 (like Kasir) in case session is missing for prototyping
        const user_id = req.session?.user?.id || 1;
        const { supplier_id, items } = req.body;
        
        let total_harga = 0;
        const formattedItems = items.map(item => {
            const subtotal = item.qty * item.harga_beli;
            total_harga += subtotal;
            return {
                ...item,
                subtotal
            }
        });

        const data = {
            user_id,
            supplier_id,
            total_harga,
            items: formattedItems
        };

        const result = await pembelianService.createPembelian(data);
        res.status(201).json({ message: "Purchase completed", result });
    } catch (err) {
        console.error("Pembelian error:", err);
        res.status(500).json({ error: "Failed to process purchase" });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const history = await pembelianService.getPembelianHistory();
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
};

exports.getDetail = async (req, res) => {
    try {
        const detail = await pembelianService.getPembelianDetail(req.params.id);
        res.json(detail);
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
};
