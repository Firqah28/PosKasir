const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');

router.get('/harian', laporanController.getLaporanHarian);
router.get('/bulanan', laporanController.getLaporanBulanan);
router.get('/tahunan', laporanController.getLaporanTahunan);
router.get('/barang', laporanController.getLaporanBarangTerjual);
router.get('/perjam', laporanController.getLaporanPerJam);
router.get('/history-pembelian', laporanController.getHistoryPembelian);
router.get('/history-pembelian/:id', laporanController.getDetailPembelian);
router.get('/history-penjualan', laporanController.getHistoryPenjualan);
router.get('/history-penjualan/:id', laporanController.getDetailPenjualan);

module.exports = router;
