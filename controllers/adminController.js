const Company = require('../models/companyModel');
const Bus = require('../models/busModel');
const Pesanan = require('../models/pesananModel');
const City = require('../models/cityModel');

const AdminController = {
    // City Management (for dropdowns and CRUD)
    getAllCities: (req, res) => {
        City.getAll((err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },
    createCity: (req, res) => {
        City.create(req.body, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: result.insertId, ...req.body });
        });
    },
    updateCity: (req, res) => {
        City.update(req.params.id, req.body, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'City updated successfully' });
        });
    },
    deleteCity: (req, res) => {
        City.delete(req.params.id, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'City deleted successfully' });
        });
    },

    // Company Management
    getAllCompanies: (req, res) => {
        const db = require('../config/db');
        const sql = `
            SELECT c.*, u.email AS login_email 
            FROM companies c 
            LEFT JOIN users u ON TRIM(u.nama_perusahaan) = TRIM(c.nama) AND u.role IN ('operator', 'company')
        `;
        db.query(sql, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            // Map results to ensure email field contains the login email if available
            const mappedResults = results.map(row => ({
                ...row,
                email: row.login_email || row.email
            }));
            res.json(mappedResults);
        });
    },
    createCompany: async (req, res) => {
        const { nama, alamat, telepon, email, password } = req.body;
        const bcrypt = require('bcrypt');
        const User = require('../models/userModel');
        const db = require('../config/db');

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required for new companies' });
        }

        try {
            // 1. Check if email already exists
            User.getUserByEmail(email, async (err, existingUser) => {
                if (err) return res.status(500).json({ error: err.message });
                if (existingUser) return res.status(400).json({ error: 'Email already registered' });

                // 2. Hash password
                try {
                    const hashedPassword = await bcrypt.hash(password, 10);

                    // 3. Create company
                    Company.create({ nama, alamat, telepon, email, password: hashedPassword }, async (cErr, result) => {
                        if (cErr) return res.status(500).json({ error: cErr.message });
                        const companyId = result.insertId;

                        // 4. Create user in users table
                        const userData = {
                            nama: nama,
                            email,
                            password: hashedPassword,
                            role: 'company',
                            nama_perusahaan: nama
                        };

                        User.createUser(userData, (uErr) => {
                            if (uErr) {
                                console.error('Error creating company user:', uErr);
                                return res.status(500).json({ error: 'Company created but failed to create login account' });
                            }
                            res.status(201).json({ id: companyId, message: 'Company and login account created successfully' });
                        });
                    });
                } catch (hashErr) {
                    res.status(500).json({ error: hashErr.message });
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateCompany: (req, res) => {
        const { id } = req.params;
        const { nama } = req.body;
        const db = require('../config/db');

        // Get old name first to update linked users
        Company.getById(id, (err, oldCompany) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!oldCompany) return res.status(404).json({ error: 'Company not found' });

            Company.update(id, req.body, (err, result) => {
                if (err) return res.status(500).json({ error: err.message });

                // Update linked users if name changed
                if (oldCompany.nama !== nama) {
                    db.query("UPDATE users SET nama_perusahaan = ? WHERE nama_perusahaan = ?", [nama, oldCompany.nama], (uErr) => {
                        if (uErr) console.error('Error updating linked users:', uErr);
                        res.json({ message: 'Company and linked users updated successfully' });
                    });
                } else {
                    res.json({ message: 'Company updated successfully' });
                }
            });
        });
    },
    deleteCompany: (req, res) => {
        Company.delete(req.params.id, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Company deleted successfully' });
        });
    },

    updateCompanyCredentials: async (req, res) => {
        const { id } = req.params;
        const { email, password } = req.body;
        const bcrypt = require('bcrypt');
        const User = require('../models/userModel');
        const db = require('../config/db');

        Company.getById(id, async (err, company) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!company) return res.status(404).json({ error: 'Company not found' });

            try {
                const hashedPassword = await bcrypt.hash(password, 10);

                // Update users table
                User.updateCredentialsByCompanyName(company.nama, email, hashedPassword, (uErr) => {
                    if (uErr) console.error('Error updating users table:', uErr);

                    // Also update companies table to keep them in sync
                    const sql = "UPDATE companies SET email = ?, password = ? WHERE id = ?";
                    db.query(sql, [email, hashedPassword, id], (cErr) => {
                        if (cErr) return res.status(500).json({ error: cErr.message });
                        res.json({ message: 'Credentials updated successfully in both tables' });
                    });
                });
            } catch (hashErr) {
                res.status(500).json({ error: hashErr.message });
            }
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
    },

    getDashboardStats: async (req, res) => {
        try {
            const db = require('../config/db').promise();
            const [companies] = await db.query("SELECT COUNT(*) as count FROM companies");
            const [buses] = await db.query("SELECT COUNT(*) as count FROM bus");
            const [orders] = await db.query("SELECT COUNT(*) as count FROM pesanan");

            res.json({
                companies: companies[0].count,
                buses: buses[0].count,
                orders: orders[0].count
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = AdminController;
