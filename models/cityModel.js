const db = require('../config/db');

const City = {
    getAll: (callback) => {
        const sql = "SELECT * FROM cities ORDER BY nama_kota ASC";
        db.query(sql, callback);
    },

    getById: (id, callback) => {
        const sql = "SELECT * FROM cities WHERE id = ?";
        db.query(sql, [id], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results[0]);
        });
    },

    create: (data, callback) => {
        const sql = "INSERT INTO cities (nama_kota) VALUES (?)";
        db.query(sql, [data.nama_kota], callback);
    },

    update: (id, data, callback) => {
        const sql = "UPDATE cities SET nama_kota = ? WHERE id = ?";
        db.query(sql, [data.nama_kota, id], callback);
    },

    delete: (id, callback) => {
        const sql = "DELETE FROM cities WHERE id = ?";
        db.query(sql, [id], callback);
    }
};

module.exports = City;
