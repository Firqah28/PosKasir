const express = require('express');
const router = express.Router();

const barangController = require('../controllers/barangController');

router.get('/', barangController.getBarang);
router.get('/:barcode', barangController.getBarangByBarcode);
router.post('/', barangController.createBarang);
router.put('/:id', barangController.updateBarang);
router.delete('/:id', barangController.deleteBarang);

module.exports = router;