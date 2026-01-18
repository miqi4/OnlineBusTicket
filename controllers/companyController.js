const Bus = require('../models/busModel');
const Pesanan = require('../models/pesananModel');
const City = require('../models/cityModel');
const db = require('../config/db');

exports.getCities = (req, res) => {
    City.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.getSchedules = (req, res) => {
    const companyId = Number(req.session.companyId);
    console.log(`Fetching schedules for companyId: ${companyId} (type: ${typeof companyId})`);
    if (!companyId) {
        return res.status(403).json({ message: 'Forbidden: Company ID not found in session. Please contact admin.' });
    }
    const sql = `
        SELECT b.*, 
               c1.nama_kota AS asal_kota, 
               c2.nama_kota AS tujuan_kota
        FROM bus b
        LEFT JOIN cities c1 ON b.origin_city_id = c1.id
        LEFT JOIN cities c2 ON b.destination_city_id = c2.id
        WHERE b.company_id = ?
    `;
    db.query(sql, [companyId], (err, results) => {
        if (err) {
            console.error("Database error in getSchedules:", err);
            return res.status(500).json({ message: 'Database error' });
        }
        console.log(`Query executed: ${sql.replace('?', companyId)}`);
        console.log(`Results found: ${results.length}`);
        res.json(results);
    });
};

exports.createSchedule = (req, res) => {
    const companyId = req.session.companyId;
    if (!companyId) {
        return res.status(403).json({ message: 'Forbidden: Company ID not found in session.' });
    }
    const data = { ...req.body, company_id: companyId };

    Bus.create(data, (err, result) => {
        if (err) return res.status(500).json({ message: 'Error creating schedule' });
        res.status(201).json({ message: 'Schedule created successfully' });
    });
};

exports.updateSchedule = (req, res) => {
    const companyId = req.session.companyId;
    if (!companyId) {
        return res.status(403).json({ message: 'Forbidden: Company ID not found in session.' });
    }
    const { id } = req.params;
    const data = { ...req.body, company_id: companyId };

    // Verify ownership
    db.query("SELECT company_id FROM bus WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (results.length === 0 || results[0].company_id !== companyId) {
            return res.status(403).json({ message: 'Forbidden: You do not own this bus' });
        }

        Bus.update(id, data, (err, result) => {
            if (err) return res.status(500).json({ message: 'Error updating schedule' });
            res.json({ message: 'Schedule updated successfully' });
        });
    });
};

exports.deleteSchedule = (req, res) => {
    const companyId = req.session.companyId;
    if (!companyId) {
        return res.status(403).json({ message: 'Forbidden: Company ID not found in session.' });
    }
    const { id } = req.params;

    // Verify ownership
    db.query("SELECT company_id FROM bus WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (results.length === 0 || results[0].company_id !== companyId) {
            return res.status(403).json({ message: 'Forbidden: You do not own this bus' });
        }

        Bus.delete(id, (err, result) => {
            if (err) return res.status(500).json({ message: 'Error deleting schedule' });
            res.json({ message: 'Schedule deleted successfully' });
        });
    });
};

exports.getOrders = (req, res) => {
    const companyId = req.session.companyId;
    if (!companyId) {
        return res.status(403).json({ message: 'Forbidden: Company ID not found in session.' });
    }
    const sql = `
        SELECT p.id, p.nama_penumpang, b.nama_bus, b.jam, p.kursi, p.bus_id 
        FROM pesanan p 
        JOIN bus b ON p.bus_id = b.id
        WHERE b.company_id = ?
    `;
    db.query(sql, [companyId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(results);
    });
};

exports.getStats = async (req, res) => {
    const companyId = req.session.companyId;
    if (!companyId) {
        return res.status(403).json({ message: 'Forbidden: Company ID not found in session.' });
    }

    try {
        const dbPromise = db.promise();
        const [totalBuses] = await dbPromise.query("SELECT COUNT(*) as count FROM bus WHERE company_id = ?", [companyId]);
        const [totalOrders] = await dbPromise.query("SELECT COUNT(p.id) as count FROM pesanan p JOIN bus b ON p.bus_id = b.id WHERE b.company_id = ?", [companyId]);
        const [todayOrders] = await dbPromise.query("SELECT COUNT(p.id) as count FROM pesanan p JOIN bus b ON p.bus_id = b.id WHERE b.company_id = ? AND DATE(p.created_at) = CURDATE()", [companyId]);

        res.json({
            totalBuses: totalBuses[0].count || 0,
            totalOrders: totalOrders[0].count || 0,
            todayOrders: todayOrders[0].count || 0
        });
    } catch (err) {
        console.error('Error in getStats:', err);
        res.status(500).json({ message: 'Database error', error: err.message });
    }
};
