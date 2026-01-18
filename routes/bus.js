const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');

router.get('/', busController.getBuses);
router.get('/locations', busController.getLocations);
router.get('/companies', busController.getCompanies);

module.exports = router;
