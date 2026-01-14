const db = require('../config/db');

const Company = {
    getAll: (callback) => {
        const sql = "SELECT * FROM companies";
        db.query(sql, callback);
    },

    getById: (id, callback) => {
        const sql = "SELECT * FROM companies WHERE id = ?";
        db.query(sql, [id], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results[0]);
        });
    },

    create: (data, callback) => {
        const sql = "INSERT INTO companies (nama, alamat, telepon) VALUES (?, ?, ?)";
        db.query(sql, [data.nama, data.alamat, data.telepon], callback);
    },

    update: (id, data, callback) => {
        const sql = "UPDATE companies SET nama = ?, alamat = ?, telepon = ? WHERE id = ?";
        db.query(sql, [data.nama, data.alamat, data.telepon, id], callback);
    },

    delete: (id, callback) => {
        const sql = "DELETE FROM companies WHERE id = ?";
        db.query(sql, [id], callback);
    }
};

module.exports = Company;
