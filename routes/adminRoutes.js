const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');

const { requireRole } = require('../middleware/auth');

// Middleware to check if user is admin
router.use(requireRole(['admin']));

// Cities
router.get('/cities', AdminController.getAllCities);
router.post('/cities', AdminController.createCity);
router.put('/cities/:id', AdminController.updateCity);
router.delete('/cities/:id', AdminController.deleteCity);

// Companies
router.get('/companies', AdminController.getAllCompanies);
router.post('/companies', AdminController.createCompany);
router.put('/companies/:id', AdminController.updateCompany);
router.delete('/companies/:id', AdminController.deleteCompany);

// Buses (Schedules)
router.get('/buses', AdminController.getAllBuses);
router.post('/buses', AdminController.createBus);
router.put('/buses/:id', AdminController.updateBus);
router.delete('/buses/:id', AdminController.deleteBus);

// Orders
router.get('/orders', AdminController.getAllOrders);
router.put('/orders/:id/reschedule', AdminController.rescheduleOrder);
router.put('/orders/:id/move-seat', AdminController.moveSeat);

module.exports = router;
