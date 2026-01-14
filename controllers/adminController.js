const Company = require('../models/companyModel');
const Route = require('../models/routeModel');
const Bus = require('../models/busModel');
const Pesanan = require('../models/pesananModel');

const AdminController = {
    // Company Management
    getAllCompanies: (req, res) => {
        Company.getAll((err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },
    createCompany: (req, res) => {
        Company.create(req.body, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: result.insertId, ...req.body });
        });
    },
    updateCompany: (req, res) => {
        Company.update(req.params.id, req.body, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Company updated successfully' });
        });
    },
    deleteCompany: (req, res) => {
        Company.delete(req.params.id, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Company deleted successfully' });
        });
    },

    // Route Management
    getAllRoutes: (req, res) => {
        const { company_id } = req.query;
        if (company_id) {
            Route.getByCompanyId(company_id, (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(results);
            });
        } else {
            Route.getAll((err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(results);
            });
        }
    },
    createRoute: (req, res) => {
        Route.create(req.body, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: result.insertId, ...req.body });
        });
    },
    updateRoute: (req, res) => {
        Route.update(req.params.id, req.body, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Route updated successfully' });
        });
    },
    deleteRoute: (req, res) => {
        Route.delete(req.params.id, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Route deleted successfully' });
        });
    },

    // Bus Schedule Management
    getAllBuses: (req, res) => {
        Bus.getAll((err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },
    createBus: (req, res) => {
        Bus.create(req.body, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: result.insertId, ...req.body });
        });
    },
    updateBus: (req, res) => {
        Bus.update(req.params.id, req.body, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Bus updated successfully' });
        });
    },
    deleteBus: (req, res) => {
        Bus.delete(req.params.id, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Bus deleted successfully' });
        });
    },

    // Order Management
    getAllOrders: (req, res) => {
        Pesanan.getAll((err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },
    rescheduleOrder: (req, res) => {
        const { bus_id } = req.body;
        Pesanan.updateBus(req.params.id, bus_id, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Order rescheduled successfully' });
        });
    },
    moveSeat: (req, res) => {
        const { kursi } = req.body;
        Pesanan.updateSeat(req.params.id, kursi, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Seat moved successfully' });
        });
    }
};

module.exports = AdminController;
