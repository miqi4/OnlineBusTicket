const express = require('express');
const router = express.Router();
const pesananController = require('../controllers/pesananController');

router.post('/', pesananController.createPesanan);
router.get('/', pesananController.getPesanan);

module.exports = router;
