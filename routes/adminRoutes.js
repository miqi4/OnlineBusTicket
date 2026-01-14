const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');

// Middleware to check if user is admin (Placeholder - implement actual auth check)
const isAdmin = (req, res, next) => {
    // TODO: Implement actual admin check based on session or token
    // For now, assuming all requests to /admin are allowed for demo/dev
    next();
};

router.use(isAdmin);

// Companies
router.get('/companies', AdminController.getAllCompanies);
router.post('/companies', AdminController.createCompany);
router.put('/companies/:id', AdminController.updateCompany);
router.delete('/companies/:id', AdminController.deleteCompany);

// Routes
router.get('/routes', AdminController.getAllRoutes);
router.post('/routes', AdminController.createRoute);
router.put('/routes/:id', AdminController.updateRoute);
router.delete('/routes/:id', AdminController.deleteRoute);

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
