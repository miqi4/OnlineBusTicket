const db = require('../config/db');

const User = {
    createUser: (userData, callback) => {
        const sql = "INSERT INTO users (nama, email, password, role, nama_perusahaan) VALUES (?, ?, ?, ?, ?)";
        db.query(sql, [userData.nama, userData.email, userData.password, userData.role, userData.nama_perusahaan || null], callback);
    },

    getUserByEmail: (email, callback) => {
        const sql = "SELECT * FROM users WHERE email = ?";
        db.query(sql, [email], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results[0]);
        });
    },

    getUserById: (id, callback) => {
        const sql = "SELECT id, nama, email, role, nama_perusahaan, created_at FROM users WHERE id = ?";
        db.query(sql, [id], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results[0]);
        });
    }
};

module.exports = User;
