const db = require('../config/db');

const Route = {
    getAll: (callback) => {
        const sql = `SELECT r.*, c.nama AS nama_perusahaan 
                     FROM routes r 
                     LEFT JOIN companies c ON r.company_id = c.id`;
        db.query(sql, callback);
    },

    getById: (id, callback) => {
        const sql = "SELECT * FROM routes WHERE id = ?";
        db.query(sql, [id], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results[0]);
        });
    },

    create: (data, callback) => {
        const sql = "INSERT INTO routes (asal, tujuan, jarak_km, durasi_jam, company_id) VALUES (?, ?, ?, ?, ?)";
        db.query(sql, [data.asal, data.tujuan, data.jarak_km, data.durasi_jam, data.company_id], callback);
    },

    update: (id, data, callback) => {
        const sql = "UPDATE routes SET asal = ?, tujuan = ?, jarak_km = ?, durasi_jam = ?, company_id = ? WHERE id = ?";
        db.query(sql, [data.asal, data.tujuan, data.jarak_km, data.durasi_jam, data.company_id, id], callback);
    },

    delete: (id, callback) => {
        const sql = "DELETE FROM routes WHERE id = ?";
        db.query(sql, [id], callback);
    },

    getByCompanyId: (companyId, callback) => {
        const sql = "SELECT * FROM routes WHERE company_id = ?";
        db.query(sql, [companyId], callback);
    }
};

module.exports = Route;
