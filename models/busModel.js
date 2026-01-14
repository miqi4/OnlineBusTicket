const db = require('../config/db');

const Bus = {
    getAll: (callback) => {
        const sql = `
            SELECT b.*, c.nama AS nama_bus, c.nama AS nama_perusahaan_real, r.asal AS rute_asal, r.tujuan AS rute_tujuan 
            FROM bus b
            LEFT JOIN companies c ON b.company_id = c.id
            LEFT JOIN routes r ON b.route_id = r.id
        `;
        db.query(sql, callback);
    },

    getById: (id, callback) => {
        const sql = "SELECT * FROM bus WHERE id = ?";
        db.query(sql, [id], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results[0]);
        });
    },

    create: (data, callback) => {
        const sql = "INSERT INTO bus (nama_bus, company_id, route_id, jam, harga, asal, tujuan, nama_perusahaan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        // Note: asal, tujuan, nama_perusahaan are kept for backward compatibility or can be derived
        db.query(sql, [data.nama_bus, data.company_id, data.route_id, data.jam, data.harga, data.asal, data.tujuan, data.nama_perusahaan], callback);
    },

    update: (id, data, callback) => {
        const sql = "UPDATE bus SET nama_bus = ?, company_id = ?, route_id = ?, jam = ?, harga = ?, asal = ?, tujuan = ?, nama_perusahaan = ? WHERE id = ?";
        db.query(sql, [data.nama_bus, data.company_id, data.route_id, data.jam, data.harga, data.asal, data.tujuan, data.nama_perusahaan, id], callback);
    },

    delete: (id, callback) => {
        const sql = "DELETE FROM bus WHERE id = ?";
        db.query(sql, [id], callback);
    },

    getBuses: (asal, tujuan, callback) => {
        let sql = `
            SELECT b.*, c.nama AS nama_bus, c.nama AS nama_perusahaan_real 
            FROM bus b
            LEFT JOIN companies c ON b.company_id = c.id
            LEFT JOIN routes r ON b.route_id = r.id
        `;
        const params = [];

        if (asal && tujuan) {
            // Check both legacy columns and route relations
            sql += " WHERE (b.asal = ? AND b.tujuan = ?) OR (r.asal = ? AND r.tujuan = ?)";
            params.push(asal, tujuan, asal, tujuan);
        }

        db.query(sql, params, callback);
    },

    getLocations: (callback) => {
        // Combine legacy locations and new route locations
        const sql = `
            SELECT DISTINCT asal FROM bus 
            UNION 
            SELECT DISTINCT tujuan FROM bus
            UNION
            SELECT DISTINCT asal FROM routes
            UNION
            SELECT DISTINCT tujuan FROM routes
        `;
        db.query(sql, callback);
    }
};

module.exports = Bus;
