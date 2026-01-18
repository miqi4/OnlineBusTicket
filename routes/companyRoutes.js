const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/companyController');
const { requireRole } = require('../middleware/auth');

// Middleware to check if user is operator or company
router.use(requireRole(['operator', 'company']));

// Stats
router.get('/stats', CompanyController.getStats);

// Cities
router.get('/cities', CompanyController.getCities);

// Schedules
router.get('/schedules', CompanyController.getSchedules);
router.post('/schedules', CompanyController.createSchedule);
router.put('/schedules/:id', CompanyController.updateSchedule);
router.delete('/schedules/:id', CompanyController.deleteSchedule);

// Orders
router.get('/orders', CompanyController.getOrders);

module.exports = router;
