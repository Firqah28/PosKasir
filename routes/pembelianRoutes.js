const express = require('express');
const router = express.Router();
const pembelianController = require('../controllers/pembelianController');

router.post('/', pembelianController.createPembelian);
router.get('/history', pembelianController.getHistory);
router.get('/:id/detail', pembelianController.getDetail);

module.exports = router;
